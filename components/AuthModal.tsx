import React, { useState } from 'react';
import { UserProfile, OnboardingOptions } from '../types';
import OnboardingWizard from './OnboardingWizard';

interface AuthModalProps {
  mode: 'login' | 'signup';
  onClose: () => void;
  onSwitchMode: (mode: 'login' | 'signup') => void;
  onLoginSuccess: (profile: UserProfile, role: 'user' | 'admin') => void;
  onboardingOptions: OnboardingOptions;
  strings: { [key: string]: string };
}

const AuthModal: React.FC<AuthModalProps> = ({ mode, onClose, onSwitchMode, onLoginSuccess, onboardingOptions, strings }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        // Dummy validation
        if (email === 'admin@jotutor.com' && password === 'admin123') {
            onLoginSuccess({ username: 'Admin', email, userType: 'Admin', educationLevel: '', curriculum: '', subjects: [] }, 'admin');
        } else if (email === 'user@jotutor.com' && password === 'user123') {
            onLoginSuccess({ username: 'Ahmad', email, userType: 'Student', educationLevel: 'ثانوي (10-12)', curriculum: 'المنهج الوطني الأردني', subjects: ['الرياضيات', 'الفيزياء'] }, 'user');
        } else {
            setError('بيانات الدخول غير صحيحة.');
        }
    };
    
    const handleSignupSuccess = (profile: UserProfile) => {
        // In a real app, this would also register the user in the backend.
        onLoginSuccess(profile, 'user');
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md" onClick={e => e.stopPropagation()}>
                <div className="p-8 relative">
                    <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>

                    {mode === 'login' ? (
                        <div>
                            <h2 className="text-3xl font-bold text-center text-blue-900 mb-6">{strings.loginTitle}</h2>
                            <form onSubmit={handleLogin} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">{strings.email}</label>
                                    <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="mt-1 w-full p-3 border border-gray-300 rounded-md" required />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">{strings.password}</label>
                                    <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="mt-1 w-full p-3 border border-gray-300 rounded-md" required />
                                </div>
                                {error && <p className="text-red-500 text-sm">{error}</p>}
                                <button type="submit" className="w-full bg-green-500 text-white font-bold py-3 rounded-md hover:bg-green-600">{strings.loginButton}</button>
                            </form>
                            <div className="text-center mt-4">
                                <button onClick={() => onSwitchMode('signup')} className="text-sm text-green-600 hover:underline">
                                    {strings.switchToSignup} {strings.signup}
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div>
                            <h2 className="text-3xl font-bold text-center text-blue-900 mb-4">{strings.signupTitle}</h2>
                            <OnboardingWizard options={onboardingOptions} onSignupSuccess={handleSignupSuccess} strings={strings} />
                            <div className="text-center mt-4">
                                <button onClick={() => onSwitchMode('login')} className="text-sm text-green-600 hover:underline">
                                    {strings.switchToLogin} {strings.login}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AuthModal;
