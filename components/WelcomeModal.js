'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';

const WelcomeModal = () => {
  return (
    <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="bg-white p-8 rounded-2xl shadow-xl max-w-lg text-center"
      >
        <Image 
            src="/images/broco-maskot.png" 
            alt="Maskot Brocco" 
            priority
            width={120} 
            height={120}
            className="mx-auto"
        />
        <h2 className="text-2xl font-bold text-gray-800 mt-4">Selamat Datang di AsuhKembang!</h2>
        <p className="mt-2 text-sm text-gray-600">
          Untuk memulai, mari kita buat profil pertama Anda. Ini akan membantu kami memberikan analisis dan rekomendasi yang paling sesuai untuk Anda.
        </p>
        <Link
          href="/profile"
          className="mt-6 inline-block bg-teal-600 text-white font-semibold px-8 py-3 rounded-lg hover:bg-teal-700 transition-colors"
        >
          Buat Profil Pertama Anda
        </Link>
      </motion.div>
    </div>
  );
};

export default WelcomeModal;