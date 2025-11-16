import React from 'react';
import { DashboardView } from '../Dashboard';

interface DashboardNavProps {
    username: string;
    activeView: DashboardView;
    setActiveView: (view: DashboardView) => void;
    onLogout: () => void;
}

const DashboardNav: React.FC<DashboardNavProps> = ({ username, activeView, setActiveView, onLogout }) => {
    const navItems = [
        { id: 'profile', label: 'الملف الشخصي' },
        { id: 'courses', label: 'دوراتي' },
        { id: 'wallet', label: 'المحفظة' },
        { id: 'ai-assistant', label: 'المساعد الذكي' },
    ];

    return (
        <aside className="md:w-64 bg-white p-6 rounded-xl shadow-lg flex-shrink-0 w-full">
            <div className="text-center mb-8">
                <div className="w-24 h-