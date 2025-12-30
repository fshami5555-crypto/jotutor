import React, { useState } from 'react';

interface WelcomeModalProps {
    onStartChat: () => void;
    onClose: () => void;
}

const WelcomeModal: React.FC<WelcomeModalProps> = ({ onStartChat, onClose }) => {
    const [showComingSoon, setShowComingSoon] = useState(false);
    const mrPincelImage = "https://i.ibb.co/sd7GkLLT/image-removebg-preview.png";

    const handleAiClick = (e: React.MouseEvent) => {
        e.preventDefault();
        setShowComingSoon(true);
        // Hide notification after 4 seconds
        setTimeout(() => setShowComingSoon(false), 4000);
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-blue-900/85 backdrop-blur-md" onClick={onClose}></div>

            {/* Modal Content */}
            <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-xl p-8 md:p-10 text-center transform transition-all scale-100 animate-fade-in-up border-8 border-green-500/20">
                <div className="absolute -top-20 left-1/2 transform -translate-x-1/2">
                    <div className="w-36 h-36 bg-white rounded-full border-4 border-green-500 flex items-center justify-center shadow-2xl ring-8 ring-white">
                        <img 
                            src={mrPincelImage} 
                            alt="Mr. Pincel" 
                            className="w-28 h-28 object-contain"
                        />
                    </div>
                </div>

                <div className="mt-16">
                    <h2 className="text-3xl md:text-4xl font-extrabold text-blue-900 mb-2">
                        أهلاً بك في JoTutor!
                    </h2>
                    <h3 className="text-xl font-bold text-green-600 mb-8">
                        دعني أساعدك في اختيار الدورة المناسبة لك
                    </h3>
                    
                    <p className="text-gray-600 mb-10 text-lg md:text-xl leading-relaxed">
                        أنا <span className="font-bold text-blue-900">Mr. Pincel</span>، مساعدك الذكي. يمكنني تحليل احتياجاتك واقتراح أفضل المعلمين والدورات لك في ثوانٍ.
                    </p>

                    <div className="space-y-8 relative">
                        {/* Cloud Notification */}
                        {showComingSoon && (
                            <div className="absolute -top-20 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white px-8 py-4 rounded-[40px] shadow-2xl animate-bounce z-50 whitespace-nowrap border-4 border-white flex items-center gap-2">
                                <span className="font-black text-lg">سيكون متاحاً قريباً لخدمة طلابنا ☁️✨</span>
                                <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-t-[12px] border-t-blue-600"></div>
                            </div>
                        )}

                        <button 
                            onClick={handleAiClick}
                            className="w-full bg-gray-100 text-gray-400 text-xl font-bold py-5 px-8 rounded-2xl shadow-inner flex items-center justify-center gap-3 border-2 border-gray-200 opacity-70 cursor-not-allowed group transition-all"
                        >
                            <span>أكمل بمساعدة المساعد الذكي Mr.Pincel</span>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                        </button>

                        <button 
                            onClick={onClose}
                            className="w-full text-blue-900 font-black text-3xl md:text-4xl hover:text-green-600 transition-all transform hover:scale-105 py-4 underline decoration-4 underline-offset-8 block"
                        >
                            تابع للموقع بدون مساعدة Mr.Pincel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WelcomeModal;