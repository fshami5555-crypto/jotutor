
import React, { useState } from 'react';
import { Course, Currency, Language } from '../types';

interface PaymentPageProps {
    course: Course;
    currency: Currency;
    exchangeRate: number;
    strings: { [key: string]: string };
    language: Language;
    onEnroll: (course: Course) => void;
}

const PaymentPage: React.FC<PaymentPageProps> = ({ course, currency, strings, onEnroll }) => {
    if (!course) return <div>Course not found</div>;

    let price = 0;
    let currencySymbol = '';

    if (currency === 'USD') {
        price = course.priceUsd ?? 0;
        currencySymbol = strings.usd;
    } else if (currency === 'SAR') {
        price = course.priceSar ?? 0;
        currencySymbol = strings.sar;
    } else {
        price = course.priceJod ?? 0;
        currencySymbol = strings.jod;
    }

    const safePrice = typeof price === 'number' ? price : 0;
    const displayPrice = safePrice.toFixed(2);

    // State for payment method. Currently only 'cliq' is valid.
    const [paymentMethod, setPaymentMethod] = useState<'cliq' | 'visa' | 'paypal'>('cliq');

    const handlePayment = (e: React.FormEvent) => {
        e.preventDefault();
        if (paymentMethod === 'cliq') {
            onEnroll(course);
        }
    };

    return (
        <div className="py-20 bg-gray-100">
            <div className="container mx-auto px-6 max-w-3xl">
                <h1 className="text-3xl font-bold text-center text-blue-900 mb-8">{strings.paymentTitle}</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Course Summary */}
                    <div className="bg-white p-6 rounded-lg shadow-md h-fit">
                        <h2 className="text-xl font-semibold mb-4">{strings.courseSummary}</h2>
                        <img src={course.imageUrl} alt={course.title} className="rounded-md mb-4 w-full h-40 object-cover" />
                        <h3 className="font-bold text-lg text-blue-900 mb-2">{course.title}</h3>
                        <p className="text-gray-600 text-sm mb-4">{strings.by} {course.teacher}</p>
                        <div className="border-t pt-4 flex justify-between items-center">
                            <span className="font-semibold">{strings.totalAmount}</span>
                            <span className="text-2xl font-bold text-green-500">{currencySymbol}{displayPrice}</span>
                        </div>
                    </div>

                    {/* Payment Methods */}
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-xl font-semibold mb-4">{strings.paymentMethod}</h2>
                        <form onSubmit={handlePayment} className="space-y-4">
                            
                            {/* Visa / Mastercard (Disabled) */}
                            <div className="border rounded-lg p-4 bg-gray-50 opacity-60 cursor-not-allowed flex justify-between items-center select-none relative overflow-hidden">
                                <div className="flex items-center space-x-3 space-x-reverse">
                                    <svg className="w-8 h-8 text-gray-400" fill="currentColor" viewBox="0 0 24 24"><path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z"/></svg>
                                    <span className="font-semibold text-gray-500">فيزا / ماستركارد</span>
                                </div>
                                <span className="text-xs font-bold text-gray-500 bg-gray-200 px-2 py-1 rounded">قريباً</span>
                            </div>

                            {/* PayPal (Disabled) */}
                            <div className="border rounded-lg p-4 bg-gray-50 opacity-60 cursor-not-allowed flex justify-between items-center select-none">
                                <div className="flex items-center space-x-3 space-x-reverse">
                                    <svg className="w-8 h-8 text-gray-400" fill="currentColor" viewBox="0 0 24 24"><path d="M12.12 12.59c-.23-.83-.46-1.67-.69-2.5-1.2.28-2.29.89-3.22 1.82-.94.93-1.55 2.02-1.83 3.22.83.23 1.67.46 2.5.69.28-1.2.89-2.29 1.82-3.22.93-.94 2.02-1.55 3.22-1.83.2-.06.4-.1.6-.18zm-2.57-1.9c.28-1.2.89-2.29 1.82-3.22.93-.94 2.02-1.55 3.22-1.83.83.23 1.67.46 2.5.69-.28 1.2-.89 2.29-1.82 3.22-.94.93-2.03 1.54-3.23 1.83-.82-.23-1.66-.46-2.49-.69zM20.33 12c0 4.6-3.73 8.33-8.33 8.33S3.67 16.6 3.67 12 7.4 3.67 12 3.67 20.33 7.4 20.33 12z"/></svg>
                                    <span className="font-semibold text-gray-500">PayPal</span>
                                </div>
                                <span className="text-xs font-bold text-gray-500 bg-gray-200 px-2 py-1 rounded">قريباً</span>
                            </div>

                            {/* CliQ (Active) */}
                            <div 
                                onClick={() => setPaymentMethod('cliq')}
                                className={`border-2 rounded-lg p-4 cursor-pointer flex justify-between items-center transition-colors ${paymentMethod === 'cliq' ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-green-300'}`}
                            >
                                <div className="flex items-center space-x-3 space-x-reverse">
                                    <div className="bg-blue-900 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-xs">Jo</div>
                                    <span className="font-bold text-blue-900">دفعات محلية (كليك)</span>
                                </div>
                                <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${paymentMethod === 'cliq' ? 'border-green-500' : 'border-gray-400'}`}>
                                    {paymentMethod === 'cliq' && <div className="w-3 h-3 rounded-full bg-green-500"></div>}
                                </div>
                            </div>

                            {/* CliQ Instructions */}
                            {paymentMethod === 'cliq' && (
                                <div className="mt-4 p-4 bg-blue-50 rounded-lg text-sm text-blue-900 border border-blue-100 animate-fade-in">
                                    <p className="font-bold mb-2">تعليمات الدفع عبر خدمة كليك (CliQ):</p>
                                    <div className="flex items-center justify-between bg-white p-2 rounded border border-blue-200 mb-2">
                                        <span className="text-gray-600">الاسم المستعار:</span>
                                        <span className="font-mono font-bold text-lg select-all">JOTUTOR</span>
                                    </div>
                                    <p className="text-xs text-gray-600">يرجى إتمام التحويل ثم الضغط على "تأكيد الدفع" لتفعيل الدورة مباشرة.</p>
                                </div>
                            )}

                            <button type="submit" className="w-full bg-green-500 text-white font-bold py-3 rounded-lg hover:bg-green-600 mt-4 shadow-md transform transition hover:-translate-y-0.5">
                                {strings.confirmPayment}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentPage;
