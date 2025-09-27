'use client';

import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

const ProfileModal = ({ onSave, onClose, initialData }) => {

  const [type, setType] = useState(initialData?.type || 'pregnant');
  const [name, setName] = useState(initialData?.name || '');
  const [date, setDate] = useState(initialData?.dueDate || initialData?.birthDate || '');
  const [allergies, setAllergies] = useState(initialData?.allergies?.join(', ') || '');

  useEffect(() => {
    if (initialData) {
      setType(initialData.type);
      setName(initialData.name);
      setDate(initialData.dueDate || initialData.birthDate || '');
      setAllergies(initialData.allergies?.join(', ') || '');
    }
  }, [initialData]);

  const handleSubmit = () => {
    if (!name) {
      alert("Nama profil harus diisi.");
      return;
    }
    if (type !== 'general' && !date) {
      alert("Tanggal harus diisi untuk profil Ibu Hamil atau Anak.");
      return;
    }
    const newProfile = {
      profileId: initialData?.profileId || `profile_${uuidv4()}`,
      type: type,
      name: name,
      ...(type === 'pregnant' && { dueDate: date }),
      ...(type === 'child' && { 
        birthDate: date, 
        allergies: allergies.split(',').map(s => s.trim()).filter(Boolean) 
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
            <label className="font-semibold text-sm text-gray-600">Tipe Profil</label>
            <select value={type} onChange={e => setType(e.target.value)} className="w-full mt-1 p-2 border rounded-lg bg-gray-50">
              <option value="pregnant">Ibu Hamil</option>
              <option value="child">Anak</option>
              <option value="general">Umum (Dewasa)</option>
            </select>
          </div>
          <div>
            <label className="font-semibold text-sm text-gray-600">Nama Profil</label>
            <input type="text" placeholder="Contoh: Budi" value={name} onChange={e => setName(e.target.value)} className="w-full mt-1 p-2 border rounded-lg" />
          </div>

          {type === 'pregnant' && (
            <div>
              <label className="font-semibold text-sm text-gray-600">Perkiraan Tanggal Lahir (HPL)</label>
              <input type="date" value={date} onChange={e => setDate(e.target.value)} className="w-full mt-1 p-2 border rounded-lg" />
            </div>
          )}
          {type === 'child' && (
            <>
              <div>
                <label className="font-semibold text-sm text-gray-600">Tanggal Lahir Anak</label>
                <input type="date" value={date} onChange={e => setDate(e.target.value)} className="w-full mt-1 p-2 border rounded-lg" />
              </div>
              <div>
                <label className="font-semibold text-sm text-gray-600">Alergi (pisahkan dengan koma)</label>
                <input type="text" placeholder="Contoh: kacang, susu, telur" value={allergies} onChange={e => setAllergies(e.target.value)} className="w-full mt-1 p-2 border rounded-lg" />
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

