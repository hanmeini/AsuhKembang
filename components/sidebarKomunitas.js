'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { FaHashtag, FaUserPlus, FaPlus,  FaCheck } from 'react-icons/fa';
import Link from 'next/link';

// Komponen untuk kartu "Tanya Ahli"
const AskExpertCard = () => (
    <div className="bg-white p-6 rounded-2xl shadow-lg">
      <h3 className="text-xl font-bold text-gray-800 mb-4">Tanya Ahli</h3>
      <div className="flex items-center space-x-4">
        <Image 
          src="/images/doctor.jpg"
          alt="Dr. Anisa" 
          width={64}
          height={64}
          className="w-16 h-16 rounded-full object-cover" 
        />
        <div>
          <p className="font-bold text-gray-800">Dr. Anisa, Sp.A</p>
          <p className="text-sm text-gray-500">Dokter Spesialis Anak</p>
        </div>
      </div>
      <motion.a 
        href="https://wa.me/6287738178406" // Ganti dengan nomor WhatsApp Anda
        target="_blank"
        rel="noopener noreferrer"
        className="block w-full mt-4 bg-teal-500 text-white font-bold text-center py-2.5 rounded-lg transition-colors"
        whileHover={{ scale: 1.05, backgroundColor: "#0d9488" }}
        whileTap={{ scale: 0.95 }}
      >
        Hubungi Ahli
      </motion.a>
    </div>
);

// Komponen Sidebar Komunitas Utama
const CommunitySidebar = () => {
  // Data dummy
  const trendingTopics = [
    { name: "#MPASI", description: "Diskusi seputar Makanan Pendamping ASI." },
    { name: "#TipsHamil", description: "Berbagi tips untuk kehamilan sehat." },
    { name: "#TumbuhGigi", description: "Mengatasi tantangan saat si kecil tumbuh gigi." },
  ];

  // State untuk melacak topik yang diikuti
  const [followedTopics, setFollowedTopics] = useState([]);

  // Fungsi untuk menangani klik tombol "Ikuti"
  const handleFollowToggle = (topicName) => {
    setFollowedTopics(prev => 
      prev.includes(topicName)
        ? prev.filter(t => t !== topicName) // Jika sudah ada, hapus (unfollow)
        : [...prev, topicName] // Jika belum ada, tambahkan (follow)
    );
  };

  // Varian animasi
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.2 }
    }
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <motion.div 
        className="space-y-8 sticky top-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
    >
      <motion.div variants={itemVariants}>
        <AskExpertCard />
      </motion.div>

      {/* PERBAIKAN: Kartu "Ikuti Topik" menggantikan "Acara Mendatang" */}
      <motion.div variants={itemVariants} className="bg-white p-6 rounded-2xl shadow-lg">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Ikuti Topik</h3>
        <ul className="space-y-4">
          {trendingTopics.map(topic => {
            const isFollowed = followedTopics.includes(topic.name);
            return (
              <li key={topic.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                      <div className="bg-gray-100 p-2 rounded-lg">
                          <FaHashtag className="text-gray-500"/>
                      </div>
                      <div>
                          <p className="font-semibold text-sm text-gray-800">{topic.name}</p>
                          <p className="text-xs text-gray-500">{topic.description}</p>
                      </div>
                  </div>
                  <motion.button 
                      onClick={() => handleFollowToggle(topic.name)}
                      className={`font-bold px-3 py-1 text-xs rounded-full border transition-colors flex items-center gap-1.5
                        ${isFollowed 
                            ? 'bg-teal-500 text-white border-teal-500' 
                            : 'bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-200'
                        }`}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                  >
                    {isFollowed ? <FaCheck size={10}/> : <FaPlus size={10}/>}
                    {isFollowed ? 'Diikuti' : 'Ikuti'}
                  </motion.button>
              </li>
            );
          })}
        </ul>
      </motion.div>
      <Link href="/resep" className="block group">
        <div className="relative bg-white p-8 rounded-2xl shadow-lg flex items-center gap-6 overflow-hidden transition-transform duration-300 hover:scale-[1.02]">
          <Image src="/images/analisis-instan.jpg" width={100} height={100} alt="Ilustrasi Resep" className='rounded-md ' />
        <div>
          <h2 className="text-xl font-bold text-gray-800">Dapur Komunitas</h2>
          <p className="mt-1 text-sm text-gray-600">Temukan ribuan resep MPASI dan makanan sehat yang dibagikan oleh para bunda dan divalidasi oleh ahli gizi.</p>
          </div>
          <span className="absolute top-4 right-4 text-xs font-semibold bg-pink-100 text-pink-700 px-3 py-1 rounded-full">BARU!</span>
        </div>
      </Link>
    </motion.div>
  );
};

export default CommunitySidebar;

