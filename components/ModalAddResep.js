'use client';

import React, {useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaImage } from 'react-icons/fa';
import Image from 'next/image';

const AddRecipeModal = ({ onClose }) => {
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
            
            alert('Resep berhasil dibagikan! Terima kasih atas kontribusimu.');
            onClose();

        } catch (error) {
            console.error(error);
            alert(`Terjadi kesalahan: ${error.message}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 z-50 flex justify-center items-center p-4"
            >
                <motion.div
                    initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
                    className="bg-white w-full max-w-2xl h-[90vh] rounded-2xl shadow-xl flex flex-col"
                >
                    {/* Image Upload Section */}
                    <div className="relative h-48 bg-gray-100 rounded-t-2xl overflow-hidden group cursor-pointer"
                         onClick={() => fileInputRef.current.click()}>
                        {imagePreview ? (
                            <Image 
                                src={imagePreview} 
                                alt="Preview" 
                                fill 
                                className="object-cover"
                            />
                        ) : (
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400">
                                <FaImage className="w-12 h-12 mb-2" />
                                <p className="text-sm font-medium">Klik untuk menambahkan foto resep</p>
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

                    <div className="flex justify-between items-center p-4">
                        <h2 className="text-xl font-bold">Bagikan Resep Andalanku</h2>
                        <button 
                            onClick={onClose} 
                            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                        >
                            <FaTimes className="w-5 h-5 text-gray-500"/>
                        </button>
                    </div>
                    
                    <form onSubmit={handleSubmit} className="px-6 space-y-4 overflow-y-auto">
                        <div className="space-y-2">
                            <input 
                                type="text" 
                                placeholder="Judul Resep" 
                                value={title} 
                                onChange={e => setTitle(e.target.value)} 
                                className="w-full p-3 border rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all" 
                                required 
                            />
                        </div>

                        <div className="space-y-2">
                            <textarea 
                                placeholder="Deskripsi singkat resep..." 
                                value={description} 
                                onChange={e => setDescription(e.target.value)} 
                                className="w-full p-3 border rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all" 
                                rows="2"
                            ></textarea>
                        </div>

                        <div className="space-y-2">
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
                            <textarea 
                                placeholder="Bahan-bahan (satu per baris)&#10;Contoh:&#10;200gr daging ayam&#10;2 sdm minyak zaitun&#10;1 siung bawang putih" 
                                value={ingredients} 
                                onChange={e => setIngredients(e.target.value)} 
                                className="w-full p-3 border rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all" 
                                rows="4" 
                                required
                            ></textarea>
                        </div>

                        <div className="space-y-2">
                            <textarea 
                                placeholder="Langkah-langkah (satu per baris)&#10;Contoh:&#10;1. Potong ayam menjadi dadu&#10;2. Tumis bawang putih&#10;3. Masak hingga matang" 
                                value={instructions} 
                                onChange={e => setInstructions(e.target.value)} 
                                className="w-full p-3 border rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all" 
                                rows="6" 
                                required
                            ></textarea>
                        </div>
                    </form>

                    <div className="mt-auto p-4 flex justify-end space-x-4 border-t bg-gray-50">
                        <button 
                            type="button"
                            onClick={onClose} 
                            className="px-6 py-2.5 rounded-xl border border-gray-300 text-gray-700 font-medium hover:bg-gray-100 transition-colors"
                        >
                            Batal
                        </button>
                        <button 
                            onClick={handleSubmit} 
                            disabled={isSubmitting} 
                            className="px-6 py-2.5 rounded-xl bg-teal-600 text-white font-medium hover:bg-teal-700 
                                     disabled:bg-gray-400 disabled:cursor-not-allowed transform transition-all 
                                     active:scale-95 flex items-center gap-2"
                        >
                            {isSubmitting ? (
                                <>
                                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    <span>Mengirim...</span>
                                </>
                            ) : 'Bagikan Resep'}
                        </button>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default AddRecipeModal;
