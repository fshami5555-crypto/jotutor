

import React, { useState, useEffect, useCallback } from 'react';
import { Page, UserProfile, Teacher, Testimonial, Course, BlogPost, SiteContent, Currency, Language } from './types';
import { JOD_TO_USD_RATE } from './constants';
import { translateContent } from './services/geminiService';
// Fix: Corrected import path for localization.
import { uiStrings } from './localization';


// Component Imports
import Header from './components/Header';
import Footer from './components/Footer';
import HeroSection from './components/HeroSection';
import FeaturesSection from './components/FeaturesSection';
import HowItWorks from './components/HowItWorks';
import TeacherSearch from './components/TeacherSearch';
import TestimonialsSection from './components/TestimonialsSection';
import AILessonPlanner from './components/AILessonPlanner';
// Fix: Corrected import path for AuthModal.
import AuthModal from './components/AuthModal';
// Fix: Corrected import path for Dashboard.
import Dashboard from './components/Dashboard';
import AdminDashboard from './components/AdminDashboard';
// Fix: Corrected import path for ContactPage.
import ContactPage from './components/ContactPage';
// Fix: Corrected import path for AboutPage.
import AboutPage from './components/AboutPage';
// Fix: Corrected import path for JoinTeacherPage.
import JoinTeacherPage from './components/JoinTeacherPage';
// Fix: Corrected import path for FAQPage.
import FAQPage from './components/FAQPage';
// Fix: Corrected import path for BlogPage.
import BlogPage from './components/BlogPage';
// Fix: Corrected import path for PrivacyPolicyPage.
import PrivacyPolicyPage from './components/PrivacyPolicyPage';
// Fix: Corrected import path for TermsPage.
import TermsPage from './components/TermsPage';
// Fix: Corrected import path for TeacherProfilePage.
import TeacherProfilePage from './components/TeacherProfilePage';
// Fix: Corrected import path for CoursesPage.
import CoursesPage from './components/CoursesPage';
// Fix: Corrected import path for CourseProfilePage.
import CourseProfilePage from './components/CourseProfilePage';
// Fix: Corrected import path for ArticlePage.
import ArticlePage from './components/ArticlePage';
// Fix: Corrected import path for PaymentPage.
import PaymentPage from './components/PaymentPage';
// Fix: Corrected import path for ShortPlayerPage.
import ShortPlayerPage from './components/ShortPlayerPage';
// Fix: Corrected import path for VideosPage.
import VideosPage from './components/VideosPage';

const initialData = {
  teachers: [
    { id: 1, name: 'أحمد محمود', avatarUrl: 'https://picsum.photos/seed/teacher1/200/200', level: 'ثانوي', experience: 10, specialties: ['الفيزياء', 'الرياضيات'], pricePerHour: 25, rating: 4.9, reviews: 120, bio: 'معلم فيزياء ورياضيات بخبرة طويلة في تدريس المناهج الوطنية والدولية. أسلوبي يركز على الفهم العميق للمفاهيم وتطبيقاتها العملية.', qualifications: ['ماجستير في الفيزياء الهندسية', 'دبلوم تربوي'] },
    { id: 2, name: 'فاطمة الزهراء', avatarUrl: 'https://picsum.photos/seed/teacher2/200/200', level: 'إعدادي', experience: 7, specialties: ['اللغة الإنجليزية', 'العلوم'], pricePerHour: 20, rating: 4.8, reviews: 95, bio: 'متخصصة في اللغة الإنجليزية والعلوم للمرحلة الإعدادية. أستخدم أساليب تفاعلية لجعل التعلم ممتعًا وفعالًا.', qualifications: ['بكالوريوس لغة إنجليزية', 'شهادة TESOL'] },
    { id: 3, name: 'علي حسن', avatarUrl: 'https://picsum.photos/seed/teacher3/200/200', level: 'جامعي', experience: 15, specialties: ['برمجة الحاسوب', 'هياكل البيانات'], pricePerHour: 35, rating: 5.0, reviews: 210, bio: 'مهندس برمجيات وأستاذ جامعي. أساعد الطلاب على بناء أساس قوي في علوم الحاسوب والاستعداد لسوق العمل.', qualifications: ['دكتوراه في علوم الحاسوب'] },
    { id: 4, name: 'مريم سعيد', avatarUrl: 'https://picsum.photos/seed/teacher4/200/200', level: 'ابتدائي', experience: 8, specialties: ['اللغة العربية', 'الرياضيات'], pricePerHour: 15, rating: 4.9, reviews: 88, bio: 'معلمة شغوفة بتعليم الأطفال في المرحلة الابتدائية. أركز على بناء المهارات الأساسية وحب التعلم لدى الطلاب الصغار.', qualifications: ['بكالوريوس معلم صف'] },
  ],
  testimonials: [
    { id: 1, name: 'أم خالد', role: 'ولي أمر', avatarUrl: 'https://picsum.photos/seed/parent1/100/100', quote: 'تجربة ممتازة! تحسن مستوى ابني بشكل ملحوظ في الرياضيات بفضل المعلم أحمد. المنصة سهلة الاستخدام والمتابعة.' },
    { id: 2, name: 'سارة عبدالله', role: 'طالبة جامعية', avatarUrl: 'https://picsum.photos/seed/student1/100/100', quote: 'الدكتور علي ساعدني كثيرًا في فهم المواد المتقدمة في البرمجة. الشرح كان واضحًا والأمثلة عملية ومفيدة جدًا.' },
    { id: 3, name: 'أبو ليان', role: 'ولي أمر', avatarUrl: 'https://picsum.photos/seed/parent2/100/100', quote: 'أعجبتني المرونة في اختيار الأوقات والمتابعة المستمرة من خلال التقارير. شكرًا JoTutor على هذا الجهد الرائع.' },
  ],
  courses: [
    { id: 1, title: 'أساسيات التفاضل والتكامل', description: 'دورة شاملة تغطي جميع المفاهيم الأساسية في التفاضل والتكامل لطلاب المرحلة الثانوية والجامعية.', teacher: 'أحمد محمود', price: 100, duration: '6 أسابيع', level: 'متقدم', imageUrl: 'https://picsum.photos/seed/course1/400/225', category: 'الرياضيات' },
    { id: 2, title: 'الإعداد لاختبار IELTS', description: 'دورة مكثفة تهدف إلى تطوير مهارات اللغة الإنجليزية الأربعة (القراءة، الكتابة، الاستماع، المحادثة) للتحضير لاختبار IELTS.', teacher: 'فاطمة الزهراء', price: 150, duration: '8 أسابيع', level: 'متوسط', imageUrl: 'https://picsum.photos/seed/course2/400/225', category: 'اللغة الإنجليزية' },
    { id: 3, title: 'مقدمة في لغة بايثون', description: 'تعلم أساسيات البرمجة باستخدام لغة بايثون، واحدة من أكثر اللغات طلبًا في العالم. لا تتطلب خبرة سابقة.', teacher: 'علي حسن', price: 120, duration: '5 أسابيع', level: 'مبتدئ', imageUrl: 'https://picsum.photos/seed/course3/400/225', category: 'برمجة الحاسوب' },
  ],
  blogPosts: [
    { id: 1, type: 'article', title: 'كيف تختار المعلم الخصوصي المناسب لطفلك؟', author: 'فريق JoTutor', date: '2023-10-26T10:00:00Z', excerpt: 'اختيار المعلم المناسب هو خطوة حاسمة في رحلة طفلك التعليمية. في هذا المقال، نقدم لك دليلًا عمليًا لمساعدتك على اتخاذ القرار الصحيح.', content: '<h1>نقاط يجب مراعاتها عند اختيار المعلم</h1><p>هناك عدة عوامل يجب أن تأخذها في الاعتبار...</p>', imageUrl: 'https://picsum.photos/seed/blog1/800/400', tags: ['نصائح', 'لأولياء الأمور'] },
    { id: 2, type: 'article', title: 'أهمية الذكاء الاصطناعي في تخصيص التعليم', author: 'علي حسن', date: '2023-10-20T14:30:00Z', excerpt: 'يُحدث الذكاء الاصطناعي ثورة في مجال التعليم من خلال تقديم تجارب تعليمية مخصصة لكل طالب. تعرف على كيفية عمل هذه التقنية.', content: '<h2>كيف يحلل الذكاء الاصطناعي أداء الطالب؟</h2><p>يستخدم نظامنا خوارزميات متقدمة لتحليل إجابات الطالب وسرعة تقدمه...</p>', imageUrl: 'https://picsum.photos/seed/blog2/800/400', tags: ['تكنولوجيا', 'التعليم'] },
    { id: 3, type: 'short', youtubeVideoId: '8y_1-4501bQ', title: 'شرح قاعدة كان وأخواتها في دقيقة', author: 'فاطمة الزهراء', date: '2023-11-01T09:00:00Z', excerpt: 'فيديو قصير وممتع يشرح قاعدة كان وأخواتها بطريقة مبسطة وسهلة الحفظ لطلاب المرحلة الإعدادية.', content: '<p>في هذا الفيديو السريع، تشرح المعلمة فاطمة قاعدة "كان وأخواتها" وأثرها على الجملة الاسمية. الفيديو مثالي للمراجعة السريعة قبل الاختبارات.</p>', imageUrl: 'https://i.ytimg.com/vi/8y_1-4501bQ/hqdefault.jpg', tags: ['لغة عربية', 'قواعد', 'فيديو قصير'] },
  ],
  siteContent: {
    about: `تأسست JoTutor برؤية واضحة: جعل التعليم عالي الجودة متاحًا للجميع. نحن نؤمن بأن كل طالب لديه إمكانات فريدة، ومهمتنا هي مساعدته على اكتشافها وتنميتها. من خلال الجمع بين نخبة من المعلمين المعتمدين وأحدث تقنيات الذكاء الاصطناعي، نقدم تجربة تعليمية مخصصة تتكيف مع احتياجات كل طالب وأسلوب تعلمه.

نحن في JoTutor نسعى لبناء مجتمع تعليمي داعم، حيث يمكن للطلاب وأولياء الأمور والمعلمين التواصل بفعالية لتحقيق أفضل النتائج. منصتنا لا تقتصر على تقديم الدروس الخصوصية فحسب، بل هي بيئة متكاملة توفر أدوات للمتابعة، تقارير أداء، ومصادر تعليمية إضافية لضمان رحلة تعليمية ناجحة ومستمرة.`,
    faq: [
      { id: 1, question: 'كيف يمكنني اختيار المعلم المناسب؟', answer: 'يمكنك استخدام فلاتر البحث في صفحة المعلمين لتحديد المادة، والمستوى الدراسي، والخبرة. كما يمكنك قراءة ملفاتهم الشخصية ومراجعات الطلاب الآخرين لمساعدتك في اتخاذ القرار.' },
      { id: 2, question: 'هل الحصص مسجلة؟', answer: 'نعم، يتم تسجيل جميع الحصص التفاعلية وتكون متاحة في حساب الطالب للمراجعة في أي وقت.' },
      { id: 3, question: 'ما هي طرق الدفع المتاحة؟', answer: 'نحن نقبل الدفع عبر البطاقات الائتمانية، التحويلات البنكية، والمحافظ الإلكترونية. يمكنك الاطلاع على جميع الخيارات المتاحة عند إتمام عملية الحجز.' },
    ],
    contact: {
      email: 'support@jotutor.com',
      phone: '+962 79 123 4567',
      address: 'مجمع الملك حسين للأعمال، عمان، الأردن'
    },
    privacy: 'نحن في JoTutor نلتزم بحماية خصوصية بياناتك. يتم استخدام المعلومات التي تقدمها فقط لغرض تحسين تجربتك التعليمية وتسهيل التواصل بينك وبين المعلمين. لن نشارك بياناتك مع أي طرف ثالث دون موافقتك الصريحة.',
    terms: 'باستخدامك لمنصة JoTutor، فإنك توافق على شروط الاستخدام.',
    heroImages: [
        'https://picsum.photos/seed/hero1/1200/800',
        'https://picsum.photos/seed/hero2/1200/800',
        'https://picsum.photos/seed/hero3/1200/800'
    ],
    onboardingOptions: {
        levels: ['ابتدائي (1-6)', 'إعدادي (7-9)', 'ثانوي (10-12)', 'جامعي'],
        curriculums: ['المنهج الوطني الأردني', 'IGCSE', 'IB', 'SAT/AP'],
        subjects: [
            'الرياضيات',
            'الفيزياء',
            'الكيمياء',
            'الأحياء',
            'اللغة العربية',
            'اللغة الإنجليزية',
            'العلوم الاجتماعية',
            'برمجة الحاسوب',
        ],
    }
  }
};

type AppData = typeof initialData;
// Fix: Corrected the type definition for translated data to use the structure of existing Arabic UI strings.
type TranslatedData = AppData & { uiStrings: typeof uiStrings.ar };

const App: React.FC = () => {
    // State management
    const [currentPage, setCurrentPage] = useState<Page>('home');
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [showAuthModal, setShowAuthModal] = useState<'login' | 'signup' | null>(null);
    const [currency, setCurrency] = useState<Currency>('JOD');
    const [appData, setAppData] = useState(initialData);
    const [selectedTeacherId, setSelectedTeacherId] = useState<number | null>(null);
    const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null);
    const [selectedPostId, setSelectedPostId] = useState<number | null>(null);

    // Language and Translation State
    const [language, setLanguage] = useState<Language>('ar');
    const [translatedData, setTranslatedData] = useState<TranslatedData | null>(null);
    const [isTranslating, setIsTranslating] = useState(false);
    const [currentStrings, setCurrentStrings] = useState(uiStrings.ar);

    // Effect to update HTML lang and dir attributes
    useEffect(() => {
        document.documentElement.lang = language;
        document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    }, [language]);

    // Translation Handler
    const handleLanguageChange = async () => {
        const newLang = language === 'ar' ? 'en' : 'ar';
        
        if (newLang === 'ar') {
            setLanguage('ar');
            setCurrentStrings(uiStrings.ar);
            return;
        }

        // Switch to English
        if (translatedData) { // Use cached translation if available
            setLanguage('en');
            setCurrentStrings(translatedData.uiStrings);
            return;
        }

        setIsTranslating(true);
        try {
            const contentToTranslate = { ...initialData, uiStrings: uiStrings.ar };
            const result = await translateContent(contentToTranslate, 'English');
            setTranslatedData(result);
            setCurrentStrings(result.uiStrings);
            setLanguage('en');
        } catch (error) {
            console.error("Translation failed:", error);
            alert("Failed to switch language. Please try again.");
        } finally {
            setIsTranslating(false);
        }
    };
    
    const dataForRendering = language === 'en' && translatedData ? translatedData : appData;


    // Handlers
    const handleNavigate = (page: Page) => {
        setCurrentPage(page);
        setSelectedTeacherId(null);
        setSelectedCourseId(null);
        setSelectedPostId(null);
        window.scrollTo(0, 0);
    };

    const handleLoginClick = () => setShowAuthModal('login');
    const handleSignupClick = () => setShowAuthModal('signup');
    const handleCloseAuthModal = () => setShowAuthModal(null);
    
    const handleLoginSuccess = (profile: UserProfile, role: 'user' | 'admin') => {
        setIsLoggedIn(true);
        setCurrentUser(profile);
        setIsAdmin(role === 'admin');
        setShowAuthModal(null);
        handleNavigate(role === 'admin' ? 'admin' : 'dashboard');
    };

    const handleLogout = () => {
        setIsLoggedIn(false);
        setCurrentUser(null);
        setIsAdmin(false);
        handleNavigate('home');
    };

    const handleCurrencyChange = () => {
        setCurrency(prev => prev === 'JOD' ? 'USD' : 'JOD');
    };

    const handleSelectTeacher = (id: number) => {
        setSelectedTeacherId(id);
        setCurrentPage('teacher-profile');
    };
    
    const handleSelectCourse = (id: number) => {
        setSelectedCourseId(id);
        setCurrentPage('course-profile');
    };
    
    const handleSelectPost = (id: number) => {
        const post = dataForRendering.blogPosts.find(p => p.id === id);
        if (post) {
            setSelectedPostId(id);
            setCurrentPage(post.type === 'short' ? 'short-player' : 'article');
        }
    };
    
    const handleBookCourse = (courseId: number) => {
        setSelectedCourseId(courseId);
        setCurrentPage('payment');
    };

    const renderPage = () => {
        if (selectedTeacherId !== null && currentPage === 'teacher-profile') {
            const teacher = dataForRendering.teachers.find(t => t.id === selectedTeacherId);
            if (teacher) return <TeacherProfilePage teacher={teacher} onBook={() => alert('Booking feature coming soon!')} currency={currency} exchangeRate={JOD_TO_USD_RATE} strings={currentStrings} language={language}/>;
        }
        
        if (selectedCourseId !== null && currentPage === 'course-profile') {
            const course = dataForRendering.courses.find(c => c.id === selectedCourseId);
            if (course) return <CourseProfilePage course={course} onBook={handleBookCourse} currency={currency} exchangeRate={JOD_TO_USD_RATE} strings={currentStrings} language={language}/>;
        }

        if (selectedCourseId !== null && currentPage === 'payment') {
            const course = dataForRendering.courses.find(c => c.id === selectedCourseId);
            if(course) return <PaymentPage course={course} currency={currency} exchangeRate={JOD_TO_USD_RATE} strings={currentStrings} language={language} />;
        }
        
        if (selectedPostId !== null && currentPage === 'article') {
            const post = dataForRendering.blogPosts.find(p => p.id === selectedPostId);
            if (post && post.type === 'article') return <ArticlePage post={post} onBack={() => handleNavigate('blog')} strings={currentStrings} language={language}/>;
        }
        
        if (selectedPostId !== null && currentPage === 'short-player') {
            const post = dataForRendering.blogPosts.find(p => p.id === selectedPostId);
            if (post && post.type === 'short') return <ShortPlayerPage post={post} onBack={() => handleNavigate('videos')} strings={currentStrings} language={language}/>;
        }

        switch (currentPage) {
            case 'home':
                return (
                    <>
                        <HeroSection onSignupClick={handleSignupClick} heroImages={dataForRendering.siteContent.heroImages} strings={currentStrings} />
                        <FeaturesSection strings={currentStrings}/>
                        <HowItWorks strings={currentStrings} />
                        <TeacherSearch teachers={dataForRendering.teachers} subjects={dataForRendering.siteContent.onboardingOptions.subjects} onSelectTeacher={handleSelectTeacher} currency={currency} exchangeRate={JOD_TO_USD_RATE} isHomePageVersion strings={currentStrings} language={language} />
                        <TestimonialsSection testimonials={dataForRendering.testimonials} strings={currentStrings} />
                        <AILessonPlanner strings={currentStrings} language={language} />
                    </>
                );
            case 'teachers':
                return <TeacherSearch teachers={dataForRendering.teachers} subjects={dataForRendering.siteContent.onboardingOptions.subjects} onSelectTeacher={handleSelectTeacher} currency={currency} exchangeRate={JOD_TO_USD_RATE} strings={currentStrings} language={language}/>;
            case 'courses':
                return <CoursesPage courses={dataForRendering.courses} onSelectCourse={handleSelectCourse} currency={currency} exchangeRate={JOD_TO_USD_RATE} strings={currentStrings} language={language}/>;
            case 'blog':
                return <BlogPage posts={dataForRendering.blogPosts.filter(p => p.type === 'article')} onSelectPost={handleSelectPost} strings={currentStrings} language={language}/>;
            case 'videos':
                 return <VideosPage shorts={dataForRendering.blogPosts.filter(p => p.type === 'short')} onSelectShort={handleSelectPost} strings={currentStrings} language={language}/>;
            case 'about':
                return <AboutPage content={dataForRendering.siteContent.about} strings={currentStrings} />;
            case 'contact':
                return <ContactPage content={dataForRendering.siteContent.contact} strings={currentStrings} />;
            case 'join':
                return <JoinTeacherPage strings={currentStrings} />;
            case 'faq':
                return <FAQPage faqs={dataForRendering.siteContent.faq} strings={currentStrings} />;
            case 'privacy':
                return <PrivacyPolicyPage content={dataForRendering.siteContent.privacy} strings={currentStrings} />;
            case 'terms':
                return <TermsPage content={dataForRendering.siteContent.terms} strings={currentStrings} />;
            case 'dashboard':
                return currentUser ? <Dashboard userProfile={currentUser} onLogout={handleLogout} /> : <p>Please log in.</p>;
            case 'admin':
                return isAdmin ? <AdminDashboard onLogout={handleLogout} initialData={appData} onUpdate={setAppData} /> : <p>Access denied.</p>;
            default:
                return <HeroSection onSignupClick={handleSignupClick} heroImages={dataForRendering.siteContent.heroImages} strings={currentStrings}/>;
        }
    };

    return (
        <div className="bg-gray-100 min-h-screen">
            {isTranslating && (
                <div className="fixed inset-0 bg-black bg-opacity-70 z-[100] flex items-center justify-center">
                    <div className="text-white text-center p-8">
                        <svg className="animate-spin h-10 w-10 text-white mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <p className="text-xl font-bold">{currentStrings.translating}</p>
                    </div>
                </div>
            )}
            <Header 
                onNavigate={handleNavigate} 
                onLoginClick={handleLoginClick} 
                onSignupClick={handleSignupClick}
                isLoggedIn={isLoggedIn}
                username={currentUser?.username}
                onLogout={handleLogout}
                currency={currency}
                onCurrencyChange={handleCurrencyChange}
                language={language}
                onLanguageChange={handleLanguageChange}
                isTranslating={isTranslating}
                strings={currentStrings}
            />
            <main>
                {renderPage()}
            </main>
            {showAuthModal && (
                <AuthModal
                    mode={showAuthModal}
                    onboardingOptions={dataForRendering.siteContent.onboardingOptions}
                    onClose={handleCloseAuthModal}
                    onSwitchMode={(mode) => setShowAuthModal(mode)}
                    onLoginSuccess={handleLoginSuccess}
                    strings={currentStrings}
                />
            )}
            <Footer onNavigate={handleNavigate} strings={currentStrings}/>
        </div>
    );
};

export default App;