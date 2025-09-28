'use client';
import {FaLongArrowAltRight} from "react-icons/fa";
import { motion } from 'framer-motion';
import Image from "next/image";
import React from "react";


const FoodFeatures = () => {

  return (
    <section id="features" className="container mx-auto px-6 py-16">
      <div className="grid grid-cols-2 gap-4 md:gap-8 max-w-4xl mx-auto">

        <div className="group relative w-full aspect-square rounded-3xl shadow-lg overflow-hidden transform transition-transform duration-300 hover:-translate-y-2">
          <Image 
            src='/images/makanan.jpg' 
            alt='Analisis Instan'
            fill 
            className="object-cover transition-transform duration-500 ease-in-out group-hover:scale-110" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="absolute bottom-0 left-0 p-6 text-white w-full">
            <h3 className="font-bold text-lg md:text-xl transform group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 delay-100">
              Analisis Instan
            </h3>
            <p className="text-xs md:text-sm mt-2 opacity-0 transform translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 delay-100">
              Ambil foto makanan Anda, dan biarkan AI kami mengidentifikasi setiap bahan di dalamnya.
            </p>
          </div>
        </div>

        <div className="group relative w-full aspect-square rounded-3xl shadow-lg overflow-hidden transform transition-transform duration-300 hover:-translate-y-2">
          <Image 
            src='/images/nutritions.jpg' 
            alt='Nutrisi Lengkap'
            fill 
            className="object-cover transition-transform duration-500 ease-in-out group-hover:scale-110" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="absolute bottom-0 left-0 p-6 text-white w-full">
            <h3 className="font-bold text-lg md:text-xl transform group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 delay-100">
              Nutrisi Lengkap
            </h3>
            <p className="text-xs md:text-sm mt-2 opacity-0 transform translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 delay-100">
              Dapatkan rincian gizi akurat, mulai dari kalori, protein, hingga vitamin esensial.
            </p>
          </div>
        </div>

        <div className="group relative w-full aspect-square rounded-3xl shadow-lg overflow-hidden transform transition-transform duration-300 hover:-translate-y-2">
          <Image 
            src='/images/jurnal.jpg' 
            alt='Jurnal Makanan'
            fill 
            className="object-cover transition-transform duration-500 ease-in-out group-hover:scale-110" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="absolute bottom-0 left-0 p-6 text-white w-full">
            <h3 className="font-bold text-lg md:text-xl transform group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 delay-100">
              Jurnal Makanan
            </h3>
            <p className="text-xs md:text-sm mt-2 opacity-0 transform translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 delay-100">
              Simpan riwayat makanan Anda untuk memantau asupan gizi harian dengan mudah.
            </p>
          </div>
        </div>

        <div className="group relative w-full aspect-square rounded-3xl shadow-lg overflow-hidden transform transition-transform duration-300 hover:-translate-y-2">
          <Image 
            src='/images/rekomendasimakanan.jpg' 
            alt='Rekomendasi Cerdas'
            fill 
            className="object-cover transition-transform duration-500 ease-in-out group-hover:scale-110" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="absolute bottom-0 left-0 p-6 text-white w-full">
            <h3 className="font-bold text-lg md:text-xl transform group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 delay-100">
              Rekomendasi Cerdas
            </h3>
            <p className="text-xs md:text-sm mt-2 opacity-0 transform translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 delay-100">
              Terima saran dan rekomendasi makanan sehat yang disesuaikan untuk Anda.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
};


const FoodAi = () => {
  return (
    <main className="font-sans">
      <div className="container mx-auto px-6 py-12 md:py-20">
        <section className="min-h-[80vh] flex flex-col">
          <div className="text-left mb-16 flex flex-col justify-start items-start max-w-6xl">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 leading-tight max-w-4xl">
              Pindai <span className="text-orange-500">Makananmu</span>, Ketahui Kandungan Nutrisi dengan <span className="text-teal-500">Si Brocco</span>
            </h1>
            <p className="mt-6 text-gray-600 max-w-4xl">
              AI kami langsung menganalisis makanan Anda, memberikan informasi nutrisi yang detail. Sempurna untuk ibu hamil, anak anak, dan masyarakat yang perlu memantau asupan nutrisi mereka.
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 md:gap-12 items-center flex-grow">
            <div className="relative w-full h-[450px] flex-col flex md:mt-0 -mt-20 items-center gap-5 md:gap-14 justify-center group">
              <video
                className="object-contain w-full h-64 rounded-2xl
                           transition-transform duration-500 ease-in-out
                           transform group-hover:scale-110 group-hover:-rotate-3"
                autoPlay
                loop
                muted
                playsInline
              >
                <source src="/images/Cheerful_Broccoli_Animation_Generated.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
              <div
                className="absolute top-1/4 left-0 bg-white px-6 py-3 rounded-full shadow-md
                           opacity-0 scale-90 group-hover:opacity-100 group-hover:scale-100
                           transition-all duration-300 ease-in-out
                           transform translate-x-1/4 group-hover:-rotate-3 -translate-y-1/2"
              >
                <span className="text-lg font-medium">Hi 👋</span>
                <div className="absolute right-full top-0 -translate-y-1/2 w-0 h-0
                                border-t-8 border-t-transparent
                                border-b-8 border-b-transparent
                                border-r-8 border-r-white">
                </div>
              </div>
              <div className="absolute bottom-44 right-12 flex items-center space-x-2 bg-white/80 backdrop-blur-sm px-12 py-2 rounded-full shadow-md">
                <span className="text-sm font-semibold text-gray-700">Brocco</span>
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                </div>
              </div>
               <div className="mt-8 flex w-auto justify-center items-center">
                <a
                  href="/scan"
                  className="bg-orange-400 flex flex-row items-center text-white text-center font-semibold px-8 py-4 rounded-full w-full md:rounded-xl hover:bg-amber-300 transition-colors shadow-md"
                >
                  Pindai Sekarang
                  <span className="ml-2"><FaLongArrowAltRight/></span>
                </a>
              </div>
            </div>
            <div className="flex items-center justify-center ">
              <FoodFeatures/>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};
export default FoodAi;