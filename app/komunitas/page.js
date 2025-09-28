'use client';

import React, { useState, useEffect,useRef } from 'react';
import AuthGuard from '../../context/AuthGuard';
import Sidebar from '../../components/Sidebar';
import BottomNavBar from '../../components/BottomNav';
import PostCard from '../../components/PostCard';
import CommunitySidebar from '../../components/sidebarKomunitas';
import { FaPen, FaPlus } from 'react-icons/fa';
import Link from 'next/link';
import FloatingChatButton from '../../components/FloatingChatButton';
import { useAuth } from '../../context/AuthContext';
import Image from 'next/image';
import { FaUserCircle, FaImage, FaTimes } from 'react-icons/fa';
import { AnimatePresence, motion } from 'framer-motion';
import { subscribeToPosts } from '../../lib/firestore';


const PostSkeleton = () => {
  return (
    <div className="bg-white flex flex-row gap-x-10 p-4 w-full rounded-2xl shadow-lg">
      {/* Kolom Kiri: Avatar */}
      <div className="flex flex-col items-center">
        <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse"></div>
      </div>
      {/* Kolom Kanan: Konten */}
      <div className='flex-1'>
        <div className="flex flex-row gap-4 items-center">
          <div className="w-20 h-4 bg-gray-200 rounded animate-pulse"></div>
          <div className="w-20 h-4 bg-gray-200 rounded animate-pulse"></div>
        </div>
        <div className="mt-3 space-y-2">
            <div className="w-full h-4 bg-gray-200 rounded animate-pulse"></div>
            <div className="w-5/6 h-4 bg-gray-200 rounded animate-pulse"></div>
        </div>
        <div className="mt-3 space-y-2">
            <div className="w-1/2 h-44 bg-gray-200 rounded animate-pulse"></div>
        </div>
        <div className="mt-4 flex items-center space-x-5">
            <div className="w-6 h-6 bg-gray-200 rounded-full animate-pulse"></div>
            <div className="w-6 h-6 bg-gray-200 rounded-full animate-pulse"></div>
        </div>
      </div>
    </div>
  );
};



const CreatePost = ({ userProfile, onCreatePost }) => {
    const [content, setContent] = useState('');
    const [isFocused, setIsFocused] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState('');
    const fileInputRef = useRef(null);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const removeImage = () => {
        setImageFile(null);
        setImagePreview('');
    };

    const handleSubmit = async () => {
        if (!content.trim() && !imageFile) return;
        setIsSubmitting(true);
        try {
            await onCreatePost(content, imageFile);
            setContent('');
            setIsFocused(false);
            removeImage();
        } catch (error) {
            console.error("Gagal membuat post:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-white p-4 rounded-t-2xl border-b border-gray-200 ">
            <div className="flex items-start gap-4">
                {userProfile?.photoURL ? (
                    <Image src={userProfile.photoURL} alt="Avatar Anda" width={40} height={40} className="w-10 h-10 rounded-full mt-1 object-cover"/>
                ) : (
                    <FaUserCircle size={40} className="text-gray-300 mt-1"/>
                )}
                <div className="w-full">
                    <textarea 
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        onFocus={() => setIsFocused(true)}
                        placeholder={`Apa yang Anda pikirkan, ${userProfile?.displayName || 'Bunda'}?`} 
                        className="w-full bg-transparent p-2 focus:outline-none resize-none"
                        rows={isFocused || imagePreview ? 3 : 1}
                    />

                    {imagePreview && (
                        <div className="relative mt-2 w-32 h-32">
                            <Image src={imagePreview} alt="Pratinjau" fill className="object-cover rounded-lg"/>
                            <button onClick={removeImage} className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-1">
                                <FaTimes size={12}/>
                            </button>
                        </div>
                    )}

                    <AnimatePresence>
                        {(isFocused || imagePreview) && (
                            <motion.div 
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="flex justify-between items-center pt-2 border-t mt-2"
                            >
                                <button onClick={() => fileInputRef.current.click()} className="p-2 text-gray-500 hover:text-teal-500">
                                    <FaImage />
                                    <input type="file" ref={fileInputRef} onChange={handleImageChange} accept="image/*" className="hidden"/>
                                </button>
                                <button 
                                    onClick={handleSubmit} 
                                    className="bg-teal-500 text-white font-bold px-6 py-2 rounded-full hover:bg-teal-600 transition-colors disabled:bg-gray-300"
                                    disabled={(!content.trim() && !imageFile) || isSubmitting}
                                >
                                    {isSubmitting ? 'Memposting...' : 'Post'}
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};


const CategoryTabs = ({ activeTab, onTabChange }) => {
  const tabs = ['Untuk Anda', 'Terpopuler', 'Kehamilan', 'MPASI', 'Tumbuh Kembang'];

  return (
    <div className="border-b border-gray-200">
      <nav 
        className="-mb-px flex space-x-6 overflow-x-auto px-4 md:px-0 hide-scrollbar" 
        aria-label="Tabs"
      >
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => onTabChange(tab)} // Memanggil fungsi dari parent
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-semibold text-sm transition-colors
              ${
                activeTab === tab
                  ? 'border-teal-500 text-teal-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }
            `}
          >
            {tab}
          </button>
        ))}
      </nav>
    </div>
  );
};

export default function CommunityPage() {
  const [isSidebarExpanded, setSidebarExpanded] = useState(false);
  const {userProfile} = useAuth();
  const [posts, setPosts] = useState([]); 
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [activeTab, setActiveTab] = useState('Untuk Anda'); 
  const [isLoading, setIsLoading] = useState(true);

  // listener Post
  useEffect(() => {
    const unsubscribe = subscribeToPosts((fetchedPosts) => {
        setPosts(fetchedPosts);
        setIsLoading(false)
    });
    return () => unsubscribe();
  }, []);

  // Filter posts berdasarkan tab
  useEffect(() => {
    if (activeTab === 'Untuk Anda') {
      setFilteredPosts(posts);
    } else if (activeTab === 'Terpopuler') {
      const sortedPosts = [...posts].sort((a, b) => (b.likes?.length || 0) - (a.likes?.length || 0));
      setFilteredPosts(sortedPosts);
    } else {
      const filtered = posts.filter(post => post.category === activeTab);
      setFilteredPosts(filtered);
    }
  }, [activeTab, posts]);

  // Fungsi add post
  const handleCreatePost = async (content, imageFile) => {
    if (!userProfile) {
        alert("Anda harus login untuk membuat postingan.");
        return;
    }
    let imageUrl = null;
    if (imageFile) {
        const formData = new FormData();
        formData.append('file', imageFile);
        formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET);

        const cloudinaryCloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
        const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${cloudinaryCloudName}/image/upload`;
        
        const cloudinaryResponse = await fetch(cloudinaryUrl, { method: 'POST', body: formData });
        const cloudinaryData = await cloudinaryResponse.json();
        
        if (!cloudinaryResponse.ok) {
            throw new Error(cloudinaryData.error.message || 'Gagal mengunggah gambar.');
        }
        imageUrl = cloudinaryData.secure_url;
    }

    const response = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            userId: userProfile.uid,
            content: content,
            imageUrl: imageUrl, 
            authorName: userProfile.displayName,
            authorAvatar: userProfile.photoURL
        })
    });

    if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Gagal membuat postingan.");
    }
  };


  return (
    <AuthGuard>
        <style jsx global>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;  /* IE and Edge */
          scrollbar-width: none;  /* Firefox */
        }
      `}</style>
      <div className="flex min-h-screen">
        <Sidebar isExpanded={isSidebarExpanded} onMouseEnter={() => setSidebarExpanded(true)} onMouseLeave={() => setSidebarExpanded(false)} />
        <main className={`flex-1 pb-24 md:pb-0 transition-all overflow-hidden duration-300 ease-in-out ${isSidebarExpanded ? 'md:pl-[17.5rem]' : 'md:pl-[6.5rem]'}`}>
          <div className="p-0 md:p-10">
            {/* Header */}
            <div className='flex flex-row justify-between items-center p-4'>
                <div>
                    <h1 className="text-xl md:text-3xl font-bold text-gray-800">Komunitas Healthier</h1>
                </div>
                <div className="flex flex-row items-center gap-5 justify-center">
                      {userProfile?.photoURL ? (
                        <Image
                          src={userProfile.photoURL}
                          alt="Foto Profil"
                          width={40}
                          height={40}
                          className="rounded-full w-10 h-10 object-cover flex-shrink-0"
                        />
                      ) : (
                        <FaUserCircle size={40} className="text-gray-500 flex-shrink-0" />
                      )}
                </div>
            </div>
            
            <div className="mt-4">
              <CategoryTabs activeTab={activeTab} onTabChange={setActiveTab} />
            </div>

            <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <CreatePost userProfile={userProfile} onCreatePost={handleCreatePost} />

                {/* Daftar Postingan sekarang menggunakan 'filteredPosts' */}
                {isLoading ? (
                    <>
                      {Array.from({ length: 7 }).map((_, index) => (
                        <PostSkeleton key={index} />
                      ))}
                    </>
                ) : filteredPosts.length > 0 ? (
                    filteredPosts.map(post => (
                        <PostCard key={post.id} post={post} />
                    ))
                ) : (
                    <p className="text-center text-gray-500 py-10">Tidak ada postingan di kategori ini.</p>
                )}
              </div>
              <div className="hidden lg:block lg:col-span-1">
                <CommunitySidebar />
              </div>
            </div>
          </div>
        </main>
        <div className="fixed bottom-24 right-4 z-50 md:hidden">
          <FloatingChatButton />
        </div>
        <BottomNavBar />
      </div>
    </AuthGuard>
  );
}
