import React from 'react';

interface AboutPageProps {
  content: string;
  strings: { [key: string]: string };
}

const AboutPage: React.FC<AboutPageProps> = ({ content, strings }) => {
  return (
    <div className="py-20 bg-white">
      <div className="container mx-auto px-6 max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-blue-900">{strings.aboutTitle}</h1>
        </div>
        <div 
          className="prose lg:prose-xl mx-auto text-gray-700 leading-relaxed" 
          dangerouslySetInnerHTML={{ __html: content.replace(/\n/g, '<br />') }}
        />
      </div>
    </div>
  );
};

export default AboutPage;
