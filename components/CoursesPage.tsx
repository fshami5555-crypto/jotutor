import React from 'react';
import { Course, Currency, Language } from '../types';
import CourseCard from './CourseCard';

interface CoursesPageProps {
  courses: Course[];
  onSelectCourse: (id: number) => void;
  currency: Currency;
  exchangeRate: number;
  strings: { [key: string]: string };
  language: Language;
}

const CoursesPage: React.FC<CoursesPageProps> = ({ courses, onSelectCourse, currency, exchangeRate, strings, language }) => {
  return (
    <div className="py-20 bg-gray-100">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-extrabold text-blue-900">{strings.coursesTitle}</h1>
          <p className="mt-4 text-lg text-gray-600">طور مهاراتك مع دوراتنا المتخصصة التي يقدمها أفضل المعلمين.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map(course => (
            <CourseCard 
                key={course.id} 
                course={course} 
                onSelect={() => onSelectCourse(course.id)} 
                currency={currency} 
                exchangeRate={exchangeRate} 
                strings={strings} 
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default CoursesPage;
