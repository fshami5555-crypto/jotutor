import React, { useState, useEffect } from 'react';

interface HeroSectionProps {
  onSignupClick: () => void;
  heroImages: string[];
  strings: { [key: string]: string };
}

const HeroSection: React.FC<HeroSectionProps> = ({ onSignupClick, heroImages = [], strings }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (heroImages.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % heroImages.length);
    }, 5000); // Change image every 5 seconds

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, [heroImages]);

  return (
    <section className="relative text-white" style={{ minHeight: '500px' }}>
       <div className="absolute inset-0 z-0">
          {heroImages.map((src, index) => (
            <div
              key={index}
              className="absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ease-in-out"
              style={{
                backgroundImage: `url(${src})`,
                opacity: index === currentIndex ? 1 : 0,
              }}
            />
          ))}
          <div className="absolute inset-0 bg-black/40"></div> {/* Overlay for better text contrast */}
        </div>

      <div className="container mx-auto px-6 py-20 lg:py-32 flex flex-col lg:flex-row items-center relative z-10">
        <div className="lg:w-1/2 text-center lg:text-right">
          <h1 className="text-4xl md:text-6xl font-extrabold text-white leading-tight" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
            {strings.heroTitle1} <span className="text-green-400">{strings.heroTitle2}</span>
          </h1>
          <p className="mt-6 text-lg text-gray-200 max-w-xl mx-auto lg:mx-0" style={{ textShadow: '0 1px 3px rgba(0,0,0,0.5)' }}>
            {strings.heroDescription}
          </p>
          <div className="mt-8 flex justify-center lg:justify-start">
            <button onClick={onSignupClick} className="bg-green-500 text-white font-bold text-lg py-3 px-8 rounded-full hover:bg-green-600 transition-transform duration-300 transform hover:scale-105 shadow-xl flex items-center space-x-2 space-x-reverse">
              <span>{strings.heroButton}</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l-5 5 5 5m-5-5h12" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;