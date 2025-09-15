'use client';

import React from 'react';
import Image from 'next/image';

const CommunityCtaSection = () => {
  return (
    <section className="py-16 md:py-24 overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          
          {/* Kolom Teks */}
          <div className="relative z-10">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 leading-tight">
              Temukan Komunitas Ibu & Anak yang Luar Biasa
            </h2>
            <p className="mt-4 text-gray-600 max-w-md">
              Jelajahi dunia penuh dukungan, pembelajaran, dan eksplorasi bersama para orang tua hebat lainnya. Bagikan pengalaman dan tumbuh bersama kami.
            </p>
            <div className="mt-8 flex items-center space-x-4">
              <a 
                href="/register" 
                className="bg-orange-400 text-white font-bold px-8 py-3 rounded-xl hover:bg-orange-500 transition-colors shadow"
              >
                Gabung Sekarang
              </a>
              <a 
                href="#about-community" 
                className="bg-white text-gray-700 font-semibold px-8 py-3 rounded-xl hover:bg-gray-100 transition-colors border border-gray-300"
              >
                Pelajari Dulu
              </a>
            </div>
             {/* Elemen Zigzag Dekoratif */}
            <svg className="absolute -bottom-12 -left-12 w-32 text-teal-400 -z-10" viewBox="0 0 105 44" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2.54834 41.5L26.6359 2.5L52.5483 41.5L78.2359 2.5L102.548 41.5" stroke="currentColor" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>

          {/* Kolom Ilustrasi */}
          <div className="relative flex justify-center items-center h-80">
            {/* Ganti src dengan path ilustrasi Anda */}
            <Image 
              src="/images/komunitas.jpg" 
              alt="Community Illustration"
              width={500}
              height={400}
              className="object-contain"
            />
          </div>

        </div>
      </div>
    </section>
  );
};

export default CommunityCtaSection;