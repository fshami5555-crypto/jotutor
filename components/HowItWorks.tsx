
import React from 'react';

interface HowItWorksProps {
    strings: { [key: string]: string };
}

const HowItWorks: React.FC<HowItWorksProps> = ({ strings }) => {
  const steps = [
    { number: '01', title: strings.step1Title, description: strings.step1Desc },
    { number: '02', title: strings.step2Title, description: strings.step2Desc },
    { number: '03', title: strings.step3Title, description: strings.step3Desc },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-extrabold text-blue-900">{strings.howItWorksTitle}</h2>
          <p className="mt-4 text-lg text-gray-600">{strings.howItWorksSubtitle}</p>
        </div>
        <div className="relative">
          <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-green-200" style={{ transform: 'translateY(-50%)' }}></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
            {steps.map(step => (
              <div key={step.number} className="text-center p-6 bg-gray-50 rounded-lg shadow-md">
                <div className="flex items-center justify-center mx-auto h-20 w-20 rounded-full bg-green-500 text-white font-extrabold text-3xl border-4 border-white shadow-lg mb-6">
                  {step.number}
                </div>
                <h3 className="text-2xl font-bold text-blue-900 mb-3">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;