
import React, { useState } from 'react';
import { Course, Currency, Language } from '../types';

interface PaymentPageProps {
    course: Course;
    currency: Currency;
    exchangeRate: number;
    strings: { [key: string]: string };
    language: Language;
    onEnroll: (course: Course, status: 'Success' | 'Pending') => void;
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
    const [showBankDetails, setShowBankDetails] = useState(false);

    const handlePayment = (e: React.FormEvent) => {
        e.preventDefault();
        if (paymentMethod === 'cliq') {
            // For local payments, show details and create pending request
            setShowBankDetails(true);
            onEnroll(course, 'Pending');
        }
    };

    const whatsappNumber = "962792822241";
    const whatsappUrl = `https://wa.me/${whatsappNumber}`;

    // 1. Bank Details View (Shown after confirming payment)
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
                                <span className="text-purple-600 font-bold text-lg">Ϟ CliQ:</span>
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
                                بعد إتمام التحويل يرجى إرسال الإيصال عبر واتساب لتأكيد التحويل وتفعيل الدورة
                            </p>
                            <a 
                                href={whatsappUrl} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="inline-flex items-center justify-center bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-8 rounded-full shadow-lg transition-transform transform hover:-translate-y-1"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 ml-2" fill="currentColor" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.017-1.04 2.48 0 1.463 1.065 2.876 1.213 3.074.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/></svg>
                                إرسال صورة التحويل عبر واتساب
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // 2. Default Payment Form View (Selection)
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

                            <button type="submit" className="w-full bg-green-500 text-white font-bold py-3 rounded-lg hover:bg-green-600 mt-4 shadow-md transform transition hover:-translate-y-0.5">
                                {strings.confirmPayment}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        );
};

export default PaymentPage;
