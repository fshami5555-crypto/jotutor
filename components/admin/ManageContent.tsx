import React, { useState, useEffect } from 'react';
import { SiteContent, FAQItem } from '../../types';

interface ManageContentProps {
  content: SiteContent;
  onUpdate: (newContent: SiteContent) => void;
}

type ContentTab = 'about' | 'faq' | 'contact' | 'privacy' | 'terms';

const ManageContent: React.FC<ManageContentProps> = ({ content, onUpdate }) => {
  const [activeTab, setActiveTab] = useState<ContentTab>('about');
  const [localContent, setLocalContent] = useState<SiteContent>(content);
  const [status, setStatus] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    setLocalContent(content);
  }, [content]);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>, section: keyof SiteContent | 'contact') => {
    const { name, value } = e.target;
    if (section === 'contact') {
        setLocalContent(prev => ({
            ...prev,
            contact: { ...prev.contact, [name]: value }
        }));
    } else {
        setLocalContent(prev => ({ ...prev, [name]: value }));
    }
  };
  
  const handleFaqChange = (id: number, field: 'question' | 'answer', value: string) => {
    setLocalContent(prev => ({
        ...prev,
        faq: prev.faq.map(item => item.id === id ? { ...item, [field]: value } : item)
    }));
  };

  const addFaqItem = () => {
    const newFaq: FAQItem = { id: Date.now(), question: 'سؤال جديد', answer: 'إجابة جديدة' };
    setLocalContent(prev => ({ ...prev, faq: [...prev.faq, newFaq]}));
  };
  
  const removeFaqItem = (id: number) => {
    setLocalContent(prev => ({ ...prev, faq: prev.faq.filter(item => item.id !== id)}));
  };

  const handleSaveChanges = () => {
    onUpdate(localContent);
    setStatus({ message: 'تم حفظ التغييرات بنجاح!', type: 'success' });
    setTimeout(() => setStatus(null), 3000);
  };
  
  const renderTabContent = () => {
    switch(activeTab) {
      case 'about':
        return (
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">محتوى صفحة "عن JoTutor"</label>
                <textarea name="about" value={localContent.about} onChange={(e) => handleTextChange(e, 'about')} rows={10} className="w-full p-2 border rounded-md"></textarea>
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
                    <input type="email" name="email" value={localContent.contact.email} onChange={(e) => handleTextChange(e, 'contact')} className="w-full p-2 border rounded-md"/>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">رقم الهاتف</label>
                    <input type="text" name="phone" value={localContent.contact.phone} onChange={(e) => handleTextChange(e, 'contact')} className="w-full p-2 border rounded-md"/>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">العنوان</label>
                    <input type="text" name="address" value={localContent.contact.address} onChange={(e) => handleTextChange(e, 'contact')} className="w-full p-2 border rounded-md"/>
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
    }
  };

  const tabs: { id: ContentTab, label: string }[] = [
      { id: 'about', label: 'عن JoTutor' },
      { id: 'faq', label: 'الأسئلة الشائعة' },
      { id: 'contact', label: 'معلومات التواصل' },
      { id: 'privacy', label: 'سياسة الخصوصية' },
      { id: 'terms', label: 'شروط الاستخدام' }
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">إدارة المحتوى</h1>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="border-b border-gray-200 mb-6">
            <nav className="-mb-px flex space-x-6 space-x-reverse" aria-label="Tabs">
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