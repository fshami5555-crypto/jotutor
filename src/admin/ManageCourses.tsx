
import React, { useState } from 'react';
import { Course } from '../types';
import { seedInitialCourses } from '../googleSheetService';
import { initialData } from '../mockData';

interface ManageCoursesProps {
    courses: Course[];
    setCourses: React.Dispatch<React.SetStateAction<Course[]>>;
    courseCategories: string[];
    curriculums: string[];
}

const CourseFormModal: React.FC<{ course: Course | null; onSave: (course: Course) => void; onClose: () => void; categories: string[]; curriculums: string[] }> = ({ course, onSave, onClose, categories, curriculums }) => {
    const [formData, setFormData] = useState<Omit<Course, 'id'>>({
        title: course?.title || '',
        description: course?.description || '',
        teacher: course?.teacher || '',
        priceJod: course?.priceJod || 50,
        priceUsd: course?.priceUsd || 70,
        priceSar: course?.priceSar || 265,
        duration: course?.duration || '4 أسابيع',
        level: course?.level || 'مبتدئ',
        imageUrl: course?.imageUrl || 'https://picsum.photos/seed/course/400/225',
        category: course?.category || (categories.length > 0 ? categories[0] : ''),
        curriculum: course?.curriculum || (curriculums.length > 0 ? curriculums[0] : ''),
        isFeatured: course?.isFeatured || false,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const isNumber = type === 'number';
        setFormData(prev => ({ ...prev, [name]: isNumber ? Number(value) : value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const finalCourse: Course = {
            id: course?.id || Date.now().toString(),
            ...formData,
        };
        onSave(finalCourse);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <form onSubmit={handleSubmit} className="p-6">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">{course ? 'تعديل الدورة' : 'إضافة دورة جديدة'}</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input name="title" value={formData.title} onChange={handleChange} placeholder="عنوان الدورة" className="p-2 border rounded md:col-span-2" required />
                        <input name="teacher" value={formData.teacher} onChange={handleChange} placeholder="اسم المعلم" className="p-2 border rounded" required />
                        
                        <div>
                            <label className="block text-xs text-gray-500 mb-1">الفئة</label>
                            <select name="category" value={formData.category} onChange={handleChange} className="w-full p-2 border rounded">
                                {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs text-gray-500 mb-1">المنهاج</label>
                            <select name="curriculum" value={formData.curriculum} onChange={handleChange} className="w-full p-2 border rounded">
                                <option value="">اختر المنهاج</option>
                                {curriculums.map(curr => <option key={curr} value={curr}>{curr}</option>)}
                            </select>
                        </div>
                        
                        <div className="md:col-span-2 grid grid-cols-3 gap-2 bg-gray-50 p-2 rounded border">
                            <div className="col-span-3 mb-1 text-sm font-semibold text-gray-700">تسعير الدورة:</div>
                            <div>
                                <label className="block text-xs text-gray-500 mb-1">السعر (JOD)</label>
                                <input name="priceJod" type="number" value={formData.priceJod} onChange={handleChange} placeholder="د.أ" className="w-full p-2 border rounded" />
                            </div>
                            <div>
                                <label className="block text-xs text-gray-500 mb-1">السعر (USD)</label>
                                <input name="priceUsd" type="number" value={formData.priceUsd} onChange={handleChange} placeholder="$" className="w-full p-2 border rounded" />
                            </div>
                            <div>
                                <label className="block text-xs text-gray-500 mb-1">السعر (SAR)</label>
                                <input name="priceSar" type="number" value={formData.priceSar} onChange={handleChange} placeholder="ر.س" className="w-full p-2 border rounded" />
                            </div>
                        </div>

                        <input name="duration" value={formData.duration} onChange={handleChange} placeholder="المدة" className="p-2 border rounded" />
                        <input name="level" value={formData.level} onChange={handleChange} placeholder="المستوى" className="p-2 border rounded" />
                        <input name="imageUrl" value={formData.imageUrl} onChange={handleChange} placeholder="رابط الصورة" className="p-2 border rounded md:col-span-2" />
                        <div className="md:col-span-2">
                            <textarea name="description" value={formData.description} onChange={handleChange} placeholder="وصف الدورة" rows={4} className="w-full p-2 border rounded"></textarea>
                        </div>

                        <div className="md:col-span-2 flex items-center mt-2">
                            <input
                                type="checkbox"
                                id="isFeatured"
                                name="isFeatured"
                                checked={formData.isFeatured}
                                onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                                className="h-5 w-5 text-green-600 focus:ring-green-500 border-gray-300 rounded ml-2"
                            />
                            <label htmlFor="isFeatured" className="text-sm text-gray-700 font-bold">إظهار في الصفحة الرئيسية</label>
                        </div>
                    </div>
                    <div className="flex justify-end mt-6 space-x-2 space-x-reverse">
                        <button type="button" onClick={onClose} className="bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded hover:bg-gray-400">إلغاء</button>
                        <button type="submit" className="bg-green-600 text-white font-bold py-2 px-4 rounded hover:bg-green-700">حفظ</button>
                    </div>
                </form>
            </div>
        </div>
    );
};


const ManageCourses: React.FC<ManageCoursesProps> = ({ courses, setCourses, courseCategories, curriculums }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCourse, setEditingCourse] = useState<Course | null>(null);
    const [isSeeding, setIsSeeding] = useState(false);

    const handleOpenModal = (course: Course | null) => {
        setEditingCourse(course);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingCourse(null);
    };

    const handleSaveCourse = (courseToSave: Course) => {
        if (courses.some(c => c.id === courseToSave.id)) {
            setCourses(prev => prev.map(c => c.id === courseToSave.id ? courseToSave : c));
        } else {
            setCourses(prev => [courseToSave, ...prev]);
        }
        handleCloseModal();
    };

    const handleRemoveCourse = (id: string) => {
        if (window.confirm('هل أنت متأكد من رغبتك في حذف هذه الدورة؟')) {
            setCourses(prev => prev.filter(c => c.id !== id));
        }
    };
    
    const handleSeedData = async () => {
        if (!window.confirm('هل أنت متأكد من رغبتك في إضافة البيانات الأولية؟ سيتم إضافة أو تحديث أكثر من 80 دورة.')) {
            return;
        }

        setIsSeeding(true);
        const result = await seedInitialCourses();
        if (result.success && result.seededCourses) {
            setCourses(result.seededCourses);
            alert('تم تحميل البيانات الأولية للدورات بنجاح!');
        } else {
            alert(`فشل تحميل البيانات الأولية: ${result.error || 'حدث خطأ غير معروف'}`);
        }
        setIsSeeding(false);
    };


    return (
        <div>
            {isModalOpen && <CourseFormModal course={editingCourse} onSave={handleSaveCourse} onClose={handleCloseModal} categories={courseCategories} curriculums={curriculums} />}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">إدارة الدورات</h1>
                 <div className="flex space-x-2 space-x-reverse">
                    <button 
                        onClick={handleSeedData} 
                        disabled={isSeeding}
                        className="bg-blue-600 text-white font-bold py-2 px-4 rounded hover:bg-blue-700 disabled:bg-gray-400"
                    >
                        {isSeeding ? 'جاري التحميل...' : 'تحميل بيانات أولية'}
                    </button>
                    <button onClick={() => handleOpenModal(null)} className="bg-green-600 text-white font-bold py-2 px-4 rounded hover:bg-green-700">
                        إضافة دورة جديدة
                    </button>
                </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="text-right py-3 px-4 font-semibold text-sm">عنوان الدورة</th>
                                <th className="text-right py-3 px-4 font-semibold text-sm">المعلم</th>
                                <th className="text-right py-3 px-4 font-semibold text-sm">المنهاج</th>
                                <th className="text-right py-3 px-4 font-semibold text-sm">السعر (JOD)</th>
                                <th className="text-right py-3 px-4 font-semibold text-sm">مميز</th>
                                <th className="text-right py-3 px-4 font-semibold text-sm">الإجراءات</th>
                            </tr>
                        </thead>
                        <tbody>
                            {courses.map(course => (
                                <tr key={course.id} className="border-b">
                                    <td className="py-3 px-4">{course.title}</td>
                                    <td className="py-3 px-4">{course.teacher}</td>
                                    <td className="py-3 px-4 text-gray-600 text-sm">{course.curriculum || '-'}</td>
                                    <td className="py-3 px-4">{course.priceJod} د.أ</td>
                                    <td className="py-3 px-4 text-center text-xl">
                                        {course.isFeatured ? <span title="يظهر في الصفحة الرئيسية">⭐</span> : ''}
                                    </td>
                                    <td className="py-3 px-4 whitespace-nowrap">
                                        <button onClick={() => handleOpenModal(course)} className="text-blue-500 hover:underline mr-4">تعديل</button>
                                        <button onClick={() => handleRemoveCourse(course.id)} className="text-red-500 hover:underline">حذف</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ManageCourses;
