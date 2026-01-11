import React, { useState } from 'react';
import { Course, Currency, Language } from '../types';

interface PaymentPageProps {
    course: Course;
    currency: Currency;
    exchangeRate: number;
    strings: { [key: string]: string };
    language: Language;
    onEnroll: (course: Course, status: 'Success' | 'Pending', details?: { orderId?: string; transactionId?: string; paymentMethod: 'Credit Card' | 'CliQ' }) => void;
}

const PaymentPage: React.FC<PaymentPageProps> = ({ course, currency, strings, onEnroll }) => {
    if (!course) return <div className="py-20 text-center">Course not found</div>;

    let price = 0;
    let currencySymbol = '';

    if (currency === 'USD') {
        price = course.priceUsd ?? (course.price ? course.price * 1.41 : 0);
        currencySymbol = strings.usd || '$';
    } else if (currency === 'SAR') {
        price = course.priceSar ?? (course.price ? course.price * 5.3 : 0);
        currencySymbol = strings.sar || 'ر.س';
    } else {
        price = course.priceJod ?? course.price ?? 0;
        currencySymbol = strings.jod || 'د.أ';
    }

    const safePrice = (typeof price === 'number' && !isNaN(price)) ? price : 0;
    const displayPrice = safePrice.toFixed(2);

    const [paymentMethod, setPaymentMethod] = useState<'cliq' | 'visa' | 'paypal'>('visa');
    const [showBankDetails, setShowBankDetails] = useState(false);
    const [showOtpModal, setShowOtpModal] = useState(false);
    
    // Card Form State
    const [cardHolder, setCardHolder] = useState('');
    const [cardNumber, setCardNumber] = useState('');
    const [expiry, setExpiry] = useState(''); // MM/YY
    const [cvv, setCvv] = useState('');
    const [otpCode, setOtpCode] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [paymentError, setPaymentError] = useState<string | null>(null);
    const [otpError, setOtpError] = useState<string | null>(null);

    // Mastercard API Details
    const GATEWAY_URL = "https://test-network.mtf.gateway.mastercard.com/api/rest/version/70";
    const MERCHANT_ID = "test12122024";
    const API_USERNAME = "merchant.test12122024";
    const API_PASSWORD = "0cb74bdcb05329641aa7bed1caff4e8a";

    // تفعيل عملية الدفع بعد التحقق من الـ OTP
    const finalizePayment = async () => {
        setIsProcessing(true);
        const uniqueSuffix = Math.floor(Math.random() * 1000000);
        const orderId = `ORD-${Date.now()}-${uniqueSuffix}`;
        const transactionId = `TXN-${Date.now()}-${uniqueSuffix}`;

        try {
            // في حالة البطاقات التجريبية، نتخطى الاتصال الحقيقي بالبوابة
            if (cardNumber.replace(/\s/g, '').startsWith('512345') || cardNumber.replace(/\s/g, '').startsWith('411111')) {
                 onEnroll(course, 'Success', {
                    orderId: orderId,
                    transactionId: transactionId,
                    paymentMethod: 'Credit Card'
                 });
                 return;
            }

            // محاولة الاتصال الحقيقي بالبوابة (Mastercard Gateway)
            const url = `${GATEWAY_URL}/merchant/${MERCHANT_ID}/order/${orderId}/transaction/${transactionId}`;
            const [expMonth, expYear] = expiry.split('/');
            const cleanYear = expYear.length === 4 ? expYear.slice(2) : expYear;

            const payload = {
                apiOperation: "PAY",
                order: { amount: displayPrice, currency: currency, reference: course.id },
                sourceOfFunds: {
                    provided: {
                        card: {
                            number: cardNumber.replace(/\s/g, ''),
                            securityCode: cvv,
                            expiry: { month: expMonth, year: cleanYear }
                        }
                    },
                    type: "CARD"
                }
            };

            const authString = btoa(`${API_USERNAME}:${API_PASSWORD}`);
            const response = await fetch(url, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Basic ${authString}` },
                body: JSON.stringify(payload)
            });

            const data = await response.json();
            if (response.ok && (data.result === 'SUCCESS' || data.result === 'PENDING')) {
                onEnroll(course, 'Success', { orderId, transactionId, paymentMethod: 'Credit Card' });
            } else {
                throw new Error(data.error?.explanation || "Payment failed.");
            }
        } catch (error: any) {
            setPaymentError(error.message || "Network error.");
            setShowOtpModal(false); // نغلق الـ OTP لو فشل الاتصال التقني
        } finally {
            setIsProcessing(false);
        }
    };

    const handleInitialSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setPaymentError(null);

        if (paymentMethod === 'cliq') {
            onEnroll(course, 'Pending', { paymentMethod: 'CliQ' });
            setShowBankDetails(true);
        } else if (paymentMethod === 'visa') {
            // التحقق من صحة البيانات قبل إظهار الـ OTP
            if (cardNumber.length < 15 || cvv.length < 3 || !expiry.includes('/')) {
                setPaymentError("يرجى إدخال بيانات بطاقة صحيحة.");
                return;
            }
            setIsProcessing(true);
            // محاكاة إرسال الـ OTP (تأخير بسيط للواقعية)
            setTimeout(() => {
                setIsProcessing(false);
                setShowOtpModal(true);
            }, 1500);
        }
    };

    const handleOtpVerify = (e: React.FormEvent) => {
        e.preventDefault();
        setOtpError(null);
        if (otpCode === '123456' || cardNumber.startsWith('5123')) {
            finalizePayment();
        } else {
            setOtpError("رمز التحقق غير صحيح. يرجى المحاولة مرة أخرى.");
        }
    };

    const whatsappNumber = "962792822241";
    const whatsappUrl = `https://wa.me/${whatsappNumber}`;

    if (showBankDetails) {
        return (
            <div className="py-20 bg-gray-100">
                <div className="container mx-auto px-6 max-w-3xl">
                    <div className="bg-white p-8 rounded-lg shadow-xl border-t-4 border-green-500">
                        <h2 className="text-2xl font-bold text-blue-900 mb-6 text-center">معلومات التحويل البنكي</h2>
                        <div className="bg-gray-50 p-6 rounded-lg space-y-6 text-gray-800 text-sm md:text-base font-medium" dir="ltr">
                            <h3 className="font-bold text-lg text-blue-900 underline decoration-green-500 mb-4">Payment Options</h3>
                            <div className="border-b pb-4">
                                <p className="font-bold text-green-600">ETIHAD Bank:</p>
                                <p>Account name: Smooth Business</p>
                                <p>ACCOUNT NUMBER: 0370137195515102</p>
                                <p>IBAN: <span className="font-mono bg-gray-200 px-1 rounded select-all">JO23UBSI1250000370137195515102</span></p>
                            </div>
                            <div className="border-b pb-4 flex items-center space-x-2">
                                <span className="text-purple-600 font-bold text-lg">CliQ:</span>
                                <span className="font-mono font-bold text-xl select-all">JOTUTOR</span>
                            </div>
                            <div className="border-b pb-4">
                                <p><span className="font-bold text-red-600">Zain Cash:</span> 0792822241</p>
                            </div>
                            <div>
                                <p className="font-bold text-blue-600">Arab Bank:</p>
                                <p>Account name: SMOOTH BUSINESS COMPANY</p>
                                <p>ACCOUNT NUMBER: 0145199540500</p>
                                <p>IBAN: <span className="font-mono bg-gray-200 px-1 rounded select-all">JO89 ARAB 1450 0000 0014 5199 5405 00</span></p>
                            </div>
                        </div>
                        <div className="mt-8 text-center" dir="rtl">
                            <p className="text-gray-700 mb-4 font-semibold">
                                تم استلام طلبك بنجاح! يرجى إتمام التحويل ثم إرسال الإيصال لتفعيل الدورة.
                            </p>
                            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-8 rounded-full shadow-lg transition-transform transform hover:-translate-y-1">
                                إرسال صورة التحويل عبر واتساب
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="py-20 bg-gray-100 min-h-screen">
            <div className="container mx-auto px-6 max-w-3xl">
                <h1 className="text-3xl font-bold text-center text-blue-900 mb-8">{strings.paymentTitle || 'إتمام عملية الدفع'}</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Order Summary */}
                    <div className="bg-white p-6 rounded-lg shadow-md h-fit">
                        <h2 className="text-xl font-semibold mb-4">{strings.courseSummary || 'ملخص الدورة'}</h2>
                        <img src={course.imageUrl || 'https://via.placeholder.com/400x225?text=No+Image'} alt={course.title} className="rounded-md mb-4 w-full h-40 object-cover" />
                        <h3 className="font-bold text-lg text-blue-900 mb-2">{course.title}</h3>
                        <p className="text-gray-600 text-sm mb-4">بواسطة {course.teacher}</p>
                        <div className="border-t pt-4 flex justify-between items-center">
                            <span className="font-semibold">{strings.totalAmount || 'المبلغ الإجمالي'}</span>
                            <span className="text-2xl font-bold text-green-500">{currencySymbol}{displayPrice}</span>
                        </div>
                    </div>

                    {/* Payment Form */}
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-xl font-semibold mb-4">{strings.paymentMethod || 'طريقة الدفع'}</h2>
                        <form onSubmit={handleInitialSubmit} className="space-y-4">
                            
                            <div 
                                onClick={() => setPaymentMethod('visa')} 
                                className={`border-2 rounded-lg p-4 cursor-pointer flex flex-col transition-colors ${paymentMethod === 'visa' ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-green-300'}`}
                            >
                                <div className="flex justify-between items-center mb-2">
                                    <div className="flex items-center space-x-3 space-x-reverse">
                                        <span className="font-bold text-blue-900">فيزا / ماستركارد</span>
                                    </div>
                                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${paymentMethod === 'visa' ? 'border-green-500' : 'border-gray-400'}`}>
                                        {paymentMethod === 'visa' && <div className="w-3 h-3 rounded-full bg-green-500"></div>}
                                    </div>
                                </div>

                                {paymentMethod === 'visa' && (
                                    <div className="mt-4 pt-4 border-t border-gray-200 animate-fade-in">
                                        <div className="space-y-4">
                                            <input 
                                                type="text" 
                                                value={cardHolder}
                                                onChange={e => setCardHolder(e.target.value)}
                                                className="w-full p-2 border rounded mt-1" 
                                                placeholder={strings.cardHolder || "الاسم المكتوب على البطاقة"}
                                                required 
                                            />
                                            <input 
                                                type="text" 
                                                value={cardNumber}
                                                onChange={e => setCardNumber(e.target.value)}
                                                placeholder={strings.cardNumber || "رقم البطاقة"}
                                                className="w-full p-2 border rounded mt-1" 
                                                required 
                                            />
                                            <div className="flex gap-4">
                                                <input 
                                                    type="text" 
                                                    value={expiry}
                                                    onChange={e => setExpiry(e.target.value)}
                                                    placeholder="MM/YY" 
                                                    className="w-full p-2 border rounded mt-1 text-center" 
                                                    required 
                                                />
                                                <input 
                                                    type="text" 
                                                    value={cvv}
                                                    onChange={e => setCvv(e.target.value)}
                                                    placeholder="CVV" 
                                                    className="w-full p-2 border rounded mt-1 text-center" 
                                                    required 
                                                />
                                            </div>
                                            {paymentError && <p className="text-red-500 text-xs text-center font-bold">{paymentError}</p>}
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div 
                                onClick={() => setPaymentMethod('cliq')} 
                                className={`border-2 rounded-lg p-4 cursor-pointer flex justify-between items-center transition-colors ${paymentMethod === 'cliq' ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-green-300'}`}
                            >
                                <span className="font-bold text-blue-900">دفعات محلية (كليك / زين كاش)</span>
                                <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${paymentMethod === 'cliq' ? 'border-green-500' : 'border-gray-400'}`}>
                                    {paymentMethod === 'cliq' && <div className="w-3 h-3 rounded-full bg-green-500"></div>}
                                </div>
                            </div>

                            <button 
                                type="submit" 
                                disabled={isProcessing}
                                className={`w-full text-white font-bold py-3 rounded-lg mt-4 shadow-md transition-all ${isProcessing ? 'bg-gray-400 cursor-wait' : 'bg-green-500 hover:bg-green-600 active:scale-95'}`}
                            >
                                {isProcessing ? 'جاري التحقق...' : (strings.confirmPayment || 'تأكيد الدفع')}
                            </button>
                        </form>
                    </div>
                </div>
            </div>

            {/* OTP Secure Modal المحاكاة */}
            {showOtpModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
                    <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-scale-up">
                        {/* Modal Header (Bank Branding Simulation) */}
                        <div className="bg-gray-50 p-4 border-b flex justify-between items-center">
                            <img src="https://i.ibb.co/XxGsLR3D/15.png" alt="JoTutor" className="h-8" />
                            <div className="flex gap-2">
                                <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" className="h-4" />
                                <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-6" />
                            </div>
                        </div>

                        <div className="p-8">
                            <div className="text-center mb-6">
                                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-50 text-blue-600 mb-4">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold text-gray-800">التحقق الآمن من البطاقة</h3>
                                <p className="text-gray-500 text-sm mt-2">
                                    لقد أرسلنا رمز تحقق (OTP) إلى هاتفك المسجل لدى البنك والمنتهي بـ <span className="font-bold">****241</span>
                                </p>
                            </div>

                            <form onSubmit={handleOtpVerify} className="space-y-6">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2 text-center">أدخل الرمز المكون من 6 أرقام</label>
                                    <input 
                                        type="text" 
                                        maxLength={6}
                                        value={otpCode}
                                        onChange={e => setOtpCode(e.target.value)}
                                        className="w-full text-center text-3xl tracking-[0.5em] font-mono p-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-0 outline-none"
                                        placeholder="000000"
                                        required
                                        autoFocus
                                    />
                                    {otpError && <p className="text-red-500 text-xs mt-2 text-center font-bold">{otpError}</p>}
                                    <p className="text-xs text-gray-400 text-center mt-2">لأغراض التجربة، استخدم الرمز: <span className="font-bold text-blue-600">123456</span></p>
                                </div>

                                <div className="flex flex-col gap-3">
                                    <button 
                                        type="submit" 
                                        disabled={isProcessing}
                                        className={`w-full bg-blue-900 text-white font-bold py-4 rounded-xl shadow-lg transition-all ${isProcessing ? 'opacity-50 cursor-wait' : 'hover:bg-blue-800'}`}
                                    >
                                        {isProcessing ? 'جاري المعالجة...' : 'تأكيد الرمز وإتمام الدفع'}
                                    </button>
                                    <button 
                                        type="button"
                                        onClick={() => setShowOtpModal(false)}
                                        className="w-full text-gray-500 text-sm font-semibold hover:underline"
                                    >
                                        إلغاء العملية
                                    </button>
                                </div>
                            </form>
                        </div>
                        
                        <div className="bg-gray-100 p-4 text-center">
                            <p className="text-[10px] text-gray-400 uppercase tracking-widest">Secure Payment Gateway - 256-bit Encryption</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PaymentPage;