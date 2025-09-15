'use client';

import React from 'react';
import Image from 'next/image';

const ScanningAnimation = () => {
  return (
    <div className="fixed inset-0 bg-white backdrop-blur-md z-50 flex flex-col items-center justify-center text-center p-6">
      <div className="relative w-48 h-48 md:w-64 md:h-64">
        <div className="absolute inset-0 border-4 border-teal-200 border-t-teal-500 p-4 rounded-full animate-spin"></div>
        <video
          src="/images/brokoli-think.mp4"
          autoPlay
          loop
          muted
          className="w-full h-full object-cover rounded-full"
        ></video>
      </div>
      <h2 className="text-2xl font-bold text-gray-800 mt-8">Brocco sedang menganalisis...</h2>
      <p className="text-gray-600 mt-2">Mendeteksi bahan dan menghitung nutrisi. Mohon tunggu sebentar!</p>
    </div>
  );
};

export default ScanningAnimation;
