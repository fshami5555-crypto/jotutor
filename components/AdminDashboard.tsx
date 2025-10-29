import React, { useState } from 'react';
import AdminNav, { AdminView } from './admin/AdminNav';
import ManageContent from './admin/ManageContent';
import ManageUsers from './admin/ManageUsers';
import ManageTeachers from './admin/ManageTeachers';
import ManageCourses from './admin/ManageCourses';
import ManageTestimonials from './admin/ManageTestimonials';
import ManageBlog from './admin/ManageBlog';
import ManageOnboarding from './admin/ManageOnboarding';
import { SiteContent, Teacher, Course, Testimonial, BlogPost } from '../types';

interface ManageHeroImagesProps {
    images: string[];
    onUpdate: (newImages: string[]) => void;
}

const ManageHeroImages: React.FC<ManageHeroImagesProps> = ({ images, onUpdate }) => {
    const [localImages, setLocalImages] = useState<string[]>(images);
    const [newImageUrl, setNewImageUrl] = useState('');
    const [status, setStatus] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

    const handleAddImage = () => {
        if (newImageUrl.trim() && !localImages.includes(newImageUrl.trim())) {
            try {
                new URL(newImageUrl.trim()); // Validate URL
                setLocalImages([...localImages, newImageUrl.trim()]);
                setNewImageUrl('');
            } catch (error) {
                setStatus({ message: 'الرجاء إدخال رابط صالح.', type: 'error' });
            }
        }
    };

    const handleRemoveImage = (urlToRemove: string) => {
        setLocalImages(localImages.filter(url => url !== urlToRemove));
    };

    const handleSaveChanges = () => {
        onUpdate(localImages);
        setStatus({ message: 'تم حفظ التغييرات بنجاح!', type: 'success' });
        setTimeout(() => setStatus(null), 3000);
    };

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">إدارة صور الصفحة الرئيسية</h1>
            <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="mb-6">
                    <h2 className="text-xl font-semibold text-gray-700 mb-4">إضافة صورة جديدة</h2>
                    <div className="flex space-x-2 space-x-reverse">
                        <input
                            type="url"
                            value={newImageUrl}
                            onChange={(e) => setNewImageUrl(e.target.value)}
                            placeholder="أدخل رابط الصورة..."
                            className="flex-1 p-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                        />
                        <button
                            onClick={handleAddImage}
                            className="bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-600"
                        >
                            إضافة
                        </button>
                    </div>
                </div>

                <div className="mb-6">
                    <h2 className="text-xl font-semibold text-gray-700 mb-4">الصور الحالية</h2>
                    {localImages.length > 0 ? (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {localImages.map((url, index) => (
                                <div key={index} className="relative group border rounded-lg overflow-hidden">
                                    <img src={url} alt={`Hero Image ${index + 1}`} className="w-full h-32 object-cover" />
                                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-colors flex items-center justify-center">
                                        <button
                                            onClick={() => handleRemoveImage(url)}
                                            className="p-2 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                            aria-label="Remove image"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500">لا توجد صور حاليًا. أضف صورة لتبدأ.</p>
                    )}
                </div>

                <div className="mt-6 pt-6 border-t flex justify-between items-center">
                    <button onClick={handleSaveChanges} className="bg-green-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-green-700 transition-colors">
                        حفظ التغييرات
                    </button>
                    {status && <p className={`text-sm font-semibold ${status.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>{status.message}</p>}
                </div>
            </div>
        </div>
    );
};

interface AdminDashboardProps {
  onLogout: () => void;
  initialData: {
    siteContent: SiteContent;
    teachers: Teacher[];
    courses: Course[];
    testimonials: Testimonial[];
    blogPosts: BlogPost[];
  };
  onUpdate: (data: AdminDashboardProps['initialData']) => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout, initialData, onUpdate }) => {
    const [activeView, setActiveView] = useState<AdminView>('content');
    
    const { siteContent, teachers, courses, testimonials, blogPosts } = initialData;
    
    const handleContentUpdate = (newContent: SiteContent) => {
        onUpdate({ ...initialData, siteContent: newContent });
    }
    const handleTeachersUpdate = (updater: React.SetStateAction<Teacher[]>) => {
        const newTeachers = typeof updater === 'function' ? updater(initialData.teachers) : updater;
        onUpdate({ ...initialData, teachers: newTeachers });
    }
    const handleCoursesUpdate = (updater: React.SetStateAction<Course[]>) => {
        const newCourses = typeof updater === 'function' ? updater(initialData.courses) : updater;
        onUpdate({ ...initialData, courses: newCourses });
    }
    const handleTestimonialsUpdate = (updater: React.SetStateAction<Testimonial[]>) => {
        const newTestimonials = typeof updater === 'function' ? updater(initialData.testimonials) : updater;
        onUpdate({ ...initialData, testimonials: newTestimonials });
    }
    const handleBlogUpdate = (updater: React.SetStateAction<BlogPost[]>) => {
        const newPosts = typeof updater === 'function' ? updater(initialData.blogPosts) : updater;
        onUpdate({ ...initialData, blogPosts: newPosts });
    }


    const renderContent = () => {
        switch (activeView) {
            case 'content':
                return <ManageContent content={siteContent} onUpdate={handleContentUpdate} />;
            case 'users':
                return <ManageUsers />;
            case 'teachers':
                return <ManageTeachers teachers={teachers} setTeachers={handleTeachersUpdate} />;
            case 'courses':
                return <ManageCourses courses={courses} setCourses={handleCoursesUpdate} subjects={siteContent.onboardingOptions.subjects} />;
            case 'testimonials':
                return <ManageTestimonials testimonials={testimonials} setTestimonials={handleTestimonialsUpdate} />;
            case 'blog':
                return <ManageBlog posts={blogPosts} setPosts={handleBlogUpdate} />;
            case 'heroImages':
                return <ManageHeroImages 
                           images={siteContent.heroImages || []} 
                           onUpdate={(newImages) => handleContentUpdate({ ...siteContent, heroImages: newImages })} 
                       />;
            case 'onboarding':
                return <ManageOnboarding 
                           options={siteContent.onboardingOptions}
                           onUpdate={(newOptions) => handleContentUpdate({ ...siteContent, onboardingOptions: newOptions })}
                        />;
            default:
                return <ManageContent content={siteContent} onUpdate={handleContentUpdate} />;
        }
    };

    return (
        <div className="bg-gray-100 min-h-screen">
            <div className="container mx-auto px-6 py-12">
                <div className="flex flex-col md:flex-row gap-8 items-start">
                    <AdminNav activeView={activeView} setActiveView={setActiveView} onLogout={onLogout} />
                    <main className="flex-1">
                        {renderContent()}
                    </main>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
