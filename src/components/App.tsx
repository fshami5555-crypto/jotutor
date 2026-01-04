import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { arStrings, enStrings } from '../localization';
import { JOD_TO_USD_RATE } from '../constants';
import { 
    Page, Currency, Language, SiteContent, HeroSlide, Teacher, Testimonial, Course, BlogPost, 
    OnboardingOptions, UserProfile, Payment, StaffMember, DashboardView 
} from '../types';

// Component Imports
import Header from './Header';
import HeroSection from './HeroSection';
import FeaturesSection from './FeaturesSection';
import HowItWorks from './HowItWorks';
import TeacherSearch from './TeacherSearch';
import TestimonialsSection from './TestimonialsSection';
import CoursesPreview from './CoursesPreview';
import AILessonPlanner from './AILessonPlanner';
import Footer from './Footer';
import AuthModal from './AuthModal';
import OnboardingWizard from './OnboardingWizard';
import Dashboard from './Dashboard';
import AdminDashboard from './AdminDashboard';
import TeacherProfilePage from './TeacherProfilePage';
import CourseProfilePage from './CourseProfilePage';
import PaymentPage from './PaymentPage';
import CoursesPage from './CoursesPage';
import VideosPage from './VideosPage';
import ShortPlayerPage from './ShortPlayerPage';
import BlogPage from './BlogPage';
import ArticlePage from './ArticlePage';
import AboutPage from './AboutPage';
import ContactPage from './ContactPage';
import FAQPage from './FAQPage';
import PrivacyPolicyPage from './PrivacyPolicyPage';
import TermsPage from './TermsPage';
import Chatbot from './Chatbot';
import WelcomeModal from './WelcomeModal';
import PaymentRefundPage from './PaymentRefundPage';

// Data and Services
import { initialData } from '../mockData';
import { translateContent, setGeminiApiKey } from '../services/geminiService';
import { 
    fetchPublicData,
    fetchAdminData,
    overwriteCollection, 
    updateConfig, 
    setDocument,
    auth,
    db,
    onAuthStateChangedListener,
    subscribeToPayments,
} from '../googleSheetService';


const App: React.FC = () => {
    const [page, setPage] = useState<Page>('home');
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [navHistory, setNavHistory] = useState<{page: Page, id: string | null}[]>([]);
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [isAdmin, setIsAdmin] = useState<boolean>(false);
    const [isSuperAdmin, setIsSuperAdmin] = useState<boolean>(false);
    const [isEnglishAdmin, setIsEnglishAdmin] = useState<boolean>(false);
    const [isAuthModalOpen, setAuthModalOpen] = useState(false);
    const [authModalView, setAuthModalView] = useState<'login' | 'signup'>('login');
    const [showOnboarding, setShowOnboarding] = useState(false);
    const [showWelcomeModal, setShowWelcomeModal] = useState(true);
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [showLangConfirm, setShowLangConfirm] = useState(false);
    const [pendingBookingId, setPendingBookingId] = useState<string | null>(null);
    const [language, setLanguage] = useState<Language>('ar');
    const [strings, setStrings] = useState(arStrings);
    const [isTranslating, setIsTranslating] = useState(false);
    const [currency, setCurrency] = useState<Currency>('JOD');
    const [users, setUsers] = useState<UserProfile[]>([]);
    const [staff, setStaff] = useState<StaffMember[]>([]);
    const [payments, setPayments] = useState<Payment[]>([]);
    const [teachers, setTeachers] = useState<Teacher[]>(initialData.teachers);
    const [courses, setCourses] = useState<Course[]>(initialData.courses);
    const [testimonials, setTestimonials] = useState<Testimonial[]>(initialData.testimonials);
    const [blogPosts, setBlogPosts] = useState<BlogPost[]>(initialData.blogPosts);
    const [heroSlides, setHeroSlides] = useState<HeroSlide[]>(initialData.heroSlides);
    const [siteContent, setSiteContent] = useState<SiteContent>(initialData.siteContent);
    const [onboardingOptions, setOnboardingOptions] = useState<OnboardingOptions>(initialData.onboardingOptions);
    const [isDataLoading, setIsDataLoading] = useState(true);
    const [isAuthLoading, setIsAuthLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [initialDashboardView, setInitialDashboardView] = useState<DashboardView | undefined>();

    const displayedCourses = useMemo(() => {
        if (language === 'ar') return courses.filter(c => c.title && c.title.trim() !== '');
        return courses.filter(c => c.title_en && c.title_en.trim() !== '').map(course => ({
                ...course,
                title: course.title_en!,
                description: course.description_en || course.description,
                level: course.level_en || course.level,
                category: course.category_en || course.category,
                curriculum: course.curriculum_en || course.curriculum,
                duration: course.duration_en || course.duration,
                includedSubjects: course.includedSubjects_en || course.includedSubjects
            }));
    }, [courses, language]);

    const displayedTeachers = useMemo(() => {
        if (language === 'ar') return teachers.filter(t => t.name && t.name.trim() !== '');
        return teachers.filter(t => t.name_en && t.name_en.trim() !== '').map(t => ({
                ...t,
                name: t.name_en!,
                level: t.level_en || t.level,
                bio: t.bio_en || t.bio,
                specialties: t.specialties_en && t.specialties_en.length > 0 ? t.specialties_en : t.specialties,
                qualifications: t.qualifications_en && t.qualifications_en.length > 0 ? t.qualifications_en : t.qualifications,
            }));
    }, [teachers, language]);

    const displayedTestimonials = useMemo(() => {
        if (language === 'ar') return testimonials.filter(t => t.name && t.name.trim() !== '');
        return testimonials.filter(t => t.name_en && t.name_en.trim() !== '').map(t => ({
                ...t,
                name: t.name_en!,
                role: t.role_en || t.role,
                quote: t.quote_en || t.quote
            }));
    }, [testimonials, language]);

    const displayedBlogPosts = useMemo(() => {
        if (language === 'ar') return blogPosts.filter(p => p.title && p.title.trim() !== '');
        return blogPosts.filter(p => p.title_en && p.title_en.trim() !== '').map(p => ({
                ...p,
                title: p.title_en!,
                excerpt: p.excerpt_en || p.excerpt,
                content: p.content_en || p.content,
                tags: p.tags_en && p.tags_en.length > 0 ? p.tags_en : p.tags
            }));
    }, [blogPosts, language]);

    const currentOnboardingOptions = useMemo(() => {
        if (language === 'en') {
            return {
                ...onboardingOptions,
                serviceTypes: onboardingOptions.serviceTypes_en || [],
                educationStages: onboardingOptions.educationStages_en || [],
                curriculums: onboardingOptions.curriculums_en || [],
                subjects: onboardingOptions.subjects_en || [],
            };
        }
        return onboardingOptions;
    }, [onboardingOptions, language]);

    useEffect(() => {
        const loadPublicData = async () => {
            setIsDataLoading(true);
            try {
                const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error("Firebase timeout")), 5000));
                const response = await Promise.race([fetchPublicData(), timeoutPromise]) as { success: boolean; data: any };
                if(response.success){
                    const data = response.data;
                    setTeachers(data.teachers || []);
                    setCourses(data.courses || []);
                    setTestimonials(data.testimonials || []);
                    setBlogPosts(data.blog || []);
                    setHeroSlides(data.heroSlides || []);
                    if (data.config && data.config.siteContent) {
                            const mergedHomepage = { ...initialData.siteContent.homepage, ...(data.config.siteContent.homepage || {}) };
                            const mergedContent = { ...initialData.siteContent, ...data.config.siteContent, homepage: mergedHomepage };
                            if (mergedContent.geminiApiKey) setGeminiApiKey(mergedContent.geminiApiKey);
                            setSiteContent(mergedContent);
                    }
                    if (data.config?.onboardingOptions) setOnboardingOptions(data.config.onboardingOptions);
                }
            } catch (e: any) {
                console.warn("Using offline data:", e.message);
                if (initialData.siteContent.geminiApiKey) setGeminiApiKey(initialData.siteContent.geminiApiKey);
            } finally {
                setIsDataLoading(false);
            }
        };
        loadPublicData();
    }, []);

    useEffect(() => {
        const authTimer = setTimeout(() => setIsAuthLoading(false), 4000);
        const unsubscribe = onAuthStateChangedListener(async (user) => {
            clearTimeout(authTimer);
            if (user) {
                setIsLoggedIn(true);
                const email = user.email ? user.email.toLowerCase() : '';
                if (['admin@jotutor.com', 'eng@jotutor.com'].includes(email)) {
                    setIsAdmin(true);
                    if (email === 'admin@jotutor.com') { setIsSuperAdmin(true); setLanguage('ar'); setStrings(arStrings); }
                    else if (email === 'eng@jotutor.com') { setIsEnglishAdmin(true); setLanguage('en'); setStrings(enStrings); }
                    const response = await fetchAdminData();
                    setUsers(response.data.users || []);
                    setStaff(response.data.staff || []);
                    if (response.data.payments) setPayments(response.data.payments);
                    subscribeToPayments((updated) => setPayments(updated));
                } else {
                    const userDocSnap = await db.collection('users').doc(user.uid).get();
                    if (userDocSnap.exists) setUserProfile({ ...userDocSnap.data(), id: user.uid } as UserProfile);
                }
            } else {
                setIsLoggedIn(false); setIsAdmin(false); setUserProfile(null);
            }
            setIsAuthLoading(false);
        });
        return unsubscribe;
    }, []);

    const handleNavigate = (newPage: Page, id: string | null = null) => {
        if (page === newPage && selectedId === id) return;
        setNavHistory(prev => [...prev, { page, id: selectedId }]);
        setPage(newPage); setSelectedId(id); window.scrollTo(0, 0);
    };

    const handleBack = () => {
        if (navHistory.length === 0) return;
        const prevState = navHistory[navHistory.length - 1];
        setNavHistory(prev => prev.slice(0, -1));
        setPage(prevState.page); setSelectedId(prevState.id); window.scrollTo(0, 0);
    };

    const handleLogin = async (email: string, password: string) => {
        try {
            await auth.signInWithEmailAndPassword(email, password);
            setAuthModalOpen(false);
            const lowerEmail = email.toLowerCase();
            if (lowerEmail === 'admin@jotutor.com' || lowerEmail === 'eng@jotutor.com') handleNavigate('admin-dashboard');
            else if (pendingBookingId) { handleNavigate('payment', pendingBookingId); setPendingBookingId(null); }
            else handleNavigate('dashboard');
            return true;
        } catch (error) { return false; }
    };

    const renderContent = () => {
        if (isDataLoading || isAuthLoading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-green-500"></div></div>;
        if (showOnboarding) return <div className="container mx-auto px-6 py-12 max-w-4xl"><OnboardingWizard options={currentOnboardingOptions} onSignupSuccess={handleSignupSuccess} onClose={() => setShowOnboarding(false)} strings={strings} language={language} /></div>;
        
        const selectedTeacher = displayedTeachers.find(t => t.id === selectedId);
        const selectedCourse = displayedCourses.find(c => c.id === selectedId);
        const selectedPost = displayedBlogPosts.find(p => p.id === selectedId);

        switch (page) {
            case 'home': return (
                <>
                    <HeroSection 
                        onSignupClick={() => { setAuthModalView('signup'); setAuthModalOpen(true); }} 
                        heroSlides={heroSlides} 
                        content={siteContent.homepage} // تأكد من وجود هذا السطر
                        strings={strings} 
                    />
                    <FeaturesSection content={siteContent.homepage} strings={strings} />
                    <HowItWorks content={siteContent.homepage} strings={strings} />
                    <TeacherSearch content={siteContent.homepage} teachers={displayedTeachers} subjects={currentOnboardingOptions?.subjects || []} onSelectTeacher={(id) => handleNavigate('teacher-profile', id)} isHomePageVersion={true} strings={strings} language={language} />
                    <CoursesPreview content={siteContent.homepage} courses={displayedCourses} onSelectCourse={(id) => handleNavigate('course-profile', id)} onNavigate={handleNavigate} currency={currency} exchangeRate={JOD_TO_USD_RATE} strings={strings} />
                    <TestimonialsSection content={siteContent.homepage} testimonials={displayedTestimonials} strings={strings} />
                    <AILessonPlanner content={siteContent.homepage} strings={strings} language={language} />
                </>
            );
            case 'teachers': return <TeacherSearch content={siteContent.homepage} teachers={displayedTeachers} subjects={currentOnboardingOptions?.subjects || []} onSelectTeacher={(id) => handleNavigate('teacher-profile', id)} strings={strings} language={language}/>;
            case 'teacher-profile': return selectedTeacher ? <TeacherProfilePage teacher={selectedTeacher} strings={strings} language={language}/> : <p>Teacher not found.</p>;
            case 'courses': return <CoursesPage courses={displayedCourses} onSelectCourse={(id) => handleNavigate('course-profile', id)} currency={currency} exchangeRate={JOD_TO_USD_RATE} strings={strings} language={language}/>;
            case 'course-profile': return selectedCourse ? <CourseProfilePage course={selectedCourse} onBook={(id) => isLoggedIn ? handleNavigate('payment', id) : (setPendingBookingId(id), setAuthModalView('login'), setAuthModalOpen(true))} currency={currency} exchangeRate={JOD_TO_USD_RATE} strings={strings} language={language}/> : <p>Course not found.</p>;
            case 'payment': return selectedCourse ? <PaymentPage course={selectedCourse} onEnroll={handleEnrollInCourse} currency={currency} exchangeRate={JOD_TO_USD_RATE} strings={strings} language={language}/> : <p>Course not found.</p>;
            case 'videos': return <VideosPage shorts={displayedBlogPosts.filter(p => p.type === 'short')} onSelectShort={(id) => handleNavigate('short-player', id)} strings={strings} language={language}/>;
            case 'short-player': return selectedPost ? <ShortPlayerPage post={selectedPost} onBack={() => handleNavigate('videos')} strings={strings} language={language}/> : <p>Video not found.</p>;
            case 'blog': return <BlogPage posts={displayedBlogPosts.filter(p=> p.type === 'article')} onSelectPost={(id) => handleNavigate('article', id)} strings={strings} language={language}/>;
            case 'article': return selectedPost ? <ArticlePage post={selectedPost} onBack={() => handleNavigate('blog')} strings={strings} language={language}/> : <p>Article not found.</p>;
            case 'about': return <AboutPage content={siteContent.about} strings={strings} />;
            case 'contact': return <ContactPage content={siteContent.contact} strings={strings} />;
            case 'faq': return <FAQPage faqs={siteContent.faq} strings={strings} />;
            case 'privacy': return <PrivacyPolicyPage content={siteContent.privacy} strings={strings} />;
            case 'terms': return <TermsPage content={siteContent.terms} strings={strings} />;
            case 'payment-refund': return <PaymentRefundPage content={siteContent.paymentRefundPolicy || ''} strings={strings} />;
            case 'dashboard': return userProfile ? <Dashboard userProfile={userProfile} onLogout={() => { auth.signOut(); handleNavigate('home'); }} courses={displayedCourses} onSelectCourse={(id) => handleNavigate('course-profile', id)} currency={currency} exchangeRate={JOD_TO_USD_RATE} strings={strings} language={language} initialView={initialDashboardView} onViewHandled={() => setInitialDashboardView(undefined)} /> : <p>Please log in.</p>;
            case 'admin-dashboard': return isAdmin ? <AdminDashboard onLogout={() => { auth.signOut(); handleNavigate('home'); }} content={siteContent} setContent={(val) => { const updated = typeof val === 'function' ? val(siteContent) : val; setSiteContent(updated); updateConfig({ siteContent: updated }); }} heroSlides={heroSlides} setHeroSlides={(val) => { const updated = typeof val === 'function' ? val(heroSlides) : val; setHeroSlides(updated); overwriteCollection('HeroSlides', updated); }} onboardingOptions={onboardingOptions} setOnboardingOptions={(val) => { const updated = typeof val === 'function' ? val(onboardingOptions) : val; setOnboardingOptions(updated); updateConfig({ onboardingOptions: updated }); }} users={users} setUsers={(val) => { const updated = typeof val === 'function' ? val(users) : val; setUsers(updated); overwriteCollection('Users', updated); }} staff={staff} setStaff={(val) => { const updated = typeof val === 'function' ? val(staff) : val; setStaff(updated); overwriteCollection('Staff', updated); }} payments={payments} setPayments={(val) => { const updated = typeof val === 'function' ? val(payments) : val; setPayments(updated); overwriteCollection('Payments', updated); }} teachers={teachers} setTeachers={(val) => { const updated = typeof val === 'function' ? val(teachers) : val; setTeachers(updated); overwriteCollection('Teachers', updated); }} courses={courses} setCourses={(val) => { const updated = typeof val === 'function' ? val(courses) : val; setCourses(updated); overwriteCollection('Courses', updated); }} subjects={onboardingOptions?.subjects || []} testimonials={testimonials} setTestimonials={(val) => { const updated = typeof val === 'function' ? val(testimonials) : val; setTestimonials(updated); overwriteCollection('Testimonials', updated); }} blogPosts={blogPosts} setBlogPosts={(val) => { const updated = typeof val === 'function' ? val(blogPosts) : val; setBlogPosts(updated); overwriteCollection('Blog', updated); }} onActivateCourse={async (id) => { const pay = payments.find(p => p.id === id); if (!pay) return; await setDocument('Payments', id, { ...pay, status: 'Success' }); const u = users.find(usr => usr.id === pay.userId); if (u) await setDocument('Users', u.id, { ...u, enrolledCourses: [...(u.enrolledCourses || []), pay.courseId] }); alert('تم التفعيل!'); }} strings={strings} language={language} isEnglishAdmin={isEnglishAdmin} isSuperAdmin={isSuperAdmin} onToggleEnglishMode={() => { const nm = !isEnglishAdmin; setIsEnglishAdmin(nm); if (nm) { setLanguage('en'); setStrings(enStrings); } else { setLanguage('ar'); setStrings(arStrings); } }} /> : <p>Access denied.</p>;
            default: return <h2>Page not found</h2>;
        }
    };

    const handleEnrollInCourse = async (course: Course, status: 'Success' | 'Pending' = 'Success', details?: any) => {
        if (!userProfile) { setAuthModalView('login'); setAuthModalOpen(true); return; }
        try {
            if (userProfile.enrolledCourses?.includes(course.id)) { alert("مسجل مسبقاً"); return; }
            if (status === 'Success') {
                const up = { ...userProfile, enrolledCourses: [...(userProfile.enrolledCourses || []), course.id] };
                await setDocument('Users', userProfile.id, up);
                setUserProfile(up);
            }
            let amt = currency === 'USD' ? (course.priceUsd || course.price! * 1.41) : (currency === 'SAR' ? (course.priceSar || course.price! * 5.3) : (course.priceJod || course.price || 0));
            const pay: Payment = { id: details?.orderId || `PAY-${Date.now()}`, date: new Date().toISOString(), userId: userProfile.id, userName: userProfile.username, courseId: course.id, courseName: course.title, amount: amt, currency, status, paymentMethod: details?.paymentMethod, gatewayOrderId: details?.orderId, transactionId: details?.transactionId };
            await setDocument('Payments', pay.id, pay);
            if (status === 'Success') { alert(strings.paymentSuccess); handleNavigate('dashboard'); }
        } catch (e) {}
    };

    const handleSignupSuccess = async (profile: UserProfile) => {
        try {
            const { user } = await auth.createUserWithEmailAndPassword(profile.email, profile.password!);
            const { password, ...pdata } = profile;
            const final = { ...pdata, id: user!.uid, enrolledCourses: [] };
            await setDocument('Users', user!.uid, final);
            setShowOnboarding(false);
            if (pendingBookingId) { handleNavigate('payment', pendingBookingId); setPendingBookingId(null); }
            else { setInitialDashboardView('courses'); handleNavigate('dashboard'); }
            return null;
        } catch (e: any) { return e.code === 'auth/email-already-in-use' ? strings.errorEmailInUse : strings.errorSignupGeneric; }
    };

    return (
        <div className={language === 'ar' ? 'rtl' : 'ltr'}>
            {showWelcomeModal && <WelcomeModal onStartChat={() => setShowWelcomeModal(false)} onClose={() => setShowWelcomeModal(false)} />}
            <Header onNavigate={handleNavigate} onLoginClick={() => { setAuthModalView('login'); setAuthModalOpen(true); }} onSignupClick={() => { setAuthModalView('signup'); setAuthModalOpen(true); }} isLoggedIn={isLoggedIn} isAdmin={isAdmin} username={isAdmin ? (isEnglishAdmin ? 'English Admin' : 'Admin') : userProfile?.username} onLogout={() => auth.signOut()} currency={currency} onCurrencyChange={() => setCurrency(c => c === 'JOD' ? 'USD' : (c === 'USD' ? 'SAR' : 'JOD'))} language={language} onLanguageChange={() => setShowLangConfirm(true)} isTranslating={isTranslating} onBack={handleBack} canGoBack={navHistory.length > 0} strings={strings} />
            {error && <div className="bg-yellow-50 border-l-4 border-yellow-400 text-yellow-700 p-4 container mx-auto my-4 rounded-md text-sm"><p className="font-bold">Notice</p><p>{error}</p></div>}
            <main>{renderContent()}</main>
            {!(isDataLoading || isAuthLoading) && <Footer onNavigate={handleNavigate} strings={strings} />}
            {isAuthModalOpen && <AuthModal initialView={authModalView} onClose={() => setAuthModalOpen(false)} onLogin={handleLogin} onSwitchToOnboarding={() => { setAuthModalOpen(false); setShowOnboarding(true); }} strings={strings} />}
            {showLangConfirm && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center px-4">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowLangConfirm(false)}></div>
                    <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-md p-6">
                        <div className="text-center mb-6"><h3 className="text-xl font-bold text-blue-900 mb-4">{strings.langConfirmTitle}</h3><p className="text-gray-600">{strings.langConfirmMessage}</p></div>
                        <div className="flex flex-col gap-3">
                            <button onClick={() => { setShowLangConfirm(false); const target = language === 'ar' ? 'en' : 'ar'; setLanguage(target); setStrings(target === 'ar' ? arStrings : enStrings); }} className="w-full bg-green-500 text-white font-bold py-3 rounded-lg">{strings.langConfirmYes}</button>
                            <button onClick={() => setShowLangConfirm(false)} className="w-full bg-gray-100 text-gray-700 font-bold py-3 rounded-lg">{strings.langConfirmNo}</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default App;