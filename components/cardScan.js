'use client';

import React from 'react';
import { FaFire, FaCarrot, FaDrumstickBite, FaTint, FaLeaf,  } from 'react-icons/fa'; 
import { GiSaltShaker, GiSugarCane } from "react-icons/gi";
import { AiFillGolden } from "react-icons/ai";
import Link from 'next/link';
import { useChat } from '../context/ChatContext';

const NutritionItem = ({ icon, label, value }) => (
  <div className="flex items-center space-x-3 bg-gray-100 p-3 rounded-lg">
    <div className="text-teal-500">{icon}</div>
    <div>
      <p className="text-sm text-gray-600">{label}</p>
      <p className="font-bold text-gray-800">{value}</p>
    </div>
  </div>
);

const ScanResultCard = ({ result }) => {
  const { openChatWithContext } = useChat();
  if (!result) return null;

  const nutrition = result.nutritionData;

  return (
    <div className="w-full relative max-w-4xl mx-auto mt-8 bg-white p-6 md:p-8 rounded-2xl md:shadow-lg animate-fade-in">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center md:text-left">Hasil Analisis</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        <div>
          <div className="relative w-full aspect-video rounded-xl overflow-hidden mb-4 shadow-md">
            <img src={result.imageUrl} alt={result.aiScanResult.display_name} className="object-cover w-full h-full" />
          </div>
          <div className="bg-teal-50 p-4 rounded-lg border border-teal-200">
            <h3 className="font-bold text-teal-700">💡 Rekomendasi Brocco</h3>
            <p className="text-sm text-teal-600 mt-2">{result.recommendation}</p>
          </div>
        </div>
        <div className="space-y-4">
          <h3 className="text-xl font-bold mb-2">{result.aiScanResult.display_name}</h3>
          
          {result.aiScanResult.bahan_terdeteksi?.length > 0 && (
            <div>
              <h4 className="font-semibold text-gray-700">Bahan Terdeteksi:</h4>
              <div className="flex flex-wrap gap-2 mt-2">
                {result.aiScanResult.bahan_terdeteksi.map((bahan, i) => (
                  <span key={i} className="bg-gray-200 text-gray-700 text-xs font-semibold px-2.5 py-1 rounded-full">{bahan.nama_bahan}</span>
                ))}
              </div>
            </div>
          )}


          <div>
            <h4 className="font-semibold text-gray-700">Estimasi Nutrisi per Porsi</h4>
            {/* Bagian Nutrisi Utama */}
            <div className="grid grid-cols-2 gap-3 mt-2">
              <NutritionItem icon={<FaFire size={20}/>} label="Kalori" value={Math.round(nutrition.calories)} unit="kkal" colorClass="text-red-500"/>
              <NutritionItem icon={<FaDrumstickBite size={20}/>} label="Protein" value={Math.round(nutrition.protein)} unit="g" colorClass="text-teal-500"/>
              <NutritionItem icon={<FaCarrot size={20}/>} label="Karbohidrat" value={Math.round(nutrition.carbohydrates)} unit="g" colorClass="text-orange-500"/>
              <NutritionItem icon={<FaTint size={20}/>} label="Lemak" value={Math.round(nutrition.fat)} unit="g" colorClass="text-yellow-500"/>
            </div>

            {/* Bagian Nutrisi Mikro Penting */}
            <h4 className="font-semibold text-gray-700 mt-4">Nutrisi Penting Lainnya</h4>
            <div className="grid grid-cols-2 gap-3 mt-2">
               <NutritionItem icon={<AiFillGolden size={20}/>} label="Zat Besi" value={Math.round(nutrition.iron)} unit="mg" colorClass="text-red-700"/>
               <NutritionItem icon={<FaLeaf size={20}/>} label="Asam Folat" value={Math.round(nutrition.folic_acid)} unit="mcg" colorClass="text-green-600"/>
               <NutritionItem icon={<GiSugarCane size={20}/>} label="Gula" value={Math.round(nutrition.sugar)} unit="g" colorClass="text-purple-500"/>
               <NutritionItem icon={<GiSaltShaker size={20}/>} label="Natrium" value={Math.round(nutrition.sodium)} unit="mg" colorClass="text-blue-500"/>
            </div>

            <div className='flex flex-row items-center gap-4 md:gap-8 justify-center'>
              <video className="object-contain w-52 h-52" autoPlay loop muted playsInline>
                <source src="/images/Cheerful_Broccoli_Animation_Generated.mp4" type="video/mp4" />
              </video>
              <button 
                type="button" 
                className='bg-teal-500 text-white px-5 py-3 hover:bg-emerald-400 transform transition-colors text-xs font-semibold w-full rounded-full' 
                onClick={() => openChatWithContext({ type: 'scan_result', data: result })}
              >
                Tanya Brocco
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScanResultCard;

