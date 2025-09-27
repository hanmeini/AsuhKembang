'use client';

import React from 'react';
// PERBAIKAN: Menggunakan 'Bar' bukan 'Radar'
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement, // <-- Menggunakan BarElement
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { motion } from 'framer-motion';

// Daftarkan elemen-elemen baru yang dibutuhkan
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const NutritionChart = ({ totals, targets }) => {
  // PERBAIKAN: Menambahkan 'Kalori' dan menyesuaikan labels
  const labels = ['Kalori', 'Protein', 'Karbohidrat', 'Lemak'];
  
  // Fungsi untuk menghitung persentase pencapaian (tidak berubah)
  const getPercentage = (current, target) => {
    if (!target || target === 0) return 0;
    return Math.min((current / target) * 100, 120);
  };

  const data = {
    labels,
    datasets: [
      {
        label: 'Asupan Gizi Harian (%)',
        data: [
          getPercentage(totals.calories, targets.calories),
          getPercentage(totals.protein, targets.protein),
          getPercentage(totals.carbs, targets.carbs),
          getPercentage(totals.fat, targets.fat),
        ],
        // PERBAIKAN: Warna berbeda untuk setiap balok
        backgroundColor: [
            'rgba(239, 68, 68, 0.6)', // Merah untuk Kalori
            'rgba(22, 163, 163, 0.6)', // Teal untuk Protein
            'rgba(249, 115, 22, 0.6)', // Oranye untuk Karbohidrat
            'rgba(234, 179, 8, 0.6)',  // Kuning untuk Lemak
        ],
        borderColor: [
            'rgba(239, 68, 68, 1)',
            'rgba(22, 163, 163, 1)',
            'rgba(249, 115, 22, 1)',
            'rgba(234, 179, 8, 1)',
        ],
        borderWidth: 2,
        borderRadius: 8,
      },
    ],
  };

  const options = {
    maintainAspectRatio: false,
    responsive: true,
    // PERBAIKAN: Opsi untuk Bar Chart
    scales: {
      y: {
        beginAtZero: true,
        max: 120, // Batas atas sumbu Y adalah 120%
        ticks: {
          callback: function(value) {
            return value + '%'; // Menambahkan simbol %
          }
        }
      },
      x: {
        grid: {
            display: false // Menghilangkan garis grid vertikal
        }
      }
    },
    plugins: {
        legend: {
            display: false
        }
    },
    // PERBAIKAN: Animasi saat grafik dimuat
    animation: {
        duration: 1000,
        easing: 'easeInOutQuart'
    }
  };

  return (
    <motion.div 
        className="bg-white p-6 rounded-2xl shadow-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
    >
      <h3 className="text-xl font-bold text-gray-800 mb-4">Ringkasan Gizi Harian</h3>
      <div className="relative h-64 md:h-80">
        <Bar data={data} options={options} />
      </div>
    </motion.div>
  );
};

export default NutritionChart;

