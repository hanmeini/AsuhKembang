'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { FaLongArrowAltRight } from "react-icons/fa";
import Image from 'next/image';

const FeatureCard = ({ title, description }) => {
    const imageUrl = `/images/${title.toLowerCase().replace(/ /g, '-')}.jpg`;

    return (
        <motion.div 
            className="group relative w-full aspect-square rounded-3xl shadow-lg overflow-hidden"
            variants={{
                hidden: { opacity: 0, y: 30 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
            }}
        >
            <Image 
                src={imageUrl}
                alt={title}
                fill 
                className="object-cover transition-transform duration-500 ease-in-out group-hover:scale-110" 
            />
            {/* Overlay gradasi gelap agar teks selalu terbaca */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            
            {/* Konten Teks yang Responsif */}
            <div className="absolute bottom-0 left-0 p-4 md:p-6 text-white w-full">
                {/* Judul selalu terlihat */}
                <h3 className="font-bold text-base md:text-xl 
                             transition-transform duration-300 
                             md:transform md:group-hover:-translate-y-8">
                  {title}
                </h3>
                {/* Deskripsi hanya muncul di desktop saat hover */}
                <p className="text-sm mt-1 
                             hidden md:block 
                             md:opacity-0 md:transform md:translate-y-4 md:group-hover:opacity-100 md:group-hover:translate-y-0 
                             transition-all duration-300">
                  {description}
                </p>
            </div>
        </motion.div>
    );
};

const FoodAiSection = () => {
  const features = [
    { title: "Analisis Instan", description: "Ambil foto, dan biarkan AI kami mengidentifikasi setiap bahan." },
    { title: "Nutrisi Lengkap", description: "Dapatkan rincian gizi akurat, dari kalori hingga vitamin." },
    { title: "Jurnal Makanan", description: "Simpan riwayat makanan untuk memantau asupan gizi harian." },
    { title: "Rekomendasi Cerdas", description: "Terima saran makanan sehat yang disesuaikan untuk Anda." }
  ];

  // Varian animasi untuk container
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.8 } }
  };

  return (
    <section className="font-sans">
      <div className="container mx-auto px-6 py-12 md:py-20">
        <div className="text-left mb-16 max-w-6xl">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 leading-tight max-w-4xl">
            Pindai <span className="text-orange-500">Makananmu</span>, Ketahui Kandungan Nutrisi dengan <span className="text-teal-500">Si Brocco</span>
          </h1>
          <p className="mt-6 text-gray-600 max-w-4xl">
            AI kami langsung menganalisis makanan Anda, memberikan informasi nutrisi yang detail. Sempurna untuk ibu hamil, anak-anak, dan siapa saja yang perlu memantau asupan nutrisi mereka.
          </p>
        </div>
        
        <motion.div 
            className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
        >
          {/* Kolom Kiri: Video Interaktif */}
          <motion.div variants={itemVariants} className="relative w-full h-[450px] flex flex-col items-center justify-center group">
            <video
              className="object-contain w-full h-64 rounded-2xl
                         transition-transform duration-500 ease-in-out
                         transform group-hover:scale-110 group-hover:-rotate-3"
              autoPlay loop muted playsInline
            >
              <source src="/images/Cheerful_Broccoli_Animation_Generated.mp4" type="video/mp4" />
            </video>
            <div
              className="absolute top-1/4 left-0 bg-white px-6 py-3 rounded-full shadow-md
                         opacity-0 scale-90 group-hover:opacity-100 group-hover:scale-100
                         transition-all duration-300 ease-in-out
                         transform translate-x-1/4 group-hover:-rotate-3 -translate-y-1/2"
            >
              <span className="text-lg font-medium">Hi 👋</span>
              <div className="absolute right-full top-0 -translate-y-1/2 w-0 h-0 border-t-8 border-t-transparent border-b-8 border-b-transparent border-r-8 border-r-white"></div>
            </div>
            <div className="absolute bottom-44 right-12 flex items-center space-x-2 bg-white/80 backdrop-blur-sm px-12 py-2 rounded-full shadow-md">
              <span className="text-sm font-semibold text-gray-700">Brocco</span>
              <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
              </div>
            </div>
            <motion.a
              href="/scan"
              className="mt-8 bg-orange-400 flex flex-row items-center text-white text-center font-semibold px-8 py-4 rounded-full w-auto hover:bg-amber-300 transition-colors shadow-md"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Pindai Sekarang
              <span className="ml-2"><FaLongArrowAltRight/></span>
            </motion.a>
          </motion.div>
          
          {/* Kolom Kanan: Kartu Fitur dengan Animasi */}
          <motion.div 
            className="grid grid-cols-2 gap-4 md:gap-6"
            variants={containerVariants} // Gunakan container lagi untuk stagger di dalam
          >
            {features.map((feature) => (
              <FeatureCard key={feature.title} title={feature.title} description={feature.description} />
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default FoodAiSection;
