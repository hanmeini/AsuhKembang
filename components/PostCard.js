'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { IoPaperPlaneOutline } from "react-icons/io5";
import { FaHeart, FaRegHeart, FaRegComment, FaUserCircle } from 'react-icons/fa';
import { BiRepost } from "react-icons/bi";
import { useAuth } from '../context/AuthContext';
import { subscribeToComments } from '../lib/firestore'; 
import { AnimatePresence,motion } from 'framer-motion';

const PostCard = ({ post }) => {
  const { userProfile } = useAuth();
  const [isLiked, setIsLiked] = useState(post.likes?.includes(userProfile?.uid));
  const [likeCount, setLikeCount] = useState(post.likes?.length || 0);
  const [comments, setComments] = useState([]);
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

  // Listener real-time untuk mengambil komentar saat dibuka
  useEffect(() => {
    if (showComments) {
      const unsubscribe = subscribeToComments(post.id, (fetchedComments) => {
        setComments(fetchedComments);
      });
      return () => unsubscribe();
    }
  }, [post.id, showComments]);


  const handleLike = async () => {
    if (!userProfile) {
      alert("Anda harus login untuk menyukai postingan.");
      return;
    }

    // Like dinamis di UI
    const newIsLiked = !isLiked;
    const newLikeCount = newIsLiked ? likeCount + 1 : likeCount - 1;
    setIsLiked(newIsLiked);
    setLikeCount(newLikeCount);

    // Kirim request ke backend di latar belakang
    try {
      await fetch(`/api/posts/${post.id}/like`, {
        method: newIsLiked ? 'POST' : 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: userProfile.uid }),
      });
    } catch (error) {
      console.error("Gagal menyukai postingan:", error);
      setIsLiked(!newIsLiked);
      setLikeCount(newIsLiked ? newLikeCount - 1 : newLikeCount + 1);
    }
  };

  // Fungsi untuk mengirim komentar baru
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || !userProfile) return;
    setIsSubmittingComment(true);

    try {
        const response = await fetch(`/api/posts/${post.id}/comment`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                userId: userProfile.uid,
                content: newComment,
                authorName: userProfile.displayName,
                authorAvatar: userProfile.photoURL,
            }),
        });

        if (!response.ok) {
            throw new Error("Gagal mengirim komentar.");
        }
        setNewComment('');
    } catch (error) {
        console.error("Gagal mengirim komentar:", error);
        alert(error.message);
    } finally {
        setIsSubmittingComment(false);
    }
  };

  return (
    <div className="bg-white grid grid-cols-[auto,1fr] gap-x-4 border-b border-gray-200 p-4 rounded-2xl">
      <div className="flex flex-row items-start justify-start space-x-3">
        <Image src={post.author.avatar || '/images/avatar-default.jpg'} alt={post.author.name} width={40} height={40} className="w-10 h-10 rounded-full object-cover" />
        <div className="flex justify-start flex-col gap-2 items-start">
          <div className='flex-row justify-start items-center flex gap-2'>
            <p className="font-bold text-gray-800 text-sm">{post.author.name}</p>
            <p className="text-xs text-gray-500">{post.createdAt?.toDate().toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}</p>
          </div>
          <div>
            <p className="mt-1 text-gray-800 text-sm">{post.content}</p>
            {post.imageUrl && (
              <div className="relative w-full aspect-video mt-3 rounded-lg overflow-hidden border border-gray-200">
                <Image src={post.imageUrl || 'images/avatar-default.jpg' } alt="Post image" fill className="object-contain" />
              </div>
            )}
            <div className="mt-4 flex items-center space-x-5 text-gray-500">
              <button onClick={handleLike} className={`flex items-center gap-2 transition-colors ${isLiked ? 'text-red-500' : 'hover:text-red-500'}`}>
                {isLiked ? <FaHeart size={20} /> : <FaRegHeart size={20} />}
                <span className="text-xs font-semibold">{likeCount}</span>
              </button>
              <button onClick={() => setShowComments(!showComments)} className="flex items-center gap-2 hover:text-blue-500 transition-colors">
                <FaRegComment size={20} />
                <span className="text-xs font-semibold">{post.commentCount || 0}</span>
              </button>
              <button className="hover:text-green-500 transition-colors"><BiRepost size={24} /></button>
              <button className="hover:text-gray-800 transition-colors"><IoPaperPlaneOutline size={22} /></button>
            </div>
            
            <AnimatePresence>
            {showComments && (
                <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-4 pt-4 border-t overflow-hidden"
                >
                    {/* Form Komentar Baru */}
                    <form onSubmit={handleCommentSubmit} className="flex items-start gap-2 mb-4">
                        {userProfile?.photoURL ? (
                            <Image src={userProfile.photoURL} alt="Avatar Anda" width={32} height={32} className="w-8 h-8 rounded-full object-cover"/>
                        ) : (
                            <FaUserCircle size={32} className="text-gray-300"/>
                        )}
                        <input 
                            type="text" 
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="Tulis komentar..."
                            className="w-full bg-gray-100 p-2 text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-teal-400"
                        />
                        <button type="submit" disabled={isSubmittingComment} className="bg-teal-500 text-white px-4 py-2 text-sm font-semibold rounded-full disabled:bg-gray-300">
                            Kirim
                        </button>
                    </form>
                    {/* Daftar Komentar */}
                    <div className="space-y-3">
                        {comments.map(comment => (
                            <div key={comment.id} className="flex items-start gap-2 text-sm">
                                <Image src={comment.author.avatar || '/images/avatar-default.jpg'} alt={comment.author.name} width={32} height={32} className="w-8 h-8 rounded-full object-cover"/>
                                <div className="bg-gray-100 p-2 rounded-lg w-full">
                                    <p><span className="font-bold">{comment.author.name}</span> {comment.content}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>
            )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostCard;