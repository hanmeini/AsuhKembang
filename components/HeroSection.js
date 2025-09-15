'use client';
import React from "react";
import Image from "next/image";


const HeroSection = () => {
  return (
    <section className="relative h-screen">
      {/* Sticky Background */}
      <div
        className="sticky top-0 h-screen w-full bg-cover bg-center"
        style={{ backgroundImage: "url('/images/keluarga-bg.jpg')" }}
      >
        <div className="absolute inset-0 bg-black/40"></div>
      </div>

      {/* Konten Hero */}
      <div className="absolute top-0 left-0 z-10 h-screen w-full flex items-center justify-center text-white">
        <div className="text-center max-w-3xl px-6">
          <h1 className="text-4xl md:text-6xl font-bold leading-tight drop-shadow-lg">
            <span className="text-teal-400">Ketenangan Pikiran</span> di Setiap <span className="text-orange-400">Suapan</span>
          </h1>
          <p className="mt-6 text-gray-200 drop-shadow-md text-lg">
            Bingung dengan gizi si kecil? Pindai makanan apa saja dengan AI kami dan dapatkan analisis nutrisi instan. Pastikan buah hati Anda mendapatkan yang terbaik untuk tumbuh kembangnya.
          </p>
          <div className="mt-8 flex justify-center space-x-4">
            <a
              href="/scan"
              className="bg-orange-500 text-white font-semibold px-6 py-3 rounded-lg hover:bg-orange-400 transition-transform duration-300 hover:scale-105"
            >
              Pindai Makanan Pertama Anda
            </a>
            <a
              href="#features"
              className="flex items-center font-semibold px-6 py-3 border-2 rounded-lg hover:bg-white/20 transition-transform duration-300 hover:scale-105"
            >
              Lihat Fitur Lainnya
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;