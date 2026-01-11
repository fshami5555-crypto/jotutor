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

    // Mastercard API Config
    const API_VERSION = "72"; 
    const GATEWAY_URL = `https://test-network.mtf.gateway.mastercard.com/api/rest/version/${API_VERSION}`;
    const MERCHANT_ID = "test12122024";
    const API_USERNAME = "merchant.test12122024";
    const API_PASSWORD = "0cb74bdcb05329641aa7bed1caff4e8a";

    const displayPrice = (currency === 'USD' ? (course.priceUsd ?? course.price * 1.41) : 
                         currency === 'SAR' ? (course.priceSar ?? course.price * 5.3) : 
                         (course.priceJod ?? course.price)).toFixed(2);

    /**
     * تنفيذ عملية الدفع الحقيقية
     * تم إزالة كائن 'interaction' لأنه غير صالح في عملية الـ PAY المباشرة
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
                    description: `Course Enrollment: ${course.title}`,
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
                // ملاحظة: تم إزالة interaction.operation و interaction.returnUrl 
                // لأنها تتسبب في خطأ مع API operation "PAY". المصادقة تتم عبر رد البوابة.
                browserPayment: {
                    returnUrl: window.location.origin // رابط العودة في حال التحويل
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

            // الحالة 1: نجاح معالجة الطلب
            if (response.ok && data.result === 'SUCCESS') {
                onEnroll(course, 'Success', { orderId, transactionId, paymentMethod: 'Credit Card' });
            } 
            // الحالة 2: طلب مصادقة 3D Secure (إعادة توجيه للبنك)
            else if (data.authentication?.redirectHtml) {
                setBankHtml(data.authentication.redirectHtml);
                setShowBankPage(true);
                setIsProcessing(false);
            }
            // الحالة 3: رفض العملية أو خطأ في البارامترات
            else {
                const errorDetail = data.error?.explanation || data.response?.gatewayCode || "العملية مرفوضة من البنك";
                throw new Error(errorDetail);
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
                    <div className="lg:col-span-2 space-y-4">
                        <div className="bg-white p-5 rounded-2xl shadow-lg border border-gray-200">
                            <img src={course.imageUrl} alt={course.title} className="w-full h-32 object-cover rounded-xl mb-4" />
                            <h3 className="font-bold text-blue-900 leading-tight">{course.title}</h3>
                            <div className="mt-4 pt-4 border-t flex justify-between items-center">
                                <span className="text-gray-500 font-bold">المبلغ:</span>
                                <span className="text-2xl font-black text-green-600">{displayPrice} {currency}</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-400 justify-center">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"/></svg>
                            Secure Gateway Services
                        </div>
                    </div>

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
                                    سيتم توجيهك لبيانات الدفع المحلية (كليك/زين كاش) عند التأكيد.
                                </div>
                            )}

                            {errorMessage && <div className="p-3 bg-red-50 text-red-600 rounded-lg text-xs font-bold border border-red-100">{errorMessage}</div>}

                            <button type="submit" disabled={isProcessing} className="w-full bg-blue-900 text-white font-black py-4 rounded-xl shadow-xl hover:bg-blue-800 transition-all active:scale-95 disabled:bg-gray-300 disabled:cursor-wait">
                                {isProcessing ? 'جاري الاتصال بالبوابة...' : strings.confirmPayment}
                            </button>
                        </form>

                        <div className="mt-8 flex justify-center gap-4 grayscale opacity-40">
                            <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" className="h-4" alt="Visa" />
                            <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" className="h-6" alt="Mastercard" />
                        </div>
                    </div>
                </div>
            </div>

            {showBankPage && bankHtml && (
                <div className="fixed inset-0 z-[200] bg-white flex flex-col">
                    <div className="bg-gray-100 p-4 border-b flex justify-between items-center">
                        <span className="font-bold text-gray-600">التحقق الآمن (3D Secure)...</span>
                        <button onClick={() => setShowBankPage(false)} className="text-red-500 font-bold text-sm">إلغاء والعودة</button>
                    </div>
                    <div className="flex-1 w-full">
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