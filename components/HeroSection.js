'use client';

import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

const HeroSection = () => {
  const router = useRouter();

  return (
    <>
      {/* Animasi floating global */}
      <style jsx global>{`
        @keyframes float-y {
          0%, 100% { transform: translateY(-5px); }
          50% { transform: translateY(5px); }
        }
        .animate-float-y {
          animation: float-y 4s ease-in-out infinite;
        }
      `}</style>

      <section
        id="home"
        style={{ backgroundImage: `url('/images/bg-grid.png')` }}
        className="relative flex flex-col items-center justify-center bg-cover bg-center bg-no-repeat min-h-screen pt-32 px-6"
      >
        {/* Konten Teks */}
        <div className="flex flex-col p-6 md:p-10 justify-center items-center relative text-center">
          {/* Ilustrasi tambahan (mengambang) */}
          <div className="absolute top-[65%] md:top-1/10 -left-2 md:left-auto md:right-8 lg:-right-20 pointer-events-none">
            <Image
              src="/images/hug.png"
              alt="Ilustrasi pelukan hangat"
              className="animate-float-y w-16 md:w-20 lg:w-24"
              height={96}
              width={96}
              priority
            />
          </div>

          <motion.div
            className="flex flex-col gap-6 items-center"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <h1 className="font-extrabold text-4xl md:text-5xl leading-tight">
              Awal Sehat untuk <span className="text-teal-500">Generasi Hebat</span>
            </h1>
            <p className="text-gray-600 max-w-3xl text-base md:text-lg">
              Bersama cegah stunting sejak dalam kandungan. Pindai makanan, pantau pertumbuhan, dan dapatkan wawasan cerdas dari AI untuk memastikan kesehatan optimal bagi ibu dan buah hati.
            </p>
          </motion.div>

          <motion.button
            onClick={() => router.push("/dashboard")}
            className="bg-teal-600 text-white px-8 py-3 rounded-full font-semibold mt-20 md:mt-8 shadow-lg transition-all duration-300 cursor-pointer"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            Mulai Sekarang
          </motion.button>
        </div>

        {/* Galeri Gambar */}
        <div className="relative flex-1 flex flex-col justify-end md:-mt-12">
          <div className="flex flex-row gap-5 md:gap-10 justify-center items-end">
            
            {/* Kartu 1 */}
            <motion.div
              className="relative w-[200px] h-[200px] md:w-[280px] md:h-[400px] rounded-xl md:rounded-3xl overflow-hidden group"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            >
              <Image 
                src="/images/hero1.jpg" 
                alt="Ibu hamil sehat dengan nutrisi seimbang"
                fill 
                sizes="(max-width: 768px) 200px, 280px"
                priority
                className="object-cover transition-transform duration-500 ease-in-out group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-center p-4 text-white">
                <h4 className="font-bold">Gizi Ibu Hamil</h4>
                <p className="text-xs mt-1">Pastikan nutrisi terbaik selama masa kehamilan.</p>
              </div>
            </motion.div>

            {/* Kartu 2 */}
            <motion.div
              className="relative w-[150px] h-[120px] md:w-[300px] md:h-[200px] rounded-xl md:rounded-3xl overflow-hidden group"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
            >
              <Image 
                src="/images/hero3.jpg" 
                alt="Pantau tumbuh kembang anak"
                fill 
                sizes="(max-width: 768px) 150px, 300px"
                priority
                className="object-cover transition-transform duration-500 ease-in-out group-hover:scale-110" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-center p-4 text-white">
                <h4 className="font-bold">Cegah Stunting</h4>
                <p className="text-xs mt-1">Pantau tumbuh kembang anak sejak dini.</p>
              </div>
            </motion.div>

            {/* Kartu 3 */}
            <motion.div
              className="relative w-[200px] h-[200px] md:w-[280px] md:h-[400px] rounded-xl md:rounded-3xl overflow-hidden group"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.6 }}
            >
              <Image 
                src="/images/hero2.jpg" 
                alt="MPASI cerdas untuk anak"
                fill 
                sizes="(max-width: 768px) 200px, 280px"
                priority
                className="object-cover transition-transform duration-500 ease-in-out group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-center p-4 text-white">
                <h4 className="font-bold">MPASI Cerdas</h4>
                <p className="text-xs mt-1">Analisis gizi makanan pendamping ASI dengan mudah.</p>
              </div>
            </motion.div>

          </div>

          {/* Lapisan gradasi putih di bawah */}
          <div className="absolute bottom-0 w-full h-48 bg-gradient-to-t from-gray-50 to-transparent pointer-events-none"></div>
        </div>
      </section>
    </>
  );
};

export default HeroSection;
