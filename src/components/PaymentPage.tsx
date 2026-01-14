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
    const initializationTried = useRef(false);

    const displayPrice = (currency === 'USD' ? (course.priceUsd ?? (course.priceJod || 0) * 1.41) : 
                         currency === 'SAR' ? (course.priceSar ?? (course.priceJod || 0) * 5.3) : 
                         (course.priceJod ?? 0)).toFixed(2);

    /**
     * وظيفة تهيئة الجلسة
     */
    const configureSession = () => {
        const win = window as any;
        if (!win.PaymentSession) {
            setErrorMessage("فشل تحميل مكتبة الدفع. يرجى التأكد من اتصالك بالإنترنت وتحديث الصفحة.");
            setIsSessionLoading(false);
            return;
        }

        // التأكد من وجود العناصر في الصفحة قبل التهيئة
        if (!document.querySelector('#card-number')) {
            console.warn("DOM elements not ready for MPGS yet, retrying...");
            setTimeout(configureSession, 100);
            return;
        }

        try {
            win.PaymentSession.configure({
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
                        console.log("MPGS Session Ready", response);
                        setIsSessionLoading(false);
                    },
                    formSessionUpdate: (response: any) => {
                        if (response.status) {
                            if ("ok" === response.status) {
                                // تم الحصول على Session ID
                                handleFinalPayment(response.session.id);
                            } else if ("fields_in_error" === response.status) {
                                setErrorMessage("يرجى مراجعة بيانات البطاقة المدخلة.");
                                setIsProcessing(false);
                            } else {
                                setErrorMessage("حدث خطأ في النظام: " + response.status);
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
            console.error("Configuration Exception", e);
        }
    };

    useEffect(() => {
        if (paymentMethod === 'visa' && !initializationTried.current) {
            initializationTried.current = true;
            // ننتظر قليلاً للتأكد من رندر المكون بالكامل
            setTimeout(configureSession, 300);
        }
    }, [paymentMethod]);

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (paymentMethod === 'cliq') {
            onEnroll(course, 'Pending', { paymentMethod: 'CliQ' });
        } else {
            setIsProcessing(true);
            setErrorMessage(null);
            const win = window as any;
            if (win.PaymentSession) {
                win.PaymentSession.updateSessionFromForm('card');
            } else {
                setErrorMessage("نظام الدفع غير متاح حالياً.");
                setIsProcessing(false);
            }
        }
    };

    const handleFinalPayment = (sessionId: string) => {
        const orderId = `ORD-${Date.now()}`;
        const transactionId = `TXN-${Date.now()}`;
        
        // محاكاة النجاح في بيئة الاختبار
        console.log("Processing with SessionID:", sessionId);
        setTimeout(() => {
            onEnroll(course, 'Success', { orderId, transactionId, paymentMethod: 'Credit Card' });
        }, 1500);
    };

    return (
        <div className="py-20 bg-gray-100 min-h-screen">
            <div className="container mx-auto px-6 max-w-4xl text-right">
                <h1 className="text-4xl font-black text-center text-blue-900 mb-12">{strings.paymentTitle}</h1>
                
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                    {/* ملخص الدورة */}
                    <div className="lg:col-span-2 order-2 lg:order-1">
                        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200">
                            <img src={course.imageUrl} alt={course.title} className="w-full h-40 object-cover rounded-xl mb-4" />
                            <h3 className="font-bold text-blue-900 text-lg leading-tight mb-4">{course.title}</h3>
                            <div className="pt-4 border-t flex justify-between items-center">
                                <span className="text-gray-500 font-bold">المبلغ المطلوب:</span>
                                <span className="text-2xl font-black text-green-600">{displayPrice} {currency}</span>
                            </div>
                        </div>
                    </div>

                    {/* واجهة الدفع */}
                    <div className="lg:col-span-3 order-1 lg:order-2 bg-white p-8 rounded-2xl shadow-xl">
                        <div className="flex gap-4 mb-8">
                            <button type="button" onClick={() => setPaymentMethod('visa')} className={`flex-1 py-3 rounded-xl border-2 font-bold transition-all ${paymentMethod === 'visa' ? 'border-green-500 bg-green-50 text-green-700' : 'border-gray-100 text-gray-400'}`}>بطاقة ائتمان</button>
                            <button type="button" onClick={() => setPaymentMethod('cliq')} className={`flex-1 py-3 rounded-xl border-2 font-bold transition-all ${paymentMethod === 'cliq' ? 'border-green-500 bg-green-50 text-green-700' : 'border-gray-100 text-gray-400'}`}>كليك / محفظة</button>
                        </div>

                        <form onSubmit={handleFormSubmit} className="space-y-6">
                            {paymentMethod === 'visa' ? (
                                <div className="space-y-4 relative">
                                    {isSessionLoading && (
                                        <div className="absolute inset-0 bg-white/90 z-20 flex flex-col items-center justify-center rounded-xl">
                                            <div className="w-10 h-10 border-4 border-green-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                                            <p className="text-sm font-bold text-blue-900">جاري تحميل نظام الدفع الآمن...</p>
                                        </div>
                                    )}

                                    <div>
                                        <label className="block text-xs font-black text-gray-400 mb-2 uppercase">الاسم على البطاقة</label>
                                        <input id="cardholder-name" type="text" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 font-bold" placeholder="FULL NAME" required />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-black text-gray-400 mb-2 uppercase">رقم البطاقة</label>
                                        <div id="card-number" className="mpgs-field"></div>
                                    </div>

                                    <div className="grid grid-cols-3 gap-4">
                                        <div>
                                            <label className="block text-xs font-black text-gray-400 mb-2 uppercase text-center">شهر</label>
                                            <input id="expiry-month" type="text" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 text-center font-bold" placeholder="MM" maxLength={2} required />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-black text-gray-400 mb-2 uppercase text-center">سنة</label>
                                            <input id="expiry-year" type="text" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 text-center font-bold" placeholder="YY" maxLength={2} required />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-black text-gray-400 mb-2 uppercase text-center">CVV</label>
                                            <div id="security-code" className="mpgs-field"></div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="bg-green-50 p-8 rounded-xl text-green-800 text-sm font-bold border border-green-100 flex flex-col items-center gap-4 text-center">
                                    <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center text-white text-3xl shadow-lg">✓</div>
                                    <p className="text-lg">دفع فوري عبر كليك (CliQ)</p>
                                    <p className="text-gray-600 font-medium">بمجرد الضغط على تأكيد، سنقوم بإرسال معلومات التحويل لك.</p>
                                </div>
                            )}

                            {errorMessage && (
                                <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm font-bold border border-red-100 animate-pulse">
                                    {errorMessage}
                                </div>
                            )}

                            <button 
                                type="submit" 
                                disabled={isProcessing || (paymentMethod === 'visa' && isSessionLoading)} 
                                className="w-full bg-blue-900 text-white font-black py-4 rounded-xl shadow-xl hover:bg-blue-800 transition-all active:scale-95 disabled:bg-gray-300 disabled:cursor-not-allowed text-lg"
                            >
                                {isProcessing ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                                        جاري المعالجة...
                                    </span>
                                ) : strings.confirmPayment}
                            </button>
                        </form>

                        <div className="mt-8 flex justify-center gap-8 grayscale opacity-50">
                            <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" className="h-4" alt="Visa" />
                            <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" className="h-6" alt="Mastercard" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentPage;