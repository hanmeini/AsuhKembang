'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';

// Komponen internal untuk satu baris progress bar
const NutrientBar = ({ label, current, target, unit = 'g', colorClass }) => {
  const percentage = target > 0 ? (current / target) * 100 : 0;
  const barWidth = Math.min(percentage, 100);

  return (
    <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
    >
      <div className="flex justify-between items-center mb-1">
        <span className="text-sm font-bold text-gray-700">{label}</span>
        <span className="text-xs font-semibold text-gray-500">{Math.round(current)} / {Math.round(target)}{unit}</span>
      </div>
      <div className="overflow-hidden h-2.5 text-xs flex rounded-full bg-gray-200">
        <div 
          style={{ width: `${barWidth}%` }} 
          className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center ${colorClass} transition-all duration-500`}
        ></div>
      </div>
    </motion.div>
  );
};


// Komponen utama yang sekarang interaktif
const MacroWidget = ({ totals, targets }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    if (!targets) return null; // Jangan render jika target belum dihitung

    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm space-y-4">
            <h4 className="font-bold text-gray-700">Ringkasan Gizi Hari Ini</h4>
            
            {/* Nutrisi Utama (selalu terlihat) */}
            <NutrientBar label="Kalori" current={totals.calories} target={targets.calories} unit=" kkal" colorClass="bg-red-500" />
            <NutrientBar label="Karbohidrat" current={totals.carbs} target={targets.carbs} colorClass="bg-orange-500" />
            <NutrientBar label="Protein" current={totals.protein} target={targets.protein} colorClass="bg-teal-500" />
            <NutrientBar label="Lemak" current={totals.fat} target={targets.fat} colorClass="bg-yellow-500" />
            
            {/* Nutrisi Mikro (muncul saat 'isExpanded' true) */}
            <AnimatePresence>
            {isExpanded && (
                <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="space-y-4 overflow-hidden"
                >
                    <hr className="my-2"/>
                    <NutrientBar label="Zat Besi" current={totals.iron} target={18} unit=" mg" colorClass="bg-red-700" />
                    <NutrientBar label="Asam Folat" current={totals.folic_acid} target={600} unit=" mcg" colorClass="bg-green-600" />
                    <NutrientBar label="Gula" current={totals.sugar} target={25} unit=" g" colorClass="bg-purple-500" />
                    <NutrientBar label="Natrium" current={totals.sodium} target={2300} unit=" mg" colorClass="bg-blue-500" />
                </motion.div>
            )}
            </AnimatePresence>

            {/* Tombol untuk expand/collapse */}
            <button 
                onClick={() => setIsExpanded(!isExpanded)} 
                className="w-full text-center text-sm font-semibold text-teal-600 hover:underline pt-2"
            >
                {isExpanded ? 'Tampilkan Lebih Sedikit' : 'Lihat Detail Nutrisi Lainnya'}
            </button>
        </div>
    );
};

export default MacroWidget;

