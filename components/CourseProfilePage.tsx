import React from 'react';
import { Course, Currency, Language } from '../types';

interface CourseProfilePageProps {
    course: Course;
    onBook: (courseId: number) => void;
    currency: Currency;
    exchangeRate: number;
    strings: { [key: string]: string };
    language: Language;
}

const CourseProfilePage: React.FC<CourseProfilePageProps> = ({ course, onBook, currency, exchangeRate, strings }) => {
    const displayPrice = currency === 'USD'
        ? (course.price / exchangeRate).toFixed(2)
        : course.price.toFixed(2);
    const currencySymbol = currency === 'USD' ? strings.usd : strings.jod;

    return (
        <div className="py-12 bg-white">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Main Content */}
                    <div className="lg:col-span-2">
                        <img src={course.imageUrl} alt={course.title} className="w-full h-auto max-h-96 object-cover rounded-lg shadow-lg mb-8" />
                        <h1 className="text-4xl font-extrabold text-blue-900 mb-4">{course.title}</h1>
                        <p className="text-lg text-gray-500 mb-6">{strings.by} {course.teacher}</p>
                        <div className="prose lg:prose-lg max-w-none text-gray-700">
                           <p>{course.description}</p>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="bg-gray-50 p-6 rounded-lg shadow-md sticky top-28">
                            <p className="text-4xl font-extrabold text-green-500 mb-6">{currencySymbol}{displayPrice}</p>
                            <button onClick={() => onBook(course.id)} className="w-full bg-green-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-green-600 transition-colors text-lg">
                                {strings.bookCourse}
                            </button>
                            <ul className="mt-8 space-y-3 text-gray-700">
                                <li className="flex justify-between"><strong>{strings.courseTeacher}:</strong> <span>{course.teacher}</span></li>
                                <li className="flex justify-between"><strong>{strings.courseDuration}:</strong> <span>{course.duration}</span></li>
                                <li className="flex justify-between"><strong>{strings.courseLevel}:</strong> <span>{course.level}</span></li>
                                <li className="flex justify-between"><strong>{strings.subject}:</strong> <span>{course.category}</span></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CourseProfilePage;
