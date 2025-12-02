
// Fix: Added AboutContent to imports to resolve type error.
import { UserProfile, Course, Teacher, Testimonial, BlogPost, HeroSlide, StaffMember, Payment, SiteContent, OnboardingOptions, AboutContent, HomepageContent } from './types';

// This file provides the initial state for the application.
// If Google Sheets is not configured, the app will run entirely on this data.
// If Google Sheets is configured, this data will be replaced by live data on load.

const users: UserProfile[] = [
    {
        id: '1',
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
    { id: '1', name: 'أحمد المشرف', email: 'ahmad@jotutor.com', permissions: 'Manage Teachers' },
    { id: '2', name: 'سارة مديرة', email: 'sara@jotutor.com', permissions: 'Full Control' }
];

const payments: Payment[] = [
    { id: '101', date: new Date('2023-10-26T10:00:00Z').toISOString(), userId: '1', userName: 'طالب جديد', courseId: 'c1', courseName: 'باقة الرياضيات للمرحلة الابتدائية', amount: 179, currency: 'JOD', status: 'Success' },
    { id: '102', date: new Date('2023-10-25T14:30:00Z').toISOString(), userId: '2', userName: 'مستخدم آخر', courseId: 'c3', courseName: 'باقة اللغة الإنجليزية المتقدمة', amount: 247, currency: 'JOD', status: 'Failed' },
];

const teachers: Teacher[] = [
    {
        id: '1',
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
        id: '2',
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
        id: '3',
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
        id: '4',
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

// Manually populated prices for demonstration: JOD (Base), USD (~1.41 * JOD), SAR (~5.3 * JOD)
const courses: Course[] = [
    // Primary Stage
    { id: 'c1', title: 'Primary Stage Std 8Sessions X 2Hours', description: 'دورة للمرحلة الابتدائية، 8 حصص لمدة ساعتين.', priceJod: 179, priceUsd: 252, priceSar: 948, duration: '8 Sessions', level: 'ابتدائي', category: 'التقوية', teacher: 'معلم متخصص', imageUrl: 'https://i.ibb.co/W2zXzLg/image.jpg', isFeatured: true, sessionCount: 8, totalHours: 16 },
    { id: 'c2', title: 'Primary Stage Std+ 8Sessions X 2Hours', description: 'دورة للمرحلة الابتدائية، 8 حصص لمدة ساعتين.', priceJod: 232, priceUsd: 327, priceSar: 1229, duration: '8 Sessions', level: 'ابتدائي', category: 'التقوية', teacher: 'معلم متخصص', imageUrl: 'https://i.ibb.co/W2zXzLg/image.jpg', isFeatured: true, sessionCount: 8, totalHours: 16 },
    { id: 'c3', title: 'Primary Stage Prm 8Sessions X 2Hours', description: 'دورة للمرحلة الابتدائية، 8 حصص لمدة ساعتين.', priceJod: 319, priceUsd: 449, priceSar: 1690, duration: '8 Sessions', level: 'ابتدائي', category: 'التقوية', teacher: 'معلم متخصص', imageUrl: 'https://i.ibb.co/W2zXzLg/image.jpg', isFeatured: true, sessionCount: 8, totalHours: 16 },
    { id: 'c4', title: 'Primary Stage Std 12Sessions X 2Hours', description: 'دورة للمرحلة الابتدائية، 12 حصة لمدة ساعتين.', priceJod: 212, priceUsd: 299, priceSar: 1123, duration: '12 Sessions', level: 'ابتدائي', category: 'التقوية', teacher: 'معلم متخصص', imageUrl: 'https://i.ibb.co/W2zXzLg/image.jpg', isFeatured: true, sessionCount: 12, totalHours: 24 },
    { id: 'c5', title: 'Primary Stage Std+ 12Sessions X 2Hours', description: 'دورة للمرحلة الابتدائية، 12 حصة لمدة ساعتين.', priceJod: 297, priceUsd: 418, priceSar: 1574, duration: '12 Sessions', level: 'ابتدائي', category: 'التقوية', teacher: 'معلم متخصص', imageUrl: 'https://i.ibb.co/W2zXzLg/image.jpg', sessionCount: 12, totalHours: 24 },
    { id: 'c6', title: 'Primary Stage Prm 12Sessions X 2Hours', description: 'دورة للمرحلة الابتدائية، 12 حصة لمدة ساعتين.', priceJod: 409, priceUsd: 576, priceSar: 2167, duration: '12 Sessions', level: 'ابتدائي', category: 'التقوية', teacher: 'معلم متخصص', imageUrl: 'https://i.ibb.co/W2zXzLg/image.jpg', sessionCount: 12, totalHours: 24 },
    { id: 'c7', title: 'Primary Stage Std 16Sessions X 2Hours', description: 'دورة للمرحلة الابتدائية، 16 حصة لمدة ساعتين.', priceJod: 279, priceUsd: 393, priceSar: 1478, duration: '16 Sessions', level: 'ابتدائي', category: 'التقوية', teacher: 'معلم متخصص', imageUrl: 'https://i.ibb.co/W2zXzLg/image.jpg', sessionCount: 16, totalHours: 32 },
    { id: 'c8', title: 'Primary Stage Std+ 16Sessions X 2Hours', description: 'دورة للمرحلة الابتدائية، 16 حصة لمدة ساعتين.', priceJod: 395, priceUsd: 557, priceSar: 2093, duration: '16 Sessions', level: 'ابتدائي', category: 'التقوية', teacher: 'معلم متخصص', imageUrl: 'https://i.ibb.co/W2zXzLg/image.jpg', sessionCount: 16, totalHours: 32 },
    { id: 'c9', title: 'Primary Stage Prm 16Sessions X 2Hours', description: 'دورة للمرحلة الابتدائية، 16 حصة لمدة ساعتين.', priceJod: 439, priceUsd: 619, priceSar: 2326, duration: '16 Sessions', level: 'ابتدائي', category: 'التقوية', teacher: 'معلم متخصص', imageUrl: 'https://i.ibb.co/W2zXzLg/image.jpg', sessionCount: 16, totalHours: 32 },
    { id: 'c10', title: 'Primary Stage Std 8Sessions X 1.5Hours', description: 'دورة للمرحلة الابتدائية، 8 حصص لمدة ساعة ونصف.', priceJod: 152, priceUsd: 214, priceSar: 805, duration: '8 Sessions', level: 'ابتدائي', category: 'التقوية', teacher: 'معلم متخصص', imageUrl: 'https://i.ibb.co/W2zXzLg/image.jpg', sessionCount: 8, totalHours: 12 },
    { id: 'c11', title: 'Primary Stage Std+ 8Sessions X 1.5Hours', description: 'دورة للمرحلة الابتدائية، 8 حصص لمدة ساعة ونصف.', priceJod: 207, priceUsd: 292, priceSar: 1097, duration: '8 Sessions', level: 'ابتدائي', category: 'التقوية', teacher: 'معلم متخصص', imageUrl: 'https://i.ibb.co/W2zXzLg/image.jpg', sessionCount: 8, totalHours: 12 },
    { id: 'c12', title: 'Primary Stage Prm 8Sessions X 1.5Hours', description: 'دورة للمرحلة الابتدائية، 8 حصص لمدة ساعة ونصف.', priceJod: 262, priceUsd: 369, priceSar: 1388, duration: '8 Sessions', level: 'ابتدائي', category: 'التقوية', teacher: 'معلم متخصص', imageUrl: 'https://i.ibb.co/W2zXzLg/image.jpg', sessionCount: 8, totalHours: 12 },
    { id: 'c13', title: 'Primary Stage Std 12Sessions X 1.5Hours', description: 'دورة للمرحلة الابتدائية، 12 حصة لمدة ساعة ونصف.', priceJod: 179, priceUsd: 252, priceSar: 948, duration: '12 Sessions', level: 'ابتدائي', category: 'التقوية', teacher: 'معلم متخصص', imageUrl: 'https://i.ibb.co/W2zXzLg/image.jpg', sessionCount: 12, totalHours: 18 },
    { id: 'c14', title: 'Primary Stage Std+ 12Sessions X 1.5Hours', description: 'دورة للمرحلة الابتدائية، 12 حصة لمدة ساعة ونصف.', priceJod: 262, priceUsd: 369, priceSar: 1388, duration: '12 Sessions', level: 'ابتدائي', category: 'التقوية', teacher: 'معلم متخصص', imageUrl: 'https://i.ibb.co/W2zXzLg/image.jpg', sessionCount: 12, totalHours: 18 },
    { id: 'c15', title: 'Primary Stage Prm 12Sessions X 1.5Hours', description: 'دورة للمرحلة الابتدائية، 12 حصة لمدة ساعة ونصف.', priceJod: 359, priceUsd: 506, priceSar: 1902, duration: '12 Sessions', level: 'ابتدائي', category: 'التقوية', teacher: 'معلم متخصص', imageUrl: 'https://i.ibb.co/W2zXzLg/image.jpg', sessionCount: 12, totalHours: 18 },
    { id: 'c16', title: 'Primary Stage Std 16Sessions X 1.5Hours', description: 'دورة للمرحلة الابتدائية، 16 حصة لمدة ساعة ونصف.', priceJod: 237, priceUsd: 334, priceSar: 1256, duration: '16 Sessions', level: 'ابتدائي', category: 'التقوية', teacher: 'معلم متخصص', imageUrl: 'https://i.ibb.co/W2zXzLg/image.jpg', sessionCount: 16, totalHours: 24 },
    { id: 'c17', title: 'Primary Stage Std+ 16Sessions X 1.5Hours', description: 'دورة للمرحلة الابتدائية، 16 حصة لمدة ساعة ونصف.', priceJod: 317, priceUsd: 447, priceSar: 1680, duration: '16 Sessions', level: 'ابتدائي', category: 'التقوية', teacher: 'معلم متخصص', imageUrl: 'https://i.ibb.co/W2zXzLg/image.jpg', sessionCount: 16, totalHours: 24 },
    { id: 'c18', title: 'Primary Stage Prm 16Sessions X 1.5Hours', description: 'دورة للمرحلة الابتدائية، 16 حصة لمدة ساعة ونصف.', priceJod: 449, priceUsd: 633, priceSar: 2379, duration: '16 Sessions', level: 'ابتدائي', category: 'التقوية', teacher: 'معلم متخصص', imageUrl: 'https://i.ibb.co/W2zXzLg/image.jpg', sessionCount: 16, totalHours: 24 },
    { id: 'c19', title: 'Primary Stage Std 8Sessions X 1Hour', description: 'دورة للمرحلة الابتدائية، 8 حصص لمدة ساعة.', priceJod: 139, priceUsd: 196, priceSar: 736, duration: '8 Sessions', level: 'ابتدائي', category: 'التقوية', teacher: 'معلم متخصص', imageUrl: 'https://i.ibb.co/W2zXzLg/image.jpg', sessionCount: 8, totalHours: 8 },
    { id: 'c20', title: 'Primary Stage Std+ 8Sessions X 1Hour', description: 'دورة للمرحلة الابتدائية، 8 حصص لمدة ساعة.', priceJod: 179, priceUsd: 252, priceSar: 948, duration: '8 Sessions', level: 'ابتدائي', category: 'التقوية', teacher: 'معلم متخصص', imageUrl: 'https://i.ibb.co/W2zXzLg/image.jpg', sessionCount: 8, totalHours: 8 },
    { id: 'c21', title: 'Primary Stage Prm 8Sessions X 1Hour', description: 'دورة للمرحلة الابتدائية، 8 حصص لمدة ساعة.', priceJod: 247, priceUsd: 348, priceSar: 1309, duration: '8 Sessions', level: 'ابتدائي', category: 'التقوية', teacher: 'معلم متخصص', imageUrl: 'https://i.ibb.co/W2zXzLg/image.jpg', sessionCount: 8, totalHours: 8 },
    { id: 'c22', title: 'Primary Stage Std 12Sessions X 1Hour', description: 'دورة للمرحلة الابتدائية، 12 حصة لمدة ساعة.', priceJod: 159, priceUsd: 224, priceSar: 842, duration: '12 Sessions', level: 'ابتدائي', category: 'التقوية', teacher: 'معلم متخصص', imageUrl: 'https://i.ibb.co/W2zXzLg/image.jpg', sessionCount: 12, totalHours: 12 },
    { id: 'c23', title: 'Primary Stage Std+ 12Sessions X 1Hour', description: 'دورة للمرحلة الابتدائية، 12 حصة لمدة ساعة.', priceJod: 229, priceUsd: 323, priceSar: 1213, duration: '12 Sessions', level: 'ابتدائي', category: 'التقوية', teacher: 'معلم متخصص', imageUrl: 'https://i.ibb.co/W2zXzLg/image.jpg', sessionCount: 12, totalHours: 12 },
    { id: 'c24', title: 'Primary Stage Prm 12Sessions X 1Hour', description: 'دورة للمرحلة الابتدائية، 12 حصة لمدة ساعة.', priceJod: 317, priceUsd: 447, priceSar: 1680, duration: '12 Sessions', level: 'ابتدائي', category: 'التقوية', teacher: 'معلم متخصص', imageUrl: 'https://i.ibb.co/W2zXzLg/image.jpg', sessionCount: 12, totalHours: 12 },
    { id: 'c25', title: 'Primary Stage Std 16Sessions X 1Hour', description: 'دورة للمرحلة الابتدائية، 16 حصة لمدة ساعة.', priceJod: 207, priceUsd: 292, priceSar: 1097, duration: '16 Sessions', level: 'ابتدائي', category: 'التقوية', teacher: 'معلم متخصص', imageUrl: 'https://i.ibb.co/W2zXzLg/image.jpg', sessionCount: 16, totalHours: 16 },
    { id: 'c26', title: 'Primary Stage Std+ 16Sessions X 1Hour', description: 'دورة للمرحلة الابتدائية، 16 حصة لمدة ساعة.', priceJod: 277, priceUsd: 390, priceSar: 1468, duration: '16 Sessions', level: 'ابتدائي', category: 'التقوية', teacher: 'معلم متخصص', imageUrl: 'https://i.ibb.co/W2zXzLg/image.jpg', sessionCount: 16, totalHours: 16 },
    { id: 'c27', title: 'Primary Stage Prm 16Sessions X 1Hour', description: 'دورة للمرحلة الابتدائية، 16 حصة لمدة ساعة.', priceJod: 419, priceUsd: 590, priceSar: 2220, duration: '16 Sessions', level: 'ابتدائي', category: 'التقوية', teacher: 'معلم متخصص', imageUrl: 'https://i.ibb.co/W2zXzLg/image.jpg', sessionCount: 16, totalHours: 16 },
    { id: 'c28', title: 'Primary Stage Std 1Sessions X 2Hours', description: 'دورة للمرحلة الابتدائية، حصة واحدة لمدة ساعتين.', priceJod: 32, priceUsd: 45, priceSar: 169, duration: '1 Session', level: 'ابتدائي', category: 'التقوية', teacher: 'معلم متخصص', imageUrl: 'https://i.ibb.co/W2zXzLg/image.jpg', sessionCount: 1, totalHours: 2 },
    { id: 'c29', title: 'Primary to Stage Prm 1Sessions X 2Hours', description: 'دورة للمرحلة الابتدائية، حصة واحدة لمدة ساعتين.', priceJod: 35, priceUsd: 49, priceSar: 185, duration: '1 Session', level: 'ابتدائي', category: 'التقوية', teacher: 'معلم متخصص', imageUrl: 'https://i.ibb.co/W2zXzLg/image.jpg', sessionCount: 1, totalHours: 2 },
    { id: 'c30', title: 'Primary Stage Std 1Sessions X 1.5Hours', description: 'دورة للمرحلة الابتدائية، حصة واحدة لمدة ساعة ونصف.', priceJod: 27, priceUsd: 38, priceSar: 143, duration: '1 Session', level: 'ابتدائي', category: 'التقوية', teacher: 'معلم متخصص', imageUrl: 'https://i.ibb.co/W2zXzLg/image.jpg', sessionCount: 1, totalHours: 1.5 },
    { id: 'c31', title: 'Primary to Stage Prm 1Sessions X 1.5Hours', description: 'دورة للمرحلة الابتدائية، حصة واحدة لمدة ساعة ونصف.', priceJod: 30, priceUsd: 42, priceSar: 159, duration: '1 Session', level: 'ابتدائي', category: 'التقوية', teacher: 'معلم متخصص', imageUrl: 'https://i.ibb.co/W2zXzLg/image.jpg', sessionCount: 1, totalHours: 1.5 },
    
    // Secondary to High Stage
    { id: 'c32', title: 'Secondary to High Std 8Sessions X 2Hours', description: 'دورة للمرحلة الإعدادية والثانوية، 8 حصص لمدة ساعتين.', priceJod: 247, priceUsd: 348, priceSar: 1309, duration: '8 Sessions', level: 'إعدادي / ثانوي', category: 'التقوية', teacher: 'معلم متخصص', imageUrl: 'https://i.ibb.co/R2W74zN/image.jpg', sessionCount: 8, totalHours: 16 },
    { id: 'c33', title: 'Secondary to High Std+ 8Sessions X 2Hours', description: 'دورة للمرحلة الإعدادية والثانوية، 8 حصص لمدة ساعتين.', priceJod: 327, priceUsd: 461, priceSar: 1733, duration: '8 Sessions', level: 'إعدادي / ثانوي', category: 'التقوية', teacher: 'معلم متخصص', imageUrl: 'https://i.ibb.co/R2W74zN/image.jpg', sessionCount: 8, totalHours: 16 },
    { id: 'c34', title: 'Secondary to High Std 12Sessions X 2Hours', description: 'دورة للمرحلة الإعدادية والثانوية، 12 حصة لمدة ساعتين.', priceJod: 349, priceUsd: 492, priceSar: 1849, duration: '12 Sessions', level: 'إعدادي / ثانوي', category: 'التقوية', teacher: 'معلم متخصص', imageUrl: 'https://i.ibb.co/R2W74zN/image.jpg', sessionCount: 12, totalHours: 24 },
    { id: 'c35', title: 'Secondary to High Std+ 12Sessions X 2Hours', description: 'دورة للمرحلة الإعدادية والثانوية، 12 حصة لمدة ساعتين.', priceJod: 467, priceUsd: 658, priceSar: 2475, duration: '12 Sessions', level: 'إعدادي / ثانوي', category: 'التقوية', teacher: 'معلم متخصص', imageUrl: 'https://i.ibb.co/R2W74zN/image.jpg', sessionCount: 12, totalHours: 24 },
    { id: 'c36', title: 'Secondary to High Std 16Sessions X 2Hours', description: 'دورة للمرحلة الإعدادية والثانوية، 16 حصة لمدة ساعتين.', priceJod: 462, priceUsd: 651, priceSar: 2448, duration: '16 Sessions', level: 'إعدادي / ثانوي', category: 'التقوية', teacher: 'معلم متخصص', imageUrl: 'https://i.ibb.co/R2W74zN/image.jpg', sessionCount: 16, totalHours: 32 },
    { id: 'c37', title: 'Secondary to High Std+ 16Sessions X 2Hours', description: 'دورة للمرحلة الإعدادية والثانوية، 16 حصة لمدة ساعتين.', priceJod: 599, priceUsd: 844, priceSar: 3174, duration: '16 Sessions', level: 'إعدادي / ثانوي', category: 'التقوية', teacher: 'معلم متخصص', imageUrl: 'https://i.ibb.co/R2W74zN/image.jpg', sessionCount: 16, totalHours: 32 },
    { id: 'c38', title: 'Secondary to High Std 8Sessions X 1.5Hours', description: 'دورة للمرحلة الإعدادية والثانوية، 8 حصص لمدة ساعة ونصف.', priceJod: 207, priceUsd: 292, priceSar: 1097, duration: '8 Sessions', level: 'إعدادي / ثانوي', category: 'التقوية', teacher: 'معلم متخصص', imageUrl: 'https://i.ibb.co/R2W74zN/image.jpg', sessionCount: 8, totalHours: 12 },
    { id: 'c39', title: 'Secondary to High Std+ 8Sessions X 1.5Hours', description: 'دورة للمرحلة الإعدادية والثانوية، 8 حصص لمدة ساعة ونصف.', priceJod: 289, priceUsd: 407, priceSar: 1531, duration: '8 Sessions', level: 'إعدادي / ثانوي', category: 'التقوية', teacher: 'معلم متخصص', imageUrl: 'https://i.ibb.co/R2W74zN/image.jpg', sessionCount: 8, totalHours: 12 },
    { id: 'c40', title: 'Secondary to High Prm 8Sessions X 1.5Hours', description: 'دورة للمرحلة الإعدادية والثانوية، 8 حصص لمدة ساعة ونصف.', priceJod: 419, priceUsd: 590, priceSar: 2220, duration: '8 Sessions', level: 'إعدادي / ثانوي', category: 'التقوية', teacher: 'معلم متخصص', imageUrl: 'https://i.ibb.co/R2W74zN/image.jpg', sessionCount: 8, totalHours: 12 },
    { id: 'c41', title: 'Secondary to High Std 12Sessions X 1.5Hours', description: 'دورة للمرحلة الإعدادية والثانوية، 12 حصة لمدة ساعة ونصف.', priceJod: 289, priceUsd: 407, priceSar: 1531, duration: '12 Sessions', level: 'إعدادي / ثانوي', category: 'التقوية', teacher: 'معلم متخصص', imageUrl: 'https://i.ibb.co/R2W74zN/image.jpg', sessionCount: 12, totalHours: 18 },
    { id: 'c42', title: 'Secondary to High Std+ 12Sessions X 1.5Hours', description: 'دورة للمرحلة الإعدادية والثانوية، 12 حصة لمدة ساعة ونصف.', priceJod: 409, priceUsd: 576, priceSar: 2167, duration: '12 Sessions', level: 'إعدادي / ثانوي', category: 'التقوية', teacher: 'معلم متخصص', imageUrl: 'https://i.ibb.co/R2W74zN/image.jpg', sessionCount: 12, totalHours: 18 },
    { id: 'c43', title: 'Secondary to High Prm 12Sessions X 1.5Hours', description: 'دورة للمرحلة الإعدادية والثانوية، 12 حصة لمدة ساعة ونصف.', priceJod: 579, priceUsd: 816, priceSar: 3068, duration: '12 Sessions', level: 'إعدادي / ثانوي', category: 'التقوية', teacher: 'معلم متخصص', imageUrl: 'https://i.ibb.co/R2W74zN/image.jpg', sessionCount: 12, totalHours: 18 },
    { id: 'c44', title: 'Secondary to High Std 16Sessions X 1.5Hours', description: 'دورة للمرحلة الإعدادية والثانوية، 16 حصة لمدة ساعة ونصف.', priceJod: 379, priceUsd: 534, priceSar: 2008, duration: '16 Sessions', level: 'إعدادي / ثانوي', category: 'التقوية', teacher: 'معلم متخصص', imageUrl: 'https://i.ibb.co/R2W74zN/image.jpg', sessionCount: 16, totalHours: 24 },
    { id: 'c45', title: 'Secondary to High Std+ 16Sessions X 1.5Hours', description: 'دورة للمرحلة الإعدادية والثانوية، 16 حصة لمدة ساعة ونصف.', priceJod: 519, priceUsd: 731, priceSar: 2750, duration: '16 Sessions', level: 'إعدادي / ثانوي', category: 'التقوية', teacher: 'معلم متخصص', imageUrl: 'https://i.ibb.co/R2W74zN/image.jpg', sessionCount: 16, totalHours: 24 },
    { id: 'c46', title: 'Secondary to High Prm 16Sessions X 1.5Hours', description: 'دورة للمرحلة الإعدادية والثانوية، 16 حصة لمدة ساعة ونصف.', priceJod: 599, priceUsd: 844, priceSar: 3174, duration: '16 Sessions', level: 'إعدادي / ثانوي', category: 'التقوية', teacher: 'معلم متخصص', imageUrl: 'https://i.ibb.co/R2W74zN/image.jpg', sessionCount: 16, totalHours: 24 },
    { id: 'c47', title: 'Secondary to High Std 8Sessions X 1Hour', description: 'دورة للمرحلة الإعدادية والثانوية، 8 حصص لمدة ساعة.', priceJod: 189, priceUsd: 266, priceSar: 1001, duration: '8 Sessions', level: 'إعدادي / ثانوي', category: 'التقوية', teacher: 'معلم متخصص', imageUrl: 'https://i.ibb.co/R2W74zN/image.jpg', sessionCount: 8, totalHours: 8 },
    { id: 'c48', title: 'Secondary to High Std+ 8Sessions X 1Hour', description: 'دورة للمرحلة الإعدادية والثانوية، 8 حصص لمدة ساعة.', priceJod: 259, priceUsd: 365, priceSar: 1372, duration: '8 Sessions', level: 'إعدادي / ثانوي', category: 'التقوية', teacher: 'معلم متخصص', imageUrl: 'https://i.ibb.co/R2W74zN/image.jpg', sessionCount: 8, totalHours: 8 },
    { id: 'c49', title: 'Secondary to High Prm 8Sessions X 1Hour', description: 'دورة للمرحلة الإعدادية والثانوية، 8 حصص لمدة ساعة.', priceJod: 359, priceUsd: 506, priceSar: 1902, duration: '8 Sessions', level: 'إعدادي / ثانوي', category: 'التقوية', teacher: 'معلم متخصص', imageUrl: 'https://i.ibb.co/R2W74zN/image.jpg', sessionCount: 8, totalHours: 8 },
    { id: 'c50', title: 'Secondary to High Std 12Sessions X 1Hour', description: 'دورة للمرحلة الإعدادية والثانوية، 12 حصة لمدة ساعة.', priceJod: 269, priceUsd: 379, priceSar: 1425, duration: '12 Sessions', level: 'إعدادي / ثانوي', category: 'التقوية', teacher: 'معلم متخصص', imageUrl: 'https://i.ibb.co/R2W74zN/image.jpg', sessionCount: 12, totalHours: 12 },
    { id: 'c51', title: 'Secondary to High Std+ 12Sessions X 1Hour', description: 'دورة للمرحلة الإعدادية والثانوية، 12 حصة لمدة ساعة.', priceJod: 359, priceUsd: 506, priceSar: 1902, duration: '12 Sessions', level: 'إعدادي / ثانوي', category: 'التقوية', teacher: 'معلم متخصص', imageUrl: 'https://i.ibb.co/R2W74zN/image.jpg', sessionCount: 12, totalHours: 12 },
    { id: 'c52', title: 'Secondary to High Prm 12Sessions X 1Hour', description: 'دورة للمرحلة الإعدادية والثانوية، 12 حصة لمدة ساعة.', priceJod: 489, priceUsd: 689, priceSar: 2591, duration: '12 Sessions', level: 'إعدادي / ثانوي', category: 'التقوية', teacher: 'معلم متخصص', imageUrl: 'https://i.ibb.co/R2W74zN/image.jpg', sessionCount: 12, totalHours: 12 },
    { id: 'c53', title: 'Secondary to High Std 16Sessions X 1Hour', description: 'دورة للمرحلة الإعدادية والثانوية، 16 حصة لمدة ساعة.', priceJod: 329, priceUsd: 463, priceSar: 1743, duration: '16 Sessions', level: 'إعدادي / ثانوي', category: 'التقوية', teacher: 'معلم متخصص', imageUrl: 'https://i.ibb.co/R2W74zN/image.jpg', sessionCount: 16, totalHours: 16 },
    { id: 'c54', title: 'Secondary to High Std+ 16Sessions X 1Hour', description: 'دورة للمرحلة الإعدادية والثانوية، 16 حصة لمدة ساعة.', priceJod: 472, priceUsd: 665, priceSar: 2501, duration: '16 Sessions', level: 'إعدادي / ثانوي', category: 'التقوية', teacher: 'معلم متخصص', imageUrl: 'https://i.ibb.co/R2W74zN/image.jpg', sessionCount: 16, totalHours: 16 },
    { id: 'c55', title: 'Secondary to High Prm 16Sessions X 1Hour', description: 'دورة للمرحلة الإعدادية والثانوية، 16 حصة لمدة ساعة.', priceJod: 529, priceUsd: 745, priceSar: 2803, duration: '16 Sessions', level: 'إعدادي / ثانوي', category: 'التقوية', teacher: 'معلم متخصص', imageUrl: 'https://i.ibb.co/R2W74zN/image.jpg', sessionCount: 16, totalHours: 16 },
    { id: 'c56', title: 'Secondary to High Std 1Sessions X 2Hours', description: 'دورة للمرحلة الإعدادية والثانوية، حصة واحدة لمدة ساعتين.', priceJod: 37, priceUsd: 52, priceSar: 196, duration: '1 Session', level: 'إعدادي / ثانوي', category: 'التقوية', teacher: 'معلم متخصص', imageUrl: 'https://i.ibb.co/R2W74zN/image.jpg', sessionCount: 1, totalHours: 2 },
    { id: 'c57', title: 'Secondary to High Std+ 1Sessions X 2Hours', description: 'دورة للمرحلة الإعدادية والثانوية، حصة واحدة لمدة ساعتين.', priceJod: 42, priceUsd: 59, priceSar: 222, duration: '1 Session', level: 'إعدادي / ثانوي', category: 'التقوية', teacher: 'معلم متخصص', imageUrl: 'https://i.ibb.co/R2W74zN/image.jpg', sessionCount: 1, totalHours: 2 },
    { id: 'c58', title: 'Secondary to High Prm++ 1Sessions X 2Hours', description: 'دورة للمرحلة الإعدادية والثانوية، حصة واحدة لمدة ساعتين.', priceJod: 60, priceUsd: 84, priceSar: 318, duration: '1 Session', level: 'إعدادي / ثانوي', category: 'التقوية', teacher: 'معلم متخصص', imageUrl: 'https://i.ibb.co/R2W74zN/image.jpg', sessionCount: 1, totalHours: 2 },
    { id: 'c59', title: 'Secondary to High Std 1Sessions X 1.5Hours', description: 'دورة للمرحلة الإعدادية والثانوية، حصة واحدة لمدة ساعة ونصف.', priceJod: 32, priceUsd: 45, priceSar: 169, duration: '1 Session', level: 'إعدادي / ثانوي', category: 'التقوية', teacher: 'معلم متخصص', imageUrl: 'https://i.ibb.co/R2W74zN/image.jpg', sessionCount: 1, totalHours: 1.5 },
    { id: 'c60', title: 'Secondary to High Std+ 1Sessions X 1.5Hours', description: 'دورة للمرحلة الإعدادية والثانوية، حصة واحدة لمدة ساعة ونصف.', priceJod: 37, priceUsd: 52, priceSar: 196, duration: '1 Session', level: 'إعدادي / ثانوي', category: 'التقوية', teacher: 'معلم متخصص', imageUrl: 'https://i.ibb.co/R2W74zN/image.jpg', sessionCount: 1, totalHours: 1.5 },
    { id: 'c61', title: 'Secondary to High Prm 1Sessions X 1.5Hours', description: 'دورة للمرحلة الإعدادية والثانوية، حصة واحدة لمدة ساعة ونصف.', priceJod: 55, priceUsd: 77, priceSar: 291, duration: '1 Session', level: 'إعدادي / ثانوي', category: 'التقوية', teacher: 'معلم متخصص', imageUrl: 'https://i.ibb.co/R2W74zN/image.jpg', sessionCount: 1, totalHours: 1.5 },
    { id: 'c62', title: 'Secondary to High Std 1Sessions X 1Hour', description: 'دورة للمرحلة الإعدادية والثانوية، حصة واحدة لمدة ساعة.', priceJod: 28, priceUsd: 39, priceSar: 148, duration: '1 Session', level: 'إعدادي / ثانوي', category: 'التقوية', teacher: 'معلم متخصص', imageUrl: 'https://i.ibb.co/R2W74zN/image.jpg', sessionCount: 1, totalHours: 1 },
    { id: 'c63', title: 'Secondary to High Std+ 1Sessions X 1Hour', description: 'دورة للمرحلة الإعدادية والثانوية، حصة واحدة لمدة ساعة.', priceJod: 32, priceUsd: 45, priceSar: 169, duration: '1 Session', level: 'إعدادي / ثانوي', category: 'التقوية', teacher: 'معلم متخصص', imageUrl: 'https://i.ibb.co/R2W74zN/image.jpg', sessionCount: 1, totalHours: 1 },
    { id: 'c64', title: 'Secondary to High Prm 1Sessions X 1Hour', description: 'دورة للمرحلة الإعدادية والثانوية، حصة واحدة لمدة ساعة.', priceJod: 50, priceUsd: 70, priceSar: 265, duration: '1 Session', level: 'إعدادي / ثانوي', category: 'التقوية', teacher: 'معلم متخصص', imageUrl: 'https://i.ibb.co/R2W74zN/image.jpg', sessionCount: 1, totalHours: 1 },
    
    // Foundation Stage
    { id: 'c65', title: 'Foundation Educ Fnd 8Sessions X 2Hours', description: 'دورة تأسيسية، 8 حصص لمدة ساعتين.', priceJod: 229, priceUsd: 323, priceSar: 1213, duration: '8 Sessions', level: 'تأسيس', category: 'تأسيس', teacher: 'معلم متخصص', imageUrl: 'https://i.ibb.co/yqgzk8N/image.jpg', sessionCount: 8, totalHours: 16 },
    { id: 'c66', title: 'Foundation Educ Fnd 12Sessions X 2Hours', description: 'دورة تأسيسية، 12 حصة لمدة ساعتين.', priceJod: 269, priceUsd: 379, priceSar: 1425, duration: '12 Sessions', level: 'تأسيس', category: 'تأسيس', teacher: 'معلم متخصص', imageUrl: 'https://i.ibb.co/yqgzk8N/image.jpg', sessionCount: 12, totalHours: 24 },
    { id: 'c67', title: 'Foundation Educ Fnd 16Sessions X 2Hours', description: 'دورة تأسيسية، 16 حصة لمدة ساعتين.', priceJod: 379, priceUsd: 534, priceSar: 2008, duration: '16 Sessions', level: 'تأسيس', category: 'تأسيس', teacher: 'معلم متخصص', imageUrl: 'https://i.ibb.co/yqgzk8N/image.jpg', sessionCount: 16, totalHours: 32 },
    { id: 'c68', title: 'Foundation Educ Fnd 8Sessions X 1.5Hours', description: 'دورة تأسيسية، 8 حصص لمدة ساعة ونصف.', priceJod: 199, priceUsd: 280, priceSar: 1054, duration: '8 Sessions', level: 'تأسيس', category: 'تأسيس', teacher: 'معلم متخصص', imageUrl: 'https://i.ibb.co/yqgzk8N/image.jpg', sessionCount: 8, totalHours: 12 },
    { id: 'c69', title: 'Foundation Educ Fnd 12Sessions X 1.5Hours', description: 'دورة تأسيسية، 12 حصة لمدة ساعة ونصف.', priceJod: 239, priceUsd: 337, priceSar: 1266, duration: '12 Sessions', level: 'تأسيس', category: 'تأسيس', teacher: 'معلم متخصص', imageUrl: 'https://i.ibb.co/yqgzk8N/image.jpg', sessionCount: 12, totalHours: 18 },
    { id: 'c70', title: 'Foundation Educ Fnd 16Sessions X 1.5Hours', description: 'دورة تأسيسية، 16 حصة لمدة ساعة ونصف.', priceJod: 319, priceUsd: 449, priceSar: 1690, duration: '16 Sessions', level: 'تأسيس', category: 'تأسيس', teacher: 'معلم متخصص', imageUrl: 'https://i.ibb.co/yqgzk8N/image.jpg', sessionCount: 16, totalHours: 24 },
    { id: 'c71', title: 'Foundation Educ Fnd 8Sessions X 1Hour', description: 'دورة تأسيسية، 8 حصص لمدة ساعة.', priceJod: 179, priceUsd: 252, priceSar: 948, duration: '8 Sessions', level: 'تأسيس', category: 'تأسيس', teacher: 'معلم متخصص', imageUrl: 'https://i.ibb.co/yqgzk8N/image.jpg', sessionCount: 8, totalHours: 8 },
    { id: 'c72', title: 'Foundation Educ Fnd 12Sessions X 1Hour', description: 'دورة تأسيسية، 12 حصة لمدة ساعة.', priceJod: 207, priceUsd: 292, priceSar: 1097, duration: '12 Sessions', level: 'تأسيس', category: 'تأسيس', teacher: 'معلم متخصص', imageUrl: 'https://i.ibb.co/yqgzk8N/image.jpg', sessionCount: 12, totalHours: 12 },
    { id: 'c73', title: 'Foundation Educ Fnd 16Sessions X 1Hour', description: 'دورة تأسيسية، 16 حصة لمدة ساعة.', priceJod: 269, priceUsd: 379, priceSar: 1425, duration: '16 Sessions', level: 'تأسيس', category: 'تأسيس', teacher: 'معلم متخصص', imageUrl: 'https://i.ibb.co/yqgzk8N/image.jpg', sessionCount: 16, totalHours: 16 },
    
    // Special Courses (Languages)
    { id: 'c74', title: 'Special Courses Prm+ 8Sessions X 2Hours', description: 'دورة لغات متخصصة، 8 حصص لمدة ساعتين.', priceJod: 239, priceUsd: 337, priceSar: 1266, duration: '8 Sessions', level: 'لغات', category: 'لغات', teacher: 'معلم متخصص', imageUrl: 'https://i.ibb.co/mXTy1Ww/image.jpg', sessionCount: 8, totalHours: 16 },
    { id: 'c75', title: 'Special Courses Prm+ 12Sessions X 2Hours', description: 'دورة لغات متخصصة، 12 حصة لمدة ساعتين.', priceJod: 319, priceUsd: 449, priceSar: 1690, duration: '12 Sessions', level: 'لغات', category: 'لغات', teacher: 'معلم متخصص', imageUrl: 'https://i.ibb.co/mXTy1Ww/image.jpg', sessionCount: 12, totalHours: 24 },
    { id: 'c76', title: 'Special Courses Prm+ 16Sessions X 2Hours', description: 'دورة لغات متخصصة، 16 حصة لمدة ساعتين.', priceJod: 419, priceUsd: 590, priceSar: 2220, duration: '16 Sessions', level: 'لغات', category: 'لغات', teacher: 'معلم متخصص', imageUrl: 'https://i.ibb.co/mXTy1Ww/image.jpg', sessionCount: 16, totalHours: 32 },
    { id: 'c77', title: 'Special Courses Prm+ 8Sessions X 1.5Hours', description: 'دورة لغات متخصصة، 8 حصص لمدة ساعة ونصف.', priceJod: 219, priceUsd: 308, priceSar: 1160, duration: '8 Sessions', level: 'لغات', category: 'لغات', teacher: 'معلم متخصص', imageUrl: 'https://i.ibb.co/mXTy1Ww/image.jpg', sessionCount: 8, totalHours: 12 },
    { id: 'c78', title: 'Special Courses Prm+ 12Sessions X 1.5Hours', description: 'دورة لغات متخصصة، 12 حصة لمدة ساعة ونصف.', priceJod: 249, priceUsd: 351, priceSar: 1319, duration: '12 Sessions', level: 'لغات', category: 'لغات', teacher: 'معلم متخصص', imageUrl: 'https://i.ibb.co/mXTy1Ww/image.jpg', sessionCount: 12, totalHours: 18 },
    { id: 'c79', title: 'Special Courses Prm+ 16Sessions X 1.5Hours', description: 'دورة لغات متخصصة، 16 حصة لمدة ساعة ونصف.', priceJod: 339, priceUsd: 478, priceSar: 1796, duration: '16 Sessions', level: 'لغات', category: 'لغات', teacher: 'معلم متخصص', imageUrl: 'https://i.ibb.co/mXTy1Ww/image.jpg', sessionCount: 16, totalHours: 24 },
    { id: 'c80', title: 'Special Courses Prm+ 8Sessions X 1Hour', description: 'دورة لغات متخصصة، 8 حصص لمدة ساعة.', priceJod: 199, priceUsd: 280, priceSar: 1054, duration: '8 Sessions', level: 'لغات', category: 'لغات', teacher: 'معلم متخصص', imageUrl: 'https://i.ibb.co/mXTy1Ww/image.jpg', sessionCount: 8, totalHours: 8 },
    { id: 'c81', title: 'Special Courses Prm+ 12Sessions X 1Hour', description: 'دورة لغات متخصصة، 12 حصة لمدة ساعة.', priceJod: 229, priceUsd: 323, priceSar: 1213, duration: '12 Sessions', level: 'لغات', category: 'لغات', teacher: 'معلم متخصص', imageUrl: 'https://i.ibb.co/mXTy1Ww/image.jpg', sessionCount: 12, totalHours: 12 },
    { id: 'c82', title: 'Special Courses Prm+ 16Sessions X 1Hour', description: 'دورة لغات متخصصة، 16 حصة لمدة ساعة.', priceJod: 299, priceUsd: 421, priceSar: 1584, duration: '16 Sessions', level: 'لغات', category: 'لغات', teacher: 'معلم متخصص', imageUrl: 'https://i.ibb.co/mXTy1Ww/image.jpg', sessionCount: 16, totalHours: 16 },
];

const testimonials: Testimonial[] = [
    { id: '1', name: 'أمل محمود', role: 'ولي أمر', avatarUrl: 'https://i.ibb.co/Jqj3B2W/image.jpg', quote: 'تجربة ممتازة! ابني تحسن مستواه بشكل ملحوظ في الرياضيات بفضل المعلم خالد. المنصة سهلة الاستخدام والدعم الفني رائع.' },
    { id: '2', name: 'أحمد علي', role: 'طالب جامعي', avatarUrl: 'https://i.ibb.co/jH0312F/image.jpg', quote: 'استفدت كثيرًا من دورة التحضير للـ TOEFL مع المعلمة فاطمة. الشرح كان واضحًا والتمارين مفيدة جدًا.' },
    { id: '3', name: 'سارة حسين', role: 'طالبة ثانوية', avatarUrl: 'https://i.ibb.co/2nS2Xfb/image.jpg', quote: 'كانت مادة الفيزياء صعبة بالنسبة لي، لكن مع المعلمة سارة أصبحت أسهل وأكثر متعة. شكرًا JoTutor!' },
];

const blogPosts: BlogPost[] = [
    { id: '1', title: '5 استراتيجيات لزيادة التركيز أثناء الدراسة عن بعد', author: 'فريق JoTutor', date: '2023-10-15T12:00:00Z', excerpt: 'في عالم التعليم الرقمي، أصبح الحفاظ على التركيز تحديًا كبيرًا. نقدم لكم 5 طرق عملية لمساعدتكم...', imageUrl: 'https://i.ibb.co/L8zB3Sy/image.jpg', tags: ['نصائح', 'دراسة'], type: 'article', content: '<p>هنا محتوى المقال الكامل...</p>' },
    { id: '2', title: 'كيف تختار المعلم الخصوصي المناسب لطفلك؟', author: 'أحمد صالح', date: '2023-10-05T09:00:00Z', excerpt: 'اختيار المعلم المناسب هو استثمار في مستقبل طفلك. إليك بعض النقاط المهمة التي يجب مراعاتها...', imageUrl: 'https://i.ibb.co/K500zVp/image.jpg', tags: ['أولياء أمور', 'اختيار'], type: 'article', content: '<p>هنا محتوى المقال الكامل...</p>' },
    { id: '3', title: 'شرح قاعدة المبني للمجهول في دقيقة', author: 'المعلمة فاطمة', date: '2023-09-28T15:00:00Z', excerpt: 'فيديو قصير ومفيد لشرح قاعدة Passive Voice في اللغة الإنجليزية.', imageUrl: 'https://i.ytimg.com/vi/cwc3h6_q-A0/hqdefault.jpg', tags: ['إنجليزية', 'قواعد'], type: 'short', youtubeVideoId: 'cwc3h6_q-A0', content: 'شرح سريع لقاعدة المبني للمجهول.' },
];

const heroSlides: HeroSlide[] = [
    { id: '1', title: 'تعليم فردي مخصص مدعوم بالذكاء الاصطناعي', description: 'نركز على احتياجات كل طالب وأسلوب تعلمه الخاص مع استراتيجية تعليمية مدعومة بالذكاء الاصطناعي', imageUrl: 'https://i.ibb.co/4ZRTCY4g/image.jpg' },
    { id: '2', title: 'نخبة من المعلمين بين يديك', description: 'فريق من أفضل المعلمين مع خبرة واسعة في التعليم وشهادات معتمدة من أرقى الجامعات', imageUrl: 'https://i.ibb.co/zWzrLWx9/02-1.jpg' },
    { id: '3', title: 'متابعة دقيقة وتقارير أداء ذكية', description: 'تقنيات حديثة لتحليل التقدم ووضع خطط تعليمية ذكية مع متابعة دقيقة للأداء', imageUrl: 'https://i.ibb.co/zWxm4Bp4/image.jpg' },
];

const homepageContent: HomepageContent = {
  featuresTitle: 'لماذا تختار JoTutor؟',
  featuresSubtitle: 'نحن نقدم تجربة تعليمية فريدة ومصممة خصيصًا لتلبية احتياجاتك.',
  feature1Title: 'معلمون خبراء',
  feature1Desc: 'نخبة من أفضل المعلمين والمعلمات لمساعدتك على التفوق الدراسي.',
  feature2Title: 'مناهج متكاملة',
  feature2Desc: 'تغطية شاملة لجميع المناهج الدراسية المحلية والدولية.',
  feature3Title: 'مرونة في المواعيد',
  feature3Desc: 'اختر الأوقات التي تناسبك لدروسك الخصوصية عبر الإنترنت.',
  howItWorksTitle: 'كيف يعمل؟',
  howItWorksSubtitle: 'ابدأ رحلتك التعليمية في ثلاث خطوات بسيطة.',
  step1Title: 'ابحث عن معلم',
  step1Desc: 'تصفح قائمة المعلمين واختر الأنسب لاحتياجاتك.',
  step2Title: 'احجز حصة',
  step2Desc: 'اختر الموعد المناسب لك وقم بحجز حصتك الدراسية بسهولة.',
  step3Title: 'ابدأ التعلم',
  step3Desc: 'انضم إلى حصتك عبر الإنترنت وابدأ رحلة التفوق.',
  teacherSearchTitle: 'ابحث عن معلمك المثالي',
  teacherSearchSubtitle: 'تواصل مع أفضل المعلمين الخصوصيين في الأردن.',
  discoverMoreTeachers: 'اكتشف المزيد من المعلمين',
  coursesPreviewTitle: 'أحدث الدورات',
  coursesPreviewSubtitle: 'تصفح أحدث الدورات المضافة في مختلف المجالات.',
  discoverMoreCourses: 'اكتشف المزيد من الدورات',
  testimonialsTitle: 'ماذا يقولون عنا',
  testimonialsSubtitle: 'آراء طلابنا وأولياء أمورهم هي شهادتنا الأغلى.',
  aiPlannerTitle: 'مخطط الدروس الذكي',
  aiPlannerSubtitle: 'استخدم الذكاء الاصطناعي لإنشاء خطط دروس متكاملة في ثوانٍ.',
  statsTeacherCount: '+750',
  statsTeacherLabel: 'معلم ومعلمة',
  statsAcceptanceRate: '25%',
  statsAcceptanceLabel: 'معدل القبول',
  statsStudentCount: '+5000',
  statsStudentLabel: 'طالب مسجل',
  statsSatisfactionRate: '95%',
  statsSatisfactionLabel: 'رضا أولياء الأمور',
};

const aboutContent: AboutContent = {
    heroImage: 'https://i.ibb.co/YFL8kfwv/image.jpg',
    aboutTitle: 'عن JoTutor',
    visionTitle: 'رؤيتنا',
    vision: 'منح المعلمين القيمة التي يستحقونها، والتي ستنعكس إيجابًا على تطور أطفالنا.',
    visionImage: 'https://i.ibb.co/4ZRTCY4g/image.jpg',
    missionTitle: 'رسالتنا',
    mission: 'تغطية جميع الاحتياجات الناتجة عن تطور التعليم ومواجهة التحديات التي تفرضها المناهج الجامدة، من خلال أساليب تعليم فردي مدعومة بالذكاء الاصطناعي. نهدف إلى دمج معايير المدارس مع أسس التعليم الخصوصي الحديثة، وتقديم الخدمة في منازل الأطفال وعبر الإنترنت، بطريقة ترفع مستواهم وتمكّنهم من الوصول إلى أقصى إمكاناتهم.',
    teacherCommunityTitle: 'مجتمع المعلمين لدينا',
    teacherCommunity: 'نسعى لبناء مجتمع من المعلمين قادر على إحداث أثر إيجابي في تطور المجتمع ككل.',
    whyJoTutorTitle: 'لماذا JoTutor؟',
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
    geminiApiKey: 'AIzaSyA9Mik-C-2DwTZ90IRZ-9YhBLB-YoR5zFE', // Added API Key
    homepage: homepageContent,
    about: aboutContent,
    faq: [
        { id: '1', question: 'كيف يمكنني حجز حصة مع معلم؟', answer: 'يمكنك تصفح قائمة المعلمين، واختيار المعلم المناسب، ثم الضغط على "عرض الملف الشخصي" لرؤية المواعيد المتاحة وحجز حصة مباشرة.' },
        { id: '2', question: 'هل الحصص مسجلة؟', answer: 'نعم، يتم تسجيل جميع الحصص ويمكن للطالب الرجوع إليها في أي وقت للمراجعة من خلال لوحة التحكم الخاصة به.' },
    ],
    contact: { email: 'contact@jotutor.com', phone: '+962 79 123 4567', address: 'عمان, الأردن' },
    privacy: 'هنا نص سياسة الخصوصية الكامل...',
    terms: 'هنا نص شروط وأحكام الاستخدام الكاملة...',
    paymentRefundPolicy: 'سياسة الدفع والإرجاع هنا...',
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
