'use client';

import React from 'react';
import Image from 'next/image';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

const StarRating = () => (
  <div className="flex space-x-1 text-amber-400">
    {[...Array(5)].map((_, i) => (
      <svg key={i} className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
    ))}
  </div>
);


const Testimonials = () => {
  const testimonialsData = [
    {
      quote: "Website ini telah menjadi penyelamat saya selama kehamilan. Fitur pelacak kehamilan sangat membantu saya tetap terorganisir dan mendapatkan informasi penting setiap minggu.",
      avatar: "/images/woman4.jpg", 
      name: "Lisandra Christina",
      title: "Ibu Rumah Tangga",
      companyLogo: "/images/komu-ibu.png",
      bgColor: "bg-pink-50",
    },
    {
      quote: "Sebagai seorang profesional kesehatan, saya merekomendasikan aplikasi ini kepada semua pasien saya. Ini adalah alat yang luar biasa untuk memantau kesehatan ibu dan bayi.",
      avatar: "/images/woman2.jpg",
      name: "Lastri Rudatin",
      title: "Ahli Gizi",
      companyLogo: "/images/komu-ibu.png",
      bgColor: "bg-green-50",
    },
    {
      quote: "Akhirnya, sebuah aplikasi yang menggabungkan teknologi AI dengan kebutuhan ibu hamil. Fitur scan makanan sangat membantu saya membuat pilihan makanan yang lebih sehat.",
      avatar: "/images/woman3.jpg", 
      name: "Siti Salma",
      title: "Mamah Muda",
      companyLogo: "/images/komu-ibu.png",
      bgColor: "bg-blue-50",
    }
  ];

  return (
    <section className="bg-white py-16 md:py-24">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800">Testimoni Pengguna</h2>
        <p className="mt-2 text-gray-600">Lihat apa yang mereka katakan!</p>

        <div className="relative mt-8">
          <Swiper
            modules={[Pagination, Navigation]}
            spaceBetween={30}
            slidesPerView={1}
            pagination={{
              clickable: true,
              el: '.swiper-pagination-custom', 
            }}
            navigation={{
              nextEl: '.swiper-button-next-custom',
              prevEl: '.swiper-button-prev-custom',
            }}
            breakpoints={{
              768: {
                slidesPerView: 2,
              },
              1024: {
                slidesPerView: 2.5,
              },
            }}
            className="!pb-16" 
          >
            {testimonialsData.map((testimonial, index) => (
              <SwiperSlide key={index}>
                <div className={`p-8 rounded-2xl shadow-sm h-full ${testimonial.bgColor}`}>
                  <StarRating />
                  <p className="mt-6 text-gray-700">{testimonial.quote}</p>
                  <div className="mt-8 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Image src={testimonial.avatar} alt={testimonial.name} width={48} height={48} className="rounded-full object-cover" />
                      <div>
                        <p className="font-bold">{testimonial.name}</p>
                        <p className="text-sm text-gray-600">{testimonial.title}</p>
                      </div>
                    </div>
                    <Image src={testimonial.companyLogo} alt="Company Logo" width={80} height={20} className="object-contain rounded-full" />
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
          
          {/* Kontrol Navigasi */}
          <div className="flex items-center justify-end mt-8 space-x-6">
            <div className="swiper-pagination-custom flex space-x-2"></div>
            <div className="flex items-center space-x-2">
              <button className="swiper-button-prev-custom p-2 rounded-full hover:bg-gray-100 transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16l-4-4m0 0l4-4m-4 4h18"></path></svg>
              </button>
              <button className="swiper-button-next-custom p-2 rounded-full hover:bg-gray-100 transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
              </button>
            </div>
          </div>

        </div>
      </div>
      {/* CSS Kustom untuk kontrol Swiper */}
      <style jsx global>{`
        .swiper-pagination-custom .swiper-pagination-bullet {
          width: 8px;
          height: 8px;
          background-color: #d1d5db;
          opacity: 1;
          transition: background-color 0.3s;
        }
        .swiper-pagination-custom .swiper-pagination-bullet-active {
          background-color: #f59e0b;
        }
        .swiper-button-disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
      `}</style>
    </section>
  );
};

export default Testimonials;