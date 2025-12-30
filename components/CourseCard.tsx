import React from 'react';
import { Course, Currency } from '../types';

interface CourseCardProps {
    course: Course;
    onSelect: () => void;
    currency: Currency;
    exchangeRate: number;
    strings: { [key: string]: string };
}

const CourseCard: React.FC<CourseCardProps> = ({ course, onSelect, currency, exchangeRate, strings }) => {
    if (!course) return null;

    // Harmonized price calculation logic
    let price = 0;
    if (currency === 'USD') {
        // Prefer priceUsd, then calculate from priceJod, then from generic price
        price = course.priceUsd ?? (course.priceJod ? course.priceJod / exchangeRate : (course.price ? course.price / exchangeRate : 0));
    } else if (currency === 'SAR') {
        // Prefer priceSar, then calculate from priceJod, then from generic price (approx 5.3 conversion)
        price = course.priceSar ?? (course.priceJod ? course.priceJod * 5.3 : (course.price ? course.price * 5.3 : 0));
    } else {
        // Default to JOD
        price = course.priceJod ?? course.price ?? 0;
    }

    const safePrice = (typeof price === 'number' && !isNaN(price)) ? price : 0;
    const displayPrice = safePrice.toFixed(2);
    const currencySymbol = currency === 'USD' ? strings.usd : (currency === 'SAR' ? strings.sar : strings.jod);

    return (
        <div onClick={onSelect} className="bg-white rounded-xl shadow-lg overflow-hidden transform hover:-translate-y-2 transition-transform duration-300 cursor-pointer h-full flex flex-col">
            <img src={course.imageUrl} alt={course.title} className="w-full h-48 object-cover"/>
            <div className="p-6 flex-1 flex flex-col">
                <div className="mb-2">
                    <span className="text-sm font-semibold text-green-600 bg-green-100 px-2 py-1 rounded-full">{course.category}</span>
                </div>
                <h3 className="text-xl font-bold text-blue-900 mb-2 line-clamp-2 h-14">{course.title}</h3>
                
                <p className="text-gray-500 text-sm mb-4">
                    <span className="font-semibold">{strings.by}: </span> 
                    {course.includedSubjects || course.teacher || course.category}
                </p>

                <div className="flex flex-wrap gap-2 mb-4">
                    {course.sessionCount && (
                        <span className="bg-green-50 text-green-700 border border-green-200 px-2 py-1 rounded text-sm font-bold shadow-sm">
                            {course.sessionCount} {strings.sessions}
                        </span>
                    )}
                    {course.totalHours && (
                        <span className="bg-green-50 text-green-700 border border-green-200 px-2 py-1 rounded text-sm font-bold shadow-sm">
                            {course.totalHours} {strings.hours}
                        </span>
                    )}
                </div>

                <div className="mt-auto flex justify-between items-center border-t pt-3">
                    <span className="text-xl font-bold text-blue-900">{currencySymbol}{displayPrice}</span>
                    <span className="text-sm text-gray-600">{course.duration}</span>
                </div>
            </div>
        </div>
    );
};

export default CourseCard;