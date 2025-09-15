'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { FaLongArrowAltRight } from "react-icons/fa";
import Image from 'next/image';

const FeatureListItem = ({ text }) => {
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <motion.div variants={itemVariants} className="flex items-center bg-gray-100 rounded-lg gap-4 py-3 px-6 w-full">
      <div className="w-3 h-3 bg-teal-500 rounded-full flex-shrink-0"></div>
      <span className="text-gray-700 font-bold text-sm md:text-lg">{text}</span>
    </motion.div>
  );
};

const JurnalSection = () => {
  const features = [
    "Lacak Asupan Gizi Harian",
    "Pantau Gejala & Mood Ibu",
    "Catat Pertambahan Berat Badan",
    "Simpan Foto USG & Momen Penting"
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      }
    }
  };

  return (
    <div className="flex items-center justify-center bg-white">
      <div className="flex flex-col items-center gap-16">
        {/* Kolom Kiri: Teks Penjelasan */}
        <motion.div 
          className="flex-1 w-full"
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="flex flex-row items-center max-w-6xl space-x-3">
            <span className="text-sm text-teal-600 font-bold uppercase">Jurnal</span>
            <div className="w-2 h-2 bg-teal-600 rounded-full"></div>
          </div>
          <h2 className="text-4xl md:text-5xl max-w-6xl font-bold text-gray-800 my-4">Jurnal <span className="text-teal-500">Kehamilan</span> Pintar</h2>
          <p className="text-gray-600 mb-6 max-w-6xl">
            Catat dan pantau perjalanan kehamilan Anda dengan mudah. 
            Dapatkan wawasan berharga untuk kesehatan Anda dan si kecil, semuanya di satu tempat.
          </p>
        <motion.div 
          className="grid grid-cols-2 w-full gap-4 flex-1"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible" 
          viewport={{ once: true, amount: 0.5 }} 
        >
        {features.map((feature, index) => (
          <FeatureListItem key={feature} text={feature} />
        ))}
        </motion.div>
        <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="mt-10 bg-teal-600 flex flex-row items-center text-white px-6 py-3 rounded-full font-semibold hover:bg-teal-700 transition-colors shadow-lg"
          >
            Mulai Jurnalmu
            <span className="ml-2"><FaLongArrowAltRight/></span>
          </motion.button>
        </motion.div>

      </div>
    </div>
  );
};

const JournalAi = () => {
  return (
    <section className="container relative mx-auto px-6 py-16 bg-white flex flex-col-reverse md:flex-row-reverse items-center justify-center">
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
                <source src="/images/Baby_Animation_Request_Fulfilled.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
              <div
                className="absolute top-1/4 left-0 bg-white px-6 py-3 rounded-full shadow-md
                           opacity-0 scale-90 group-hover:opacity-100 group-hover:scale-100
                           transition-all duration-300 ease-in-out
                           transform translate-x-1/4 group-hover:-rotate-3 -translate-y-1/2"
              >
                <span className="text-sm font-medium">gugugaga 🍼</span>
                <div className="absolute right-full top-0 -translate-y-1/2 w-0 h-0
                                border-t-8 border-t-transparent
                                border-b-8 border-b-transparent
                                border-r-8 border-r-white">
                </div>
              </div>
              <div className="absolute bottom-44 right-12 flex items-center space-x-2 bg-white/80 backdrop-blur-sm px-12 py-2 rounded-full shadow-md">
                <span className="text-sm font-semibold text-gray-700">Baby</span>
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                </div>
              </div>
            </div>
            <JurnalSection/>
    </section>
  );
}

export default JournalAi;