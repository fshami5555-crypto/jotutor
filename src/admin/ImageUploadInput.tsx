import React, { useState, useRef } from 'react';

interface ImageUploadInputProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    className?: string;
}

const ImageUploadInput: React.FC<ImageUploadInputProps> = ({ value, onChange, placeholder, className }) => {
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        const formData = new FormData();
        formData.append('image', file);

        const apiKey = process.env.VITE_IMGBB_KEY || "";

        try {
            const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
                method: 'POST',
                body: formData,
            });
            const data = await response.json();
            
            if (data.success) {
                onChange(data.data.url);
            } else {
                alert('فشل رفع الصورة: ' + (data.error?.message || 'خطأ غير معروف'));
            }
        } catch (error) {
            console.error('Upload error:', error);
            alert('حدث خطأ أثناء رفع الصورة.');
        } finally {
            setUploading(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    return (
        <div className={`flex items-center space-x-2 space-x-reverse ${className || ''}`}>
            <div className="flex-1 relative">
                <input
                    type="text"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                    className="w-full p-2 border rounded text-left"
                    dir="ltr"
                />
            </div>
            
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
            />
            
            <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400 text-sm font-bold flex items-center gap-2 transition-colors"
            >
                {uploading ? 'جاري الرفع...' : 'رفع'}
            </button>
        </div>
    );
};

export default ImageUploadInput;