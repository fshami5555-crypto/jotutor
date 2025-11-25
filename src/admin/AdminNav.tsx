
import React from 'react';

export type AdminView = 'content' | 'users' | 'teachers' | 'courses' | 'testimonials' | 'blog' | 'heroImages' | 'onboarding' | 'staff' | 'payments' | 'whatsapp-courses';

interface AdminNavProps {
    activeView: AdminView;
    setActiveView: (view: AdminView) => void;
    onLogout: () => void;
}

const AdminNav: React.FC<AdminNavProps> = ({ activeView, setActiveView, onLogout }) => {
    const navItems = [
        { id: 'whatsapp-courses', label: 'الدورات عبر واتساب', icon: '💬' },
        { id: 'content', label: 'إدارة المحتوى' },
        { id: 'heroImages', label: 'إدارة بنر الرئيسية' },
        { id: 'onboarding', label: 'مراحل التسجيل' },
        { id: 'users', label: 'إدارة المستخدمين' },
        { id: 'staff', label: 'إدارة الموظفين' },
        { id: 'payments', label: 'إدارة الدفعات' },
        { id: 'teachers', label: 'إدارة المعلمين' },
        { id: 'courses', label: 'إدارة الدورات' },
        { id: 'testimonials', label: 'إدارة الشهادات' },
        { id: 'blog', label: 'إدارة المدونة' },
    ];

    return (
        <aside className="md:w-64 bg-white p-6 rounded-xl shadow-lg flex-shrink-0 w-full">
            <div className="text-center mb-8">
                <h3 className="font-bold text-xl mt-4 text-blue-900">لوحة تحكم المشرف</h3>
            </div>
            <nav className="space-y-2">
                {navItems.map(item => (
                    <button
                        key={item.id}
                        onClick={() => setActiveView(item.id as AdminView)}
                        className={`w-full text-right p-3 rounded-lg transition-colors flex items-center justify-between ${activeView === item.id ? 'bg-blue-900 text-white' : 'hover:bg-gray-100 text-gray-700'}`}
                    >
                        <span className="font-semibold">{item.label}</span>
                        {item.icon && <span>{item.icon}</span>}
                    </button>
                ))}
            </nav>
            <div className="mt-8 border-t pt-4">
                 <button onClick={onLogout} className="w-full flex items-center space-x-3 space-x-reverse p-3 rounded-lg text-right transition-colors text-red-500 hover:bg-red-50">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                    <span className="font-semibold">تسجيل الخروج</span>
                </button>
            </div>
        </aside>
    );
};

export default AdminNav;
