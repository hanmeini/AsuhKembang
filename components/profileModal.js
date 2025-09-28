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
          className="bg-white w-full max-w-7xl h-[90vh] md:ml-12 rounded-t-2xl shadow-xl flex flex-col"
        >
          {/* Header Modal */}
          <div className="flex justify-between items-center p-4 border-b flex-shrink-0">
            <h2 className="text-xl font-bold">{initialData ? 'Edit Profil' : 'Tambah Profil Baru'}</h2>
            <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100"><FaTimes/></button>
          </div>
          
          {/* Konten Form (dibuat bisa di-scroll) */}
          <div className="p-6 space-y-4 overflow-y-auto">
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

            {type === 'child' && (
              <>
                <div>
                  <label className="font-semibold text-sm">Tanggal Lahir Anak</label>
                  <input type="date" value={date} onChange={e => setDate(e.target.value)} className="w-full mt-1 p-2 border rounded-lg" />
                </div>
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
             {type === 'pregnant' && (
              <div>
                <label className="font-semibold text-sm">Perkiraan Tanggal Lahir (HPL)</label>
                <input type="date" value={date} onChange={e => setDate(e.target.value)} className="w-full mt-1 p-2 border rounded-lg" />
              </div>
            )}
          </div>

          {/* Footer Modal */}
          <div className="mt-auto p-4 flex pb-30 md:pb-4 justify-start space-x-4 border-t">
            <button onClick={handleSubmit} className="bg-teal-600 text-white font-semibold px-6 py-2 rounded-lg hover:bg-teal-700">Simpan</button>
            <button onClick={onClose} className="text-gray-600 px-4 py-2 rounded-lg hover:bg-gray-100">Batal</button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ProfileModal;

