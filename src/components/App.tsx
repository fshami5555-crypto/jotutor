import React, { useState, useEffect, useCallback, useMemo } from 'react';
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
import PaymentRefundPage from './PaymentRefundPage';

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
    subscribeToPayments, // Added subscription
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
    const [isSuperAdmin, setIsSuperAdmin] = useState<boolean>(false); // Track if user is the main admin
    const [isEnglishAdmin, setIsEnglishAdmin] = useState<boolean>(false);

    // Modals
    const [isAuthModalOpen, setAuthModalOpen] = useState(false);
    const [authModalView, setAuthModalView] = useState<'login' | 'signup'>('login');
    const [showOnboarding, setShowOnboarding] = useState(false);
    const [showWelcomeModal, setShowWelcomeModal] = useState(true); // Show Welcome Modal by default on load
    const [isChatOpen, setIsChatOpen] = useState(false); // Chatbot state managed here
    const [showLangConfirm, setShowLangConfirm] = useState(false); // Language confirmation modal
    
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

    // === COMPUTED PROPERTIES FOR LOCALIZATION (STRICT SEPARATION) ===
    
    // 1. Localized Courses
    const displayedCourses = useMemo(() => {
        if (language === 'ar') {
            // Show courses that have an Arabic title
            return courses.filter(c => c.title && c.title.trim() !== '');
        }
        
        // English Mode: Show courses with English title, and map English fields to primary fields
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

    // 2. Localized Teachers
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

    // 3. Localized Testimonials
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

    // 4. Localized Blog Posts
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

    // 5. Localized Onboarding Options
    const currentOnboardingOptions = useMemo(() => {
        if (language === 'en') {
            return {
                ...onboardingOptions,
                serviceTypes: onboardingOptions.serviceTypes_en || [],
                educationStages: onboardingOptions.educationStages_en || [],
                curriculums: onboardingOptions.curriculums_en || [],
                subjects: onboardingOptions.subjects_en || [],
                // Fallback to empty if not provided, ensuring strict separation
            };
        }
        return onboardingOptions;
    }, [onboardingOptions, language]);

    const currentSiteContent = siteContent;

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
                    if (data.config) {
                        if (data.config.siteContent) {
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
        let paymentUnsubscribe: () => void = () => {};
        
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
                const email = user.email ? user.email.toLowerCase() : '';
                const adminEmails = ['admin@jotutor.com', 'eng@jotutor.com'];
                
                if (adminEmails.includes(email)) {
                    setIsAdmin(true);
                    setUserProfile(null);
                    
                    if (email === 'admin@jotutor.com') {
                        setIsSuperAdmin(true);
                        setIsEnglishAdmin(false); // Default to Full Admin
                        setLanguage('ar');
                        setStrings(arStrings);
                    } else if (email === 'eng@jotutor.com') {
                        setIsSuperAdmin(false);
                        setIsEnglishAdmin(true);
                        setLanguage('en');
                        setStrings(enStrings);
                    } else {
                        setIsSuperAdmin(false);
                        setIsEnglishAdmin(false);
                    }
                    
                    // --- ADMIN DATA LOADING ---
                    try {
                        const response = await fetchAdminData();
                        const data = response.data; 
                        setUsers(data.users || []);
                        setStaff(data.staff || []);
                        // FIX: Explicitly set payments from fetch result initially
                        if (data.payments) {
                            setPayments(data.payments);
                        }
                        
                        // CRITICAL FIX: Use Real-time listener for Payments for Admin
                        // This prevents the issue where new payments disappear because the local state 
                        // is overwritten by a stale fetch or lack of sync.
                        paymentUnsubscribe = subscribeToPayments((updatedPayments) => {
                            if (isMounted) setPayments(updatedPayments);
                        });

                        if (!response.success && response.failedCollections && response.failedCollections.length > 0) {
                            console.warn(`Partial admin data load failure: ${response.failedCollections.join(', ')}`);
                        }
                    } catch (err) {
                        console.error("Admin data fetch failed", err);
                    }

                } else {
                    setIsAdmin(false);
                    setIsEnglishAdmin(false);
                    setIsSuperAdmin(false);
                    // Fix: Use Firebase v8 compat syntax to resolve module errors.
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
                // Unsubscribe from payments if user logs out
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
        
        // If the content includes a new API key, update the service immediately
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
        if (!auth) {
            alert("Authentication service is unavailable. Please check your connection.");
            return false;
        }
        try {
            // Fix: Use Firebase v8 compat syntax to resolve module errors.
            await auth.signInWithEmailAndPassword(email, password);
            setAuthModalOpen(false);
            
            const lowerEmail = email.toLowerCase();
            if (lowerEmail === 'admin@jotutor.com' || lowerEmail === 'eng@jotutor.com') {
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
        if (auth) {
            auth.signOut();
        }
        handleNavigate('home');
    };
    
    // Toggle for Admin to switch to English Mode
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
        if (!auth) {
            return "Authentication service unavailable.";
        }
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

    const handleEnrollInCourse = async (
        course: Course, 
        status: 'Success' | 'Pending' = 'Success', 
        details?: { orderId?: string; transactionId?: string; paymentMethod: 'Credit Card' | 'CliQ' }
    ) => {
        if (!userProfile) {
            alert("Please log in to enroll in a course.");
            setAuthModalOpen(true);
            return;
        }

        try {
            const currentEnrolled = userProfile.enrolledCourses || [];
            if (currentEnrolled.includes(course.id)) {
                alert("You are already enrolled in this course.");
                handleNavigate('dashboard');
                return;
            }

            // If status is Pending (Local Payment), we do NOT update the user profile yet.
            // We only create the payment record.
            if (status === 'Success') {
                const updatedProfile: UserProfile = {
                    ...userProfile,
                    enrolledCourses: [...currentEnrolled, course.id]
                };
                await setDocument('Users', userProfile.id, updatedProfile);
                setUserProfile(updatedProfile); // Update local state immediately
            }

            // Determine price based on current currency selection. SAFE FALLBACK.
            let paymentAmount = 0;
            if (currency === 'USD') {
                paymentAmount = course.priceUsd ?? (course.price ? course.price * 1.41 : 0);
            } else if (currency === 'SAR') {
                paymentAmount = course.priceSar ?? (course.price ? course.price * 5.3 : 0);
            } else {
                paymentAmount = course.priceJod ?? course.price ?? 0;
            }

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
                // Add Gateway Details
                paymentMethod: details?.paymentMethod,
                gatewayOrderId: details?.orderId,
                transactionId: details?.transactionId,
            };
            
            // Save payment record to Firestore
            await setDocument('Payments', newPayment.id, newPayment);
            
            // Optimistically update payments state if NOT an admin (Admins get updates via listener)
            // If we are testing as an admin who is also paying, the listener will catch it, but this doesn't hurt.
            // However, to be safe against double-adds if listener is active, we check.
            if (!isAdmin) {
                setPayments(prev => [...prev, newPayment]);
            }

            if (status === 'Success') {
                alert(`${strings.paymentSuccess} You have enrolled in ${course.title}.`);
                handleNavigate('dashboard');
            }
            // If Pending, the PaymentPage handles the UI (showing transfer details)

        } catch (error) {
            console.error("Error enrolling in course:", error);
            alert("There was an error creating the request. Please try again.");
        }
    };

    // Admin Function: Activate a Pending Course
    const handleActivateCourse = async (paymentId: string) => {
        const paymentToActivate = payments.find(p => p.id === paymentId);
        if (!paymentToActivate) return;

        // Try to find the user in the loaded list. 
        // Note: For large apps, we might need to fetch the specific user doc if not in list.
        let targetUser = users.find(u => u.id === paymentToActivate.userId);
        
        if (!targetUser) {
             // Fallback: Fetch user directly if not in state
             if (db) {
                 try {
                    const userDoc = await db.collection('users').doc(paymentToActivate.userId).get();
                    if (userDoc.exists) {
                        targetUser = { ...userDoc.data(), id: userDoc.id } as UserProfile;
                    }
                 } catch (e) {
                     console.error("Error fetching target user:", e);
                 }
             }
        }

        if (!targetUser) {
            alert("Could not find user associated with this payment.");
            return;
        }

        try {
            // 1. Update Payment Status to Success
            const updatedPayment = { ...paymentToActivate, status: 'Success' as const };
            await setDocument('Payments', paymentId, updatedPayment);
            // setPayments is handled by the real-time listener for admins

            // 2. Enroll User in Course
            const currentEnrolled = targetUser.enrolledCourses || [];
            // Check if already enrolled to avoid duplicates
            if (!currentEnrolled.includes(paymentToActivate.courseId)) {
                const updatedUser = {
                    ...targetUser,
                    enrolledCourses: [...currentEnrolled, paymentToActivate.courseId]
                };
                await setDocument('Users', targetUser.id, updatedUser);
                setUsers(prev => prev.map(u => u.id === targetUser!.id ? updatedUser : u));
            }

            alert("Course activated successfully!");
        } catch (error) {
            console.error("Error activating course:", error);
            alert("Failed to activate course.");
        }
    };

    // Trigger confirmation modal
    const initiateLanguageChange = () => {
        setShowLangConfirm(true);
    };

    // Perform actual language switch
    const performLanguageChange = async () => {
        setShowLangConfirm(false);
        const targetLanguage = language === 'ar' ? 'en' : 'ar';
        if (targetLanguage === 'ar') {
            setLanguage('ar'); setStrings(arStrings); return;
        }
        
        // Switch to English
        setLanguage('en');
        setStrings(enStrings);
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
        // setIsChatOpen(true); // AI chat is currently being disabled as per request
    };

    // === RENDER LOGIC ===
    const renderContent = () => {
        if (isDataLoading || isAuthLoading) {
            return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-green-500"></div></div>;
        }

        if (showOnboarding) {
             return (
                 <div className="container mx-auto px-6 py-12 max-w-4xl">
                     <OnboardingWizard 
                        options={currentOnboardingOptions} // Use computed localized options
                        onSignupSuccess={handleSignupSuccess} 
                        onClose={() => setShowOnboarding(false)}
                        strings={strings}
                        language={language} // Pass language to enable localized grades
                    />
                </div>
            );
        }
        
        // Note: Use displayed collections to ensure the ID matches the viewed content
        const selectedTeacher = displayedTeachers.find(t => t.id === selectedId);
        const selectedCourse = displayedCourses.find(c => c.id === selectedId);
        const selectedPost = displayedBlogPosts.find(p => p.id === selectedId);

        switch (page) {
            case 'home': return (
                <>
                    <HeroSection 
                        onSignupClick={() => { setAuthModalView('signup'); setAuthModalOpen(true); }} 
                        heroSlides={heroSlides} 
                        content={currentSiteContent.homepage}
                        strings={strings} 
                    />
                    <FeaturesSection content={currentSiteContent.homepage} strings={strings} />
                    <HowItWorks content={currentSiteContent.homepage} strings={strings} />
                    {/* Pass localized displayedTeachers */}
                    <TeacherSearch content={currentSiteContent.homepage} teachers={displayedTeachers} subjects={currentOnboardingOptions?.subjects || []} onSelectTeacher={(id) => handleNavigate('teacher-profile', id)} isHomePageVersion={true} strings={strings} language={language} />
                    <CoursesPreview content={currentSiteContent.homepage} courses={displayedCourses} onSelectCourse={(id) => handleNavigate('course-profile', id)} onNavigate={handleNavigate} currency={currency} exchangeRate={JOD_TO_USD_RATE} strings={strings} />
                    {/* Pass localized displayedTestimonials */}
                    <TestimonialsSection content={currentSiteContent.homepage} testimonials={displayedTestimonials} strings={strings} />
                    <AILessonPlanner content={currentSiteContent.homepage} strings={strings} language={language} />
                </>
            );
            case 'teachers': return <TeacherSearch content={currentSiteContent.homepage} teachers={displayedTeachers} subjects={currentOnboardingOptions?.subjects || []} onSelectTeacher={(id) => handleNavigate('teacher-profile', id)} strings={strings} language={language}/>;
            case 'teacher-profile': return selectedTeacher ? <TeacherProfilePage teacher={selectedTeacher} strings={strings} language={language}/> : <p>Teacher not found.</p>;
            
            case 'courses': return <CoursesPage courses={displayedCourses} onSelectCourse={(id) => handleNavigate('course-profile', id)} currency={currency} exchangeRate={JOD_TO_USD_RATE} strings={strings} language={language}/>
            case 'course-profile': return selectedCourse ? <CourseProfilePage course={selectedCourse} onBook={handleBookCourse} currency={currency} exchangeRate={JOD_TO_USD_RATE} strings={strings} language={language}/> : <p>Course not found.</p>;
            case 'payment': return selectedCourse ? <PaymentPage course={selectedCourse} onEnroll={handleEnrollInCourse} currency={currency} exchangeRate={JOD_TO_USD_RATE} strings={strings} language={language}/> : <p>Course not found.</p>;

            case 'videos': return <VideosPage shorts={displayedBlogPosts.filter(p => p.type === 'short')} onSelectShort={(id) => handleNavigate('short-player', id)} strings={strings} language={language}/>;
            case 'short-player': return selectedPost ? <ShortPlayerPage post={selectedPost} onBack={() => handleNavigate('videos')} strings={strings} language={language}/> : <p>Video not found.</p>;
            
            case 'blog': return <BlogPage posts={displayedBlogPosts.filter(p=> p.type === 'article')} onSelectPost={(id) => handleNavigate('article', id)} strings={strings} language={language}/>;
            case 'article': return selectedPost ? <ArticlePage post={selectedPost} onBack={() => handleNavigate('blog')} strings={strings} language={language}/> : <p>Article not found.</p>;

            case 'about': return currentSiteContent ? <AboutPage content={currentSiteContent.about} strings={strings} /> : null;
            case 'contact': return currentSiteContent ? <ContactPage content={currentSiteContent.contact} strings={strings} /> : null;
            case 'faq': return currentSiteContent ? <FAQPage faqs={currentSiteContent.faq} strings={strings} /> : null;
            case 'privacy': return currentSiteContent ? <PrivacyPolicyPage content={currentSiteContent.privacy} strings={strings} /> : null;
            case 'terms': return currentSiteContent ? <TermsPage content={currentSiteContent.terms} strings={strings} /> : null;
            case 'payment-refund': return currentSiteContent ? <PaymentRefundPage content={currentSiteContent.paymentRefundPolicy || ''} strings={strings} /> : null;

            case 'dashboard': return userProfile ? (
                <Dashboard 
                    userProfile={userProfile} 
                    onLogout={handleLogout} 
                    courses={displayedCourses} 
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
                    content={currentSiteContent} 
                    setContent={handleSetSiteContent}
                    heroSlides={heroSlides} 
                    setHeroSlides={handleSetHeroSlides}
                    onboardingOptions={onboardingOptions} 
                    setOnboardingOptions={handleSetOnboardingOptions}
                    users={users} 
                    setUsers={handleSetUsers}
                    staff={staff} 
                    setStaff={handleSetStaff}
                    payments={payments} 
                    setPayments={handleSetPayments}
                    teachers={teachers} 
                    setTeachers={handleSetTeachers}
                    courses={courses} 
                    setCourses={handleSetCourses}
                    subjects={onboardingOptions?.subjects || []}
                    testimonials={testimonials} 
                    setTestimonials={handleSetTestimonials}
                    blogPosts={blogPosts} 
                    setBlogPosts={handleSetBlogPosts}
                    onActivateCourse={handleActivateCourse}
                    strings={strings}
                    language={language}
                    isEnglishAdmin={isEnglishAdmin}
                    isSuperAdmin={isSuperAdmin}
                    onToggleEnglishMode={handleToggleEnglishAdminMode}
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
                username={isAdmin ? (isEnglishAdmin ? 'English Admin' : 'Admin') : userProfile?.username}
                onLogout={handleLogout}
                currency={currency}
                onCurrencyChange={handleCurrencyChange}
                language={language}
                onLanguageChange={initiateLanguageChange} // Use wrapper function
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
                    {/* Chatbot globally hidden for now as per user request to stop AI chat */}
                    {/* 
                    <Chatbot 
                        courses={displayedCourses} 
                        onSelectCourse={(id) => handleNavigate('course-profile', id)} 
                        strings={strings} 
                        language={language}
                        isOpen={isChatOpen}
                        setIsOpen={setIsChatOpen}
                    /> 
                    */}
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

            {/* Language Confirmation Modal */}
            {showLangConfirm && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center px-4">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowLangConfirm(false)}></div>
                    <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-md p-6 transform transition-all scale-100">
                        <div className="text-center mb-6">
                            <h3 className="text-xl font-bold text-blue-900 mb-4">{strings.langConfirmTitle}</h3>
                            <p className="text-gray-600 leading-relaxed">
                                {strings.langConfirmMessage}
                            </p>
                        </div>
                        <div className="flex flex-col gap-3">
                            <button 
                                onClick={performLanguageChange}
                                className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-lg transition-colors"
                            >
                                {strings.langConfirmYes}
                            </button>
                            <button 
                                onClick={() => setShowLangConfirm(false)}
                                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-3 rounded-lg transition-colors"
                            >
                                {strings.langConfirmNo}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default App;