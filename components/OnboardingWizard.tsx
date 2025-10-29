import React, { useState } from 'react';
import { UserProfile, OnboardingOptions } from '../types';

interface OnboardingWizardProps {
    options: OnboardingOptions;
    onSignupSuccess: (profile: UserProfile) => void;
    strings: { [key: string]: string };
}

const OnboardingWizard: React.FC<OnboardingWizardProps> = ({ options, onSignupSuccess, strings }) => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState<Partial<UserProfile>>({
        userType: 'Student',
        subjects: []
    });

    const handleNext = () => setStep(prev => prev + 1);
    const handleBack = () => setStep(prev => prev - 1);

    const handleSelect = (key: keyof UserProfile, value: any) => {
        setFormData(prev => ({ ...prev, [key]: value }));
    };

    const handleSubjectToggle = (subject: string) => {
        setFormData(prev => {
            const subjects = prev.subjects || [];
            const newSubjects = subjects.includes(subject)
                ? subjects.filter(s => s !== subject)
                : [...subjects, subject];
            return { ...prev, subjects: newSubjects };
        });
    };
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Dummy data for missing fields
        const finalProfile: UserProfile = {
            username: formData.username || `User${Date.now()}`,
            email: formData.email || '',
            password: formData.password || '',
            userType: formData.userType || 'Student',
            educationLevel: formData.educationLevel || '',
            curriculum: formData.curriculum || '',
            subjects: formData.subjects || []
        };
        onSignupSuccess(finalProfile);
    };

    return (
        <form onSubmit={handleSubmit} className="p-4">
            {step === 1 && (
                <div>
                    {/* Fix: Renamed string key to avoid conflict. */}
                    <h3 className="text-lg font-semibold text-center mb-2">{strings.onboardingStep1Title}</h3>
                    {/* Fix: Renamed string key to avoid conflict. */}
                    <p className="text-center text-gray-600 mb-4">{strings.onboardingStep1Desc}</p>
                    <div className="flex justify-center gap-4">
                         {['Student', 'Parent'].map(type => (
                            <button key={type} type="button" onClick={() => handleSelect('userType', type as 'Student' | 'Parent')} className={`p-4 border rounded-lg w-32 text-center ${formData.userType === type ? 'bg-green-500 text-white border-green-500' : 'hover:border-green-400'}`}>
                                {strings[`userType${type}`]}
                            </button>
                        ))}
                    </div>
                </div>
            )}
             {step === 2 && (
                <div>
                    {/* Fix: Renamed string key to avoid conflict. */}
                    <h3 className="text-lg font-semibold text-center mb-2">{strings.onboardingStep2Title}</h3>
                    {/* Fix: Renamed string key to avoid conflict. */}
                    <p className="text-center text-gray-600 mb-4">{strings.onboardingStep2Desc}</p>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">{strings.educationLevel}</label>
                            <select onChange={e => handleSelect('educationLevel', e.target.value)} value={formData.educationLevel} className="w-full p-2 border rounded mt-1">
                                {options.levels.map(l => <option key={l} value={l}>{l}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">{strings.curriculum}</label>
                            <select onChange={e => handleSelect('curriculum', e.target.value)} value={formData.curriculum} className="w-full p-2 border rounded mt-1">
                                {options.curriculums.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>
                    </div>
                </div>
            )}
            {step === 3 && (
                 <div>
                    {/* Fix: Renamed string key to avoid conflict. */}
                    <h3 className="text-lg font-semibold text-center mb-2">{strings.onboardingStep3Title}</h3>
                    {/* Fix: Renamed string key to avoid conflict. */}
                    <p className="text-center text-gray-600 mb-4">{strings.onboardingStep3Desc}</p>
                    <div className="flex flex-wrap gap-2 justify-center">
                        {options.subjects.map(subject => (
                             <button key={subject} type="button" onClick={() => handleSubjectToggle(subject)} className={`px-4 py-2 border rounded-full text-sm ${formData.subjects?.includes(subject) ? 'bg-green-500 text-white border-green-500' : 'bg-gray-100'}`}>
                                {subject}
                            </button>
                        ))}
                    </div>
                </div>
            )}
            {step === 4 && (
                <div className="space-y-4">
                     <h3 className="text-lg font-semibold text-center mb-4">معلومات الحساب</h3>
                    <input type="text" placeholder={strings.username} onChange={e => handleSelect('username', e.target.value)} className="w-full p-2 border rounded" required />
                    <input type="email" placeholder={strings.email} onChange={e => handleSelect('email', e.target.value)} className="w-full p-2 border rounded" required />
                    <input type="password" placeholder={strings.password} onChange={e => handleSelect('password', e.target.value)} className="w-full p-2 border rounded" required />
                </div>
            )}

            <div className="flex justify-between mt-6">
                {step > 1 ? <button type="button" onClick={handleBack} className="bg-gray-200 py-2 px-6 rounded-md">{strings.back}</button> : <div />}
                {step < 4 ? <button type="button" onClick={handleNext} className="bg-green-500 text-white py-2 px-6 rounded-md">{strings.next}</button> : <button type="submit" className="bg-green-500 text-white py-2 px-6 rounded-md">{strings.finish}</button>}
            </div>
        </form>
    );
};

export default OnboardingWizard;