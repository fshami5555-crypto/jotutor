
import React, { useState, useEffect } from 'react';
import { SiteContent, FAQItem, AboutContent, ContactContent, HomepageContent } from '../types';
import { initialData } from '../mockData';

interface ManageContentProps {
  content: SiteContent;
  onUpdate: (newContent: SiteContent) => void;
}

type ContentTab = 'homepage' | 'about' | 'faq' | 'contact' | 'privacy' | 'terms' | 'config';

const ManageContent: React.FC<ManageContentProps> = ({ content, onUpdate }) => {
  const [activeTab, setActiveTab] = useState<ContentTab>('homepage');
  const [localContent, setLocalContent] = useState<SiteContent>(JSON.parse(JSON.stringify(content))); // Deep copy
  const [status, setStatus] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    setLocalContent(JSON.parse(JSON.stringify(content)));
  }, [content]);

  const handleHomepageChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setLocalContent(prev => ({
        ...prev,
        homepage: { ...prev.homepage, [name]: value }
    }));
  };
  
  const handleAboutChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === 'whyJoTutor') {
        setLocalContent(prev => ({
            ...prev,
            about: { ...prev.about, [name]: value.split('\n') }
        }));
    } else {
        setLocalContent(prev => ({
            ...prev,
            about: { ...prev.about, [name]: value }
        }));
    }
  };
  
  const handleContactChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
     setLocalContent(prev => ({
        ...prev,
        contact: { ...prev.contact, [name]: value }
    }));
  };

  const handleConfigChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLocalContent(prev => ({ ...prev, [name]: value }));
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>, section: 'privacy' | 'terms') => {
    const { name, value } = e.target;
    setLocalContent(prev => ({ ...prev, [name]: value }));
  };
  
  const handleFaqChange = (id: string, field: 'question' | 'answer', value: string) => {
    setLocalContent(prev => ({
        ...prev,
        faq: prev.faq.map(item => item.id === id ? { ...item, [field]: value } : item)
    }));
  };

  const addFaqItem = () => {
    const newFaq: FAQItem = { id: Date.now().toString(), question: 'سؤال جديد', answer: 'إجابة جديدة' };
    setLocalContent(prev => ({ ...prev, faq: [...prev.faq, newFaq]}));
  };
  
  const removeFaqItem = (id: string) => {
    setLocalContent(prev => ({ ...prev, faq: prev.faq.filter(item => item.id !== id)}));
  };

  const handleSaveChanges = () => {
    onUpdate(localContent);
    setStatus({ message: 'تم حفظ التغييرات بنجاح!', type: 'success' });
    setTimeout(() => setStatus(null), 3000);
  };
  
  const renderTabContent = () => {
    const defaultHomepage = initialData.siteContent.homepage;

    switch(activeTab) {
        case 'homepage':
            return (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Features Section Edit */}
                    <div className="md:col-span-2 p-4 border rounded-md bg-white shadow-sm">
                        <h3 className="text-lg font-bold mb-4 text-blue-900 border-b pb-2">قسم "لماذا تختار JoTutor؟"</h3>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">العنوان الرئيسي</label>
                            <input name="featuresTitle" value={localContent.homepage.featuresTitle} onChange={handleHomepageChange} className="w-full p-2 border rounded mb-2" placeholder="العنوان الرئيسي"/>
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">العنوان الفرعي</label>
                            <textarea name="featuresSubtitle" value={localContent.homepage.featuresSubtitle} onChange={handleHomepageChange} className="w-full p-2 border rounded" placeholder="العنوان الفرعي" rows={2}></textarea>
                        </div>
                        
                        <div className="mt-6 pt-4 border-t">
                            <h4 className="font-bold text-gray-800 mb-4 text-base bg-gray-100 p-2 rounded">تعديل البوكسات الثلاثة</h4>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="p-3 bg-gray-50 rounded border shadow-sm">
                                    <h5 className="font-bold text-green-600 mb-2 text-sm">البوكس الأول</h5>
                                    <input name="feature1Title" value={localContent.homepage.feature1Title} onChange={handleHomepageChange} className="w-full p-2 border rounded mb-2 text-sm" placeholder="العنوان"/>
                                    <textarea name="feature1Desc" value={localContent.homepage.feature1Desc} onChange={handleHomepageChange} className="w-full p-2 border rounded text-sm" placeholder="الوصف" rows={3}></textarea>
                                </div>
                                <div className="p-3 bg-gray-50 rounded border shadow-sm">
                                    <h5 className="font-bold text-green-600 mb-2 text-sm">البوكس الثاني</h5>
                                    <input name="feature2Title" value={localContent.homepage.feature2Title} onChange={handleHomepageChange} className="w-full p-2 border rounded mb-2 text-sm" placeholder="العنوان"/>
                                    <textarea name="feature2Desc" value={localContent.homepage.feature2Desc} onChange={handleHomepageChange} className="w-full p-2 border rounded text-sm" placeholder="الوصف" rows={3}></textarea>
                                </div>
                                <div className="p-3 bg-gray-50 rounded border shadow-sm">
                                    <h5 className="font-bold text-green-600 mb-2 text-sm">البوكس الثالث</h5>
                                    <input name="feature3Title" value={localContent.homepage.feature3Title} onChange={handleHomepageChange} className="w-full p-2 border rounded mb-2 text-sm" placeholder="العنوان"/>
                                    <textarea name="feature3Desc" value={localContent.homepage.feature3Desc} onChange={handleHomepageChange} className="w-full p-2 border rounded text-sm" placeholder="الوصف" rows={3}></textarea>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Statistics Section Edit */}
                    <div className="md:col-span-2 p-4 border rounded-md bg-white shadow-sm ring-1 ring-green-200">
                        <h3 className="text-lg font-bold mb-4 text-green-800 border-b pb-2 flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                            إحصائيات الموقع (الدوائر تحت البنر)
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="p-2 bg-gray-50 rounded">
                                <label className="block text-xs font-bold text-gray-600 mb-1">عدد المعلمين</label>
                                <input name="statsTeacherCount" value={localContent.homepage.statsTeacherCount || defaultHomepage.statsTeacherCount || ''} onChange={handleHomepageChange} className="w-full p-2 border rounded mb-2 text-center font-bold text-blue-900" placeholder="+750"/>
                                <input name="statsTeacherLabel" value={localContent.homepage.statsTeacherLabel || defaultHomepage.statsTeacherLabel || ''} onChange={handleHomepageChange} className="w-full p-2 border rounded text-center text-xs" placeholder="معلم ومعلمة"/>
                            </div>
                            <div className="p-2 bg-gray-50 rounded">
                                <label className="block text-xs font-bold text-gray-600 mb-1">معدل القبول</label>
                                <input name="statsAcceptanceRate" value={localContent.homepage.statsAcceptanceRate || defaultHomepage.statsAcceptanceRate || ''} onChange={handleHomepageChange} className="w-full p-2 border rounded mb-2 text-center font-bold text-blue-900" placeholder="25%"/>
                                <input name="statsAcceptanceLabel" value={localContent.homepage.statsAcceptanceLabel || defaultHomepage.statsAcceptanceLabel || ''} onChange={handleHomepageChange} className="w-full p-2 border rounded text-center text-xs" placeholder="معدل القبول"/>
                            </div>
                            <div className="p-2 bg-gray-50 rounded">
                                <label className="block text-xs font-bold text-gray-600 mb-1">عدد الطلاب</label>
                                <input name="statsStudentCount" value={localContent.homepage.statsStudentCount || defaultHomepage.statsStudentCount || ''} onChange={handleHomepageChange} className="w-full p-2 border rounded mb-2 text-center font-bold text-blue-900" placeholder="+5000"/>
                                <input name="statsStudentLabel" value={localContent.homepage.statsStudentLabel || defaultHomepage.statsStudentLabel || ''} onChange={handleHomepageChange} className="w-full p-2 border rounded text-center text-xs" placeholder="طالب مسجل"/>
                            </div>
                            <div className="p-2 bg-gray-50 rounded">
                                <label className="block text-xs font-bold text-gray-600 mb-1">نسبة الرضا</label>
                                <input name="statsSatisfactionRate" value={localContent.homepage.statsSatisfactionRate || defaultHomepage.statsSatisfactionRate || ''} onChange={handleHomepageChange} className="w-full p-2 border rounded mb-2 text-center font-bold text-blue-900" placeholder="95%"/>
                                <input name="statsSatisfactionLabel" value={localContent.homepage.statsSatisfactionLabel || defaultHomepage.statsSatisfactionLabel || ''} onChange={handleHomepageChange} className="w-full p-2 border rounded text-center text-xs" placeholder="رضا أولياء الأمور"/>
                            </div>
                        </div>
                    </div>

                     <div className="md:col-span-2 p-4 border rounded-md bg-white shadow-sm">
                        <h3 className="text-lg font-semibold mb-2 text-blue-900">قسم "كيف يعمل؟"</h3>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">العنوان الرئيسي</label>
                            <input name="howItWorksTitle" value={localContent.homepage.howItWorksTitle} onChange={handleHomepageChange} className="w-full p-2 border rounded mb-2" placeholder="العنوان الرئيسي"/>
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">العنوان الفرعي</label>
                            <textarea name="howItWorksSubtitle" value={localContent.homepage.howItWorksSubtitle} onChange={handleHomepageChange} className="w-full p-2 border rounded" placeholder="العنوان الفرعي" rows={2}></textarea>
                        </div>

                        <div className="mt-4 border-t pt-4">
                            <h4 className="font-bold text-gray-800 mb-4 text-base bg-gray-100 p-2 rounded">تعديل الخطوات الثلاث</h4>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="p-3 bg-gray-50 rounded border shadow-sm">
                                    <h5 className="font-bold text-green-600 mb-2 text-sm">الخطوة الأولى (01)</h5>
                                    <input name="step1Title" value={localContent.homepage.step1Title || ''} onChange={handleHomepageChange} className="w-full p-2 border rounded mb-2 text-sm" placeholder="عنوان الخطوة" />
                                    <textarea name="step1Desc" value={localContent.homepage.step1Desc || ''} onChange={handleHomepageChange} className="w-full p-2 border rounded text-sm" placeholder="وصف الخطوة" rows={3}></textarea>
                                </div>
                                <div className="p-3 bg-gray-50 rounded border shadow-sm">
                                    <h5 className="font-bold text-green-600 mb-2 text-sm">الخطوة الثانية (02)</h5>
                                    <input name="step2Title" value={localContent.homepage.step2Title || ''} onChange={handleHomepageChange} className="w-full p-2 border rounded mb-2 text-sm" placeholder="عنوان الخطوة" />
                                    <textarea name="step2Desc" value={localContent.homepage.step2Desc || ''} onChange={handleHomepageChange} className="w-full p-2 border rounded text-sm" placeholder="وصف الخطوة" rows={3}></textarea>
                                </div>
                                <div className="p-3 bg-gray-50 rounded border shadow-sm">
                                    <h5 className="font-bold text-green-600 mb-2 text-sm">الخطوة الثالثة (03)</h5>
                                    <input name="step3Title" value={localContent.homepage.step3Title || ''} onChange={handleHomepageChange} className="w-full p-2 border rounded mb-2 text-sm" placeholder="عنوان الخطوة" />
                                    <textarea name="step3Desc" value={localContent.homepage.step3Desc || ''} onChange={handleHomepageChange} className="w-full p-2 border rounded text-sm" placeholder="وصف الخطوة" rows={3}></textarea>
                                </div>
                            </div>
                        </div>
                    </div>

                     <div className="md:col-span-2 p-4 border rounded-md">
                        <h3 className="text-lg font-semibold mb-2 text-blue-900">قسم "ابحث عن معلم"</h3>
                        <input name="teacherSearchTitle" value={localContent.homepage.teacherSearchTitle} onChange={handleHomepageChange} className="w-full p-2 border rounded mb-2" placeholder="العنوان الرئيسي"/>
                        <textarea name="teacherSearchSubtitle" value={localContent.homepage.teacherSearchSubtitle} onChange={handleHomepageChange} className="w-full p-2 border rounded" placeholder="العنوان الفرعي" rows={2}></textarea>
                    </div>
                    <div className="md:col-span-2 p-4 border rounded-md">
                        <h3 className="text-lg font-semibold mb-2 text-blue-900">قسم "أحدث الدورات"</h3>
                        <input name="coursesPreviewTitle" value={localContent.homepage.coursesPreviewTitle} onChange={handleHomepageChange} className="w-full p-2 border rounded mb-2" placeholder="العنوان الرئيسي"/>
                        <textarea name="coursesPreviewSubtitle" value={localContent.homepage.coursesPreviewSubtitle} onChange={handleHomepageChange} className="w-full p-2 border rounded" placeholder="العنوان الفرعي" rows={2}></textarea>
                    </div>
                    <div className="md:col-span-2 p-4 border rounded-md">
                        <h3 className="text-lg font-semibold mb-2 text-blue-900">قسم "شهادات العملاء"</h3>
                        <input name="testimonialsTitle" value={localContent.homepage.testimonialsTitle} onChange={handleHomepageChange} className="w-full p-2 border rounded mb-2" placeholder="العنوان الرئيسي"/>
                        <textarea name="testimonialsSubtitle" value={localContent.homepage.testimonialsSubtitle} onChange={handleHomepageChange} className="w-full p-2 border rounded" placeholder="العنوان الفرعي" rows={2}></textarea>
                    </div>
                    <div className="md:col-span-2 p-4 border rounded-md">
                        <h3 className="text-lg font-semibold mb-2 text-blue-900">قسم "مخطط الدروس الذكي"</h3>
                        <input name="aiPlannerTitle" value={localContent.homepage.aiPlannerTitle} onChange={handleHomepageChange} className="w-full p-2 border rounded mb-2" placeholder="العنوان الرئيسي"/>
                        <textarea name="aiPlannerSubtitle" value={localContent.homepage.aiPlannerSubtitle} onChange={handleHomepageChange} className="w-full p-2 border rounded" placeholder="العنوان الفرعي" rows={2}></textarea>
                    </div>
                </div>
            );
        // ... other cases remain same as existing file ...
        case 'about':
        return (
            <div className="space-y-6">
                 <div>
                    <label className="font-semibold block mb-1">العنوان الرئيسي للصفحة</label>
                    <input name="aboutTitle" value={localContent.about.aboutTitle} onChange={handleAboutChange} className="w-full p-2 border rounded-md"/>
                 </div>
                 <div>
                    <label className="font-semibold block mb-1">صورة البنر الرئيسية (رابط)</label>
                    <input name="heroImage" value={localContent.about.heroImage} onChange={handleAboutChange} className="w-full p-2 border rounded-md"/>
                 </div>
                 <div>
                    <label className="font-semibold block mb-1">عنوان قسم الرؤية</label>
                    <input name="visionTitle" value={localContent.about.visionTitle} onChange={handleAboutChange} className="w-full p-2 border rounded-md"/>
                 </div>
                 <div>
                    <label className="font-semibold block mb-1">نص الرؤية</label>
                    <textarea name="vision" value={localContent.about.vision} onChange={handleAboutChange} rows={3} className="w-full p-2 border rounded-md"></textarea>
                 </div>
                 <div>
                    <label className="font-semibold block mb-1">صورة الرؤية (رابط)</label>
                    <input name="visionImage" value={localContent.about.visionImage} onChange={handleAboutChange} className="w-full p-2 border rounded-md"/>
                 </div>
                  <div>
                    <label className="font-semibold block mb-1">عنوان قسم الرسالة</label>
                    <input name="missionTitle" value={localContent.about.missionTitle} onChange={handleAboutChange} className="w-full p-2 border rounded-md"/>
                 </div>
                 <div>
                    <label className="font-semibold block mb-1">نص الرسالة</label>
                    <textarea name="mission" value={localContent.about.mission} onChange={handleAboutChange} rows={5} className="w-full p-2 border rounded-md"></textarea>
                 </div>
                  <div>
                    <label className="font-semibold block mb-1">عنوان مجتمع المعلمين</label>
                    <input name="teacherCommunityTitle" value={localContent.about.teacherCommunityTitle} onChange={handleAboutChange} className="w-full p-2 border rounded-md"/>
                 </div>
                 <div>
                    <label className="font-semibold block mb-1">نص مجتمع المعلمين</label>
                    <textarea name="teacherCommunity" value={localContent.about.teacherCommunity} onChange={handleAboutChange} rows={3} className="w-full p-2 border rounded-md"></textarea>
                 </div>
                 <div>
                    <label className="font-semibold block mb-1">عنوان قسم "لماذا JoTutor؟"</label>
                    <input name="whyJoTutorTitle" value={localContent.about.whyJoTutorTitle} onChange={handleAboutChange} className="w-full p-2 border rounded-md"/>
                 </div>
                 <div>
                    <label className="font-semibold block mb-1">نقاط "لماذا JoTutor؟" (كل نقطة في سطر جديد)</label>
                    <textarea name="whyJoTutor" value={localContent.about.whyJoTutor.join('\n')} onChange={handleAboutChange} rows={10} className="w-full p-2 border rounded-md"></textarea>
                 </div>
            </div>
        );
      case 'faq':
        return (
            <div>
                {localContent.faq.map(item => (
                    <div key={item.id} className="grid grid-cols-1 md:grid-cols-12 gap-2 mb-4 p-4 border rounded-md bg-gray-50">
                        <div className="md:col-span-11">
                            <input type="text" value={item.question} onChange={e => handleFaqChange(item.id, 'question', e.target.value)} placeholder="السؤال" className="w-full p-2 border rounded-md mb-2 font-semibold"/>
                            <textarea value={item.answer} onChange={e => handleFaqChange(item.id, 'answer', e.target.value)} placeholder="الإجابة" rows={2} className="w-full p-2 border rounded-md"></textarea>
                        </div>
                        <div className="md:col-span-1 flex items-center justify-end">
                             <button onClick={() => removeFaqItem(item.id)} className="p-2 text-red-500 hover:bg-red-100 rounded-full">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                            </button>
                        </div>
                    </div>
                ))}
                 <button onClick={addFaqItem} className="bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-600">إضافة سؤال جديد</button>
            </div>
        );
      case 'contact':
        return (
            <div className="space-y-4">
                 <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">البريد الإلكتروني</label>
                    <input type="email" name="email" value={localContent.contact.email} onChange={handleContactChange} className="w-full p-2 border rounded-md"/>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">رقم الهاتف</label>
                    <input type="text" name="phone" value={localContent.contact.phone} onChange={handleContactChange} className="w-full p-2 border rounded-md"/>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">العنوان</label>
                    <input type="text" name="address" value={localContent.contact.address} onChange={handleContactChange} className="w-full p-2 border rounded-md"/>
                </div>
            </div>
        );
      case 'privacy':
         return (
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">محتوى صفحة "سياسة الخصوصية"</label>
                <textarea name="privacy" value={localContent.privacy} onChange={(e) => handleTextChange(e, 'privacy')} rows={10} className="w-full p-2 border rounded-md"></textarea>
            </div>
        );
      case 'terms':
        return (
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">محتوى صفحة "شروط الاستخدام"</label>
                <textarea name="terms" value={localContent.terms} onChange={(e) => handleTextChange(e, 'terms')} rows={10} className="w-full p-2 border rounded-md"></textarea>
            </div>
        );
      case 'config':
        return (
            <div className="space-y-4">
                <div className="bg-yellow-50 p-4 rounded border border-yellow-300 text-yellow-800 text-sm mb-4">
                    <strong>تحذير:</strong> مفتاح API حساس. مشاركته قد تؤدي إلى سوء استخدامه. تأكد من إبقاء هذا المفتاح سرياً.
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Gemini API Key</label>
                    <input type="text" name="geminiApiKey" value={localContent.geminiApiKey || ''} onChange={handleConfigChange} className="w-full p-2 border rounded-md font-mono text-sm" placeholder="AIzaSy..."/>
                </div>
            </div>
        );
    }
  };

  const tabs: { id: ContentTab, label: string }[] = [
      { id: 'homepage', label: 'محتوى الصفحة الرئيسية' },
      { id: 'about', label: 'عن JoTutor' },
      { id: 'faq', label: 'الأسئلة الشائعة' },
      { id: 'contact', label: 'معلومات التواصل' },
      { id: 'config', label: 'إعدادات النظام (API)' }, // New Tab
      { id: 'privacy', label: 'سياسة الخصوصية' },
      { id: 'terms', label: 'شروط الاستخدام' }
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">إدارة المحتوى</h1>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="border-b border-gray-200 mb-6">
            <nav className="-mb-px flex space-x-6 space-x-reverse overflow-x-auto" aria-label="Tabs">
                {tabs.map(tab => (
                    <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`${activeTab === tab.id ? 'border-green-500 text-green-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}>
                        {tab.label}
                    </button>
                ))}
            </nav>
        </div>
        
        <div className="min-h-[300px]">
            {renderTabContent()}
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

export default ManageContent;
