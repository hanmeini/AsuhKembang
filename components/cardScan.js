'use client';

import React from 'react';
import { FaFire, FaCarrot, FaDrumstickBite, FaTint, FaBack } from 'react-icons/fa';
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
            <h4 className="font-semibold text-gray-700">Total Estimasi Nutrisi:</h4>
            <div className="grid grid-cols-2 gap-4 mt-2 mb-10">
              <NutritionItem icon={<FaFire size={20}/>} label="Kalori" value={`${Math.round(result.nutritionData.calories)} kcal`} />
              <NutritionItem icon={<FaDrumstickBite size={20}/>} label="Protein" value={`${Math.round(result.nutritionData.protein)} g`} />
              <NutritionItem icon={<FaCarrot size={20}/>} label="Karbohidrat" value={`${Math.round(result.nutritionData.carbohydrates)} g`} />
              <NutritionItem icon={<FaTint size={20}/>} label="Lemak" value={`${Math.round(result.nutritionData.fat)} g`} />
            </div>

            <div className='flex flex-row items-center gap-4 md:gap-8 justify-center'>
              <video className="object-contain w-52 h-52" autoPlay loop muted playsInline>
                <source src="/images/Cheerful_Broccoli_Animation_Generated.mp4" type="video/mp4" />
              </video>
              <button className='bg-teal-500 text-white px-5 py-3 hover:bg-emerald-400 transform transition-colors text-xs font-semibold w-full rounded-full' onClick={() => openChatWithContext({ type: 'scan_result', data: result })}>
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

