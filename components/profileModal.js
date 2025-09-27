'use client';

import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

const ProfileModal = ({ onSave, onClose, initialData }) => {
  // State untuk data dasar
  const [type, setType] = useState(initialData?.type || 'pregnant');
  const [name, setName] = useState(initialData?.name || '');
  
  // State untuk data spesifik
  const [date, setDate] = useState(initialData?.dueDate || initialData?.birthDate || '');
  const [allergies, setAllergies] = useState(initialData?.allergies?.join(', ') || '');
  
  // PERBAIKAN: State baru untuk data kesehatan anak
  const [childHealthData, setChildHealthData] = useState({
    height: initialData?.healthData?.height || '',
    weight: initialData?.healthData?.weight || '',
    gender: initialData?.healthData?.gender || 'Pria',
  });

  // Fungsi untuk update state kesehatan anak
  const handleChildHealthChange = (e) => {
    const { name, value } = e.target;
    setChildHealthData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    if (!name || (type !== 'general' && !date)) {
      alert("Nama dan Tanggal harus diisi.");
      return;
    }

    const newProfile = {
      profileId: initialData?.profileId || `profile_${uuidv4()}`,
      type: type,
      name: name,
      ...(type === 'pregnant' && { dueDate: date }),
      ...(type === 'child' && { 
        birthDate: date, 
        allergies: allergies.split(',').map(s => s.trim()).filter(Boolean),
        healthData: { // Menyimpan data kesehatan anak
            height: Number(childHealthData.height),
            weight: Number(childHealthData.weight),
            gender: childHealthData.gender,
        }
      }),
    };
    
    onSave(newProfile);
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex justify-center items-center p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6">{initialData ? 'Edit Profil' : 'Tambah Profil Baru'}</h2>
        
        <div className="space-y-4">
          <div>
            <label className="font-semibold text-sm">Tipe Profil</label>
            <select value={type} onChange={e => setType(e.target.value)} className="w-full mt-1 p-2 border rounded-lg">
              <option value="pregnant">Ibu Hamil</option>
              <option value="child">Anak</option>
              <option value="general">Umum (Dewasa)</option>
            </select>
          </div>
          <div>
            <label className="font-semibold text-sm">Nama Profil</label>
            <input type="text" placeholder="Contoh: Kehamilan Pertama / Budi" value={name} onChange={e => setName(e.target.value)} className="w-full mt-1 p-2 border rounded-lg" />
          </div>

          {type === 'pregnant' && (
            <div>
              <label className="font-semibold text-sm">Perkiraan Tanggal Lahir (HPL)</label>
              <input type="date" value={date} onChange={e => setDate(e.target.value)} className="w-full mt-1 p-2 border rounded-lg" />
            </div>
          )}
          {type === 'child' && (
            <>
              <div>
                <label className="font-semibold text-sm">Tanggal Lahir Anak</label>
                <input type="date" value={date} onChange={e => setDate(e.target.value)} className="w-full mt-1 p-2 border rounded-lg" />
              </div>
              {/* PERBAIKAN: Form input untuk data kesehatan anak */}
              <div className="p-4 border-t mt-4">
                  <h3 className="font-semibold text-gray-700">Data Fisik Anak (Opsional)</h3>
                  <div className="grid grid-cols-2 gap-4 mt-2">
                      <div>
                          <label className="text-xs">Tinggi (cm)</label>
                          <input type="number" name="height" value={childHealthData.height} onChange={handleChildHealthChange} className="w-full mt-1 p-2 border rounded-lg" />
                      </div>
                      <div>
                          <label className="text-xs">Berat (kg)</label>
                          <input type="number" name="weight" value={childHealthData.weight} onChange={handleChildHealthChange} className="w-full mt-1 p-2 border rounded-lg" />
                      </div>
                      <div className="col-span-2">
                           <label className="text-xs">Jenis Kelamin</label>
                          <select name="gender" value={childHealthData.gender} onChange={handleChildHealthChange} className="w-full mt-1 p-2 border rounded-lg">
                              <option>Pria</option>
                              <option>Wanita</option>
                          </select>
                      </div>
                  </div>
              </div>
              <div>
                <label className="font-semibold text-sm">Alergi (pisahkan dengan koma)</label>
                <input type="text" placeholder="Contoh: kacang, susu" value={allergies} onChange={e => setAllergies(e.target.value)} className="w-full mt-1 p-2 border rounded-lg" />
              </div>
            </>
          )}
        </div>

        <div className="mt-8 flex justify-end space-x-4">
          <button onClick={onClose} className="text-gray-600 px-4 py-2 rounded-lg hover:bg-gray-100">Batal</button>
          <button onClick={handleSubmit} className="bg-teal-600 text-white font-semibold px-6 py-2 rounded-lg hover:bg-teal-700">Simpan</button>
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;

