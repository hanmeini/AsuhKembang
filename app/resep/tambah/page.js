'use client';

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../context/AuthContext';
import { FaImage, FaArrowLeft } from 'react-icons/fa';
import Image from 'next/image';
import Link from 'next/link';

export default function TambahResepPage() {
    const router = useRouter();
    const { userProfile } = useAuth();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('MPASI 6-8 Bulan');
    const [ingredients, setIngredients] = useState('');
    const [instructions, setInstructions] = useState('');
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const fileInputRef = useRef(null);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            let imageUrl = null;
            if (imageFile) {
                const formData = new FormData();
                formData.append('file', imageFile);
                formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET);
                const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`;
                const res = await fetch(cloudinaryUrl, { method: 'POST', body: formData });
                const data = await res.json();
                if (!res.ok) throw new Error(data.error.message);
                imageUrl = data.secure_url;
            }

            const response = await fetch('/api/resep', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: userProfile.uid,
                    authorName: userProfile.displayName,
                    authorAvatar: userProfile.photoURL,
                    title,
                    description,
                    category,
                    imageUrl,
                    ingredients: ingredients.split('\n'),
                    instructions: instructions.split('\n'),
                }),
            });

            if (!response.ok) throw new Error('Gagal menyimpan resep.');
            
            router.push('/resep');
            router.refresh();

        } catch (error) {
            console.error(error);
            alert(`Terjadi kesalahan: ${error.message}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white border-b sticky top-0 z-10">
                <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
                    <Link href="/resep" className="flex items-center gap-2 text-gray-700 hover:text-gray-900">
                        <FaArrowLeft className="w-5 h-5" />
                        <span className="font-medium">Kembali</span>
                    </Link>
                    <h1 className="text-xl font-bold">Tambah Resep Baru</h1>
                    <div className="w-20"></div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-4xl mx-auto px-4 py-8">
                <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm">
                    {/* Image Upload */}
                    <div 
                        className="relative h-64 bg-gray-100 rounded-t-2xl overflow-hidden group cursor-pointer"
                        onClick={() => fileInputRef.current.click()}
                    >
                        {imagePreview ? (
                            <Image 
                                src={imagePreview} 
                                alt="Preview" 
                                fill 
                                className="object-cover"
                            />
                        ) : (
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400">
                                <FaImage className="w-16 h-16 mb-4" />
                                <p className="text-lg font-medium">Klik untuk menambahkan foto resep</p>
                                <p className="text-sm text-gray-500 mt-2">Format: JPG, PNG (Max 5MB)</p>
                            </div>
                        )}
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <span className="text-white font-medium">Ganti Foto</span>
                        </div>
                        <input 
                            type="file" 
                            ref={fileInputRef} 
                            onChange={handleImageChange} 
                            accept="image/*" 
                            className="hidden"
                        />
                    </div>

                    {/* Form Fields */}
                    <div className="p-6 space-y-6">
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">Judul Resep</label>
                            <input 
                                type="text" 
                                value={title} 
                                onChange={e => setTitle(e.target.value)} 
                                className="w-full p-3 border rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all" 
                                placeholder="Contoh: Bubur Ayam Sayur"
                                required 
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">Deskripsi</label>
                            <textarea 
                                value={description} 
                                onChange={e => setDescription(e.target.value)} 
                                className="w-full p-3 border rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all" 
                                rows="3"
                                placeholder="Jelaskan secara singkat tentang resep ini..."
                            ></textarea>
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">Kategori</label>
                            <select 
                                value={category} 
                                onChange={e => setCategory(e.target.value)} 
                                className="w-full p-3 border rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                            >
                                <option>MPASI 6-8 Bulan</option>
                                <option>MPASI 9-11 Bulan</option>
                                <option>Anak 1+ Tahun</option>
                                <option>Ibu Hamil</option>
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">Bahan-bahan</label>
                            <textarea 
                                value={ingredients} 
                                onChange={e => setIngredients(e.target.value)} 
                                className="w-full p-3 border rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all" 
                                rows="6"
                                placeholder="200gr daging ayam&#10;2 sdm minyak zaitun&#10;1 siung bawang putih"
                                required
                            ></textarea>
                            <p className="text-sm text-gray-500">Tulis setiap bahan dalam baris baru</p>
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">Langkah-langkah</label>
                            <textarea 
                                value={instructions} 
                                onChange={e => setInstructions(e.target.value)} 
                                className="w-full p-3 border rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all" 
                                rows="8"
                                placeholder="1. Potong ayam menjadi dadu&#10;2. Tumis bawang putih&#10;3. Masak hingga matang"
                                required
                            ></textarea>
                            <p className="text-sm text-gray-500">Tulis setiap langkah dalam baris baru</p>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="px-6 pb-6">
                        <button 
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full py-3 bg-teal-600 text-white font-medium rounded-xl hover:bg-teal-700 
                                     disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors
                                     flex items-center justify-center gap-2"
                        >
                            {isSubmitting ? (
                                <>
                                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    <span>Menyimpan Resep...</span>
                                </>
                            ) : 'Simpan Resep'}
                        </button>
                    </div>
                </form>
            </main>
        </div>
    );
}