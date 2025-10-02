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