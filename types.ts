
// Fix: Removed circular and conflicting self-import.
export type Language = 'ar' | 'en';

export type Page = 'home' | 'teachers' | 'courses' | 'blog' | 'about' | 'contact' | 'join' | 'faq' | 'privacy' | 'terms' | 'dashboard' | 'admin' | 'teacher-profile' | 'course-profile' | 'article' | 'payment' | 'short-player' | 'videos';

export type Currency = 'JOD' | 'USD';

export interface UserProfile {
    username: string;
    email: string;
    password?: string; // Only used during signup process
    userType: 'Student' | 'Parent' | 'Teacher' | 'Admin';
    educationLevel: string;
    curriculum: string;
    subjects: string[];
}

export interface Teacher {
    id: number;
    name: string;
    avatarUrl: string;
    level: string; // e.g., 'ابتدائي', 'ثانوي'
    experience: number; // in years
    specialties: string[]; // e.g., 'الرياضيات', 'الفيزياء'
    pricePerHour: number; // in JOD
    rating: number; // 0-5
    reviews: number;
    bio: string;
    qualifications: string[];
}

export interface Testimonial {
    id: number;
    name: string;
    role: string; // e.g., 'ولي أمر', 'طالب'
    avatarUrl: string;
    quote: string;
}

export interface Course {
    id: number;
    title: string;
    description: string;
    teacher: string;
    price: number; // in JOD
    duration: string; // e.g., '4 أسابيع'
    level: 'مبتدئ' | 'متوسط' | 'متقدم';
    imageUrl: string;
    category: string;
}

export interface BlogPost {
    id: number;
    type: 'article' | 'short';
    title: string;
    author: string;
    date: string; // ISO format string
    excerpt: string;
    content: string; // Can be HTML string
    imageUrl: string;
    tags: string[];
    youtubeVideoId?: string;
}

export interface FAQItem {
    id: number;
    question: string;
    answer: string;
}

export interface OnboardingOptions {
    levels: string[];
    curriculums: string[];
    subjects: string[];
}

export interface SiteContent {
    about: string;
    faq: FAQItem[];
    contact: {
        email: string;
        phone: string;
        address: string;
    };
    privacy: string;
    terms: string;
    heroImages: string[];
    onboardingOptions: OnboardingOptions;
}