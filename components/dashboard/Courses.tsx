import React, { useMemo } from 'react';
// Fix: Corrected import path for types.
import { UserProfile, Course, Currency } from '../../types';
import CourseCard from '../CourseCard';

interface CoursesViewProps {
    userProfile: UserProfile;
    allCourses: Course[];
    onSelectCourse: (id: number) => void;
    currency: Currency;
    exchangeRate: number;
    strings: { [key: string]: string };
}

const getSuggestedCourses = (profile: UserProfile, allCourses: Course[]): Course[] => {
    const { serviceType, educationStage } = profile;

    let targetCategories: string[] = [];

    if (serviceType === 'التأسيس') {
        targetCategories.push('تأسيس');
    } else if (serviceType === 'اللغات') {
        targetCategories.push('لغات');
    } else { // For 'المتابعة', 'التقوية', etc.
        if (educationStage.includes('تأسيس')) {
             targetCategories.push('تأسيس');
        }
        if (educationStage.includes('ابتدائي')) {
            targetCategories.push('المرحلة الابتدائية');
        }
        if (educationStage.includes('إعدادي') || educationStage.includes('ثانوي') || educationStage.includes('جامعي')) {
            targetCategories.push('المرحلة الإعدادية والثانوية');
        }
    }
    
    if (targetCategories.length === 0) {
        return [];
    }

    return allCourses.filter(course => targetCategories.includes(course.category));
};

const CoursesView: React.FC<CoursesViewProps> = ({ userProfile, allCourses, onSelectCourse, currency, exchangeRate, strings }) => {
    const suggestedCourses = useMemo(() => getSuggestedCourses(userProfile, allCourses), [userProfile, allCourses]);

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">{strings.myCourses}</h1>
             <p className="text-gray-600 mb-6">{strings.suggestedCoursesDesc}</p>

            <div className="bg-white p-6 rounded-lg shadow-md">
                {suggestedCourses.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {suggestedCourses.map(course => (
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
                ) : (
                    <div className="text-center py-12">
                        <h3 className="text-xl font-semibold text-gray-700">{strings.noSuggestedCourses}</h3>
                        <p className="text-gray-500 mt-2">{strings.noSuggestedCoursesDesc}</p>
                        <button className="mt-4 bg-green-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-600">
                            {strings.discoverMoreCourses}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CoursesView;