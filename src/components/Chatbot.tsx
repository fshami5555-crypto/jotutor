import React, { useState, useEffect, useRef } from 'react';
import { Course, ChatMessage, Language } from '../types';
import { getChatbotResponse } from '../services/geminiService';
import { JOD_TO_USD_RATE } from '../constants';

interface ChatbotProps {
    courses: Course[];
    onSelectCourse: (id: string) => void;
    strings: { [key: string]: string };
    language: Language;
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
}

const Chatbot: React.FC<ChatbotProps> = ({ courses, onSelectCourse, strings, language, isOpen, setIsOpen }) => {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [userInput, setUserInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showTooltip, setShowTooltip] = useState(false);
    const [isSoonActive, setIsSoonActive] = useState(false); // New state for "Soon" cloud
    const messagesEndRef = useRef<null | HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages]);
    
    // Effect to manage the introductory tooltip
    useEffect(() => {
        const showTimer = setTimeout(() => {
            if (!isOpen && !isSoonActive) {
                setShowTooltip(true);
            }
        }, 2000); // Show tooltip after 2 seconds

        const hideTimer = setTimeout(() => {
            setShowTooltip(false);
        }, 9000); // Hide it after 7 more seconds

        return () => {
            clearTimeout(showTimer);
            clearTimeout(hideTimer);
        };
    }, [isOpen, isSoonActive]);


    useEffect(() => {
        if (isOpen) {
            setShowTooltip(false); // Hide tooltip immediately when chat is opened
            if (messages.length === 0) {
                setMessages([{ sender: 'bot', text: strings.chatbotWelcome }]);
            }
        }
    }, [isOpen, messages.length, strings.chatbotWelcome]);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        const trimmedInput = userInput.trim();
        if (!trimmedInput || isLoading) return;

        const userMessage: ChatMessage = { sender: 'user', text: trimmedInput };
        setMessages(prev => [...prev, userMessage]);
        setUserInput('');
        setIsLoading(true);

        try {
            const response = await getChatbotResponse(trimmedInput, courses);
            
            const recommendedCourses = courses.filter(course => 
                response.recommendedCourseIds.includes(String(course.id)) 
            );
            
            const botMessage: ChatMessage = {
                sender: 'bot',
                text: response.responseText,
                courses: recommendedCourses.length > 0 ? recommendedCourses : undefined
            };

            setMessages(prev => [...prev, botMessage]);

        } catch (error) {
            console.error("Chatbot error:", error);
            const errorMessage: ChatMessage = { sender: 'bot', text: "Sorry, I'm having trouble connecting right now." };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleFabClick = () => {
        // AI Chat is currently disabled - show "Coming Soon" notification instead
        setIsSoonActive(true);
        setShowTooltip(false);
        
        // Hide notification after 4 seconds
        setTimeout(() => {
            setIsSoonActive(false);
        }, 4000);
    };

    const mrPincelIcon = "https://i.ibb.co/sd7GkLLT/image-removebg-preview.png";

    return (
        <>
            {/* Soon Notification Cloud */}
            <div 
                className={`fixed bottom-24 right-6 w-64 bg-green-500 text-white p-4 rounded-2xl shadow-2xl z-50 transition-all duration-500 transform ${isSoonActive ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-4 scale-95 pointer-events-none'}`}>
                <p className="text-sm text-center font-bold">
                    {strings.chatbotSoon}
                </p>
                {/* Arrow */}
                <div className="absolute -bottom-2 right-8 w-0 h-0 border-l-8 border-l-transparent border-r-8 border-r-transparent border-t-8 border-t-green-500"></div>
            </div>

            {/* Standard Tooltip */}
            <div 
                role="tooltip"
                className={`fixed bottom-24 right-6 w-64 bg-blue-900 text-white p-3 rounded-lg shadow-lg z-50 transition-all duration-500 ease-in-out ${showTooltip && !isSoonActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}>
                <p className="text-sm text-center font-medium">
                    {strings.chatbotTooltip}
                </p>
                {/* Arrow */}
                <div className="absolute -bottom-2 right-6 w-0 h-0 border-l-8 border-l-transparent border-r-8 border-r-transparent border-t-8 border-t-blue-900"></div>
            </div>

            {/* FAB - Modified to trigger "Soon" cloud */}
            <button
                onClick={handleFabClick}
                className={`fixed bottom-6 right-6 bg-green-500 text-white rounded-full p-2 shadow-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-transform duration-300 z-50 border-2 border-white ${isOpen ? 'rotate-90 scale-0' : 'rotate-0 scale-100 hover:scale-110 active:scale-95'}`}
                aria-label="Open Chat"
            >
                <img 
                    src={mrPincelIcon} 
                    alt="Mr.Pincel" 
                    className="w-14 h-14 object-contain"
                />
            </button>

            {/* Chat Window - Hidden because chat is disabled */}
            <div className={`fixed bottom-24 right-6 w-full max-w-sm h-[70vh] max-h-[600px] bg-white rounded-xl shadow-2xl flex flex-col transition-all duration-300 origin-bottom-right z-50 ${isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0 pointer-events-none'}`}>
                {/* ... existing window content ... */}
            </div>
        </>
    );
};

export default Chatbot;