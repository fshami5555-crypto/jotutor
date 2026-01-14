
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { arStrings, enStrings } from '../localization';
import { JOD_TO_USD_RATE } from '../constants';
import { 
    Page, Currency, Language, SiteContent, HeroSlide, Teacher, Testimonial, Course, BlogPost, 
    OnboardingOptions, UserProfile, Payment, StaffMember, DashboardView 
} from '../types';

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
        if (language === 'ar') {
            return courses.filter(c => c.title && c.title.trim() !== '');
        }
        return courses
            .filter(c => c.title_en && c.title_en.trim() !== '')
            .map(course => ({
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
        if (language === 'ar') {
            return teachers.filter(t => t.name && t.name.trim() !== '');
        }
        return teachers
            .filter(t => t.name_en && t.name_en.trim() !== '')
            .map(t => ({
                ...t,
                name: t.name_en!,
                level: t.level_en || t.level,
                bio: t.bio_en || t.bio,
                specialties: t.specialties_en && t.specialties_en.length > 0 ? t.specialties_en : t.specialties,
                qualifications: t.qualifications_en && t.qualifications_en.length > 0 ? t.qualifications_en : t.qualifications,
            }));
    }, [teachers, language]);

    const displayedTestimonials = useMemo(() => {
        if (language === 'ar') {
            return testimonials.filter(t => t.name && t.name.trim() !== '');
        }
        return testimonials
            .filter(t => t.name_en && t.name_en.trim() !== '')
            .map(t => ({
                ...t,
                name: t.name_en!,
                role: t.role_en || t.role,
                quote: t.quote_en || t.quote
            }));
    }, [testimonials, language]);

    const displayedBlogPosts = useMemo(() => {
        if (language === 'ar') {
            return blogPosts.filter(p => p.title && p.title.trim() !== '');
        }
        return blogPosts
            .filter(p => p.title_en && p.title_en.trim() !== '')
            .map(p => ({
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

    const currentSiteContent = siteContent;

    useEffect(() => {
        const loadPublicData = async () => {
            setIsDataLoading(true);
            try {
                const timeoutPromise = new Promise((_, reject) => 
                    setTimeout(() => reject(new Error("Firebase request timed out")), 5000)
                );
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
                    if (data.config) {
                        if (data.config.siteContent) {
                            const fetchedContent = data.config.siteContent;
                            const mergedHomepage = { 
                                ...initialData.siteContent.homepage, 
                                ...(fetchedContent.homepage || {}) 
                            };
                            const mergedContent = {
                                ...initialData.siteContent,
                                ...fetchedContent,
                                homepage: mergedHomepage
                            };
                            if (mergedContent.geminiApiKey) {
                                setGeminiApiKey(mergedContent.geminiApiKey);
                            }
                            setSiteContent(mergedContent);
                        }
                    }
                    if (data.config?.onboardingOptions) setOnboardingOptions(data.config.onboardingOptions);
                    setError(null);
                } else {
                     throw new Error("Failed to fetch public data from Firebase");
                }
            } catch (e: any) {
                console.warn("Failed to load public data (Offline Mode):", e.message);
                if (initialData.siteContent.geminiApiKey) {
                    setGeminiApiKey(initialData.siteContent.geminiApiKey);
                }
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

    useEffect(() => {
        let isMounted = true;
        let paymentUnsubscribe: () => void = () => {};
        const authTimer = setTimeout(() => {
            if (isMounted) {
                setIsAuthLoading(false);
            }
        }, 4000);

        const unsubscribe = onAuthStateChangedListener(async (user) => {
            if (!isMounted) return;
            clearTimeout(authTimer);
            if (user) {
                setIsLoggedIn(true);
                const email = user.email ? user.email.toLowerCase() : '';
                const adminEmails = ['admin@jotutor.com', 'eng@jotutor.com'];
                if (adminEmails.includes(email)) {
                    setIsAdmin(true);
                    setUserProfile(null);
                    if (email === 'admin@jotutor.com') {
                        setIsSuperAdmin(true);
                        setIsEnglishAdmin(false);
                        setLanguage('ar');
                        setStrings(arStrings);
                    } else if (email === 'eng@jotutor.com') {
                        setIsSuperAdmin(false);
                        setIsEnglishAdmin(true);
                        setLanguage('en');
                        setStrings(enStrings);
                    }
                    try {
                        const response = await fetchAdminData();
                        const data = response.data; 
                        setUsers(data.users || []);
                        setStaff(data.staff || []);
                        if (data.payments) setPayments(data.payments);
                        paymentUnsubscribe = subscribeToPayments((updatedPayments) => {
                            if (isMounted) setPayments(updatedPayments);
                        });
                    } catch (err) {
                        console.error("Admin data fetch failed", err);
                    }
                } else {
                    setIsAdmin(false);
                    setIsEnglishAdmin(false);
                    setIsSuperAdmin(false);
                    try {
                        if (db) {
                            const userDocRef = db.collection('users').doc(user.uid);
                            const userDocSnap = await userDocRef.get();
                            if (userDocSnap.exists) {
                                setUserProfile({ ...userDocSnap.data(), id: user.uid } as UserProfile);
                            }
                        }
                    } catch (err) {
                        console.error("Failed to fetch user profile", err);
                    }
                }
            } else {
                setIsLoggedIn(false);
                setIsAdmin(false);
                setIsEnglishAdmin(false);
                setIsSuperAdmin(false);
                setUserProfile(null);
                paymentUnsubscribe();
            }
            setIsAuthLoading(false);
        });

        return () => {
            isMounted = false;
            clearTimeout(authTimer);
            unsubscribe();
            paymentUnsubscribe();
        };
    }, []);

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
    const handleSetPayments = (newPayments: React.SetStateAction<Payment[]>) => {
        const updatedPayments = typeof newPayments === 'function' ? newPayments(payments) : newPayments;
        setPayments(updatedPayments);
        overwriteCollection('Payments', updatedPayments).catch(e => console.error("Failed to save payments:", e));
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
        if (finalContent && finalContent.geminiApiKey) {
            setGeminiApiKey(finalContent.geminiApiKey);
        }
        updateConfig({ 
            siteContent: finalContent, 
            onboardingOptions: finalOptions 
        }).catch(e => console.error("Failed to save config:", e));
    };
    const handleSetSiteContent = (newContent: React.SetStateAction<SiteContent>) => {
         const updatedContent = typeof newContent === 'function' ? newContent(siteContent) : newContent;
         handleSetConfig(updatedContent, undefined);
    };
    const handleSetOnboardingOptions = (newOptions: React.SetStateAction<OnboardingOptions>) => {
        const updatedOptions = typeof newOptions === 'function' ? newOptions(onboardingOptions!) : newOptions;
        if(updatedOptions) {
          handleSetConfig(undefined, updatedOptions);
        }
    };

    const handleNavigate = (newPage: Page, id: string | null = null) => {
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
        if (!auth) return false;
        try {
            await auth.signInWithEmailAndPassword(email, password);
            setAuthModalOpen(false);
            const lowerEmail = email.toLowerCase();
            if (lowerEmail === 'admin@jotutor.com' || lowerEmail === 'eng@jotutor.com') {
                handleNavigate('admin-dashboard');
            } else {
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
        if (auth) auth.signOut();
        handleNavigate('home');
    };

    /**
     * تحديث الملف الشخصي للمستخدم
     */
    const handleUpdateUserProfile = async (updatedProfile: UserProfile) => {
        try {
            await setDocument('Users', updatedProfile.id, updatedProfile);
            setUserProfile(updatedProfile);
            return true;
        } catch (error) {
            console.error("Failed to update profile:", error);
            return false;
        }
    };
    
    const handleToggleEnglishAdminMode = () => {
        if (!isSuperAdmin) return;
        const newMode = !isEnglishAdmin;
        setIsEnglishAdmin(newMode);
        if (newMode) {
            setLanguage('en');
            setStrings(enStrings);
        } else {
            setLanguage('ar');
            setStrings(arStrings);
        }
    };
    
    const handleSignupSuccess = async (profile: UserProfile): Promise<string | null> => {
        if (!auth) return "Auth service unavailable.";
        try {
            const { user } = await auth.createUserWithEmailAndPassword(profile.email, profile.password!);
            const { password, ...profileData } = profile;
            const finalProfile = { ...profileData, id: user!.uid, enrolledCourses: [] };
            await setDocument('Users', user!.uid, finalProfile);
            setShowOnboarding(false);
            if (pendingBookingId) {
                handleNavigate('payment', pendingBookingId);
                setPendingBookingId(null);
            } else {
                setInitialDashboardView('courses');
                handleNavigate('dashboard');
            }
            return null;
        } catch (error: any) {
            if (error.code === 'auth/email-already-in-use') return strings.errorEmailInUse;
            return strings.errorSignupGeneric;
        }
    };

    const handleEnrollInCourse = async (
        course: Course, 
        status: 'Success' | 'Pending' = 'Success', 
        details?: { orderId?: string; transactionId?: string; paymentMethod: 'Credit Card' | 'CliQ' }
    ) => {
        if (!userProfile) {
            setAuthModalOpen(true);
            return;
        }
        try {
            const currentEnrolled = userProfile.enrolledCourses || [];
            if (currentEnrolled.includes(course.id)) {
                handleNavigate('dashboard');
                return;
            }
            if (status === 'Success') {
                const updatedProfile: UserProfile = { ...userProfile, enrolledCourses: [...currentEnrolled, course.id] };
                await setDocument('Users', userProfile.id, updatedProfile);
                setUserProfile(updatedProfile);
            }

            let paymentAmount = 0;
            if (currency === 'USD') paymentAmount = course.priceUsd ?? (course.price ? course.price * 1.41 : 0);
            else if (currency === 'SAR') paymentAmount = course.priceSar ?? (course.price ? course.price * 5.3 : 0);
            else paymentAmount = course.priceJod ?? course.price ?? 0;

            const newPayment: Payment = {
                id: details?.orderId || `${userProfile.id}-${course.id}-${Date.now()}`,
                date: new Date().toISOString(),
                userId: userProfile.id,
                userName: userProfile.username,
                courseId: course.id,
                courseName: course.title,
                amount: paymentAmount,
                currency: currency,
                status: status,
                paymentMethod: details?.paymentMethod,
                gatewayOrderId: details?.orderId,
                transactionId: details?.transactionId,
            };
            await setDocument('Payments', newPayment.id, newPayment);
            if (!isAdmin) setPayments(prev => [...prev, newPayment]);
            if (status === 'Success') handleNavigate('dashboard');
        } catch (error) {
            console.error("Enrollment error:", error);
        }
    };

    const handleActivateCourse = async (paymentId: string) => {
        const paymentToActivate = payments.find(p => p.id === paymentId);
        if (!paymentToActivate) return;
        let targetUser = users.find(u => u.id === paymentToActivate.userId);
        if (!targetUser && db) {
            try {
                const userDoc = await db.collection('users').doc(paymentToActivate.userId).get();
                if (userDoc.exists) targetUser = { ...userDoc.data(), id: userDoc.id } as UserProfile;
            } catch (e) {}
        }
        if (!targetUser) return;
        try {
            await setDocument('Payments', paymentId, { ...paymentToActivate, status: 'Success' });
            const currentEnrolled = targetUser.enrolledCourses || [];
            if (!currentEnrolled.includes(paymentToActivate.courseId)) {
                const updatedUser = { ...targetUser, enrolledCourses: [...currentEnrolled, paymentToActivate.courseId] };
                await setDocument('Users', targetUser.id, updatedUser);
                setUsers(prev => prev.map(u => u.id === targetUser!.id ? updatedUser : u));
            }
        } catch (error) {}
    };

    const performLanguageChange = async () => {
        setShowLangConfirm(false);
        if (language === 'en') {
            setLanguage('ar'); setStrings(arStrings);
        } else {
            setLanguage('en'); setStrings(enStrings);
        }
    };

    const handleCurrencyChange = () => {
        setCurrency(prev => {
            if (prev === 'JOD') return 'USD';
            if (prev === 'USD') return 'SAR';
            return 'JOD';
        });
    };

    const renderContent = () => {
        if (isDataLoading || isAuthLoading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-green-500"></div></div>;
        if (showOnboarding) return <div className="container mx-auto px-6 py-12 max-w-4xl"><OnboardingWizard options={currentOnboardingOptions} onSignupSuccess={handleSignupSuccess} onClose={() => setShowOnboarding(false)} strings={strings} language={language} /></div>;
        
        const selectedTeacher = displayedTeachers.find(t => t.id === selectedId);
        const selectedCourse = displayedCourses.find(c => c.id === selectedId);
        const selectedPost = displayedBlogPosts.find(p => p.id === selectedId);

        switch (page) {
            case 'home': return <><HeroSection onSignupClick={() => { setAuthModalView('signup'); setAuthModalOpen(true); }} heroSlides={heroSlides} content={currentSiteContent.homepage} strings={strings} /><FeaturesSection content={currentSiteContent.homepage} strings={strings} /><HowItWorks content={currentSiteContent.homepage} strings={strings} /><TeacherSearch content={currentSiteContent.homepage} teachers={displayedTeachers} subjects={currentOnboardingOptions?.subjects || []} onSelectTeacher={(id) => handleNavigate('teacher-profile', id)} isHomePageVersion={true} strings={strings} language={language} /><CoursesPreview content={currentSiteContent.homepage} courses={displayedCourses} onSelectCourse={(id) => handleNavigate('course-profile', id)} onNavigate={handleNavigate} currency={currency} exchangeRate={JOD_TO_USD_RATE} strings={strings} /><TestimonialsSection content={currentSiteContent.homepage} testimonials={displayedTestimonials} strings={strings} /><AILessonPlanner content={currentSiteContent.homepage} strings={strings} language={language} /></>;
            case 'teachers': return <TeacherSearch content={currentSiteContent.homepage} teachers={displayedTeachers} subjects={currentOnboardingOptions?.subjects || []} onSelectTeacher={(id) => handleNavigate('teacher-profile', id)} strings={strings} language={language}/>;
            case 'teacher-profile': return selectedTeacher ? <TeacherProfilePage teacher={selectedTeacher} strings={strings} language={language}/> : <p>Teacher not found.</p>;
            case 'courses': return <CoursesPage courses={displayedCourses} onSelectCourse={(id) => handleNavigate('course-profile', id)} currency={currency} exchangeRate={JOD_TO_USD_RATE} strings={strings} language={language}/>;
            case 'course-profile': return selectedCourse ? <CourseProfilePage course={selectedCourse} onBook={handleBookCourse} currency={currency} exchangeRate={JOD_TO_USD_RATE} strings={strings} language={language}/> : <p>Course not found.</p>;
            case 'payment': return selectedCourse ? <PaymentPage course={selectedCourse} onEnroll={handleEnrollInCourse} currency={currency} exchangeRate={JOD_TO_USD_RATE} strings={strings} language={language}/> : <p>Course not found.</p>;
            case 'videos': return <VideosPage shorts={displayedBlogPosts.filter(p => p.type === 'short')} onSelectShort={(id) => handleNavigate('short-player', id)} strings={strings} language={language}/>;
            case 'short-player': return selectedPost ? <ShortPlayerPage post={selectedPost} onBack={() => handleNavigate('videos')} strings={strings} language={language}/> : <p>Video not found.</p>;
            case 'blog': return <BlogPage posts={displayedBlogPosts.filter(p=> p.type === 'article')} onSelectPost={(id) => handleNavigate('article', id)} strings={strings} language={language}/>;
            case 'article': return selectedPost ? <ArticlePage post={selectedPost} onBack={() => handleNavigate('blog')} strings={strings} language={language}/> : <p>Article not found.</p>;
            case 'about': return <AboutPage content={currentSiteContent.about} strings={strings} />;
            case 'contact': return <ContactPage content={currentSiteContent.contact} strings={strings} />;
            case 'faq': return <FAQPage faqs={currentSiteContent.faq} strings={strings} />;
            case 'privacy': return <PrivacyPolicyPage content={currentSiteContent.privacy} strings={strings} />;
            case 'terms': return <TermsPage content={currentSiteContent.terms} strings={strings} />;
            case 'payment-refund': return <PaymentRefundPage content={currentSiteContent.paymentRefundPolicy || ''} strings={strings} />;
            case 'dashboard': return userProfile ? <Dashboard userProfile={userProfile} onLogout={handleLogout} onUpdateProfile={handleUpdateUserProfile} courses={displayedCourses} onSelectCourse={(id) => handleNavigate('course-profile', id)} currency={currency} exchangeRate={JOD_TO_USD_RATE} strings={strings} language={language} initialView={initialDashboardView} onViewHandled={() => setInitialDashboardView(undefined)}/> : <p>Please log in.</p>;
            case 'admin-dashboard': return isAdmin ? <AdminDashboard onLogout={handleLogout} content={currentSiteContent} setContent={handleSetSiteContent} heroSlides={heroSlides} setHeroSlides={handleSetHeroSlides} onboardingOptions={onboardingOptions} setOnboardingOptions={handleSetOnboardingOptions} users={users} setUsers={handleSetUsers} staff={staff} setStaff={handleSetStaff} payments={payments} setPayments={handleSetPayments} teachers={teachers} setTeachers={handleSetTeachers} courses={courses} setCourses={handleSetCourses} subjects={onboardingOptions?.subjects || []} testimonials={testimonials} setTestimonials={handleSetTestimonials} blogPosts={blogPosts} setBlogPosts={handleSetBlogPosts} onActivateCourse={handleActivateCourse} strings={strings} language={language} isEnglishAdmin={isEnglishAdmin} isSuperAdmin={isSuperAdmin} onToggleEnglishMode={handleToggleEnglishAdminMode}/> : <p>Access denied.</p>;
            default: return <h2>Page not found</h2>;
        }
    };

    return (
        <div className={language === 'ar' ? 'rtl' : 'ltr'}>
            {showWelcomeModal && <WelcomeModal onStartChat={() => { setShowWelcomeModal(false); setIsChatOpen(true); }} onClose={() => setShowWelcomeModal(false)} />}
            <Header onNavigate={handleNavigate} onLoginClick={() => { setAuthModalView('login'); setAuthModalOpen(true); }} onSignupClick={() => { setAuthModalView('signup'); setAuthModalOpen(true); }} isLoggedIn={isLoggedIn} isAdmin={isAdmin} username={isAdmin ? (isEnglishAdmin ? 'English Admin' : 'Admin') : userProfile?.username} onLogout={handleLogout} currency={currency} onCurrencyChange={handleCurrencyChange} language={language} onLanguageChange={() => setShowLangConfirm(true)} isTranslating={isTranslating} onBack={handleBack} canGoBack={navHistory.length > 0} strings={strings} />
            {error && <div className="bg-yellow-50 border-l-4 border-yellow-400 text-yellow-700 p-4 container mx-auto my-4 rounded-md text-sm"><p className="font-bold">Notice</p><p>{error}</p></div>}
            <main>{renderContent()}</main>
             {!(isDataLoading || isAuthLoading) && <><Footer onNavigate={handleNavigate} strings={strings} /><Chatbot courses={displayedCourses} onSelectCourse={(id) => handleNavigate('course-profile', id)} strings={strings} language={language} isOpen={isChatOpen} setIsOpen={setIsChatOpen} /><button onClick={() => handleNavigate('courses')} className="fixed bottom-32 left-6 z-40 w-16 h-16 bg-blue-900 text-white rounded-full shadow-lg hover:bg-blue-800 transition-transform transform hover:scale-105 flex flex-col items-center justify-center border-2 border-white font-bold text-xs leading-tight" style={{ left: '24px', right: 'auto' }}><span>{language === 'ar' ? 'ابدأ' : 'Start'}</span><span>{language === 'ar' ? 'الآن' : 'Now'}</span></button></>}
            {isAuthModalOpen && <AuthModal initialView={authModalView} onClose={() => { setAuthModalOpen(false); setPendingBookingId(null); }} onLogin={handleLogin} onSwitchToOnboarding={() => { setAuthModalOpen(false); setShowOnboarding(true); }} strings={strings} />}
            {showLangConfirm && <div className="fixed inset-0 z-[110] flex items-center justify-center px-4"><div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowLangConfirm(false)}></div><div className="relative bg-white rounded-xl shadow-2xl w-full max-w-md p-6 transform transition-all scale-100"><div className="text-center mb-6"><h3 className="text-xl font-bold text-blue-900 mb-4">{strings.langConfirmTitle}</h3><p className="text-gray-600 leading-relaxed">{strings.langConfirmMessage}</p></div><div className="flex flex-col gap-3"><button onClick={performLanguageChange} className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-lg transition-colors">{strings.langConfirmYes}</button><button onClick={() => setShowLangConfirm(false)} className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-3 rounded-lg transition-colors">{strings.langConfirmNo}</button></div></div></div>}
        </div>
    );
};

export default App;
