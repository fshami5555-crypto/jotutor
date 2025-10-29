import React from 'react';
import { Teacher, Currency, Language } from '../types';

interface TeacherCardProps {
    teacher: Teacher;
    onSelect: (id: number) => void;
    currency: Currency;
    exchangeRate: number;
    strings: { [key: string]: string };
    language: Language;
}

const TeacherCard: React.FC<TeacherCardProps> = ({ teacher, onSelect, currency, exchangeRate, strings, language }) => {
    const displayPrice = currency === 'USD' 
        ? (teacher.pricePerHour / exchangeRate).toFixed(2) 
        : teacher.pricePerHour.toFixed(2);
    const currencySymbol = currency === 'USD' ? strings.usd : strings.jod;

    return (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden transform hover:-translate-y-2 transition-transform duration-300">
            <div className="h-48 w-full overflow-hidden">
                <img src={teacher.avatarUrl} alt={teacher.name} className="w-full h-full object-cover"/>
            </div>
            <div className="p-6">
                <h3 className="text-2xl font-bold text-blue-900 mb-2">{teacher.name}</h3>
                <p className="text-gray-600 mb-4">{teacher.level} ・ {teacher.experience} {strings.yearsExperience}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                    {teacher.specialties.slice(0, 2).map(spec => (
                        <span key={spec} className="bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">{spec}</span>
                    ))}
                </div>
                <div className="flex justify-between items-center mb-4">
                    <div className="text-lg font-bold text-green-500">{currencySymbol}{displayPrice}<span className="text-sm font-normal text-gray-500">{strings.perHour}</span></div>
                    <div className="flex items-center">
                        <span className="text-yellow-400">★</span>
                        <span className="font-bold ml-1">{teacher.rating}</span>
                        <span className="text-gray-500 text-sm ml-1">({teacher.reviews})</span>
                    </div>
                </div>
                <button onClick={() => onSelect(teacher.id)} className="w-full bg-blue-900 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-800 transition-colors">
                    {strings.viewProfile}
                </button>
            </div>
        </div>
    );
};

export default TeacherCard;