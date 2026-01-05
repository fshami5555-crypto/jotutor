
import React, { useState, useEffect } from 'react';
import { HeroSlide, HomepageContent } from '../types';

interface HeroSectionProps {
  onSignupClick: () => void;
  heroSlides: HeroSlide[];
  content?: HomepageContent;
  strings: { [key: string]: string };
}

const HeroSection: React.FC<HeroSectionProps> = ({ onSignupClick, heroSlides = [], content, strings }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (heroSlides.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [heroSlides]);

  const currentSlide = heroSlides[currentIndex];

  // Helper component for the styled title
  const Title: React.FC<{ text: string }> = ({ text }) => {
    if (!text) return null;
    const words = text.split(' ');
    const lastWord = words.pop();
    const mainText = words.join(' ');
    return (
        <h1 className="text-4xl md:text-6xl font-extrabold text-white leading-tight" style={{ textShadow: '0 4px 12px rgba(0,0,0,0.4)' }}>
            {mainText} <span className="text-green-400">{lastWord}</span>
        </h1>
    );
  };

  const stats = [
    {
      value: content?.statsStudentCount || '+5000',
      label: content?.statsStudentLabel || 'طالب مسجل',
      color: 'from-blue-500 to-blue-700',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      )
    },
    {
      value: content?.statsTeacherCount || '+750',
      label: content?.statsTeacherLabel || 'معلم معتمد',
      color: 'from-green-500 to-green-700',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138z" />
        </svg>
      )
    },
    {
      value: content?.statsSatisfactionRate || '98%',
      label: content?.statsSatisfactionLabel || 'نسبة نجاح طلابنا',
      color: 'from-orange-500 to-red-600',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      )
    },
    {
      value: content?.statsAcceptanceRate || '25%',
      label: content?.statsAcceptanceLabel || 'قبول المعلمين المتفوقين',
      color: 'from-purple-500 to-pink-600',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04M12 2.944V21m0-18.056L3.382 6m8.618-3.056L20.618 6" />
        </svg>
      )
    }
  ];

  return (
    <div className="relative flex flex-col">
      {/* Background Slides Section */}
      <section className="relative text-white overflow-hidden" style={{ minHeight: '600px' }}>
        <div className="absolute inset-0 z-0">
          {heroSlides.map((slide, index) => (
            <div
              key={index}
              className="absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ease-in-out"
              style={{
                backgroundImage: `url(${slide.imageUrl})`,
                opacity: index === currentIndex ? 1 : 0,
              }}
            />
          ))}
          <div className="absolute inset-0 bg-gradient-to-b from-blue-900/60 to-blue-900/90"></div>
        </div>

        {/* Content Section */}
        <div className="container mx-auto px-6 py-24 lg:py-40 flex flex-col lg:flex-row items-center relative z-10">
          <div className="lg:w-2/3 text-center lg:text-right animate-fade-in-up">
            {currentSlide && <Title text={currentSlide.title} />}
            {currentSlide && (
              <p className="mt-6 text-xl text-gray-100 max-w-2xl mx-auto lg:mx-0 font-medium leading-relaxed">
                {currentSlide.description}
              </p>
            )}
            <div className="mt-10 flex justify-center lg:justify-start">
              <button 
                onClick={onSignupClick} 
                className="bg-green-500 text-white font-black text-xl py-4 px-10 rounded-full hover:bg-green-600 transition-all duration-300 transform hover:scale-105 shadow-2xl flex items-center space-x-3 space-x-reverse"
              >
                <span>{strings.heroButton}</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 7l-5 5 5 5" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Separator Wave */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none z-10">
          <svg className="relative block w-full h-12 md:h-24" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V46.35C54.7,64.35,123.93,73.12,192,67.64,242.06,63.64,286,59.39,321.39,56.44Z" className="fill-gray-50"></path>
          </svg>
        </div>
      </section>

      {/* Floating Statistics Section (The 4 Circles) */}
      <div className="relative z-40 -mt-16 md:-mt-24 mb-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-10">
            {stats.map((stat, index) => (
              <div 
                key={index} 
                className="group relative flex flex-col items-center animate-fade-in-up" 
                style={{ animationDelay: `${index * 150}ms` }}
              >
                {/* Main Circle */}
                <div className={`relative w-36 h-36 md:w-52 md:h-52 rounded-full bg-white shadow-[0_20px_50px_rgba(0,0,0,0.15)] p-2 transition-all duration-500 transform group-hover:scale-110 group-hover:-translate-y-2 ring-4 ring-white/30 backdrop-blur-sm overflow-hidden`}>
                  {/* Decorative Gradient Background inside Circle */}
                  <div className={`w-full h-full rounded-full bg-gradient-to-tr ${stat.color} opacity-5 absolute inset-0`}></div>
                  
                  {/* Content Container */}
                  <div className="relative w-full h-full rounded-full border-2 border-dashed border-gray-100 flex flex-col items-center justify-center text-center p-4">
                    <div className={`mb-2 md:mb-3 text-transparent bg-clip-text bg-gradient-to-br ${stat.color} transform transition-transform group-hover:scale-125`}>
                        {stat.icon}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-2xl md:text-4xl font-black text-blue-900 leading-tight">
                        {stat.value}
                      </span>
                      <span className="text-[10px] md:text-xs font-bold text-gray-500 mt-1 uppercase tracking-tighter line-clamp-2 md:line-clamp-none">
                        {stat.label}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Floating Glow Behind */}
                <div className={`absolute inset-0 rounded-full bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-20 blur-2xl transition-all duration-500 -z-10`}></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
