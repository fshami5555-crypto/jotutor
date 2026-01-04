
import React, { useState, useEffect } from 'react';
import { SiteContent, FAQItem, AboutContent, ContactContent, HomepageContent } from '../types';
import { initialData } from '../mockData';
import ImageUploadInput from './ImageUploadInput';

interface ManageContentProps {
  content: SiteContent;
  onUpdate: (newContent: SiteContent) => void;
  isEnglishAdmin?: boolean;
}

type ContentTab = 'homepage' | 'about' | 'faq' | 'contact' | 'privacy' | 'terms' | 'paymentRefund' | 'config';

const ManageContent: React.FC<ManageContentProps> = ({ content, onUpdate, isEnglishAdmin }) => {
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

  const handleAboutImageChange = (name: string, value: string) => {
      setLocalContent(prev => ({
          ...prev,
          about: { ...prev.about, [name]: value }
      }));
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

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>, section: 'privacy' | 'terms' | 'paymentRefundPolicy') => {
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
    const newFaq: FAQItem = { id: Date.now().toString(), question: isEnglishAdmin ? 'New Question' : 'سؤال جديد', answer: isEnglishAdmin ? 'New Answer' : 'إجابة جديدة' };
    setLocalContent(prev => ({ ...prev, faq: [...prev.faq, newFaq]}));
  };
  
  const removeFaqItem = (id: string) => {
    setLocalContent(prev => ({ ...prev, faq: prev.faq.filter(item => item.id !== id)}));
  };

  const handleSaveChanges = () => {
    onUpdate(localContent);
    setStatus({ message: isEnglishAdmin ? 'Changes saved successfully (English Version)!' : 'تم حفظ التغييرات بنجاح!', type: 'success' });
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
                        <h3 className="text-lg font-bold mb-4 text-blue-900 border-b pb-2">{isEnglishAdmin ? 'Features Section' : 'قسم "لماذا تختار JoTutor؟"'}</h3>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">{isEnglishAdmin ? 'Main Title' : 'العنوان الرئيسي'}</label>
                            <input name="featuresTitle" value={localContent.homepage.featuresTitle} onChange={handleHomepageChange} className="w-full p-2 border rounded mb-2" placeholder="Title"/>
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">{isEnglishAdmin ? 'Subtitle' : 'العنوان الفرعي'}</label>
                            <textarea name="featuresSubtitle" value={localContent.homepage.featuresSubtitle} onChange={handleHomepageChange} className="w-full p-2 border rounded" placeholder="Subtitle" rows={2}></textarea>
                        </div>
                    </div>

                    {/* Statistics Section Edit */}
                    <div className="md:col-span-2 p-4 border rounded-md bg-white shadow-sm ring-1 ring-green-200">
                        <h3 className="text-lg font-bold mb-4 text-green-800 border-b pb-2 flex items-center">
                            {isEnglishAdmin ? 'Statistics Section (Floating Circles)' : 'إحصائيات الموقع (الدوائر العائمة)'}
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="p-2 bg-gray-50 rounded">
                                <label className="block text-xs font-bold text-gray-600 mb-1">{isEnglishAdmin ? 'Student Count' : 'عدد الطلاب المسجلين'}</label>
                                <input name="statsStudentCount" value={localContent.homepage.statsStudentCount || '+5000'} onChange={handleHomepageChange} className="w-full p-2 border rounded mb-2 text-center font-bold text-blue-900" placeholder="+5000"/>
                                <input name="statsStudentLabel" value={localContent.homepage.statsStudentLabel || 'طالب مسجل'} onChange={handleHomepageChange} className="w-full p-2 border rounded text-center text-xs" placeholder="Label"/>
                            </div>
                            <div className="p-2 bg-gray-50 rounded">
                                <label className="block text-xs font-bold text-gray-600 mb-1">{isEnglishAdmin ? 'Teacher Count' : 'عدد المعلمين المعتمدين'}</label>
                                <input name="statsTeacherCount" value={localContent.homepage.statsTeacherCount || '+750'} onChange={handleHomepageChange} className="w-full p-2 border rounded mb-2 text-center font-bold text-blue-900" placeholder="+750"/>
                                <input name="statsTeacherLabel" value={localContent.homepage.statsTeacherLabel || 'معلم معتمد'} onChange={handleHomepageChange} className="w-full p-2 border rounded text-center text-xs" placeholder="Label"/>
                            </div>
                            <div className="p-2 bg-gray-50 rounded">
                                <label className="block text-xs font-bold text-gray-600 mb-1">{isEnglishAdmin ? 'Success Rate' : 'نسب نجاح طلابنا'}</label>
                                <input name="statsSatisfactionRate" value={localContent.homepage.statsSatisfactionRate || '98%'} onChange={handleHomepageChange} className="w-full p-2 border rounded mb-2 text-center font-bold text-blue-900" placeholder="98%"/>
                                <input name="statsSatisfactionLabel" value={localContent.homepage.statsSatisfactionLabel || 'نسبة نجاح طلابنا'} onChange={handleHomepageChange} className="w-full p-2 border rounded text-center text-xs" placeholder="Label"/>
                            </div>
                            <div className="p-2 bg-gray-50 rounded">
                                <label className="block text-xs font-bold text-gray-600 mb-1">{isEnglishAdmin ? 'Acceptance Rate' : 'نسب قبول المعلمين'}</label>
                                <input name="statsAcceptanceRate" value={localContent.homepage.statsAcceptanceRate || '25%'} onChange={handleHomepageChange} className="w-full p-2 border rounded mb-2 text-center font-bold text-blue-900" placeholder="25%"/>
                                <input name="statsAcceptanceLabel" value={localContent.homepage.statsAcceptanceLabel || 'قبول المعلمين المتفوقين'} onChange={handleHomepageChange} className="w-full p-2 border rounded text-center text-xs" placeholder="Label"/>
                            </div>
                        </div>
                    </div>

                    <div className="md:col-span-2 p-4 border rounded-md">
                        <h3 className="text-lg font-semibold mb-2 text-blue-900">{isEnglishAdmin ? 'How It Works Section' : 'قسم "كيف يعمل؟"'}</h3>
                        <input name="howItWorksTitle" value={localContent.homepage.howItWorksTitle} onChange={handleHomepageChange} className="w-full p-2 border rounded mb-2" placeholder="Title"/>
                    </div>
                </div>
            );
        case 'about':
        return (
            <div className="space-y-6">
                 <div>
                    <label className="font-semibold block mb-1">Page Title</label>
                    <input name="aboutTitle" value={localContent.about.aboutTitle} onChange={handleAboutChange} className="w-full p-2 border rounded-md"/>
                 </div>
                 <div>
                    <label className="font-semibold block mb-1">Hero Image</label>
                    <ImageUploadInput 
                        value={localContent.about.heroImage} 
                        onChange={(url) => handleAboutImageChange('heroImage', url)} 
                        placeholder="Image URL" 
                    />
                 </div>
                 <div>
                    <label className="font-semibold block mb-1">Vision Title</label>
                    <input name="visionTitle" value={localContent.about.visionTitle} onChange={handleAboutChange} className="w-full p-2 border rounded-md"/>
                 </div>
                 <div>
                    <label className="font-semibold block mb-1">Vision Text</label>
                    <textarea name="vision" value={localContent.about.vision} onChange={handleAboutChange} rows={3} className="w-full p-2 border rounded-md"></textarea>
                 </div>
                 <div>
                    <label className="font-semibold block mb-1">Vision Image</label>
                    <ImageUploadInput 
                        value={localContent.about.visionImage} 
                        onChange={(url) => handleAboutImageChange('visionImage', url)} 
                        placeholder="Image URL" 
                    />
                 </div>
            </div>
        );
      case 'faq':
        return (
            <div>
                {localContent.faq.map(item => (
                    <div key={item.id} className="grid grid-cols-1 md:grid-cols-12 gap-2 mb-4 p-4 border rounded-md bg-gray-50">
                        <div className="md:col-span-11">
                            <input type="text" value={item.question} onChange={e => handleFaqChange(item.id, 'question', e.target.value)} placeholder="Question" className="w-full p-2 border rounded-md mb-2 font-semibold"/>
                            <textarea value={item.answer} onChange={e => handleFaqChange(item.id, 'answer', e.target.value)} placeholder="Answer" rows={2} className="w-full p-2 border rounded-md"></textarea>
                        </div>
                    </div>
                ))}
                 <button onClick={addFaqItem} className="bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-600">Add New Question</button>
            </div>
        );
      case 'contact':
        return (
            <div className="space-y-4">
                 <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input type="email" name="email" value={localContent.contact.email} onChange={handleContactChange} className="w-full p-2 border rounded-md"/>
                </div>
            </div>
        );
      case 'privacy':
         return (
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Privacy Policy Content</label>
                <textarea name="privacy" value={localContent.privacy} onChange={(e) => handleTextChange(e, 'privacy')} rows={10} className="w-full p-2 border rounded-md"></textarea>
            </div>
        );
      case 'terms':
        return (
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Terms & Conditions Content</label>
                <textarea name="terms" value={localContent.terms} onChange={(e) => handleTextChange(e, 'terms')} rows={10} className="w-full p-2 border rounded-md"></textarea>
            </div>
        );
      case 'paymentRefund':
        return (
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Payment & Refund Policy Content</label>
                <textarea name="paymentRefundPolicy" value={localContent.paymentRefundPolicy || ''} onChange={(e) => handleTextChange(e, 'paymentRefundPolicy')} rows={10} className="w-full p-2 border rounded-md"></textarea>
            </div>
        );
      case 'config':
        return (
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Gemini API Key</label>
                    <input type="text" name="geminiApiKey" value={localContent.geminiApiKey || ''} onChange={handleConfigChange} className="w-full p-2 border rounded-md font-mono text-sm" placeholder="AIzaSy..."/>
                </div>
            </div>
        );
    }
  };

  const tabs: { id: ContentTab, label: string }[] = [
      { id: 'homepage', label: isEnglishAdmin ? 'Homepage' : 'محتوى الصفحة الرئيسية' },
      { id: 'about', label: isEnglishAdmin ? 'About' : 'عن JoTutor' },
      { id: 'faq', label: isEnglishAdmin ? 'FAQ' : 'الأسئلة الشائعة' },
      { id: 'contact', label: isEnglishAdmin ? 'Contact' : 'معلومات التواصل' },
      { id: 'config', label: isEnglishAdmin ? 'Config (API)' : 'إعدادات النظام (API)' },
      { id: 'privacy', label: isEnglishAdmin ? 'Privacy' : 'سياسة الخصوصية' },
      { id: 'terms', label: isEnglishAdmin ? 'Terms' : 'شروط الاستخدام' },
      { id: 'paymentRefund', label: isEnglishAdmin ? 'Refund Policy' : 'سياسة الدفع والارجاع' }
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">{isEnglishAdmin ? 'Content Management (English Mode)' : 'إدارة المحتوى'}</h1>
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
                {isEnglishAdmin ? 'Save English Content' : 'حفظ التغييرات'}
            </button>
            {status && <p className={`text-sm font-semibold ${status.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>{status.message}</p>}
        </div>
      </div>
    </div>
  );
};

export default ManageContent;
