'use client';

import React from 'react';

const CommunitySidebar = () => {
  const trendingTopics = ["#MPASI", "#TipsHamil", "#TumbuhGigi", "#VaksinAnak", "#Trimester3"];
  const upcomingEvents = [
    { date: "15 Sep", title: "Webinar: Gizi Seimbang untuk Balita" },
    { date: "22 Sep", title: "Tanya Jawab: Tidur Nyenyak Bayi" },
  ];

  return (
    <div className="space-y-8 sticky top-10">
      {/* Topik Populer */}
        <div className="bg-white p-6 rounded-2xl shadow-lg">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Topik Populer</h3>
            <div className="flex flex-wrap gap-2">
            {trendingTopics.map(topic => (
                <a key={topic} href="#" className="bg-gray-100 text-gray-600 text-sm font-semibold px-3 py-1 rounded-full hover:bg-teal-100 hover:text-teal-700">
                {topic}
                </a>
            ))}
            </div>
        </div>
      {/* Acara Mendatang */}
        <div className="bg-white p-6 rounded-2xl shadow-lg">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Acara Mendatang</h3>
            <ul className="space-y-4">
            {upcomingEvents.map(event => (
                <li key={event.title} className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-pink-100 text-pink-600 font-bold rounded-lg flex flex-col items-center justify-center leading-tight">
                    <span>SEP</span>
                    <span className="text-xl">{event.date.split(' ')[0]}</span>
                </div>
                <div>
                    <p className="font-semibold text-gray-700">{event.title}</p>
                    <a href="#" className="text-xs text-teal-600 hover:underline">Lihat Detail</a>
                </div>
                </li>
            ))}
            </ul>
        </div>

      {/* */}
        <div className="bg-white p-6 rounded-2xl shadow-lg">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Tanya Ahli</h3>
        <div className="flex items-center space-x-4">
            <img 
            src="/images/doctor-avatar.jpg" // Ganti dengan foto ahli Anda
            alt="Dr. Anisa" 
            className="w-16 h-16 rounded-full object-cover" 
            />
            <div>
            <p className="font-bold text-gray-800">Dr. Anisa, Sp.A</p>
            <p className="text-sm text-gray-500">Dokter Spesialis Anak</p>
            </div>
        </div>
        <a 
            href="/tanya-ahli" 
            className="block w-full mt-4 bg-teal-500 text-white font-bold text-center py-2 rounded-lg hover:bg-teal-600 transition-colors"
        >
            Ajukan Pertanyaan
        </a>
        </div>
    </div>
  );
};

export default CommunitySidebar;
