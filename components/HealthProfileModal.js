
'use client';

import React, { useState } from 'react';

const HealthProfileModal = ({ userProfile, onSave, onClose }) => {
  const [height, setHeight] = useState(userProfile?.healthProfile?.height || '');
  const [weight, setWeight] = useState(userProfile?.healthProfile?.weight || '');
  const [birthDate, setBirthDate] = useState(userProfile?.healthProfile?.birthDate || '');
  const [gender, setGender] = useState(userProfile?.healthProfile?.gender || 'Wanita');
  const [activityLevel, setActivityLevel] = useState(userProfile?.healthProfile?.activityLevel || 'Ringan');

  const [results, setResults] = useState(null);

  const handleCalculate = () => {
    if (!height || !weight || !birthDate) {
      alert("Harap isi tinggi, berat, dan tanggal lahir.");
      return;
    }

    // --- Kalkulasi BMI ---
    const heightInMeters = height / 100;
    const bmi = (weight / (heightInMeters * heightInMeters)).toFixed(2);
    let bmiCategory = '';
    if (bmi < 18.5) bmiCategory = 'Berat Badan Kurang';
    else if (bmi < 24.9) bmiCategory = 'Berat Badan Ideal';
    else if (bmi < 29.9) bmiCategory = 'Berat Badan Berlebih';
    else bmiCategory = 'Obesitas';

    // --- Kalkulasi Kebutuhan Kalori (TDEE) dengan rumus Mifflin-St Jeor ---
    const age = new Date().getFullYear() - new Date(birthDate).getFullYear();
    const bmr = (gender === 'Pria')
      ? (10 * weight) + (6.25 * height) - (5 * age) + 5
      : (10 * weight) + (6.25 * height) - (5 * age) - 161;

    const activityMultipliers = { 'Jarang': 1.2, 'Ringan': 1.375, 'Aktif': 1.55, 'Sangat Aktif': 1.725 };
    const tdee = Math.round(bmr * activityMultipliers[activityLevel]);

    setResults({ bmi, bmiCategory, tdee });
  };

  const handleSave = () => {
    const healthData = { height, weight, birthDate, gender, activityLevel };
    onSave(healthData); 
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex justify-center items-center">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-lg">
        <h2 className="text-2xl font-bold mb-4">Lengkapi Profil Kesehatan Anda</h2>
        
        {/* Form Input */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input type="number" placeholder="Tinggi (cm)" value={height} onChange={e => setHeight(e.target.value)} className="p-2 border rounded" />
          <input type="number" placeholder="Berat (kg)" value={weight} onChange={e => setWeight(e.target.value)} className="p-2 border rounded" />
          <input type="date" placeholder="Tanggal Lahir" value={birthDate} onChange={e => setBirthDate(e.target.value)} className="p-2 border rounded" />
          <select value={gender} onChange={e => setGender(e.target.value)} className="p-2 border rounded">
            <option>Wanita</option>
            <option>Pria</option>
          </select>
          <select value={activityLevel} onChange={e => setActivityLevel(e.target.value)} className="p-2 border rounded col-span-2">
            <option value="Jarang">Jarang atau tidak pernah olahraga</option>
            <option value="Ringan">Olahraga ringan (1-3 hari/minggu)</option>
            <option value="Aktif">Olahraga aktif (3-5 hari/minggu)</option>
            <option value="Sangat Aktif">Olahraga sangat aktif (6-7 hari/minggu)</option>
          </select>
        </div>

        {/* Tombol Aksi */}
        <div className="mt-6 flex justify-between">
          <button onClick={handleCalculate} className="bg-teal-500 text-white px-4 py-2 rounded-lg hover:bg-teal-600">Hitung</button>
          <div>
            <button onClick={onClose} className="text-gray-600 px-4 py-2 rounded-lg mr-2 hover:bg-gray-100">Tutup</button>
            <button onClick={handleSave} disabled={!results} className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 disabled:bg-gray-400">Simpan</button>
          </div>
        </div>

        {/* Hasil Kalkulasi */}
        {results && (
          <div className="mt-6 p-4 bg-gray-50 rounded-lg border">
            <h3 className="font-bold">Hasil Analisis:</h3>
            <p><strong>IMT/BMI:</strong> {results.bmi} ({results.bmiCategory})</p>
            <p><strong>Kebutuhan Kalori Harian:</strong> ~{results.tdee} kkal</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HealthProfileModal;