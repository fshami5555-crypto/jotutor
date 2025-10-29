import React from 'react';

const CoursesView: React.FC = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">دوراتي المسجلة</h1>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <p className="text-gray-600">هنا ستظهر الدورات التي قمت بالتسجيل بها. (ميزة قيد التطوير)</p>
        {/* Placeholder content */}
        <div className="mt-6 border-t pt-6">
            <h3 className="text-lg font-semibold">لا يوجد دورات مسجلة حاليًا</h3>
            <p className="text-gray-500 mt-2">تصفح الدورات المتاحة وابدأ رحلتك التعليمية!</p>
            <button className="mt-4 bg-green-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-600">
                تصفح الدورات
            </button>
        </div>
      </div>
    </div>
  );
};

export default CoursesView;
