'use client';

import React, { useState, useEffect } from 'react';
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
  Filler,
} from 'chart.js';
import { whoWeightForAgeBoys } from '../lib/who-growth-standarts'; 

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
  const [chartOptions, setChartOptions] = useState({});

  // Efek untuk mengatur opsi grafik agar responsif
  useEffect(() => {
    const handleResize = () => {
      const isMobile = window.innerWidth < 768;
      
      setChartOptions({
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
            display: !isMobile, 
          },
          title: {
            display: true,
            text: 'Kurva Pertumbuhan Berat Badan vs. Usia (Laki-laki, 0-24 Bulan)',
            font: {
                size: isMobile ? 14 : 18 
            }
          },
        },
        scales: {
            x: { 
                title: { display: true, text: 'Usia (Bulan)' },
                ticks: {
                    font: { size: isMobile ? 10 : 12 } // Ukuran font sumbu-x
                }
            },
            y: { 
                title: { display: true, text: 'Berat Badan (kg)' },
                 ticks: {
                    font: { size: isMobile ? 10 : 12 } // Ukuran font sumbu-y
                }
            }
        }
      });
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []); 

  // Fungsi untuk menghitung usia dalam bulan (tidak ada perubahan)
  const getAgeInMonths = (date) => {
    if (!childBirthDate || !date) return 0;
    const birth = new Date(childBirthDate);
    const measurementDate = new Date(date);
    let months = (measurementDate.getFullYear() - birth.getFullYear()) * 12;
    months -= birth.getMonth();
    months += measurementDate.getMonth();
    return months <= 0 ? 0 : months;
  };

  // Proses data anak untuk grafik (tidak ada perubahan)
  const processedChildData = childData.map(entry => ({
    x: getAgeInMonths(entry.date),
    y: entry.weight
  }));

  const data = {
    labels: whoWeightForAgeBoys.labels,
    datasets: [
      ...whoWeightForAgeBoys.datasets,
      {
        label: 'Berat Anak Anda',
        data: processedChildData,
        borderColor: 'rgb(54, 162, 235)',
        backgroundColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 2,
        pointRadius: 3,
        fill: false,
      }
    ]
  };

  return (
    <div className="relative h-[300px] sm:h-[400px] lg:h-[500px]">
      <Line options={chartOptions} data={data} />
    </div>
  );
};

export default GrowthChart;
