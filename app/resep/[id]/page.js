'use client';

import React, { useState, useEffect } from 'react';
import AuthGuard from '../../../context/AuthGuard';
import BottomNavBar from '../../../components/BottomNav';
import Image from 'next/image';
import Link from 'next/link';
import { FaArrowLeft, FaLeaf, FaFire, FaRegClock } from 'react-icons/fa';
import 'swiper/css';
import 'swiper/css/pagination';
import { motion } from 'framer-motion';

// Komponen untuk konten utama resep (bahan, instruksi, dll.)
const RecipeContent = ({ recipe }) => (
    <>
        <div className="mt-8">
            <h2 className="text-xl font-bold text-gray-700">Keunggulan Gizi</h2>
            <div className="mt-4 space-y-3">
                <div className="flex items-start gap-3"><div className="w-8 h-8 flex-shrink-0 bg-gray-100 rounded-full flex items-center justify-center"><FaFire className="text-red-500"/></div><div><p className="font-semibold">Tinggi Zat Besi</p><p className="text-sm text-gray-600">Sangat penting untuk mencegah anemia dan mendukung perkembangan kognitif.</p></div></div>
                <div className="flex items-start gap-3"><div className="w-8 h-8 flex-shrink-0 bg-gray-100 rounded-full flex items-center justify-center"><FaLeaf className="text-green-500"/></div><div><p className="font-semibold">Sumber Protein Hewani</p><p className="text-sm text-gray-600">Mendukung pertumbuhan sel dan otot si kecil.</p></div></div>
            </div>
        </div>
        
        <hr className="my-8 border-gray-200" />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
                <h2 className="text-xl font-bold text-gray-700">Bahan-Bahan</h2>
                <ul className="mt-4 space-y-2 list-disc list-inside text-gray-600">
                    {recipe.ingredients?.map(item => <li key={item}>{item}</li>)}
                </ul>
            </div>
            <div>
                <h2 className="text-xl font-bold text-gray-700">Cara Membuat</h2>
                <ol className="mt-4 space-y-3 list-decimal list-inside text-gray-600">
                    {recipe.instructions?.map(item => <li key={item}>{item}</li>)}
                </ol>
            </div>
        </div>
    </>
);


export default function RecipeDetailPage({ params }) {
    const resolvedParams = React.use(params);
    const { id } = resolvedParams;
    const [recipe, setRecipe] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (id) {
            const fetchRecipeDetail = async () => {
                try {
                    const response = await fetch(`/api/resep/${id}`);
                    const data = await response.json();
                    if (!response.ok) throw new Error(data.error);
                    setRecipe(data);
                } catch (error) {
                    console.error("Gagal memuat detail resep:", error);
                } finally {
                    setIsLoading(false);
                }
            };
            fetchRecipeDetail();
        }
    }, [id]);

    if (isLoading) {
        return (
            <AuthGuard>
                {/* Mobile Skeleton */}
                <div className="md:hidden bg-gray-50 min-h-screen pb-20 animate-pulse">
                    <div className="relative">
                        <div className="h-80 bg-gray-200"></div>
                    </div>
                    <div className="bg-gray-50 p-6 rounded-t-3xl -mt-8 relative z-10">
                        <div className="h-8 bg-gray-200 rounded-md mb-4"></div>
                        <div className="flex items-center gap-4 mt-4">
                            <div className="h-6 w-24 bg-gray-200 rounded-full"></div>
                            <div className="h-6 w-20 bg-gray-200 rounded-full"></div>
                        </div>
                        <hr className="my-6" />
                        <div className="space-y-4">
                            <div className="h-6 bg-gray-200 rounded-md"></div>
                            <div className="h-6 bg-gray-200 rounded-md"></div>
                            <div className="h-6 bg-gray-200 rounded-md"></div>
                        </div>
                        <hr className="my-8 border-gray-200" />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div>
                                <div className="h-7 bg-gray-200 rounded-md mb-4"></div>
                                <div className="space-y-2">
                                    <div className="h-4 bg-gray-200 rounded-md"></div>
                                    <div className="h-4 bg-gray-200 rounded-md"></div>
                                    <div className="h-4 bg-gray-200 rounded-md"></div>
                                </div>
                            </div>
                            <div>
                                <div className="h-7 bg-gray-200 rounded-md mb-4"></div>
                                <div className="space-y-2">
                                    <div className="h-4 bg-gray-200 rounded-md"></div>
                                    <div className="h-4 bg-gray-200 rounded-md"></div>
                                    <div className="h-4 bg-gray-200 rounded-md"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Desktop Skeleton */}
                <div className="hidden md:block bg-white animate-pulse">
                    <header className="bg-teal-600 text-white p-20 md:rounded-b-[4rem] relative">
                        <div className="max-w-6xl mx-auto pt-8">
                            <div className="h-12 bg-teal-200 rounded-md w-1/2 mb-4"></div>
                            <div className="flex items-center gap-x-6 gap-y-2 mt-4 text-teal-100 opacity-90">
                                <div className="h-6 bg-teal-200 rounded-md w-32"></div>
                                <div className="h-6 bg-teal-200 rounded-md w-24"></div>
                            </div>
                        </div>
                    </header>
                    <main className="max-w-6xl mx-auto px-8 pb-16">
                        <div className="grid grid-cols-1 place-items-center -mt-22 relative z-10">
                            <div>
                                <div className="w-[400px] h-64 bg-gray-200 rounded-xl shadow-lg"></div>
                            </div>
                        </div>
                        <div className="my-12">
                            <div className="space-y-4">
                                <div className="h-6 bg-gray-200 rounded-md"></div>
                                <div className="h-6 bg-gray-200 rounded-md"></div>
                                <div className="h-6 bg-gray-200 rounded-md"></div>
                            </div>
                            <hr className="my-8 border-gray-200" />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div>
                                    <div className="h-7 bg-gray-200 rounded-md mb-4"></div>
                                    <div className="space-y-2">
                                        <div className="h-4 bg-gray-200 rounded-md"></div>
                                        <div className="h-4 bg-gray-200 rounded-md"></div>
                                        <div className="h-4 bg-gray-200 rounded-md"></div>
                                    </div>
                                </div>
                                <div>
                                    <div className="h-7 bg-gray-200 rounded-md mb-4"></div>
                                    <div className="space-y-2">
                                        <div className="h-4 bg-gray-200 rounded-md"></div>
                                        <div className="h-4 bg-gray-200 rounded-md"></div>
                                        <div className="h-4 bg-gray-200 rounded-md"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </main>
                </div>
                <BottomNavBar />
            </AuthGuard>
        );
    }

    if (!recipe) {
        return <div className="text-center p-10">Resep tidak ditemukan.</div>;
    }

    // Menggunakan gambar utama dan beberapa placeholder untuk galeri
    const galleryImages = [recipe.imageUrl, '/images/resep-placeholder-1.jpg', '/images/resep-placeholder-2.jpg'];

    return (
        <AuthGuard>
            {/* Tampilan Mobile */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="md:hidden bg-gray-50 min-h-screen pb-20">
                <div className="relative">
                    <Link href="/resep" className="absolute top-4 left-4 z-20 bg-white/70 p-2 rounded-full shadow-lg backdrop-blur-sm">
                        <FaArrowLeft className="w-6 h-6 text-gray-800" />
                    </Link>
                    <div className="h-80 relative">
                        <Image src={recipe.imageUrl} alt={recipe.title} fill className="w-full h-full object-cover" style={{objectFit: 'cover'}} />
                    </div>
                </div>
                <div className="bg-gray-50 p-6 rounded-t-3xl -mt-8 relative z-10">
                    <h1 className="text-3xl font-bold text-gray-900">{recipe.title}</h1>
                    <div className="flex items-center gap-4 mt-4">
                        <span className="text-sm font-semibold bg-teal-100 text-teal-700 px-3 py-1 rounded-full">{recipe.category}</span>
                        <div className="flex items-center gap-2 text-gray-500 text-sm"><FaRegClock/> 25 Menit</div>
                    </div>
                    <hr className="my-6" />
                    <RecipeContent recipe={recipe} />
                </div>
            </motion.div>

            {/* Tampilan Desktop */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="hidden md:block bg-white">
                <header className="bg-teal-600 text-white p-20 md:rounded-b-[4rem] relative">
                    <Link href="/resep" className="absolute top-6 left-6 z-20 bg-white/20 p-2 rounded-full hover:bg-white/40 transition">
                        <FaArrowLeft className="w-6 h-6 text-white" />
                    </Link>
                    <div className="max-w-6xl mx-auto pt-8">
                        <h1 className="text-5xl font-bold text-left">{recipe.title}</h1>
                        <div className="flex items-center gap-x-6 gap-y-2 mt-4 text-teal-100 opacity-90">
                            <p className="font-semibold">{recipe.category}</p>
                            <p className="flex items-center gap-2"><FaRegClock /> 25 Menit</p>
                        </div>
                    </div>
                </header>
                <main className="max-w-6xl mx-auto px-8 pb-16">
                    <div className="grid grid-cols-1 place-items-center -mt-22 relative z-10">
                        <div>
                            <Image src={galleryImages[0]} alt={recipe.title} width={800} height={600} className="w-[400px] h-full object-cover rounded-xl shadow-lg"/>
                        </div>
                    </div>
                    <div className="my-12">
                        <RecipeContent recipe={recipe} />
                    </div>
                </main>
            </motion.div>
            <BottomNavBar/>
        </AuthGuard>
    );
}
