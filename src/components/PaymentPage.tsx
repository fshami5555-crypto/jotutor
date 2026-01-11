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
    const [showBankPage, setShowBankPage] = useState(false);
    const [bankHtml, setBankHtml] = useState<string | null>(null);
    
    // Card State
    const [cardHolder, setCardHolder] = useState('');
    const [cardNumber, setCardNumber] = useState('');
    const [expiry, setExpiry] = useState(''); 
    const [cvv, setCvv] = useState('');
    
    // UI State
    const [isProcessing, setIsProcessing] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    // Mastercard API Config (Version 72)
    const API_VERSION = "72"; 
    const GATEWAY_URL = `https://test-network.mtf.gateway.mastercard.com/api/rest/version/${API_VERSION}`;
    const MERCHANT_ID = "test12122024";
    const API_USERNAME = "merchant.test12122024";
    const API_PASSWORD = "0cb74bdcb05329641aa7bed1caff4e8a";

    const displayPrice = (currency === 'USD' ? (course.priceUsd ?? (course.priceJod || 0) * 1.41) : 
                         currency === 'SAR' ? (course.priceSar ?? (course.priceJod || 0) * 5.3) : 
                         (course.priceJod ?? 0)).toFixed(2);

    /**
     * تنفيذ عملية الدفع عبر البوابة
     * تم إزالة كائن interaction نهائياً لأنه المسبب للخطأ في عملية الـ PAY
     */
    const initiateGatewayPayment = async () => {
        setIsProcessing(true);
        setErrorMessage(null);

        const orderId = `ORD-${Date.now()}`;
        const transactionId = `TXN-${Date.now()}`;

        try {
            const expiryParts = expiry.split('/').map(s => s.trim());
            if (expiryParts.length !== 2) throw new Error("تنسيق التاريخ غير صحيح (MM/YY)");
            
            const [month, year] = expiryParts;
            const fullYear = year.length === 2 ? `20${year}` : year;

            // الطلب المحدث والمتوافق مع عملية PAY المباشرة
            const payload = {
                apiOperation: "PAY",
                authentication: {
                    acceptVersions: "3DS1,3DS2",
                    channel: "BROWSER",
                    purpose: "PAYMENT_TRANSACTION"
                },
                order: {
                    amount: displayPrice,
                    currency: currency,
                    description: `JoTutor: ${course.title}`,
                    reference: course.id
                },
                sourceOfFunds: {
                    provided: {
                        card: {
                            number: cardNumber.replace(/\s/g, ''),
                            securityCode: cvv,
                            expiry: {
                                month: month.padStart(2, '0'),
                                year: fullYear.slice(-2)
                            }
                        }
                    },
                    type: "CARD"
                },
                // تم نقل رابط العودة إلى browserPayment بدلاً من interaction
                browserPayment: {
                    returnUrl: window.location.origin
                }
            };

            const response = await fetch(`${GATEWAY_URL}/merchant/${MERCHANT_ID}/order/${orderId}/transaction/${transactionId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Basic ${btoa(`${API_USERNAME}:${API_PASSWORD}`)}`
                },
                body: JSON.stringify(payload)
            });

            const data = await response.json();

            // معالجة الردود
            if (response.ok && data.result === 'SUCCESS') {
                onEnroll(course, 'Success', { orderId, transactionId, paymentMethod: 'Credit Card' });
            } 
            // التحقق من وجود HTML إعادة التوجيه لـ 3DS (استدعاء البنك)
            else if (data.authentication?.redirectHtml) {
                setBankHtml(data.authentication.redirectHtml);
                setShowBankPage(true);
                setIsProcessing(false);
            }
            else {
                // استخراج رسالة الخطأ من البوابة
                const errorMsg = data.error?.explanation || data.response?.gatewayCode || "العملية مرفوضة من قبل البنك";
                throw new Error(errorMsg);
            }

        } catch (error: any) {
            setErrorMessage(`خطأ في الدفع: ${error.message}`);
            setIsProcessing(false);
        }
    };

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (paymentMethod === 'cliq') {
            onEnroll(course, 'Pending', { paymentMethod: 'CliQ' });
        } else {
            initiateGatewayPayment();
        }
    };

    return (
        <div className="py-20 bg-gray-100 min-h-screen">
            <div className="container mx-auto px-6 max-w-4xl">
                <h1 className="text-4xl font-black text-center text-blue-900 mb-12">{strings.paymentTitle}</h1>
                
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                    {/* ملخص الدورة */}
                    <div className="lg:col-span-2 space-y-4">
                        <div className="bg-white p-5 rounded-2xl shadow-lg border border-gray-200">
                            <img src={course.imageUrl} alt={course.title} className="w-full h-32 object-cover rounded-xl mb-4" />
                            <h3 className="font-bold text-blue-900 leading-tight">{course.title}</h3>
                            <div className="mt-4 pt-4 border-t flex justify-between items-center">
                                <span className="text-gray-500 font-bold">المبلغ المستحق:</span>
                                <span className="text-2xl font-black text-green-600">{displayPrice} {currency}</span>
                            </div>
                        </div>
                        <div className="bg-blue-900 p-5 rounded-2xl text-white">
                            <div className="flex items-center gap-2 mb-2 text-sm">
                                <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>
                                <span className="font-bold">دفع آمن بالكامل</span>
                            </div>
                            <p className="text-[10px] text-blue-200">يتم معالجة بياناتك مباشرة عبر بوابة Mastercard Payment Gateway العالمية.</p>
                        </div>
                    </div>

                    {/* واجهة الدفع */}
                    <div className="lg:col-span-3 bg-white p-8 rounded-2xl shadow-xl">
                        <div className="flex gap-4 mb-8">
                            <button type="button" onClick={() => setPaymentMethod('visa')} className={`flex-1 py-3 rounded-xl border-2 font-bold transition-all ${paymentMethod === 'visa' ? 'border-green-500 bg-green-50 text-green-700' : 'border-gray-100 text-gray-400'}`}>بطاقة بنكية</button>
                            <button type="button" onClick={() => setPaymentMethod('cliq')} className={`flex-1 py-3 rounded-xl border-2 font-bold transition-all ${paymentMethod === 'cliq' ? 'border-green-500 bg-green-50 text-green-700' : 'border-gray-100 text-gray-400'}`}>دفع محلي</button>
                        </div>

                        <form onSubmit={handleFormSubmit} className="space-y-5">
                            {paymentMethod === 'visa' ? (
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-xs font-black text-gray-400 mb-1 uppercase">حامل البطاقة</label>
                                        <input type="text" value={cardHolder} onChange={e => setCardHolder(e.target.value)} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 font-bold" placeholder="NAME ON CARD" required />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-black text-gray-400 mb-1 uppercase">رقم البطاقة</label>
                                        <input type="text" value={cardNumber} onChange={e => setCardNumber(e.target.value.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim())} maxLength={19} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 font-mono text-lg" placeholder="0000 0000 0000 0000" required />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-black text-gray-400 mb-1 uppercase">تاريخ الانتهاء</label>
                                            <input type="text" value={expiry} onChange={e => setExpiry(e.target.value.replace(/\D/g, '').replace(/(.{2})/, '$1/').trim())} maxLength={5} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 text-center font-bold" placeholder="MM/YY" required />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-black text-gray-400 mb-1 uppercase">CVV</label>
                                            <input type="password" value={cvv} onChange={e => setCvv(e.target.value.replace(/\D/g, ''))} maxLength={4} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 text-center font-bold" placeholder="•••" required />
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="bg-blue-50 p-4 rounded-xl text-blue-800 text-sm font-bold border border-blue-100">
                                    سيتم تزويدك ببيانات تحويل CliQ فور الضغط على زر التأكيد أدناه.
                                </div>
                            )}

                            {errorMessage && <div className="p-3 bg-red-50 text-red-600 rounded-lg text-xs font-bold border border-red-100">{errorMessage}</div>}

                            <button type="submit" disabled={isProcessing} className="w-full bg-blue-900 text-white font-black py-4 rounded-xl shadow-xl hover:bg-blue-800 transition-all active:scale-95 disabled:bg-gray-300 disabled:cursor-wait">
                                {isProcessing ? 'جاري التحقق...' : strings.confirmPayment}
                            </button>
                        </form>

                        <div className="mt-8 flex justify-center gap-4 grayscale opacity-40">
                            <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" className="h-4" alt="Visa" />
                            <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" className="h-6" alt="Mastercard" />
                        </div>
                    </div>
                </div>
            </div>

            {/* صفحة التحقق من البنك (3DS) */}
            {showBankPage && bankHtml && (
                <div className="fixed inset-0 z-[200] bg-white flex flex-col">
                    <div className="bg-gray-100 p-4 border-b flex justify-between items-center">
                        <div className="flex items-center gap-2">
                             <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                             <span className="font-bold text-gray-600 text-sm">التحقق الآمن عبر البنك المصدر (3D Secure)</span>
                        </div>
                        <button onClick={() => setShowBankPage(false)} className="text-red-500 font-bold text-sm bg-red-50 px-3 py-1 rounded-md">إلغاء</button>
                    </div>
                    <div className="flex-1 w-full bg-white">
                        <iframe 
                            title="Bank Verification"
                            srcDoc={bankHtml} 
                            className="w-full h-full border-none"
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default PaymentPage;