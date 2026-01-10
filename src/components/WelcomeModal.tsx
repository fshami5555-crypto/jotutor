
import React from 'react';

interface WelcomeModalProps {
    onStartChat: () => void;
    onClose: () => void;
}

const WelcomeModal: React.FC<WelcomeModalProps> = ({ onStartChat, onClose }) => {
    const mrPincelImage = "https://i.ibb.co/sd7GkLLT/image-removebg-preview.png";

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-blue-900/80 backdrop-blur-sm" onClick={onClose}></div>

            {/* Modal Content */}
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg p-8 text-center transform transition-all scale-100 animate-fade-in-up border-4 border-green-500">
                <div className="absolute -top-16 left-1/2 transform -translate-x-1/2">
                    <div className="w-32 h-32 bg-white rounded-full border-4 border-green-500 flex items-center justify-center shadow-lg">
                        <img 
                            src={mrPincelImage} 
                            alt="Mr. Pincel" 
                            className="w-24 h-24 object-contain"
                        />
                    </div>
                </div>

                <div className="mt-16">
                    <h2 className="text-3xl font-extrabold text-blue-900 mb-2">
                        أهلاً بك في JoTutor!
                    </h2>
                    <h3 className="text-xl font-bold text-green-600 mb-6">
                        دعني أساعدك في اختيار الدورة المناسبة لك
                    </h3>
                    
                    <p className="text-gray-600 mb-8 text-lg">
                        أنا <span className="font-bold">Mr. Pincel</span>، مساعدك الذكي. يمكنني تحليل احتياجاتك واقتراح أفضل المعلمين والدورات لك في ثوانٍ.
                    </p>

                    <div className="space-y-4">
                        <button 
                            onClick={onStartChat}
                            className="w-full bg-green-500 hover:bg-green-600 text-white text-lg font-bold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex items-center justify-center gap-2"
                        >
                            <span>أكمل بمساعدة المساعد الذكي Mr.Pincel</span>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                            </svg>
                        </button>

                        <button 
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600 font-medium text-sm hover:underline transition-colors"
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
