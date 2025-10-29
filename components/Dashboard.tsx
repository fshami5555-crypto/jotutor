import React, { useState } from 'react';
import { UserProfile } from '../types';
import DashboardNav from './dashboard/DashboardNav';
import UserProfileView from './dashboard/UserProfile';
import CoursesView from './dashboard/Courses';
import WalletView from './dashboard/Wallet';
import AIAssistantView from './dashboard/AIAssistant';

interface DashboardProps {
    userProfile: UserProfile;
    onLogout: () => void;
}

export type DashboardView = 'profile' | 'courses' | 'wallet' | 'ai-assistant';

const Dashboard: React.FC<DashboardProps> = ({ userProfile, onLogout }) => {
    const [activeView, setActiveView] = useState<DashboardView>('profile');

    const renderContent = () => {
        switch (activeView) {
            case 'profile':
                return <UserProfileView userProfile={userProfile} />;
            case 'courses':
                return <CoursesView />;
            case 'wallet':
                return <WalletView />;
            case 'ai-assistant':
                return <AIAssistantView />;
            default:
                return <UserProfileView userProfile={userProfile} />;
        }
    };

    return (
        <div className="bg-gray-100 min-h-screen">
            <div className="container mx-auto px-6 py-12">
                <div className="flex flex-col md:flex-row gap-8 items-start">
                    <DashboardNav 
                        username={userProfile.username} 
                        activeView={activeView} 
                        setActiveView={setActiveView} 
                        onLogout={onLogout} 
                    />
                    <main className="flex-1">
                        {renderContent()}
                    </main>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
