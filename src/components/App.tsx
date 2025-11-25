
import React, { useState, useEffect, useCallback } from 'react';
import { arStrings, enStrings } from '../localization';
import { JOD_TO_USD_RATE } from '../constants';
// Fix: Imported DashboardView from types.ts to resolve module error.
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
// Fix: Removed DashboardView from this import as it's now imported from types.ts.
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

// Data and Services
import { initialData } from '../mockData';
import { translateContent, setGeminiApiKey } from '../services/geminiService';
// Fix: Use Firebase v8 compat imports and syntax to resolve module errors.
import { 
    fetchPublicData,
    fetchAdminData,
    overwriteCollection, 
    updateConfig, 
    setDocument,
    auth,
    db,
    onAuthStateChangedListener,
} from '../googleSheetService'; // This is now firebaseService.ts


const App: React.FC = () => {
    // === STATE MANAGEMENT ===
    const [page, setPage] = useState<Page>('home');
    const [selectedId, setSelectedId] = useState<string | null>(null);
    // Navigation History Stack
    const [navHistory, setNavHistory] = useState<{page: Page, id: string | null}[]>([]);

    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [isAdmin, setIsAdmin] = useState<boolean>(false);

    // Modals
    const [isAuthModalOpen, setAuthModalOpen] = useState(false);
    const [authModalView, setAuthModalView] = useState<'login' | 'signup'>('login');
    const [showOnboarding, setShowOnboarding] = useState(false);
    const [showWelcomeModal, setShowWelcomeModal] = useState(true); // Show Welcome Modal by default on load
    const [isChatOpen, setIsChatOpen] = useState(false); // Chatbot state managed here
    
    // Pending action state (for redirecting after login)
    const [pendingBookingId, setPendingBookingId] = useState<string | null>(null);

    // Localization & Currency
    const [language, setLanguage] = useState<Language>('ar');
    const [strings, setStrings] = useState(arStrings);
    const [isTranslating, setIsTranslating] = useState(false);
    const [currency, setCurrency] = useState<Currency>('JOD');

    // Data State (initialized with mock data, loaded from Firebase)
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

    // Loading & Error State
    const [isDataLoading, setIsDataLoading] = useState(true);
    const [isAuthLoading, setIsAuthLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    
    // State for one-time dashboard view redirect
    const [initialDashboardView, setInitialDashboardView] = useState<DashboardView | undefined>();

    // === DATA FETCHING ON MOUNT ===
    useEffect(() => {
        const loadPublicData = async () => {
            setIsDataLoading(true);
            try {
                // Create a timeout to prevent indefinite loading
                const timeoutPromise = new Promise((_, reject) => 
                    setTimeout(() => reject(new Error("Firebase request timed out")), 5000)
                );

                // Race the fetch against the timeout
                const response = await Promise.race([
                    fetchPublicData(),
                    timeoutPromise
                ]) as { success: boolean; data: any };

                if(response.success){
                    const data = response.data;
                    setTeachers(data.teachers || []);
                    setCourses(data.courses || []);
                    setTestimonials(data.testimonials || []);
                    setBlogPosts(data.blog || []);
                    setHeroSlides(data.heroSlides || []);
                    
                    // Merge fetched content with initialData to ensure new fields (like stats) appear
                    if (data.config?.siteContent) {
                        const fetchedContent = data.config.siteContent;
                        // Deep merge homepage content
                        const mergedHomepage = { 
                            ...initialData.siteContent.homepage, 
                            ...(fetchedContent.homepage || {}) 
                        };
                        const mergedContent = {
                            ...initialData.siteContent,
                            ...fetchedContent,
                            homepage: mergedHomepage
                        };
                        
                        // IMPORTANT: Set Gemini API Key if present in DB
                        if (mergedContent.geminiApiKey) {
                            setGeminiApiKey(mergedContent.geminiApiKey);
                        }

                        setSiteContent(mergedContent);
                    }

                    if (data.config?.onboardingOptions) setOnboardingOptions(data.config.onboardingOptions);
                    setError(null);
                } else {
                     throw new Error("Failed to fetch public data from Firebase");
                }
            } catch (e: any) {
                console.warn("Failed to load public data (Offline Mode):", e.message);
                // Initialize Gemini with mock data key if offline or error
                if (initialData.siteContent.geminiApiKey) {
                    setGeminiApiKey(initialData.siteContent.geminiApiKey);
                }

                // We don't set a heavy error message here to avoid scaring the user,
                // as the app will simply fall back to mock data (initialData).
                if (e.message.includes("timed out") || e.message.includes("offline")) {
                    setError("Could not connect to the server. Using offline mode.");
                } else {
                    setError("Failed to load live data. Displaying sample data.");
                }
            } finally {
                setIsDataLoading(false);
            }
        };

        loadPublicData();
    }, []);

    // === AUTHENTICATION STATE LISTENER ===
    useEffect(() => {
        let isMounted = true;
        
        // Safety timeout for Auth: If Firebase is blocked or offline, don't hang forever.
        const authTimer = setTimeout(() => {
            if (isMounted) {
                console.warn("Auth check timed out - defaulting to logged out state.");
                setIsAuthLoading(false);
            }
        }, 4000);

        const unsubscribe = onAuthStateChangedListener(async (user) => {
            if (!isMounted) return;
            clearTimeout(authTimer); // Auth responded, clear timeout

            if (user) {
                setIsLoggedIn(true);
                if (user.email === 'admin@jotutor.com') {
                    setIsAdmin(true);
                    setUserProfile(null);
                    
                    // Fetch admin-specific data
                    try {
                        const response = await fetchAdminData();
                        const data = response.data; 
                        setUsers(data.users || []);
                        setStaff(data.staff || []);
                        setPayments(data.payments || []);

                        if (!response.success && response.failedCollections && response.failedCollections.length > 0) {
                            console.warn(`Partial admin data load failure: ${response.failedCollections.join(', ')}`);
                        }
                    } catch (err) {
                        console.error("Admin data fetch failed", err);
                    }

                } else {
                    // Fix: Use Firebase v8 compat syntax to resolve module errors.
                    try {
                        const userDocRef = db.collection('users').doc(user.uid);
                        const userDocSnap = await userDocRef.get();
                        if (userDocSnap.exists) {
                            setUserProfile({ ...userDocSnap.data(), id: user.uid } as UserProfile);
                        }
                    } catch (err) {
                        console.error("Failed to fetch user profile", err);
                    }
                    setIsAdmin(false);
                }
            } else {
                setIsLoggedIn(false);
                setIsAdmin(false);
                setUserProfile(null);
            }
            setIsAuthLoading(false);
        });

        return () => {
            isMounted = false;
            clearTimeout(authTimer);
            unsubscribe();
        };
    }, []);
    

    // === PERSISTENCE WRAPPERS (Saves state to Firestore) ===
    const handleSetUsers = (newUsers: React.SetStateAction<UserProfile[]>) => {
        const updatedUsers = typeof newUsers === 'function' ? newUsers(users) : newUsers;
        setUsers(updatedUsers);
        overwriteCollection('Users', updatedUsers).catch(e => console.error("Failed to save users:", e));
    };
    const handleSetStaff = (newStaff: React.SetStateAction<StaffMember[]>) => {
        const updatedStaff = typeof newStaff === 'function' ? newStaff(staff) : newStaff;
        setStaff(updatedStaff);
        overwriteCollection('Staff', updatedStaff).catch(e => console.error("Failed to save staff:", e));
    };
    const handleSetTeachers = (newTeachers: React.SetStateAction<Teacher[]>) => {
        const updatedTeachers = typeof newTeachers === 'function' ? newTeachers(teachers) : newTeachers;
        setTeachers(updatedTeachers);
        overwriteCollection('Teachers', updatedTeachers).catch(e => console.error("Failed to save teachers:", e));
    };
    const handleSetCourses = (newCourses: React.SetStateAction<Course[]>) => {
        const updatedCourses = typeof newCourses === 'function' ? newCourses(courses) : newCourses;
        setCourses(updatedCourses);
        overwriteCollection('Courses', updatedCourses).catch(e => console.error("Failed to save courses:", e));
    };
    const handleSetTestimonials = (newTestimonials: React.SetStateAction<Testimonial[]>) => {
        const updatedTestimonials = typeof newTestimonials === 'function' ? newTestimonials(testimonials) : newTestimonials;
        setTestimonials(updatedTestimonials);
        overwriteCollection('Testimonials', updatedTestimonials).catch(e => console.error("Failed to save testimonials:", e));
    };
     const handleSetBlogPosts = (newPosts: React.SetStateAction<BlogPost[]>) => {
        const updatedPosts = typeof newPosts === 'function' ? newPosts(blogPosts) : newPosts;
        setBlogPosts(updatedPosts);
        overwriteCollection('Blog', updatedPosts).catch(e => console.error("Failed to save blog posts:", e));
    };
    const handleSetHeroSlides = (newSlides: React.SetStateAction<HeroSlide[]>) => {
        const updatedSlides = typeof newSlides === 'function' ? newSlides(heroSlides) : newSlides;
        setHeroSlides(updatedSlides);
        overwriteCollection('HeroSlides', updatedSlides).catch(e => console.error("Failed to save hero slides:", e));
    };
    const handleSetConfig = (newContent?: SiteContent, newOptions?: OnboardingOptions) => {
        const finalContent = newContent || siteContent;
        const finalOptions = newOptions || onboardingOptions;
        if (finalContent) setSiteContent(finalContent);
        if (finalOptions) setOnboardingOptions(finalOptions);
        
        // If the content includes a new API key, update the service immediately
        if (finalContent && finalContent.geminiApiKey) {
            setGeminiApiKey(finalContent.geminiApiKey);
        }

        updateConfig({ siteContent: finalContent, onboardingOptions: finalOptions })
            .catch(e => console.error("Failed to save config:", e));
    };
     const handleSetSiteContent = (newContent: React.SetStateAction<SiteContent>) => {
        const updatedContent = typeof newContent === 'function' ? newContent(siteContent!) : newContent;
        if (updatedContent) {
          handleSetConfig(updatedContent, undefined);
        }
    };
    const handleSetOnboardingOptions = (newOptions: React.SetStateAction<OnboardingOptions>) => {
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
    const handleNavigate = (newPage: Page, id: string | null = null) => {
        // Prevent duplicate entries if clicking the same link
        if (page === newPage && selectedId === id) return;

        setNavHistory(prev => [...prev, { page, id: selectedId }]);
        setPage(newPage);
        setSelectedId(id);
        window.scrollTo(0, 0);
    };

    const handleBack = () => {
        if (navHistory.length === 0) return;
        const prevState = navHistory[navHistory.length - 1];
        
        setNavHistory(prev => prev.slice(0, -1));
        setPage(prevState.page);
        setSelectedId(prevState.id);
        window.scrollTo(0, 0);
    };

    const handleBookCourse = (courseId: string) => {
        if (isLoggedIn) {
            handleNavigate('payment', courseId);
        } else {
            setPendingBookingId(courseId);
            setAuthModalView('login');
            setAuthModalOpen(true);
        }
    };

    const handleLogin = async (email: string, password: string): Promise<boolean> => {
        try {
            // Fix: Use Firebase v8 compat syntax to resolve module errors.
            await auth.signInWithEmailAndPassword(email, password);
            setAuthModalOpen(false);
            if (email.toLowerCase() === 'admin@jotutor.com') {
                handleNavigate('admin-dashboard');
            } else {
                // Redirect to pending booking if exists, otherwise dashboard
                if (pendingBookingId) {
                    handleNavigate('payment', pendingBookingId);
                    setPendingBookingId(null);
                } else {
                    handleNavigate('dashboard');
                }
            }
            return true;
        } catch (error) {
            console.error("Login failed:", error);
            return false;
        }
    };

    const handleLogout = () => {
        // Fix: Use Firebase v8 compat syntax to resolve module errors.
        auth.signOut();
        handleNavigate('home');
    };
    
    const handleSignupSuccess = async (profile: UserProfile): Promise<string | null> => {
        if (!profile.email || !profile.password) {
            console.error("Email or password missing for signup.");
            return "Email or password missing for signup.";
        }
    
        try {
            // Fix: Use Firebase v8 compat syntax to resolve module errors.
            const { user } = await auth.createUserWithEmailAndPassword(profile.email, profile.password);
            
            const { password, ...profileData } = profile;
            const finalProfile = { ...profileData, id: user!.uid, enrolledCourses: [] };
    
            await setDocument('Users', user!.uid, finalProfile);
            
            // The onAuthStateChanged listener will handle setting the user profile and login state.
            setShowOnboarding(false);
            
            if (pendingBookingId) {
                handleNavigate('payment', pendingBookingId);
                setPendingBookingId(null);
            } else {
                setInitialDashboardView('courses'); // Set the initial view for the dashboard
                handleNavigate('dashboard');
            }
            
            return null; // Return null on success
        } catch (error: any) {
            console.error("Error during signup process:", error);
            if (error.code === 'auth/email-already-in-use') {
                return strings.errorEmailInUse;
            }
            return strings.errorSignupGeneric;
        }
    };

    const handleEnrollInCourse = async (course: Course) => {
        if (!userProfile) {
            alert("Please log in to enroll in a course.");
            setAuthModalOpen(true);
            return;
        }

        try {
            // 1. Update user profile with new course
            const currentEnrolled = userProfile.enrolledCourses || [];
            if (currentEnrolled.includes(course.id)) {
                alert("You are already enrolled in this course.");
                handleNavigate('dashboard');
                return;
            }
            const updatedProfile: UserProfile = {
                ...userProfile,
                enrolledCourses: [...currentEnrolled, course.id]
            };
            await setDocument('Users', userProfile.id, updatedProfile);
            setUserProfile(updatedProfile); // Update local state immediately

            // 2. Create a payment record for admin tracking
            // Determine price based on current currency selection. SAFE FALLBACK.
            let paymentAmount = 0;
            if (currency === 'USD') {
                paymentAmount = course.priceUsd || 0;
            } else if (currency === 'SAR') {
                paymentAmount = course.priceSar || 0;
            } else {
                paymentAmount = course.priceJod || 0;
            }

            const newPayment: Payment = {
                id: `${userProfile.id}-${course.id}-${Date.now()}`,
                date: new Date().toISOString(),
                userId: userProfile.id,
                userName: userProfile.username,
                courseId: course.id,
                courseName: course.title,
                amount: paymentAmount,
                currency: currency,
                status: 'Success'
            };
            await setDocument('Payments', newPayment.id, newPayment);

            // 3. Provide feedback and navigate
            alert(`${strings.paymentSuccess} You have enrolled in ${course.title}.`);
            handleNavigate('dashboard');

        } catch (error) {
            console.error("Error enrolling in course:", error);
            alert("There was an error enrolling you in the course. Please try again.");
        }
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

    const handleCurrencyChange = () => {
        setCurrency(prev => {
            if (prev === 'JOD') return 'USD';
            if (prev === 'USD') return 'SAR';
            return 'JOD';
        });
    };

    // Welcome Modal handlers
    const handleStartChatFromModal = () => {
        setShowWelcomeModal(false);
        setIsChatOpen(true);
    };

    // === RENDER LOGIC ===
    const renderContent = () => {
        if (isDataLoading || isAuthLoading) {
            return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-green-500"></div></div>;
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
                    <HeroSection 
                        onSignupClick={() => { setAuthModalView('signup'); setAuthModalOpen(true); }} 
                        heroSlides={heroSlides} 
                        content={siteContent.homepage}
                        strings={strings} 
                    />
                    <FeaturesSection content={siteContent.homepage} strings={strings} />
                    <HowItWorks content={siteContent.homepage} strings={strings} />
                    <TeacherSearch content={siteContent.homepage} teachers={teachers} subjects={onboardingOptions?.subjects || []} onSelectTeacher={(id) => handleNavigate('teacher-profile', id)} isHomePageVersion={true} strings={strings} language={language} />
                    <CoursesPreview content={siteContent.homepage} courses={courses} onSelectCourse={(id) => handleNavigate('course-profile', id)} onNavigate={handleNavigate} currency={currency} exchangeRate={JOD_TO_USD_RATE} strings={strings} />
                    <TestimonialsSection content={siteContent.homepage} testimonials={testimonials} strings={strings} />
                    <AILessonPlanner content={siteContent.homepage} strings={strings} language={language} />
                </>
            );
            case 'teachers': return <TeacherSearch content={siteContent.homepage} teachers={teachers} subjects={onboardingOptions?.subjects || []} onSelectTeacher={(id) => handleNavigate('teacher-profile', id)} strings={strings} language={language}/>;
            case 'teacher-profile': return selectedTeacher ? <TeacherProfilePage teacher={selectedTeacher} strings={strings} language={language}/> : <p>Teacher not found.</p>;
            
            case 'courses': return <CoursesPage courses={courses} onSelectCourse={(id) => handleNavigate('course-profile', id)} currency={currency} exchangeRate={JOD_TO_USD_RATE} strings={strings} language={language}/>
            case 'course-profile': return selectedCourse ? <CourseProfilePage course={selectedCourse} onBook={handleBookCourse} currency={currency} exchangeRate={JOD_TO_USD_RATE} strings={strings} language={language}/> : <p>Course not found.</p>;
            case 'payment': return selectedCourse ? <PaymentPage course={selectedCourse} onEnroll={handleEnrollInCourse} currency={currency} exchangeRate={JOD_TO_USD_RATE} strings={strings} language={language}/> : <p>Course not found.</p>;

            case 'videos': return <VideosPage shorts={blogPosts.filter(p => p.type === 'short')} onSelectShort={(id) => handleNavigate('short-player', id)} strings={strings} language={language}/>;
            case 'short-player': return selectedPost ? <ShortPlayerPage post={selectedPost} onBack={() => handleNavigate('videos')} strings={strings} language={language}/> : <p>Video not found.</p>;
            
            case 'blog': return <BlogPage posts={blogPosts.filter(p=> p.type === 'article')} onSelectPost={(id) => handleNavigate('article', id)} strings={strings} language={language}/>;
            case 'article': return selectedPost ? <ArticlePage post={selectedPost} onBack={() => handleNavigate('blog')} strings={strings} language={language}/> : <p>Article not found.</p>;

            case 'about': return siteContent ? <AboutPage content={siteContent.about} strings={strings} /> : null;
            case 'contact': return siteContent ? <ContactPage content={siteContent.contact} strings={strings} /> : null;
            case 'faq': return siteContent ? <FAQPage faqs={siteContent.faq} strings={strings} /> : null;
            case 'privacy': return siteContent ? <PrivacyPolicyPage content={siteContent.privacy} strings={strings} /> : null;
            case 'terms': return siteContent ? <TermsPage content={siteContent.terms} strings={strings} /> : null;

            case 'dashboard': return userProfile ? (
                <Dashboard 
                    userProfile={userProfile} 
                    onLogout={handleLogout} 
                    courses={courses} 
                    onSelectCourse={(id) => handleNavigate('course-profile', id)} 
                    currency={currency} 
                    exchangeRate={JOD_TO_USD_RATE} 
                    strings={strings} 
                    language={language}
                    initialView={initialDashboardView}
                    onViewHandled={() => setInitialDashboardView(undefined)}
                />
            ) : <p>Please log in.</p>;
            
            case 'admin-dashboard': return isAdmin ? (
                <AdminDashboard 
                    onLogout={handleLogout}
                    content={siteContent} setContent={handleSetSiteContent}
                    heroSlides={heroSlides} setHeroSlides={handleSetHeroSlides}
                    onboardingOptions={onboardingOptions} setOnboardingOptions={handleSetOnboardingOptions}
                    users={users} setUsers={handleSetUsers}
                    staff={staff} setStaff={handleSetStaff}
                    payments={payments}
                    teachers={teachers} setTeachers={handleSetTeachers}
                    courses={courses} setCourses={handleSetCourses}
                    subjects={(onboardingOptions).subjects || []}
                    testimonials={testimonials} setTestimonials={handleSetTestimonials}
                    blogPosts={blogPosts} setBlogPosts={handleSetBlogPosts}
                />
            ) : <p>Access denied.</p>;

            default: return <h2>Page not found</h2>;
        }
    };

    return (
        <div className={language === 'ar' ? 'rtl' : 'ltr'}>
            {/* Welcome Modal - Only shown if state is true AND user is not logged in/navigating somewhere else ideally, but logic says "on opening" */}
            {showWelcomeModal && (
                <WelcomeModal 
                    onStartChat={handleStartChatFromModal}
                    onClose={() => setShowWelcomeModal(false)}
                />
            )}

            <Header
                onNavigate={handleNavigate}
                onLoginClick={() => { setAuthModalView('login'); setAuthModalOpen(true); }}
                onSignupClick={() => { setAuthModalView('signup'); setAuthModalOpen(true); }}
                isLoggedIn={isLoggedIn}
                isAdmin={isAdmin}
                username={isAdmin ? 'Admin' : userProfile?.username}
                onLogout={handleLogout}
                currency={currency}
                onCurrencyChange={handleCurrencyChange}
                language={language}
                onLanguageChange={handleLanguageChange}
                isTranslating={isTranslating}
                onBack={handleBack}
                canGoBack={navHistory.length > 0}
                strings={strings}
            />
            
            {error && (
                 <div className="bg-yellow-50 border-l-4 border-yellow-400 text-yellow-700 p-4 container mx-auto my-4 rounded-md text-sm" role="alert">
                    <p className="font-bold">Notice</p>
                    <p>{error}</p>
                </div>
            )}

            <main>
                {renderContent()}
            </main>

             {!(isDataLoading || isAuthLoading) && (
                 <>
                    <Footer onNavigate={handleNavigate} strings={strings} />
                    <Chatbot 
                        courses={courses} 
                        onSelectCourse={(id) => handleNavigate('course-profile', id)} 
                        strings={strings} 
                        language={language}
                        isOpen={isChatOpen}
                        setIsOpen={setIsChatOpen}
                    />
                    {/* Start Now Floating Button - Moved to Left Side */}
                    <button
                        onClick={() => handleNavigate('courses')}
                        className="fixed bottom-32 left-6 z-40 w-16 h-16 bg-blue-900 text-white rounded-full shadow-lg hover:bg-blue-800 transition-transform transform hover:scale-105 flex flex-col items-center justify-center border-2 border-white font-bold text-xs leading-tight"
                        style={{ left: '24px', right: 'auto' }}
                    >
                        <span>{language === 'ar' ? 'ابدأ' : 'Start'}</span>
                        <span>{language === 'ar' ? 'الآن' : 'Now'}</span>
                    </button>
                 </>
            )}
            
            {isAuthModalOpen && (
                <AuthModal 
                    initialView={authModalView}
                    onClose={() => {
                        setAuthModalOpen(false);
                        setPendingBookingId(null); // Clear pending booking if closed without login
                    }}
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
