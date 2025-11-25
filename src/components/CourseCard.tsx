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
    const safePrice = typeof price === 'number' ? price : 0;
    const displayPrice = safePrice.toFixed(2);

    return (
        <div onClick={onSelect} className="bg-white rounded-xl shadow-lg overflow-hidden transform hover:-translate-y-2 transition-transform duration-300 cursor-pointer">
            <img src={course.imageUrl} alt={course.title} className="w-full h-48 object-cover"/>
            <div className="p-6">
                <span className="text-sm font-semibold text-green-600 bg-green-100 px-2 py-1 rounded-full">{course.category}</span>
                <h3 className="text-xl font-bold text-blue-900 mt-3 mb-2 h-14 overflow-hidden">{course.title}</h3>
                <p className="text-gray-500 text-sm mb-4">بواسطة: {course.teacher}</p>
                <div className="flex justify-between items-center">
                    <span className="text-xl font-bold text-blue-900">{currencySymbol}{displayPrice}</span>
                    <span className="text-sm text-gray-600">{course.duration}</span>
                </div>
            </div>
        </div>
    );
};

export default CourseCard;