import React, { useState, useEffect, useRef } from 'react';
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
    const [isProcessing, setIsProcessing] = useState(false);
    const [isSessionLoading, setIsSessionLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const sessionInitialized = useRef(false);

    const displayPrice = (currency === 'USD' ? (course.priceUsd ?? (course.priceJod || 0) * 1.41) : 
                         currency === 'SAR' ? (course.priceSar ?? (course.priceJod || 0) * 5.3) : 
                         (course.priceJod ?? 0)).toFixed(2);

    /**
     * وظيفة تهيئة جلسة الدفع الآمنة
     */
    const initMpgsSession = () => {
        if (!(window as any).PaymentSession) {
            console.error("Mastercard Session library not loaded yet.");
            return;
        }

        try {
            (window as any).PaymentSession.configure({
                fields: {
                    card: {
                        number: "#card-number",
                        securityCode: "#security-code",
                        expiryMonth: "#expiry-month",
                        expiryYear: "#expiry-year",
                        nameOnCard: "#cardholder-name"
                    }
                },
                frameEmbeddingMitigation: ["javascript"],
                callbacks: {
                    initialized: (response: any) => {
                        console.log("MPGS Session Initialized", response);
                        setIsSessionLoading(false);
                        sessionInitialized.current = true;
                    },
                    formSessionUpdate: (response: any) => {
                        if (response.status) {
                            if ("ok" === response.status) {
                                finalizePayment(response.session.id);
                            } else if ("fields_in_error" === response.status) {
                                setErrorMessage("يرجى التأكد من صحة بيانات البطاقة.");
                                setIsProcessing(false);
                            } else {
                                setErrorMessage("حدث خطأ في معالجة البيانات: " + response.status);
                                setIsProcessing(false);
                            }
                        }
                    }
                },
                interaction: {
                    displayControl: {
                        formatCard: "EMBEDDED",
                        invalidFieldCharacters: "REJECT"
                    }
                }
            });
        } catch (e) {
            console.error("MPGS Configuration Error", e);
        }
    };

    /**
     * تشغيل التهيئة عند تحميل المكون
     */
    useEffect(() => {
        if (paymentMethod === 'visa') {
            setIsSessionLoading(true);
            // انتظار بسيط للتأكد من أن الـ DOM قد تم رندرتها بالكامل
            const timer = setTimeout(() => {
                initMpgsSession();
            }, 500);
            return () => clearTimeout(timer);
        }
    }, [paymentMethod]);

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (paymentMethod === 'cliq') {
            onEnroll(course, 'Pending', { paymentMethod: 'CliQ' });
        } else {
            if (!sessionInitialized.current) {
                setErrorMessage("نظام الدفع غير جاهز حالياً، يرجى تحديث الصفحة.");
                return;
            }
            setIsProcessing(true);
            setErrorMessage(null);
            (window as any).PaymentSession.updateSessionFromForm('card');
        }
    };

    const finalizePayment = async (sessionId: string) => {
        const orderId = `ORD-${Date.now()}`;
        const transactionId = `TXN-${Date.now()}`;

        try {
            // محاكاة الطلب للخادم (يتم استبداله برابط الـ API الخاص بك)
            // ملاحظة: لا يمكن تنفيذ طلب PAY مباشرة من المتصفح لـ Mastercard بسبب CORS
            // يجب أن يتم من خلال Server-side الخاص بك.
            
            console.log("Finalizing with Session:", sessionId);
            
            // في بيئة الاختبار الحالية، سنعتبرها ناجحة للمضي قدماً
            setTimeout(() => {
                onEnroll(course, 'Success', { orderId, transactionId, paymentMethod: 'Credit Card' });
            }, 1500);
            
        } catch (error: any) {
            setErrorMessage("فشل تأكيد العملية. يرجى المحاولة لاحقاً.");
            setIsProcessing(false);
        }
    };

    return (
        <div className="py-20 bg-gray-100 min-h-screen">
            <div className="container mx-auto px-6 max-w-4xl">
                <h1 className="text-4xl font-black text-center text-blue-900 mb-12">{strings.paymentTitle}</h1>
                
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                    {/* ملخص الدورة */}
                    <div className="lg:col-span-2 space-y-4">
                        <div className="bg-white p-5 rounded-2xl shadow-lg border border-gray-200 text-right">
                            <img src={course.imageUrl} alt={course.title} className="w-full h-32 object-cover rounded-xl mb-4" />
                            <h3 className="font-bold text-blue-900 leading-tight">{course.title}</h3>
                            <div className="mt-4 pt-4 border-t flex justify-between items-center">
                                <span className="text-gray-500 font-bold text-sm">المبلغ:</span>
                                <span className="text-2xl font-black text-green-600">{displayPrice} {currency}</span>
                            </div>
                        </div>
                    </div>

                    {/* واجهة الدفع */}
                    <div className="lg:col-span-3 bg-white p-8 rounded-2xl shadow-xl">
                        <div className="flex gap-4 mb-8">
                            <button type="button" onClick={() => setPaymentMethod('visa')} className={`flex-1 py-3 rounded-xl border-2 font-bold transition-all ${paymentMethod === 'visa' ? 'border-green-500 bg-green-50 text-green-700' : 'border-gray-100 text-gray-400'}`}>بطاقة بنكية</button>
                            <button type="button" onClick={() => setPaymentMethod('cliq')} className={`flex-1 py-3 rounded-xl border-2 font-bold transition-all ${paymentMethod === 'cliq' ? 'border-green-500 bg-green-50 text-green-700' : 'border-gray-100 text-gray-400'}`}>CliQ / محفظة</button>
                        </div>

                        <form onSubmit={handleFormSubmit} className="space-y-5 text-right">
                            {paymentMethod === 'visa' ? (
                                <div className="space-y-4 relative">
                                    {isSessionLoading && (
                                        <div className="absolute inset-0 bg-white/80 z-10 flex flex-col items-center justify-center rounded-xl">
                                            <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin mb-2"></div>
                                            <p className="text-xs font-bold text-gray-500">جاري تهيئة الاتصال الآمن...</p>
                                        </div>
                                    )}

                                    <div>
                                        <label className="block text-xs font-black text-gray-400 mb-1 uppercase">الاسم على البطاقة</label>
                                        <input id="cardholder-name" type="text" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 font-bold" placeholder="FULL NAME" required />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-black text-gray-400 mb-1 uppercase">رقم البطاقة</label>
                                        <div id="card-number" className="mpgs-field"></div>
                                    </div>
                                    <div className="grid grid-cols-3 gap-4">
                                        <div>
                                            <label className="block text-xs font-black text-gray-400 mb-1 uppercase">الشهر</label>
                                            <input id="expiry-month" type="text" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 text-center font-bold" placeholder="MM" maxLength={2} required />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-black text-gray-400 mb-1 uppercase">السنة</label>
                                            <input id="expiry-year" type="text" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 text-center font-bold" placeholder="YY" maxLength={2} required />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-black text-gray-400 mb-1 uppercase">CVV</label>
                                            <div id="security-code" className="mpgs-field"></div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="bg-green-50 p-6 rounded-xl text-green-800 text-sm font-bold border border-green-100 flex flex-col items-center gap-4 text-center">
                                    <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white text-2xl">✓</div>
                                    سيتم إرسال تعليمات الدفع عبر CliQ فور تأكيد الطلب.
                                </div>
                            )}

                            {errorMessage && (
                                <div className="p-3 bg-red-50 text-red-600 rounded-lg text-xs font-bold border border-red-100">
                                    {errorMessage}
                                </div>
                            )}

                            <button type="submit" disabled={isProcessing || (paymentMethod === 'visa' && isSessionLoading)} className="w-full bg-blue-900 text-white font-black py-4 rounded-xl shadow-xl hover:bg-blue-800 transition-all active:scale-95 disabled:bg-gray-300">
                                {isProcessing ? "جاري المعالجة..." : strings.confirmPayment}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentPage;