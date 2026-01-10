import React from 'react';
import { Page, Currency, Language } from '../types';

interface HeaderProps {
    onNavigate: (page: Page) => void;
    onLoginClick: () => void;
    onSignupClick: () => void;
    isLoggedIn: boolean;
    isAdmin: boolean;
    username?: string;
    onLogout: () => void;
    currency: Currency;
    onCurrencyChange: () => void;
    language: Language;
    onLanguageChange: () => void;
    isTranslating: boolean;
    onBack?: () => void;
    canGoBack?: boolean;
    strings: { [key: string]: string };
}

const Header: React.FC<HeaderProps> = ({ 
    onNavigate, onLoginClick, onSignupClick, isLoggedIn, isAdmin, username, onLogout, 
    currency, onCurrencyChange, language, onLanguageChange, isTranslating, onBack, canGoBack, strings 
}) => {
    // الروابط المتاحة بناءً على اللغة
    const navLinks = [
        ...(language === 'en' ? [{ label: strings.navHome, page: 'home' as Page }] : []),
        { label: strings.navTeachers, page: 'teachers' as Page },
        { label: strings.navCourses, page: 'courses' as Page },
        { label: strings.navVideos, page: 'videos' as Page },
        { label: strings.navBlog, page: 'blog' as Page },
        { label: strings.navAbout, page: 'about' as Page },
        { label: strings.navContact, page: 'contact' as Page },
    ];
    
    return (
        <header className="bg-white shadow-md sticky top-0 z-40">
            <div className="container mx-auto px-6 py-3 flex justify-between items-center">
                {/* الشعار */}
                <button onClick={() => onNavigate('home')} className="flex items-center shrink-0">
                    <img src="https://i.ibb.co/XxGsLR3D/15.png" alt="JoTutor Logo" className="h-12 w-auto" />
                </button>

                {/* روابط التنقل الرئيسية - تم زيادة المسافة إلى 10 */}
                <nav className="hidden lg:flex items-center gap-10">
                    {navLinks.map(link => (
                        <button 
                            key={link.page} 
                            onClick={() => onNavigate(link.page)} 
                            className="text-gray-600 hover:text-green-500 font-bold transition-colors text-sm whitespace-nowrap"
                        >
                            {link.label}
                        </button>
                    ))}
                </nav>

                {/* أزرار الإجراءات الجانبية - تم تنظيمها بمسافات متساوية gap-4 */}
                <div className="flex items-center gap-4">
                    {/* زر اللغة */}
                    <button 
                        onClick={onLanguageChange} 
                        disabled={isTranslating}
                        className="border border-gray-300 rounded-full w-10 h-10 text-xs font-black text-gray-700 hover:bg-gray-100 transition-colors flex items-center justify-center disabled:cursor-not-allowed disabled:opacity-50 shrink-0"
                    >
                        {language === 'ar' ? 'EN' : 'AR'}
                    </button>

                    {/* زر العملة */}
                    <button 
                        onClick={onCurrencyChange} 
                        className="border border-gray-300 rounded-full px-4 py-1.5 text-xs font-bold text-gray-700 hover:bg-gray-100 transition-colors flex items-center gap-2 shrink-0"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                        </svg>
                        <span>{currency}</span>
                    </button>
                    
                    {/* زر الرجوع */}
                    {canGoBack && onBack && (
                        <button 
                            onClick={onBack}
                            className="flex items-center gap-2 bg-gray-100 text-gray-700 hover:bg-gray-200 hover:text-green-600 px-4 py-1.5 rounded-full transition-colors font-bold text-xs shrink-0"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 transform rtl:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            <span>{strings.back}</span>
                        </button>
                    )}

                    {/* أزرار الدخول والتسجيل */}
                    <div className="flex items-center gap-4 border-r pr-4 rtl:border-r-0 rtl:border-l rtl:pl-4 border-gray-200">
                        {isLoggedIn ? (
                            <div className="flex items-center gap-3">
                                <span className="font-bold text-blue-900 hidden xl:inline text-sm">{strings.welcome}, {username}</span>
                                <button onClick={() => onNavigate(isAdmin ? 'admin-dashboard' : 'dashboard')} className="bg-blue-900 text-white font-bold py-2 px-5 rounded-full hover:bg-blue-800 transition-colors text-xs whitespace-nowrap">
                                    {strings.dashboard}
                                </button>
                                <button onClick={onLogout} className="bg-red-500 text-white font-bold py-2 px-5 rounded-full hover:bg-red-600 transition-colors text-xs whitespace-nowrap">
                                    {strings.logout}
                                </button>
                            </div>
                        ) : (
                            <>
                                <button onClick={onLoginClick} className="text-green-600 font-black hover:text-green-700 transition-colors text-sm whitespace-nowrap px-2">
                                    {strings.login}
                                </button>
                                <button onClick={onSignupClick} className="bg-green-500 text-white font-black py-2.5 px-6 rounded-full hover:bg-green-600 transition-transform active:scale-95 shadow-md text-sm whitespace-nowrap">
                                    {strings.signup}
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
