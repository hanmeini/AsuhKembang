// Data ini adalah penyederhanaan dari tabel standar pertumbuhan anak laki-laki WHO (Berat badan berdasarkan Usia, 0-24 bulan)
// P3, P15, P50, P85, P97 adalah garis persentil ke-3, 15, 50, 85, dan 97.
// Dalam aplikasi nyata, Anda akan memerlukan data yang lebih lengkap untuk jenis kelamin dan parameter lain (tinggi badan, lingkar kepala).

export const whoWeightForAgeBoys = {
  labels: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24], // Usia dalam bulan
  datasets: [
    {
      label: 'Persentil ke-3',
      data: [2.5, 3.4, 4.4, 5.1, 5.6, 6.1, 6.4, 6.7, 7.0, 7.2, 7.4, 7.6, 7.7, 7.9, 8.1, 8.3, 8.4, 8.6, 8.8, 8.9, 9.1, 9.2, 9.4, 9.5, 9.7],
      borderColor: 'rgba(255, 99, 132, 0.5)',
      backgroundColor: 'rgba(255, 99, 132, 0.1)',
      borderWidth: 2,
      pointRadius: 0,
      fill: '+1', // Mengisi area ke garis di atasnya
    },
    {
      label: 'Persentil ke-15',
      data: [2.9, 3.9, 5.0, 5.7, 6.3, 6.7, 7.1, 7.4, 7.7, 7.9, 8.2, 8.4, 8.6, 8.8, 9.0, 9.2, 9.4, 9.6, 9.8, 10.0, 10.1, 10.3, 10.5, 10.7, 10.8],
      borderColor: 'rgba(255, 206, 86, 0.5)',
      backgroundColor: 'rgba(255, 206, 86, 0.1)',
      borderWidth: 2,
      pointRadius: 0,
      fill: '+1',
    },
    {
      label: 'Persentil ke-50 (Median)',
      data: [3.3, 4.5, 5.6, 6.4, 7.0, 7.5, 7.9, 8.3, 8.6, 8.9, 9.2, 9.4, 9.6, 9.9, 10.1, 10.3, 10.5, 10.7, 10.9, 11.1, 11.3, 11.5, 11.7, 11.9, 12.1],
      borderColor: 'rgba(75, 192, 192, 1)',
      backgroundColor: 'rgba(75, 192, 192, 0.2)',
      borderWidth: 3,
      pointRadius: 0,
    },
     {
      label: 'Persentil ke-85',
      data: [3.9, 5.1, 6.3, 7.2, 7.8, 8.4, 8.8, 9.2, 9.6, 9.9, 10.2, 10.5, 10.8, 11.0, 11.3, 11.5, 11.7, 12.0, 12.2, 12.5, 12.7, 12.9, 13.2, 13.4, 13.6],
      borderColor: 'rgba(255, 206, 86, 0.5)',
      backgroundColor: 'rgba(255, 206, 86, 0.1)',
      borderWidth: 2,
      pointRadius: 0,
      fill: '-1',
    },
    {
      label: 'Persentil ke-97',
      data: [4.4, 5.7, 7.0, 7.9, 8.6, 9.2, 9.7, 10.1, 10.5, 10.9, 11.2, 11.5, 11.8, 12.1, 12.4, 12.6, 12.9, 13.2, 13.4, 13.7, 13.9, 14.2, 14.4, 14.7, 14.9],
      borderColor: 'rgba(255, 99, 132, 0.5)',
      backgroundColor: 'rgba(255, 99, 132, 0.1)',
      borderWidth: 2,
      pointRadius: 0,
      fill: '-1',
    }
  ],
};

// Simplified WHO standar untuk Tinggi terhadap Usia (cm) - laki-laki 0-24 bulan (contoh/sintetik)
export const whoHeightForAgeBoys = {
  labels: [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24],
  datasets: [
    {
      label: 'Persentil ke-3',
      data: [44.2,47.5,50.0,52.3,54.0,55.5,57.0,58.2,59.3,60.3,61.2,62.0,62.8,63.5,64.1,64.7,65.2,65.7,66.1,66.5,66.9,67.2,67.6,67.9,68.2],
      borderColor: 'rgba(255,99,132,0.5)',
      backgroundColor: 'rgba(255,99,132,0.08)',
      borderWidth: 2,
      pointRadius: 0,
      fill: '+1'
    },
    {
      label: 'Persentil ke-15',
      data: [46.0,49.2,51.7,53.9,55.6,57.1,58.5,59.7,60.8,61.8,62.7,63.5,64.2,64.9,65.5,66.0,66.5,67.0,67.4,67.8,68.2,68.5,68.9,69.2,69.5],
      borderColor: 'rgba(255,206,86,0.5)',
      backgroundColor: 'rgba(255,206,86,0.08)',
      borderWidth: 2,
      pointRadius: 0,
      fill: '+1'
    },
    {
      label: 'Persentil ke-50 (Median)',
      data: [49.9,53.8,56.4,58.6,60.5,62.0,63.3,64.5,65.5,66.4,67.2,67.9,68.6,69.2,69.8,70.3,70.8,71.2,71.6,71.9,72.3,72.6,72.9,73.2,73.5],
      borderColor: 'rgba(75,192,192,1)',
      backgroundColor: 'rgba(75,192,192,0.12)',
      borderWidth: 3,
      pointRadius: 0
    },
    {
      label: 'Persentil ke-85',
      data: [53.8,57.7,60.3,62.5,64.4,65.9,67.2,68.4,69.4,70.3,71.1,71.8,72.5,73.1,73.7,74.2,74.7,75.2,75.6,75.9,76.3,76.6,76.9,77.2,77.5],
      borderColor: 'rgba(255,206,86,0.5)',
      backgroundColor: 'rgba(255,206,86,0.08)',
      borderWidth: 2,
      pointRadius: 0,
      fill: '-1'
    },
    {
      label: 'Persentil ke-97',
      data: [55.6,60.1,62.9,65.0,66.9,68.5,69.6,70.8,71.7,72.5,73.3,74.0,74.6,75.2,75.8,76.3,76.8,77.2,77.6,78.0,78.4,78.8,79.2,79.6,80.0],
      borderColor: 'rgba(255,99,132,0.5)',
      backgroundColor: 'rgba(255,99,132,0.08)',
      borderWidth: 2,
      pointRadius: 0,
      fill: '-1'
    }
  ]
};

// Simplified WHO standar untuk Indeks BMI terhadap Usia (sintesis: tinggi dibagi berat sebagai indikator sederhana)
export const whoBMIForAgeBoys = {
  labels: [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24],
  datasets: [
    {
      label: 'Persentil ke-3',
      data: [6.5,7.0,7.5,8.0,8.3,8.6,8.8,9.0,9.1,9.2,9.3,9.4,9.5,9.6,9.7,9.8,9.9,10.0,10.1,10.2,10.3,10.4,10.5,10.6,10.7],
      borderColor: 'rgba(255,99,132,0.4)',
      backgroundColor: 'rgba(255,99,132,0.06)',
      borderWidth: 2,
      pointRadius: 0,
      fill: '+1'
    },
    {
      label: 'Persentil ke-50',
      data: [7.5,8.2,8.8,9.3,9.7,10.0,10.3,10.5,10.7,10.9,11.0,11.2,11.3,11.4,11.5,11.6,11.7,11.8,11.9,12.0,12.1,12.2,12.3,12.4,12.5],
      borderColor: 'rgba(75,192,192,1)',
      backgroundColor: 'rgba(75,192,192,0.12)',
      borderWidth: 3,
      pointRadius: 0
    },
    {
      label: 'Persentil ke-97',
      data: [8.5,9.4,10.1,10.7,11.1,11.5,11.8,12.0,12.3,12.5,12.7,12.9,13.0,13.2,13.3,13.5,13.6,13.8,13.9,14.0,14.2,14.3,14.4,14.6,14.7],
      borderColor: 'rgba(255,99,132,0.4)',
      backgroundColor: 'rgba(255,99,132,0.06)',
      borderWidth: 2,
      pointRadius: 0,
      fill: '-1'
    }
  ]
};