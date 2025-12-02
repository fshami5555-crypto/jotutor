
import React from 'react';
import { Course, Currency } from '../types';

interface CourseCardProps {
    course: Course;
    onSelect: () => void;
    currency: Currency;
    exchangeRate: number;
    strings: { [key: string]: string };
}

const CourseCard: React.FC<CourseCardProps> = ({ course, onSelect, currency, strings }) => {
    // Safety check
    if (!course) return null;

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

    // Safe check to ensure price is a number before calling toFixed
    const safePrice = (typeof price === 'number' && !isNaN(price)) ? price : 0;
    const displayPrice = safePrice.toFixed(2);

    return (
        <div onClick={onSelect} className="bg-white rounded-xl shadow-lg overflow-hidden transform hover:-translate-y-2 transition-transform duration-300 cursor-pointer h-full flex flex-col">
            <img src={course.imageUrl} alt={course.title} className="w-full h-48 object-cover"/>
            <div className="p-6 flex-1 flex flex-col">
                <div className="mb-2">
                    <span className="text-sm font-semibold text-green-600 bg-green-100 px-2 py-1 rounded-full">{course.category}</span>
                </div>
                <h3 className="text-xl font-bold text-blue-900 mb-2 line-clamp-2 h-14">{course.title}</h3>
                
                {/* Changed from Teacher Name to Subject/Category based on "Includes subjects" label */}
                <p className="text-gray-500 text-sm mb-2">
                    <span className="font-semibold">{strings.by}: </span> 
                    {course.category}
                </p>

                {/* New Section for Sessions and Hours */}
                <div className="flex flex-wrap gap-2 text-xs text-gray-500 mb-4 font-medium">
                    {course.sessionCount && (
                        <span className="bg-gray-100 px-2 py-1 rounded border">
                            {course.sessionCount} {strings.sessions}
                        </span>
                    )}
                    {course.totalHours && (
                        <span className="bg-gray-100 px-2 py-1 rounded border">
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
