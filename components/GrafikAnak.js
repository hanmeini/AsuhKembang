'use client';

import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler, // Impor Filler untuk area
} from 'chart.js';
import { whoWeightForAgeBoys } from '../lib/who-growth-standarts'; // Impor data WHO

// Daftarkan semua komponen Chart.js yang dibutuhkan
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const GrowthChart = ({ childData, childBirthDate }) => {
  // Fungsi untuk menghitung usia dalam bulan
  const getAgeInMonths = (date) => {
    const birth = new Date(childBirthDate);
    const measurementDate = new Date(date);
    let months = (measurementDate.getFullYear() - birth.getFullYear()) * 12;
    months -= birth.getMonth();
    months += measurementDate.getMonth();
    return months <= 0 ? 0 : months;
  };

  // Proses data anak untuk grafik
  const processedChildData = childData.map(entry => ({
    x: getAgeInMonths(entry.date),
    y: entry.weight
  }));

  const data = {
    labels: whoWeightForAgeBoys.labels, // Sumbu X: Usia dalam bulan
    datasets: [
      ...whoWeightForAgeBoys.datasets, // Data standar WHO
      // Data anak
      {
        label: 'Berat Anak Anda',
        data: processedChildData,
        borderColor: 'rgb(54, 162, 235)',
        backgroundColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 4,
        pointRadius: 5,
        fill: false,
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Kurva Pertumbuhan Berat Badan vs. Usia (Laki-laki, 0-24 Bulan)' },
    },
    scales: {
        x: { title: { display: true, text: 'Usia (Bulan)' } },
        y: { title: { display: true, text: 'Berat Badan (kg)' } }
    }
  };

  return <Line options={options} data={data} />;
};

export default GrowthChart;
