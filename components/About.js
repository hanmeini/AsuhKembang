'use client';

import React from 'react';
import Image from 'next/image';

const FeatureItem = ({ icon, title, text }) => (
  <div className="flex items-start space-x-4">
    <div className="bg-green-100 p-2 rounded-lg">{icon}</div>
    <div>
      <h3 className="font-bold text-lg">{title}</h3>
      <p className="text-gray-600 mt-1 text-sm">{text}</p>
    </div>
  </div>
);

const HoverCard = ({ imageUrl, alt, title, description }) => (
  <div className="relative w-full sm:w-80 h-96 rounded-2xl shadow-lg overflow-hidden group transition-transform duration-300 hover:scale-105">
    <Image
      src={imageUrl}
      alt={alt}
      fill={true}
      sizes="(max-width: 768px) 150px, 300px"
      className="object-cover transition-transform duration-500 ease-in-out group-hover:scale-110"
    />
    <div
      className="
        absolute inset-0 bg-gradient-to-t from-black/70 to-transparent 
        flex flex-col justify-end p-6
        opacity-100 translate-y-0
        md:opacity-0 md:translate-y-5 md:group-hover:opacity-100 md:group-hover:translate-y-0
        transition-all duration-300 ease-in-out
      "
    >
      <h3 className="text-2xl font-bold text-white mb-2">{title}</h3>
      <p className="text-gray-200 text-sm">{description}</p>
    </div>
  </div>
);



const FeaturesSection = () => {
  const cardData = [
    {
      id: 1,
      imageUrl: "/images/ibuhamil.jpg",
      alt: "Ibu Hamil",
      title: "Untuk Ibu Hamil",
      description: "Pantau gizi dan perkembangan janin untuk kehamilan yang sehat dan tenang.",
    },
    {
      id: 2,
      imageUrl: "/images/keluarga-bg.jpg",
      alt: "Keluarga",
      title: "Untuk Keluarga",
      description: "Pastikan seluruh anggota keluarga mendapatkan nutrisi seimbang setiap hari.",
    },
    {
      id: 3,
      imageUrl: "/images/anaksehat.jpg",
      alt: "Anak Sehat",
      title: "Untuk Anak-Anak",
      description: "Dukung tumbuh kembang si kecil dengan asupan gizi yang tepat dan terukur.",
    }
  ];

  const features = [
    {
      icon: <svg className="w-8 h-8 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>,
      title: "Analisis Gizi Instan",
      text: "Cukup dengan satu foto, AI canggih kami akan mengenali makanan Anda dan memberikan rincian nutrisi lengkap secara otomatis.",
    },
    {
      icon: <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>,
      title: "Jurnal & Pelacakan Cerdas",
      text: "Simpan riwayat asupan harian Anda secara otomatis. Pantau kemajuan dan bagikan laporan dengan mudah kepada ahli gizi Anda.",
    },
  ];

  return (
    <section id='about' className="container mx-auto px-6 py-16 md:py-24 space-y-24">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 items-center pt-16">
        <div className="md:col-span-1 text-2xl md:text-3xl font-semibold leading-snug">
          <p>"Membangun hubungan adalah inti dari apa yang kami lakukan. Dalam suasana ceria dan penuh kasih sayang..."</p>
        </div>
        <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-8">
          {features.map((feature) => (
            <FeatureItem
              key={feature.title}
              icon={feature.icon}
              title={feature.title}
              text={feature.text}
            />
          ))}
        </div>
        </div>
              <div className="flex flex-col lg:flex-row justify-center items-center gap-8 lg:gap-16">
          {cardData.map((card) => (
            <HoverCard
              key={card.id}
              imageUrl={card.imageUrl}
              alt={card.alt}
              title={card.title}
              description={card.description}
            />
          ))}
        </div>
    </section>
  );
};
export default FeaturesSection;