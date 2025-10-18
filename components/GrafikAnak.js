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
import { whoWeightForAgeBoys, whoHeightForAgeBoys, whoBMIForAgeBoys } from '../lib/who-growth-standarts'; 

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
  const [chartType, setChartType] = useState('weight'); // 'weight', 'height', 'bmi'
  const [baselineBirth, setBaselineBirth] = useState(childBirthDate || null);

  // Efek untuk mengatur opsi grafik agar responsif dan sesuai chartType
  useEffect(() => {
    const handleResize = () => {
      const isMobile = window.innerWidth < 768;
      let title = '';
      let yLabel = '';
      if (chartType === 'weight') {
        title = 'Kurva Pertumbuhan Berat Badan vs. Usia (Laki-laki, 0-24 Bulan)';
        yLabel = 'Berat Badan (kg)';
      } else if (chartType === 'height') {
        title = 'Kurva Pertumbuhan Tinggi Badan vs. Usia';
        yLabel = 'Tinggi Badan (cm)';
      } else {
        title = 'Kurva Rata-rata Tinggi/Berat vs. Usia';
        yLabel = 'Tinggi / Berat (cm/kg)';
      }
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
            text: title,
            font: {
                size: isMobile ? 14 : 18 
            }
          },
        },
        scales: {
            x: { 
                title: { display: true, text: 'Usia (Bulan)' },
                ticks: {
                    font: { size: isMobile ? 10 : 12 }
                }
            },
            y: { 
                title: { display: true, text: yLabel },
                 ticks: {
                    font: { size: isMobile ? 10 : 12 }
                }
            }
        }
      });
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [chartType]); 

  // If birth date is not provided, use earliest measurement date as baseline
  useEffect(() => {
    if (!childBirthDate && childData && childData.length > 0) {
      // find earliest date in childData
      const earliest = childData.reduce((acc, e) => {
        const d = (e.date && typeof e.date.toDate === 'function') ? e.date.toDate() : new Date(e.date);
        return (!acc || d < acc) ? d : acc;
      }, null);
      if (earliest) setBaselineBirth(earliest);
    } else {
      setBaselineBirth(childBirthDate || null);
    }
  }, [childBirthDate, childData]);

  // Fungsi untuk menghitung usia dalam bulan (decimal)
  const DAYS_PER_MONTH = 30.4375; // rata-rata hari per bulan (365.25/12)
  const getAgeInMonths = (date) => {
    if (!baselineBirth || !date) return 0;
    const birth = (baselineBirth && typeof baselineBirth.toDate === 'function') ? baselineBirth.toDate() : new Date(baselineBirth);
    const measurementDate = (date && typeof date.toDate === 'function') ? date.toDate() : new Date(date);

    const msPerDay = 24 * 60 * 60 * 1000;
    const diffDays = (measurementDate - birth) / msPerDay; // difference in days (float)
  const monthsFloat = diffDays / DAYS_PER_MONTH; 
  return monthsFloat < 0 ? 0 : monthsFloat; // return as float, not rounded
  };

  // Proses data anak untuk grafik
  const processedWeightData = childData.map(entry => ({
    x: getAgeInMonths(entry.date),
    y: Number(entry.weight)
  })).sort((a,b) => a.x - b.x);
  const processedHeightData = childData.map(entry => ({
    x: getAgeInMonths(entry.date),
    y: Number(entry.height)
  })).sort((a,b) => a.x - b.x);
  // BMI = weight(kg) / (height(m))^2. Ensure numeric and sort by x
  const processedBMIData = childData.map(entry => {
    const h = Number(entry.height);
    const w = Number(entry.weight);
    if (!h || !w) return null;
    const heightInMeters = h / 100;  // convert cm to meters
    const bmi = w / (heightInMeters * heightInMeters);
    // BMI should typically be between 10 and 30 for children
    if (bmi < 5 || bmi > 40) return null; // filter out obviously incorrect values
    return { x: getAgeInMonths(entry.date), y: Number(bmi.toFixed(1)) };
  }).filter(Boolean).sort((a,b) => a.x - b.x);

  // Convert WHO datasets (labels + array data) into {x,y} point arrays for linear x-axis
  const makeWhoPoints = (who) => {
    if (!who) return [];
    const labels = who.labels || [];
    return (who.datasets || []).map(ds => ({
      ...ds,
      data: ds.data.map((val, idx) => ({ x: labels[idx], y: val }))
    }));
  };
  const whoWeightDatasets = makeWhoPoints(whoWeightForAgeBoys);
  const whoHeightDatasets = makeWhoPoints(whoHeightForAgeBoys);
  const whoBmiDatasets = makeWhoPoints(whoBMIForAgeBoys);

  // Data chart
  let data;
  if (chartType === 'weight') {
    data = {
      datasets: [
        ...whoWeightDatasets,
        {
          label: 'Berat Anak Anda',
          data: processedWeightData,
          borderColor: 'rgb(54, 162, 235)',
          backgroundColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 2,
          pointRadius: 4,
          pointBackgroundColor: 'rgb(54, 162, 235)',
          fill: false,
          parsing: false,
          tension: 0.3,
          showLine: true
        }
      ]
    };
  } else if (chartType === 'height') {
    data = {
      datasets: [
        ...whoHeightDatasets,
        {
          label: 'Tinggi Anak Anda',
          data: processedHeightData,
          borderColor: 'rgb(34,197,94)',
          backgroundColor: 'rgba(34,197,94,1)',
          borderWidth: 2,
          pointRadius: 4,
          pointBackgroundColor: 'rgb(34,197,94)',
          fill: false,
          parsing: false,
          tension: 0.3,
          showLine: true
        }
      ]
    };
  } else {
    data = {
      datasets: [
        ...whoBmiDatasets,
        {
          label: 'BMI Anak Anda',
          data: processedBMIData,
          borderColor: 'rgb(251,191,36)',
          backgroundColor: 'rgba(251,191,36,1)',
          borderWidth: 2,
          pointRadius: 4,
          pointBackgroundColor: 'rgb(251,191,36)',
          fill: false,
          parsing: false,
          tension: 0.3,
          showLine: true
        }
      ]
    };
  }

  return (
    <div className="relative h-[340px] sm:h-[400px] lg:h-[500px]">
      <div className="flex gap-2 mb-4">
        <button
          className={`px-4 py-2 rounded-full font-semibold text-sm transition-colors border ${chartType === 'weight' ? 'bg-teal-500 text-white border-teal-500' : 'bg-gray-100 text-gray-600 border-gray-200'}`}
          onClick={() => setChartType('weight')}
        >
          Berat vs Usia
        </button>
        <button
          className={`px-4 py-2 rounded-full font-semibold text-sm transition-colors border ${chartType === 'height' ? 'bg-green-500 text-white border-green-500' : 'bg-gray-100 text-gray-600 border-gray-200'}`}
          onClick={() => setChartType('height')}
        >
          Tinggi vs Usia
        </button>
        {/* <button
          className={`px-4 py-2 rounded-full font-semibold text-sm transition-colors border ${chartType === 'bmi' ? 'bg-amber-400 text-white border-amber-400' : 'bg-gray-100 text-gray-600 border-gray-200'}`}
          onClick={() => setChartType('bmi')}
        >
          Tinggi/Berat vs Usia
        </button> */}
      </div>
      <Line options={{
        ...chartOptions,
        scales: {
          ...chartOptions.scales,
          x: { type: 'linear', min: 0, max: 24, ticks: { stepSize: 1 } }
        }
      }} data={data} />
    </div>
  );
};

export default GrowthChart;
