import React from 'react';
import { UserProfile } from '../../types';

interface UserProfileProps {
    userProfile: UserProfile;
}

const UserProfileView: React.FC<UserProfileProps> = ({ userProfile }) => {
    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">الملف الشخصي</h1>
            <div className="bg-white p-8 rounded-lg shadow-md">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-500">اسم المستخدم</label>
                        <p className="text-lg font-semibold text-gray-800 mt-1">{userProfile.username}</p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-500">البريد الإلكتروني</label>
                        <p className="text-lg font-semibold text-gray-800 mt-1">{userProfile.email}</p>
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-500">نوع المستخدم</label>
                        <p className="text-lg font-semibold text-gray-800 mt-1">{userProfile.userType}</p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-500">المستوى التعليمي</label>
                        <p className="text-lg font-semibold text-gray-800 mt-1">{userProfile.educationLevel}</p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-500">المنهاج</label>
                        <p className="text-lg font-semibold text-gray-800 mt-1">{userProfile.curriculum}</p>
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-500">المواد التي تهمني</label>
                        <div className="flex flex-wrap gap-2 mt-2">
                            {userProfile.subjects.map(subject => (
                                <span key={subject} className="bg-green-100 text-green-800 text-sm font-medium px-3 py-1 rounded-full">{subject}</span>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="mt-8 border-t pt-6">
                    <button className="bg-blue-900 text-white font-bold py-2 px-6 rounded-lg hover:bg-blue-800">
                        تعديل الملف الشخصي
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UserProfileView;
