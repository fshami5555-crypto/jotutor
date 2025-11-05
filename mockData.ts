// Fix: Added AboutContent to imports to resolve type error.
import { UserProfile, Course, Teacher, Testimonial, BlogPost, HeroSlide, StaffMember, Payment, SiteContent, OnboardingOptions, AboutContent } from './types';

// This file provides the initial state for the application.
// If Google Sheets is not configured, the app will run entirely on this data.
// If Google Sheets is configured, this data will be replaced by live data on load.

const users: UserProfile[] = [
    {
        id: 1,
        username: "طالب جديد",
        email: "student@example.com",
        phone: "0791234567",
        password: "password123",
        userType: 'Student',
        serviceType: 'التقوية',
        educationStage: 'المرحلة الإعدادية/المتوسطة',
        grade: 'الصف التاسع',
        curriculum: 'المنهج الوطني الأردني',
        subjects: ['الرياضيات', 'الفيزياء'],
        dob: '2008-05-10',
    }
];

const staff: StaffMember[] = [
    { id: 1, name: 'أحمد المشرف', email: 'ahmad@jotutor.com', permissions: 'Manage Teachers' },
    { id: 2, name: 'سارة مديرة', email: 'sara@jotutor.com', permissions: 'Full Control' }
];

const payments: Payment[] = [
    { id: 101, date: new Date('2023-10-26T10:00:00Z').toISOString(), userId: 1, userName: 'طالب جديد', courseId: 1, courseName: 'باقة الرياضيات للمرحلة الابتدائية', amount: 179, currency: 'JOD', status: 'Success' },
    { id: 102, date: new Date('2023-10-25T14:30:00Z').toISOString(), userId: 2, userName: 'مستخدم آخر', courseId: 3, courseName: 'باقة اللغة الإنجليزية المتقدمة', amount: 247, currency: 'JOD', status: 'Failed' },
];

const teachers: Teacher[] = [
    {
        id: 1,
        name: "الأستاذ خالد",
        avatarUrl: "https://i.ibb.co/6yv0fbv/image.jpg",
        level: "ابتدائي ومتوسط",
        experience: 8,
        specialties: ["الرياضيات", "العلوم"],
        rating: 4.9,
        reviews: 120,
        pricePerHour: 25,
        bio: "أستاذ متخصص في تبسيط المفاهيم العلمية والرياضية لطلاب المرحلتين الابتدائية والمتوسطة، أستخدم أساليب تفاعلية لجعل التعلم ممتعًا.",
        qualifications: ["بكالوريوس في الرياضيات", "دبلوم تربية"],
    },
    {
        id: 2,
        name: "المعلمة فاطمة",
        avatarUrl: "https://i.ibb.co/yQj50tq/image.jpg",
        level: "ثانوي وجامعي",
        experience: 12,
        specialties: ["اللغة الإنجليزية", "التحضير لـ TOEFL"],
        rating: 5.0,
        reviews: 250,
        pricePerHour: 35,
        bio: "خبيرة في تدريس اللغة الإنجليزية لغير الناطقين بها، أركز على تطوير مهارات المحادثة والكتابة الأكاديمية للطلاب.",
        qualifications: ["ماجستير في الأدب الإنجليزي", "شهادة TESOL"],
    },
    {
        id: 3,
        name: "الأستاذ يوسف",
        avatarUrl: "https://i.ibb.co/3zd2yv9/image.jpg",
        level: "جميع المراحل",
        experience: 10,
        specialties: ["اللغة العربية", "البلاغة", "النحو"],
        rating: 4.8,
        reviews: 95,
        pricePerHour: 30,
        bio: "أعمل على ترسيخ حب اللغة العربية لدى الطلاب من خلال أساليب إبداعية تركز على فهم النصوص وتذوقها.",
        qualifications: ["دكتوراه في اللغة العربية وآدابها"],
    },
    {
        id: 4,
        name: "المعلمة سارة",
        avatarUrl: "https://i.ibb.co/L5BKn2S/image.jpg",
        level: "متوسط وثانوي",
        experience: 7,
        specialties: ["الفيزياء", "الكيمياء"],
        rating: 4.9,
        reviews: 110,
        pricePerHour: 28,
        bio: "أساعد الطلاب على فهم القوانين الفيزيائية والتفاعلات الكيميائية من خلال التجارب العملية والأمثلة الواقعية.",
        qualifications: ["بكالوريوس في الهندسة الكيميائية"],
    },
];

const courses: Course[] = [
    { id: 1, title: 'باقة الرياضيات للمرحلة الابتدائية - 8 حصص', description: 'باقة تأسيسية في الرياضيات تغطي أساسيات الجمع والطرح والضرب والقسمة لطلاب المرحلة الابتدائية.', teacher: 'الأستاذ خالد', price: 179, duration: '8 حصص', level: 'مبتدئ', imageUrl: 'https://i.ibb.co/W2zXzLg/image.jpg', category: 'المرحلة الابتدائية' },
    { id: 2, title: 'باقة الفيزياء للمرحلة الثانوية - 12 حصة', description: 'شرح مفصل لمنهاج الفيزياء للمرحلة الثانوية مع حل تمارين مكثفة.', teacher: 'المعلمة سارة', price: 349, duration: '12 حصة', level: 'متقدم', imageUrl: 'https://i.ibb.co/R2W74zN/image.jpg', category: 'المرحلة الإعدادية والثانوية' },
    { id: 3, title: 'دورة التحضير لامتحان TOEFL - 16 حصة', description: 'دورة مكثفة لتطوير مهارات الاستماع والقراءة والكتابة والمحادثة للتحضير لامتحان TOEFL.', teacher: 'المعلمة فاطمة', price: 599, duration: '16 حصص', level: 'متقدم', imageUrl: 'https://i.ibb.co/mXTy1Ww/image.jpg', category: 'لغات' },
    { id: 4, title: 'أساسيات اللغة العربية - 8 حصص', description: 'دورة لتعليم أساسيات النحو والصرف والإملاء لجميع المستويات.', teacher: 'الأستاذ يوسف', price: 229, duration: '8 حصص', level: 'متوسط', imageUrl: 'https://i.ibb.co/yqgzk8N/image.jpg', category: 'لغات' },
];

const testimonials: Testimonial[] = [
    { id: 1, name: 'أمل محمود', role: 'ولي أمر', avatarUrl: 'https://i.ibb.co/Jqj3B2W/image.jpg', quote: 'تجربة ممتازة! ابني تحسن مستواه بشكل ملحوظ في الرياضيات بفضل المعلم خالد. المنصة سهلة الاستخدام والدعم الفني رائع.' },
    { id: 2, name: 'أحمد علي', role: 'طالب جامعي', avatarUrl: 'https://i.ibb.co/jH0312F/image.jpg', quote: 'استفدت كثيرًا من دورة التحضير للـ TOEFL مع المعلمة فاطمة. الشرح كان واضحًا والتمارين مفيدة جدًا.' },
    { id: 3, name: 'سارة حسين', role: 'طالبة ثانوية', avatarUrl: 'https://i.ibb.co/2nS2Xfb/image.jpg', quote: 'كانت مادة الفيزياء صعبة بالنسبة لي، لكن مع المعلمة سارة أصبحت أسهل وأكثر متعة. شكرًا JoTutor!' },
];

const blogPosts: BlogPost[] = [
    { id: 1, title: '5 استراتيجيات لزيادة التركيز أثناء الدراسة عن بعد', author: 'فريق JoTutor', date: '2023-10-15T12:00:00Z', excerpt: 'في عالم التعليم الرقمي، أصبح الحفاظ على التركيز تحديًا كبيرًا. نقدم لكم 5 طرق عملية لمساعدتكم...', imageUrl: 'https://i.ibb.co/L8zB3Sy/image.jpg', tags: ['نصائح', 'دراسة'], type: 'article', content: '<p>هنا محتوى المقال الكامل...</p>' },
    { id: 2, title: 'كيف تختار المعلم الخصوصي المناسب لطفلك؟', author: 'أحمد صالح', date: '2023-10-05T09:00:00Z', excerpt: 'اختيار المعلم المناسب هو استثمار في مستقبل طفلك. إليك بعض النقاط المهمة التي يجب مراعاتها...', imageUrl: 'https://i.ibb.co/K500zVp/image.jpg', tags: ['أولياء أمور', 'اختيار'], type: 'article', content: '<p>هنا محتوى المقال الكامل...</p>' },
    { id: 3, title: 'شرح قاعدة المبني للمجهول في دقيقة', author: 'المعلمة فاطمة', date: '2023-09-28T15:00:00Z', excerpt: 'فيديو قصير ومفيد لشرح قاعدة Passive Voice في اللغة الإنجليزية.', imageUrl: 'https://i.ytimg.com/vi/cwc3h6_q-A0/hqdefault.jpg', tags: ['إنجليزية', 'قواعد'], type: 'short', youtubeVideoId: 'cwc3h6_q-A0', content: 'شرح سريع لقاعدة المبني للمجهول.' },
];

const heroSlides: HeroSlide[] = [
    { id: 1, title: 'تعليم فردي مخصص مدعوم بالذكاء الاصطناعي', description: 'نركز على احتياجات كل طالب وأسلوب تعلمه الخاص مع استراتيجية تعليمية مدعومة بالذكاء الاصطناعي', imageUrl: 'https://i.ibb.co/4ZRTCY4g/image.jpg' },
    { id: 2, title: 'نخبة من المعلمين بين يديك', description: 'فريق من أفضل المعلمين مع خبرة واسعة في التعليم وشهادات معتمدة من أرقى الجامعات', imageUrl: 'https://i.ibb.co/zWzrLWx9/02-1.jpg' },
    { id: 3, title: 'متابعة دقيقة وتقارير أداء ذكية', description: 'تقنيات حديثة لتحليل التقدم ووضع خطط تعليمية ذكية مع متابعة دقيقة للأداء', imageUrl: 'https://i.ibb.co/zWxm4Bp4/image.jpg' },
];

const aboutContent: AboutContent = {
    heroImage: 'https://i.ibb.co/YFL8kfwv/image.jpg',
    vision: 'منح المعلمين القيمة التي يستحقونها، والتي ستنعكس إيجابًا على تطور أطفالنا.',
    visionImage: 'https://i.ibb.co/4ZRTCY4g/image.jpg',
    mission: 'تغطية جميع الاحتياجات الناتجة عن تطور التعليم ومواجهة التحديات التي تفرضها المناهج الجامدة، من خلال أساليب تعليم فردي مدعومة بالذكاء الاصطناعي. نهدف إلى دمج معايير المدارس مع أسس التعليم الخصوصي الحديثة، وتقديم الخدمة في منازل الأطفال وعبر الإنترنت، بطريقة ترفع مستواهم وتمكّنهم من الوصول إلى أقصى إمكاناتهم.',
    teacherCommunity: 'نسعى لبناء مجتمع من المعلمين قادر على إحداث أثر إيجابي في تطور المجتمع ككل.',
    whyJoTutor: [
        'أكثر من 750 معلمًا ومعلمة لتغطية جميع المناهج والمراحل الدراسية وأساليب التعلم.',
        'تطبيق استراتيجيات التعليم الفردي بمشاركة الذكاء الاصطناعي وفريق خدمة عملاء متفانٍ.',
        'عملية قبول صارمة تشمل التحقق من المؤهلات، الفحص الأمني، والمراجع.',
        'معدل قبول أقل من 25٪ لضمان تقديم الأفضل فقط.',
        'فريق جودة وخدمة عملاء لضمان تخصيص المعلم الأنسب (وليس الأفضل فقط).',
        'خطط تطوير طويلة الأمد للعملاء.',
        'تقييم خارجي دوري لضمان التطوير المستمر.',
        'متابعة تقدم الطالب بناءً على مستواه وقدرته والتزامه.',
        'تحقيق توافق اجتماعي ونفسي بين الطالب والمعلم.',
        'لسنا مجرد منصة، بل أول كيان للمعلمين في الأردن والشرق الأوسط.'
    ],
};

const onboardingOptions: OnboardingOptions = {
    serviceTypes: ['التأسيس', 'التقوية', 'المتابعة', 'الأنشطة اللاصفية', 'اللغات'],
    educationStages: ['تأسيس (3-5 سنوات)', 'ابتدائي (6-11 سنة)', 'إعدادي/متوسط (12-14 سنة)', 'ثانوي (15-18 سنة)', 'جامعي (18+)'],
    curriculums: ['المنهج الوطني الأردني', 'المنهج الأمريكي', 'المنهج البريطاني (IGCSE)', 'البكالوريا الدولية (IB)'],
    subjects: ['الرياضيات', 'الفيزياء', 'الكيمياء', 'الأحياء', 'اللغة العربية', 'اللغة الإنجليزية', 'التاريخ', 'الجغرافيا', 'البرمجة'],
    languages: ['الإنجليزية', 'العربية لغير الناطقين بها', 'الفرنسية', 'الألمانية', 'الإسبانية']
};

const siteContent: SiteContent = {
    about: aboutContent,
    faq: [
        { id: 1, question: 'كيف يمكنني حجز حصة مع معلم؟', answer: 'يمكنك تصفح قائمة المعلمين، واختيار المعلم المناسب، ثم الضغط على "عرض الملف الشخصي" لرؤية المواعيد المتاحة وحجز حصة مباشرة.' },
        { id: 2, question: 'هل الحصص مسجلة؟', answer: 'نعم، يتم تسجيل جميع الحصص ويمكن للطالب الرجوع إليها في أي وقت للمراجعة من خلال لوحة التحكم الخاصة به.' },
    ],
    contact: { email: 'contact@jotutor.com', phone: '+962 79 123 4567', address: 'عمان, الأردن' },
    privacy: 'هنا نص سياسة الخصوصية الكامل...',
    terms: 'هنا نص شروط وأحكام الاستخدام الكاملة...'
};

export const initialData = {
    users,
    staff,
    payments,
    teachers,
    courses,
    testimonials,
    blogPosts,
    heroSlides,
    siteContent,
    onboardingOptions
};