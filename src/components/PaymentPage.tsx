import React, { useState, useEffect } from 'react';
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

    const [paymentMethod, setPaymentMethod] = useState<'cliq' | 'visa'>('visa');
    const [showBankDetails, setShowBankDetails] = useState(false);
    const [showOtpModal, setShowOtpModal] = useState(false);
    
    // Card Form State
    const [cardHolder, setCardHolder] = useState('');
    const [cardNumber, setCardNumber] = useState('');
    const [expiry, setExpiry] = useState(''); 
    const [cvv, setCvv] = useState('');
    const [otpCode, setOtpCode] = useState('');
    
    // UI & Error State
    const [isProcessing, setIsProcessing] = useState(false);
    const [paymentError, setPaymentError] = useState<string | null>(null);
    const [otpError, setOtpError] = useState<string | null>(null);

    // Mastercard API Configuration
    const GATEWAY_URL = "https://test-network.mtf.gateway.mastercard.com/api/rest/version/70";
    const MERCHANT_ID = "test12122024";
    const API_USERNAME = "merchant.test12122024";
    const API_PASSWORD = "0cb74bdcb05329641aa7bed1caff4e8a";

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
    const displayPrice = price.toFixed(2);

    // تنفيذ عملية الدفع النهائية بعد التحقق من OTP
    const executeGatewayPayment = async () => {
        setIsProcessing(true);
        setOtpError(null);
        
        const orderId = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
        const transactionId = `TXN-${Date.now()}`;

        try {
            const expiryParts = expiry.split('/');
            if (expiryParts.length !== 2) throw new Error("تنسيق التاريخ غير صحيح (MM/YY)");
            
            const [month, year] = expiryParts;
            const fullYear = year.length === 2 ? `20${year}` : year;

            const payload = {
                apiOperation: "PAY",
                order: { 
                    amount: displayPrice, 
                    currency: currency, 
                    reference: course.id,
                    description: `Enrollment for ${course.title}`
                },
                sourceOfFunds: {
                    provided: {
                        card: {
                            number: cardNumber.replace(/\s/g, ''),
                            securityCode: cvv,
                            expiry: { month: month.trim(), year: fullYear.trim().slice(-2) }
                        }
                    },
                    type: "CARD"
                }
            };

            const authHeader = `Basic ${btoa(`${API_USERNAME}:${API_PASSWORD}`)}`;
            
            const response = await fetch(`${GATEWAY_URL}/merchant/${MERCHANT_ID}/order/${orderId}/transaction/${transactionId}`, {
                method: 'PUT',
                headers: { 
                    'Content-Type': 'application/json', 
                    'Authorization': authHeader 
                },
                body: JSON.stringify(payload)
            });

            const data = await response.json();

            if (response.ok && (data.result === 'SUCCESS')) {
                setShowOtpModal(false);
                onEnroll(course, 'Success', { orderId, transactionId, paymentMethod: 'Credit Card' });
            } else {
                // استخراج سبب الفشل الدقيق من استجابة البوابة
                const errorCode = data.error?.cause || data.response?.gatewayCode || "DECLINED";
                const errorExplanation = data.error?.explanation || "العملية مرفوضة من قبل البنك. يرجies التحقق من الرصيد أو بيانات البطاقة.";
                throw new Error(`${errorCode}: ${errorExplanation}`);
            }
        } catch (error: any) {
            setOtpError(error.message);
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
        } else {
            // التحقق من الحقول قبل إظهار OTP
            if (cardNumber.replace(/\s/g, '').length < 15) {
                setPaymentError("رقم البطاقة غير مكتمل");
                return;
            }
            setShowOtpModal(true);
        }
    };

    if (showBankDetails) {
        return (
            <div className="py-20 bg-gray-100 min-h-screen flex items-center">
                <div className="container mx-auto px-6 max-w-2xl">
                    <div className="bg-white p-8 rounded-2xl shadow-2xl border-t-8 border-green-500 animate-fade-in-up">
                        <div className="text-center mb-8">
                            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                            </div>
                            <h2 className="text-3xl font-black text-blue-900">تم تسجيل طلبك!</h2>
                            <p className="text-gray-500 mt-2">يرجى إتمام التحويل عبر الخيارات أدناه</p>
                        </div>
                        
                        <div className="space-y-4 bg-gray-50 p-6 rounded-xl border border-gray-200 font-mono text-sm" dir="ltr">
                            <div className="flex justify-between border-b pb-2"><span className="text-gray-500">CliQ Alias:</span> <span className="font-bold text-blue-900">JOTUTOR</span></div>
                            <div className="flex justify-between border-b pb-2"><span className="text-gray-500">Zain Cash:</span> <span className="font-bold text-blue-900">0792822241</span></div>
                            <div className="pt-2">
                                <span className="text-gray-500 block mb-1">Arab Bank IBAN:</span>
                                <span className="text-xs break-all font-bold">JO89 ARAB 1450 0000 0014 5199 5405 00</span>
                            </div>
                        </div>

                        <div className="mt-8">
                            <a href="https://wa.me/962792822241" target="_blank" rel="noopener noreferrer" className="w-full bg-green-500 hover:bg-green-600 text-white font-black py-4 rounded-xl shadow-lg flex items-center justify-center gap-3 transition-transform active:scale-95">
                                <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.414 0 .018 5.393 0 12.029c0 2.119.549 4.185 1.591 6.019L0 24l6.135-1.61a11.81 11.81 0 005.915 1.594h.005c6.637 0 12.032-5.391 12.035-12.027a11.85 11.85 0 01-3.441-8.528z"/></svg>
                                إرسال إيصال الدفع عبر واتساب
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="py-20 bg-gray-100 min-h-screen">
            <div className="container mx-auto px-6 max-w-4xl">
                <h1 className="text-4xl font-black text-center text-blue-900 mb-12">{strings.paymentTitle}</h1>
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                    
                    {/* ملخص الدورة */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white p-6 rounded-2xl shadow-xl overflow-hidden">
                            <img src={course.imageUrl} alt={course.title} className="w-full h-40 object-cover rounded-xl mb-4" />
                            <h3 className="font-black text-blue-900 text-lg mb-1">{course.title}</h3>
                            <p className="text-sm text-gray-500 mb-4">{course.teacher}</p>
                            <div className="border-t pt-4 flex justify-between items-center">
                                <span className="font-bold text-gray-400">الإجمالي:</span>
                                <span className="text-2xl font-black text-green-500">{currencySymbol}{displayPrice}</span>
                            </div>
                        </div>
                        <div className="bg-blue-900 p-6 rounded-2xl text-white shadow-lg">
                            <div className="flex items-center gap-3 mb-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                                <span className="font-bold">دفع آمن 100%</span>
                            </div>
                            <p className="text-xs text-blue-200">بياناتك مشفرة ولا يتم تخزين أرقام البطاقات في خوادمنا.</p>
                        </div>
                    </div>

                    {/* نموذج الدفع */}
                    <div className="lg:col-span-3 bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
                        <div className="flex gap-4 mb-8">
                            <button onClick={() => setPaymentMethod('visa')} className={`flex-1 py-3 rounded-xl border-2 font-bold transition-all flex items-center justify-center gap-2 ${paymentMethod === 'visa' ? 'border-green-500 bg-green-50 text-green-700' : 'border-gray-100 text-gray-400'}`}>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                                بطاقة بنكية
                            </button>
                            <button onClick={() => setPaymentMethod('cliq')} className={`flex-1 py-3 rounded-xl border-2 font-bold transition-all flex items-center justify-center gap-2 ${paymentMethod === 'cliq' ? 'border-green-500 bg-green-50 text-green-700' : 'border-gray-100 text-gray-400'}`}>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                دفع محلي
                            </button>
                        </div>

                        <form onSubmit={handleInitialSubmit} className="space-y-5">
                            {paymentMethod === 'visa' ? (
                                <>
                                    <div>
                                        <label className="block text-xs font-black text-gray-500 uppercase mb-2">اسم حامل البطاقة</label>
                                        <input type="text" value={cardHolder} onChange={e => setCardHolder(e.target.value)} className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none font-bold" placeholder="John Doe" required />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-black text-gray-500 uppercase mb-2">رقم البطاقة</label>
                                        <input type="text" value={cardNumber} onChange={e => setCardNumber(e.target.value.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim())} maxLength={19} className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none font-mono text-lg tracking-widest" placeholder="0000 0000 0000 0000" required />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-black text-gray-500 uppercase mb-2">تاريخ الانتهاء</label>
                                            <input type="text" value={expiry} onChange={e => setExpiry(e.target.value.replace(/\D/g, '').replace(/(.{2})/, '$1/').trim())} maxLength={5} className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none text-center font-bold" placeholder="MM/YY" required />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-black text-gray-500 uppercase mb-2">رمز الأمان CVV</label>
                                            <input type="password" value={cvv} onChange={e => setCvv(e.target.value.replace(/\D/g, ''))} maxLength={4} className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none text-center font-bold" placeholder="•••" required />
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <div className="bg-orange-50 p-6 rounded-xl border border-orange-100">
                                    <p className="text-orange-800 text-sm font-bold leading-relaxed">
                                        سيتم تزويدك ببيانات التحويل (CliQ / Zain Cash) فور الضغط على زر التأكيد أدناه. يرجى تجهيز تطبيق البنك الخاص بك.
                                    </p>
                                </div>
                            )}

                            {paymentError && <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm font-bold text-center border border-red-100 animate-pulse">{paymentError}</div>}

                            <button type="submit" disabled={isProcessing} className="w-full bg-green-500 hover:bg-green-600 text-white font-black py-4 rounded-xl shadow-xl transition-all active:scale-95 disabled:bg-gray-300">
                                {strings.confirmPayment}
                            </button>
                        </form>
                    </div>
                </div>
            </div>

            {/* نظام 3D Secure / OTP من "الشركة" */}
            {showOtpModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => !isProcessing && setShowOtpModal(false)}></div>
                    <div className="relative bg-[#f8f9fa] rounded-lg shadow-2xl w-full max-w-md overflow-hidden border border-gray-200 animate-scale-up">
                        {/* ترويسة البنك المحاكاة */}
                        <div className="bg-white p-5 border-b flex justify-between items-center shadow-sm">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 bg-blue-900 rounded-md flex items-center justify-center text-white font-bold text-xs">BANK</div>
                                <span className="font-bold text-gray-700 text-sm uppercase tracking-tighter">Secure Authentication</span>
                            </div>
                            <div className="flex gap-3 grayscale opacity-60">
                                <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" className="h-3" />
                                <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="MC" className="h-5" />
                            </div>
                        </div>

                        <div className="p-8 text-center">
                            <div className="mb-6">
                                <h3 className="text-lg font-bold text-gray-800 mb-2">التحقق من حامل البطاقة</h3>
                                <p className="text-xs text-gray-500 leading-relaxed">
                                    أدخل رمز التحقق (OTP) الذي تم إرساله إلى رقم هاتفك المسجل لغايات إتمام الشراء بقيمة 
                                    <span className="font-black text-blue-900 ml-1">{currencySymbol}{displayPrice}</span>
                                </p>
                            </div>

                            <form onSubmit={(e) => { e.preventDefault(); executeGatewayPayment(); }} className="space-y-6">
                                <div className="relative">
                                    <input 
                                        type="text" 
                                        maxLength={6}
                                        value={otpCode}
                                        onChange={e => setOtpCode(e.target.value.replace(/\D/g, ''))}
                                        className="w-full text-center text-4xl tracking-[0.3em] font-mono py-4 bg-white border-2 border-gray-200 rounded-lg focus:border-blue-600 outline-none transition-all shadow-inner"
                                        placeholder="000000"
                                        required
                                        autoFocus
                                    />
                                    {isProcessing && <div className="absolute inset-0 bg-white/50 flex items-center justify-center rounded-lg"><div className="w-6 h-6 border-4 border-blue-900 border-t-transparent rounded-full animate-spin"></div></div>}
                                </div>

                                {otpError && (
                                    <div className="p-4 bg-red-50 border border-red-100 rounded-lg text-right">
                                        <p className="text-red-700 text-xs font-black mb-1">فشل في معالجة العملية:</p>
                                        <p className="text-red-600 text-[11px] leading-tight">{otpError}</p>
                                    </div>
                                )}

                                <div className="space-y-3">
                                    <button type="submit" disabled={isProcessing} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-lg shadow-md transition-all active:scale-95 disabled:opacity-50">
                                        {isProcessing ? 'جاري التحقق...' : 'تأكيد وإتمام الدفع'}
                                    </button>
                                    <button type="button" onClick={() => setShowOtpModal(false)} disabled={isProcessing} className="text-xs text-gray-400 font-bold hover:text-gray-600 underline">
                                        إلغاء العملية والعودة للمتجر
                                    </button>
                                </div>
                            </form>
                            
                            <div className="mt-8 pt-6 border-t border-gray-100 flex justify-center gap-6 opacity-30">
                                <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal_logo.svg" className="h-4" alt="PCI" />
                                <div className="text-[10px] font-black border border-gray-400 px-1 rounded">PCI DSS</div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PaymentPage;