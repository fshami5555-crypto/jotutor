import React, { useState, useEffect, useCallback } from 'react';
import { arStrings, enStrings } from '../localization';
import { JOD_TO_USD_RATE } from '../constants';
import { 
    Page, Currency, Language, SiteContent, HeroSlide, Teacher, Testimonial, Course, BlogPost, 
    OnboardingOptions, UserProfile, Payment, StaffMember 
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
import JoinTeacherPage from './JoinTeacherPage';
import FAQPage from './FAQPage';
import PrivacyPolicyPage from './PrivacyPolicyPage';
import TermsPage from './TermsPage';
import Chatbot from './Chatbot';

// Data and Services
import { translateContent } from '../services/geminiService';
import { fetchAllData, appendRow, overwriteSheet, updateConfig, isGoogleSheetConfigured } from '../googleSheetService';
import { initialData } from '../mockData'; 


const App: React.FC = () => {
    // === STATE MANAGEMENT ===
    const [page, setPage] = useState<Page>('home');
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [isAdmin, setIsAdmin] = useState<boolean>(false);

    // Modals
    const [isAuthModalOpen, setAuthModalOpen] = useState(false);
    const [authModalView, setAuthModalView] = useState<'login' | 'signup'>('login');
    const [showOnboarding, setShowOnboarding] = useState(false);

    // Localization & Currency
    const [language, setLanguage] = useState<Language>('ar');
    const [strings, setStrings] = useState(arStrings);
    const [isTranslating, setIsTranslating] = useState(false);
    const [currency, setCurrency] = useState<Currency>('JOD');

    // Data State (initialized from local mock data as a fallback)
    const [users, setUsers] = useState<UserProfile[]>(initialData.users);
    const [staff, setStaff] = useState<StaffMember[]>(initialData.staff);
    const [payments, setPayments] = useState<Payment[]>(initialData.payments);
    const [teachers, setTeachers] = useState<Teacher[]>(initialData.teachers);
    const [courses, setCourses] = useState<Course[]>(initialData.courses);
    const [testimonials, setTestimonials] = useState<Testimonial[]>(initialData.testimonials);
    const [blogPosts, setBlogPosts] = useState<BlogPost[]>(initialData.blogPosts);
    const [heroSlides, setHeroSlides] = useState<HeroSlide[]>(initialData.heroSlides);
    const [siteContent, setSiteContent] = useState<SiteContent | null>(initialData.siteContent);
    const [onboardingOptions, setOnboardingOptions] = useState<OnboardingOptions | null>(initialData.onboardingOptions);

    // Loading & Error State
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    
    // === DATA FETCHING ON LOAD ===
    useEffect(() => {
        const loadData = async () => {
            if (!isGoogleSheetConfigured()) {
                console.warn("Google Sheets not configured. Running on local mock data.");
                setIsLoading(false);
                return;
            }

            try {
                const data = await fetchAllData();
                setUsers(data.users || []);
                setStaff(data.staff || []);
                setPayments(data.payments || []);
                setTeachers(data.teachers || []);
                setCourses(data.courses || []);
                setTestimonials(data.testimonials || []);
                setBlogPosts(data.blog || []);
                setHeroSlides(data.heroSlides || []);
                if (data.config.siteContent) setSiteContent(data.config.siteContent);
                if (data.config.onboardingOptions) setOnboardingOptions(data.config.onboardingOptions);
                setError(null);
            } catch (e) {
                console.error("Failed to load data from Google Sheets:", e);
                setError("Failed to load application data. Please check your connection or the Google Sheet configuration.");
            } finally {
                setIsLoading(false);
            }
        };

        loadData();
    }, []);


    // === PERSISTENCE WRAPPERS (Saves state locally AND to Google Sheets if configured) ===
    const handleSetUsers = (newUsers: React.SetStateAction<UserProfile[]>) => {
        const updatedUsers = typeof newUsers === 'function' ? newUsers(users) : newUsers;
        setUsers(updatedUsers);
        overwriteSheet('Users', updatedUsers).catch(e => console.error("Failed to save users:", e));
    };
    const handleSetStaff = (newStaff: React.SetStateAction<StaffMember[]>) => {
        const updatedStaff = typeof newStaff === 'function' ? newStaff(staff) : newStaff;
        setStaff(updatedStaff);
        overwriteSheet('Staff', updatedStaff).catch(e => console.error("Failed to save staff:", e));
    };
    const handleSetTeachers = (newTeachers: React.SetStateAction<Teacher[]>) => {
        const updatedTeachers = typeof newTeachers === 'function' ? newTeachers(teachers) : newTeachers;
        setTeachers(updatedTeachers);
        overwriteSheet('Teachers', updatedTeachers).catch(e => console.error("Failed to save teachers:", e));
    };
    const handleSetCourses = (newCourses: React.SetStateAction<Course[]>) => {
        const updatedCourses = typeof newCourses === 'function' ? newCourses(courses) : newCourses;
        setCourses(updatedCourses);
        overwriteSheet('Courses', updatedCourses).catch(e => console.error("Failed to save courses:", e));
    };
    const handleSetTestimonials = (newTestimonials: React.SetStateAction<Testimonial[]>) => {
        const updatedTestimonials = typeof newTestimonials === 'function' ? newTestimonials(testimonials) : newTestimonials;
        setTestimonials(updatedTestimonials);
        overwriteSheet('Testimonials', updatedTestimonials).catch(e => console.error("Failed to save testimonials:", e));
    };
     const handleSetBlogPosts = (newPosts: React.SetStateAction<BlogPost[]>) => {
        const updatedPosts = typeof newPosts === 'function' ? newPosts(blogPosts) : newPosts;
        setBlogPosts(updatedPosts);
        overwriteSheet('Blog', updatedPosts).catch(e => console.error("Failed to save blog posts:", e));
    };
    const handleSetHeroSlides = (newSlides: React.SetStateAction<HeroSlide[]>) => {
        const updatedSlides = typeof newSlides === 'function' ? newSlides(heroSlides) : newSlides;
        setHeroSlides(updatedSlides);
        overwriteSheet('HeroSlides', updatedSlides).catch(e => console.error("Failed to save hero slides:", e));
    };
    const handleSetConfig = (newContent?: SiteContent, newOptions?: OnboardingOptions) => {
        const finalContent = newContent || siteContent;
        const finalOptions = newOptions || onboardingOptions;
        if (finalContent) setSiteContent(finalContent);
        if (finalOptions) setOnboardingOptions(finalOptions);
        updateConfig({ siteContent: finalContent, onboardingOptions: finalOptions })
            .catch(e => console.error("Failed to save config:", e));
    };
     const handleSetSiteContent = (newContent: React.SetStateAction<SiteContent | null>) => {
        const updatedContent = typeof newContent === 'function' ? newContent(siteContent!) : newContent;
        if (updatedContent) {
          handleSetConfig(updatedContent, undefined);
        }
    };
    const handleSetOnboardingOptions = (newOptions: React.SetStateAction<OnboardingOptions | null>) => {
        const updatedOptions = typeof newOptions === 'function' ? newOptions(onboardingOptions!) : newOptions;
        if(updatedOptions) {
          handleSetConfig(undefined, updatedOptions);
        }
    };

    // === EFFECTS ===
    useEffect(() => {
        document.documentElement.lang = language;
        document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    }, [language]);

    // === NAVIGATION & AUTH HANDLERS ===
    const handleNavigate = (newPage: Page, id: number | null = null) => {
        setPage(newPage);
        setSelectedId(id);
        window.scrollTo(0, 0);
    };

    const handleLogin = (email: string, password: string): boolean => {
        const lowercasedEmail = email.toLowerCase();
        if (lowercasedEmail === 'admin@jotutor.com' && password === 'admin123') {
            setIsAdmin(true);
            setIsLoggedIn(true);
            setUserProfile(null);
            handleNavigate('admin-dashboard');
            setAuthModalOpen(false);
            return true;
        }

        const user = users.find(u => u.email.toLowerCase() === lowercasedEmail);
        if (user && user.password === password) {
            setUserProfile(user);
            setIsLoggedIn(true);
            setIsAdmin(false);
            handleNavigate('dashboard');
            setAuthModalOpen(false);
            return true;
        }
        return false;
    };

    const handleLogout = () => {
        setIsLoggedIn(false); setIsAdmin(false); setUserProfile(null); handleNavigate('home');
    };
    
    const handleSignupSuccess = (profile: UserProfile) => {
        const newUser: UserProfile = { ...profile, id: Date.now(), email: profile.email.toLowerCase() };
        
        handleSetUsers(prevUsers => [newUser, ...prevUsers]);
        
        appendRow('Users', newUser).then(response => {
            if (!response.success) {
                console.error("Failed to save new user to sheet:", response.error);
            }
        });
        
        setUserProfile(newUser);
        setIsLoggedIn(true);
        setShowOnboarding(false);
        handleNavigate('dashboard');
    };

    const handleLanguageChange = async () => {
        const targetLanguage = language === 'ar' ? 'en' : 'ar';
        if (targetLanguage === 'ar') {
            setLanguage('ar'); setStrings(arStrings); return;
        }
        setIsTranslating(true);
        try {
            const translatedStrings = await translateContent(arStrings, 'English');
            setStrings(translatedStrings);
            setLanguage('en');
        } catch (error) {
            console.error("Failed to translate content", error);
            setStrings(enStrings);
            setLanguage('en');
        } finally {
            setIsTranslating(false);
        }
    };

    // === RENDER LOGIC ===
    const renderContent = () => {
        if (isLoading) {
            return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-green-500"></div></div>;
        }

        if(error) {
            return (
                <div className="min-h-screen flex items-center justify-center text-center p-4">
                    <div>
                        <h2 className="text-2xl font-bold text-red-600 mb-4">Data loading failed:</h2>
                        <p className="text-gray-700">{error}</p>
                    </div>
                </div>
            )
        }

        if (showOnboarding) {
             return (
                 <div className="container mx-auto px-6 py-12 max-w-4xl">
                     <OnboardingWizard options={onboardingOptions!} onSignupSuccess={handleSignupSuccess} strings={strings}/>
                </div>
            );
        }
        
        const selectedTeacher = teachers.find(t => t.id === selectedId);
        const selectedCourse = courses.find(c => c.id === selectedId);
        const selectedPost = blogPosts.find(p => p.id === selectedId);

        switch (page) {
            case 'home': return (
                <>
                    <HeroSection onSignupClick={() => { setAuthModalView('signup'); setAuthModalOpen(true); }} heroSlides={heroSlides} strings={strings} />
                    <FeaturesSection strings={strings} />
                    <HowItWorks strings={strings} />
                    <TeacherSearch teachers={teachers} subjects={onboardingOptions!.subjects} onSelectTeacher={(id) => handleNavigate('teacher-profile', id)} isHomePageVersion={true} strings={strings} language={language} />
                    <CoursesPreview courses={courses} onSelectCourse={(id) => handleNavigate('course-profile', id)} onNavigate={handleNavigate} currency={currency} exchangeRate={JOD_TO_USD_RATE} strings={strings} />
                    <TestimonialsSection testimonials={testimonials} strings={strings} />
                    <AILessonPlanner strings={strings} language={language} />
                </>
            );
            case 'teachers': return <TeacherSearch teachers={teachers} subjects={onboardingOptions!.subjects} onSelectTeacher={(id) => handleNavigate('teacher-profile', id)} strings={strings} language={language}/>;
            case 'teacher-profile': return selectedTeacher ? <TeacherProfilePage teacher={selectedTeacher} strings={strings} language={language}/> : <p>Teacher not found.</p>;
            
            case 'courses': return <CoursesPage courses={courses} onSelectCourse={(id) => handleNavigate('course-profile', id)} currency={currency} exchangeRate={JOD_TO_USD_RATE} strings={strings} language={language}/>
            case 'course-profile': return selectedCourse ? <CourseProfilePage course={selectedCourse} onBook={(id) => handleNavigate('payment', id)} currency={currency} exchangeRate={JOD_TO_USD_RATE} strings={strings} language={language}/> : <p>Course not found.</p>;
            case 'payment': return selectedCourse ? <PaymentPage course={selectedCourse} currency={currency} exchangeRate={JOD_TO_USD_RATE} strings={strings} language={language}/> : <p>Course not found.</p>;

            case 'videos': return <VideosPage shorts={blogPosts.filter(p => p.type === 'short')} onSelectShort={(id) => handleNavigate('short-player', id)} strings={strings} language={language}/>;
            case 'short-player': return selectedPost ? <ShortPlayerPage post={selectedPost} onBack={() => handleNavigate('videos')} strings={strings} language={language}/> : <p>Video not found.</p>;
            
            case 'blog': return <BlogPage posts={blogPosts.filter(p=> p.type === 'article')} onSelectPost={(id) => handleNavigate('article', id)} strings={strings} language={language}/>;
            case 'article': return selectedPost ? <ArticlePage post={selectedPost} onBack={() => handleNavigate('blog')} strings={strings} language={language}/> : <p>Article not found.</p>;

            case 'about': return <AboutPage content={siteContent!.about} strings={strings} />;
            case 'contact': return <ContactPage content={siteContent!.contact} strings={strings} />;
            case 'join': return <JoinTeacherPage strings={strings} />;
            case 'faq': return <FAQPage faqs={siteContent!.faq} strings={strings} />;
            case 'privacy': return <PrivacyPolicyPage content={siteContent!.privacy} strings={strings} />;
            case 'terms': return <TermsPage content={siteContent!.terms} strings={strings} />;

            case 'dashboard': return userProfile ? <Dashboard userProfile={userProfile} onLogout={handleLogout} courses={courses} onSelectCourse={(id) => handleNavigate('course-profile', id)} currency={currency} exchangeRate={JOD_TO_USD_RATE} strings={strings} language={language} /> : <p>Please log in.</p>;
            
            case 'admin-dashboard': return isAdmin ? (
                <AdminDashboard 
                    onLogout={handleLogout}
                    content={siteContent!} setContent={handleSetSiteContent}
                    heroSlides={heroSlides} setHeroSlides={handleSetHeroSlides}
                    onboardingOptions={onboardingOptions!} setOnboardingOptions={handleSetOnboardingOptions}
                    users={users} setUsers={handleSetUsers}
                    staff={staff} setStaff={handleSetStaff}
                    payments={payments}
                    teachers={teachers} setTeachers={handleSetTeachers}
                    courses={courses} setCourses={handleSetCourses}
                    subjects={onboardingOptions!.subjects}
                    testimonials={testimonials} setTestimonials={handleSetTestimonials}
                    blogPosts={blogPosts} setBlogPosts={handleSetBlogPosts}
                />
            ) : <p>Access denied.</p>;

            default: return <h2>Page not found</h2>;
        }
    };

    return (
        <div className={language === 'ar' ? 'rtl' : 'ltr'}>
            {!isGoogleSheetConfigured() && (
                <div className="bg-yellow-400 text-yellow-900 p-3 text-center text-sm font-semibold flex items-center justify-center gap-2" role="alert">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M8.257 3.099c.636-1.1 2.252-1.1 2.888 0l6.217 10.768A1.75 1.75 0 0116.25 16.5H3.75a1.75 1.75 0 01-1.112-2.633L8.257 3.099zM10 6a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 6zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                    </svg>
                    <span>
                        <strong>وضع العرض فقط:</strong> لم يتم تكوين Google Sheets. لن يتم حفظ التغييرات. يرجى اتباع التعليمات في <code>SETUP_INSTRUCTIONS.md</code>.
                    </span>
                </div>
            )}
            <Header
                onNavigate={handleNavigate}
                onLoginClick={() => { setAuthModalView('login'); setAuthModalOpen(true); }}
                onSignupClick={() => { setAuthModalView('signup'); setAuthModalOpen(true); }}
                isLoggedIn={isLoggedIn}
                username={userProfile?.username}
                onLogout={handleLogout}
                currency={currency}
                onCurrencyChange={() => setCurrency(c => c === 'JOD' ? 'USD' : 'JOD')}
                language={language}
                onLanguageChange={handleLanguageChange}
                isTranslating={isTranslating}
                strings={strings}
            />

            <main>
                {renderContent()}
            </main>

             {!isLoading && (
                 <>
                    <Footer onNavigate={handleNavigate} strings={strings} />
                    <Chatbot courses={courses} onSelectCourse={(id) => handleNavigate('course-profile', id)} strings={strings} language={language}/>
                 </>
            )}
            
            {isAuthModalOpen && (
                <AuthModal 
                    initialView={authModalView}
                    onClose={() => setAuthModalOpen(false)}
                    onLogin={handleLogin}
                    onSwitchToOnboarding={() => {
                        setAuthModalOpen(false);
                        setShowOnboarding(true);
                    }}
                    strings={strings}
                />
            )}
        </div>
    );
};

export default App;
