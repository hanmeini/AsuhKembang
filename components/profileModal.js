'use client';

import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes } from 'react-icons/fa';

const ProfileModal = ({ onSave, onClose, initialData }) => {
  const [type, setType] = useState(initialData?.type || 'pregnant');
  const [name, setName] = useState(initialData?.name || '');
  const [date, setDate] = useState(initialData?.dueDate || initialData?.birthDate || '');
  const [allergies, setAllergies] = useState(initialData?.allergies?.join(', ') || '');
  const [childHealthData, setChildHealthData] = useState({
    height: initialData?.healthData?.height || '',
    weight: initialData?.healthData?.weight || '',
    gender: initialData?.healthData?.gender || 'Pria',
  });

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
        healthData: {
            height: Number(childHealthData.height),
            weight: Number(childHealthData.weight),
            gender: childHealthData.gender,
        }
      }),
    };
    
    onSave(newProfile);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 z-50 flex justify-center items-end"
      >
        <motion.div 
          initial={{ y: "100%" }}
          animate={{ y: "0%" }}
          exit={{ y: "100%" }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="bg-white w-full max-w-7xl h-[90vh] md:ml-12 rounded-t-2xl shadow-xl flex flex-col overflow-y-auto"
        >
          {/* Header Modal */}
          <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100 flex-shrink-0">
            <h2 className="text-xl font-bold text-gray-800">{initialData ? 'Edit Profil' : 'Tambah Profil Baru'}</h2>
            <button 
              onClick={onClose} 
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
            >
              <FaTimes className="text-gray-400 hover:text-gray-600"/>
            </button>
          </div>
          
          {/* Konten Form (dibuat bisa di-scroll) */}
          <div className="px-6 py-4 space-y-6 overflow-y-auto max-h-[65vh] md:max-h-[70vh]">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Tipe Profil</label>
              <select 
                value={type} 
                onChange={e => setType(e.target.value)} 
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-gray-300 focus:ring focus:ring-gray-200 focus:ring-opacity-50 transition-all outline-none text-gray-600"
              >
                <option value="pregnant">Ibu Hamil</option>
                <option value="child">Anak</option>
                <option value="general">Umum (Dewasa)</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Nama Profil</label>
              <input 
                type="text" 
                placeholder="Contoh: Kehamilan Pertama / Budi" 
                value={name} 
                onChange={e => setName(e.target.value)} 
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-gray-300 focus:ring focus:ring-gray-200 focus:ring-opacity-50 transition-all outline-none text-gray-600 placeholder-gray-400" 
              />
            </div>

            {type === 'child' && (
              <>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Tanggal Lahir Anak</label>
                  <input 
                    type="date" 
                    value={date} 
                    onChange={e => setDate(e.target.value)} 
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-gray-300 focus:ring focus:ring-gray-200 focus:ring-opacity-50 transition-all outline-none text-gray-600" 
                  />
                </div>

                <div className="p-6 bg-gray-50 rounded-2xl space-y-4">
                  <h3 className="font-medium text-gray-700">Data Fisik Anak (Opsional)</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-600">Tinggi (cm)</label>
                      <input 
                        type="number" 
                        name="height" 
                        value={childHealthData.height} 
                        onChange={handleChildHealthChange} 
                        className="w-full p-3 bg-white border border-gray-200 rounded-xl focus:border-gray-300 focus:ring focus:ring-gray-200 focus:ring-opacity-50 transition-all outline-none text-gray-600" 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-600">Berat (kg)</label>
                      <input 
                        type="number" 
                        name="weight" 
                        value={childHealthData.weight} 
                        onChange={handleChildHealthChange} 
                        className="w-full p-3 bg-white border border-gray-200 rounded-xl focus:border-gray-300 focus:ring focus:ring-gray-200 focus:ring-opacity-50 transition-all outline-none text-gray-600" 
                      />
                    </div>
                    <div className="col-span-2 space-y-2">
                      <label className="text-sm font-medium text-gray-600">Jenis Kelamin</label>
                      <select 
                        name="gender" 
                        value={childHealthData.gender} 
                        onChange={handleChildHealthChange} 
                        className="w-full p-3 bg-white border border-gray-200 rounded-xl focus:border-gray-300 focus:ring focus:ring-gray-200 focus:ring-opacity-50 transition-all outline-none text-gray-600"
                      >
                        <option>Pria</option>
                        <option>Wanita</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Alergi (pisahkan dengan koma)</label>
                  <input 
                    type="text" 
                    placeholder="Contoh: kacang, susu" 
                    value={allergies} 
                    onChange={e => setAllergies(e.target.value)} 
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-gray-300 focus:ring focus:ring-gray-200 focus:ring-opacity-50 transition-all outline-none text-gray-600 placeholder-gray-400" 
                  />
                </div>
              </>
            )}

            {type === 'pregnant' && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Perkiraan Tanggal Lahir (HPL)</label>
                <input 
                  type="date" 
                  value={date} 
                  onChange={e => setDate(e.target.value)} 
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-gray-300 focus:ring focus:ring-gray-200 focus:ring-opacity-50 transition-all outline-none text-gray-600" 
                />
              </div>
            )}

            {/* Tombol Simpan & Batal langsung di bawah input */}
            <div className="pt-4 flex justify-end gap-3">
              <button 
                onClick={onClose} 
                className="px-6 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-medium hover:bg-gray-100 transition-colors"
              >
                Batal
              </button>
              <button 
                onClick={handleSubmit} 
                className="px-6 py-2.5 rounded-xl bg-teal-600 text-white font-medium hover:bg-teal-700 
                         transition-all active:scale-95 focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
              >
                Simpan Profil
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ProfileModal;

