export type Page = 
  'home' | 'teachers' | 'teacher-profile' | 'courses' | 'course-profile' | 
  'payment' | 'videos' | 'short-player' | 'blog' | 'article' | 'about' | 
  'contact' | 'join' | 'faq' | 'privacy' | 'terms' | 
  'dashboard' | 'admin-dashboard' | 'admin-user-view';

export type Currency = 'JOD' | 'USD';
export type Language = 'ar' | 'en';

export interface HeroSlide {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
}

export interface Teacher {
  id: number;
  name: string;
  avatarUrl: string;
  level: string; // e.g., "ابتدائي ومتوسط"
  experience: number; // years
  specialties: string[];
  rating: number;
  reviews: number;
  pricePerHour: number;
  bio: string;
  qualifications: string[];
}

export interface Testimonial {
  id: number;
  name: string;
  role: string; // e.g., "ولي أمر"
  avatarUrl: string;
  quote: string;
}

export interface Course {
    id: number;
    title: string;
    description: string;
    teacher: string;
    price: number; // in JOD
    duration: string;
    level: string;
    imageUrl: string;
    category: string;
}

export interface UserProfile {
    id: number;
    username: string;
    email: string;
    phone: string;
    password?: string;
    userType: 'Student' | 'Parent';
    serviceType: string;
    educationStage: string;
    grade: string;
    curriculum: string;
    subjects: string[];
    dob: string; // YYYY-MM-DD
}

export interface OnboardingOptions {
    serviceTypes: string[];
    educationStages: string[];
    curriculums: string[];
    subjects: string[];
    languages: string[];
}

export interface FAQItem {
  id: number;
  question: string;
  answer: string;
}

export interface BlogPost {
  id: number;
  title: string;
  author: string;
  date: string; // ISO string
  excerpt: string;
  content: string;
  imageUrl: string;
  tags: string[];
  type: 'article' | 'short';
  youtubeVideoId?: string;
}

export interface ContactContent {
  email: string;
  phone: string;
  address: string;
}

export interface AboutContent {
  heroImage: string;
  vision: string;
  visionImage: string;
  mission: string;
  teacherCommunity: string;
  whyJoTutor: string[];
}

export interface SiteContent {
  about: AboutContent;
  faq: FAQItem[];
  contact: ContactContent;
  privacy: string;
  terms: string;
}

export interface ChatMessage {
    sender: 'user' | 'bot';
    text: string;
    courses?: Course[];
}

export type StaffPermission = 'Full Control' | 'Manage Teachers' | 'Manage Users' | 'Manage Blog';

export interface StaffMember {
    id: number;
    name: string;
    email: string;
    permissions: StaffPermission;
}

export interface Payment {
    id: number;
    date: string; // ISO String
    userId: number;
    userName: string;
    courseId: number;
    courseName: string;
    amount: number;
    currency: 'JOD' | 'USD';
    status: 'Success' | 'Failed';
}
