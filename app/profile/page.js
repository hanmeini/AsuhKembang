'use client';

import React, { useState, useEffect } from 'react';
import AuthGuard from '../../context/AuthGuard';
import Sidebar from '../../components/Sidebar';
import { useAuth } from '../../context/AuthContext';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import ProfileModal from '../../components/profileModal';

// Komponen kecil untuk menampilkan kartu profil
const ProfileCard = ({ profile, onEdit }) => (
  <div className="bg-white p-6 rounded-2xl shadow-md flex justify-between items-center">
    <div>
      <p className="font-bold text-lg text-gray-800">{profile.name}</p>
      <p className="text-sm text-gray-500 capitalize">
        {
          profile.type === 'pregnant' ? 'Kehamilan' :
          profile.type === 'child' ? 'Anak' :
          'Umum'
        }
      </p>
    </div>
    <button onClick={() => onEdit(profile)} className="text-teal-600 font-semibold hover:underline">
      Edit
    </button>
  </div>
);

export default function ProfilePage() {
  const { userProfile, refreshUserProfile } = useAuth();
  const [isSidebarExpanded, setSidebarExpanded] = useState(false);

  // State untuk form profil utama
  const [displayName, setDisplayName] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [gender, setGender] = useState('Wanita');
  const [activityLevel, setActivityLevel] = useState('Ringan');
  const [isLoading, setIsLoading] = useState(false);

  // State untuk modal sub-profil
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProfile, setEditingProfile] = useState(null);

  // Mengisi form dengan data yang sudah ada saat halaman dimuat
  useEffect(() => {
    if (userProfile) {
      setDisplayName(userProfile.displayName || '');
      const hp = userProfile.healthProfile;
      if (hp) {
        setHeight(hp.height || '');
        setWeight(hp.weight || '');
        setBirthDate(hp.birthDate || '');
        setGender(hp.gender || 'Wanita');
        setActivityLevel(hp.activityLevel || 'Ringan');
      }
    }
  }, [userProfile]);

  // Fungsi untuk menyimpan perubahan PROFIL UTAMA
  const handleSaveMainProfile = async () => {
    if (!userProfile) return;
    setIsLoading(true);

    try {
      const userDocRef = doc(db, "users", userProfile.uid);
      await updateDoc(userDocRef, {
        displayName: displayName,
        healthProfile: {
          height: Number(height),
          weight: Number(weight),
          birthDate: birthDate,
          gender: gender,
          activityLevel: activityLevel,
        }
      });
      
      await refreshUserProfile(); // Memuat ulang data user di seluruh aplikasi
      alert("Profil utama berhasil diperbarui!");

    } catch (error) {
      console.error("Gagal memperbarui profil utama: ", error);
      alert("Terjadi kesalahan saat menyimpan profil.");
    } finally {
      setIsLoading(false);
    }
  };

  // Fungsi untuk membuka modal tambah SUB-PROFIL baru
  const handleAddNewSubProfile = () => {
    setEditingProfile(null); 
    setIsModalOpen(true);
  };

  // Fungsi untuk membuka modal edit SUB-PROFIL
  const handleEditSubProfile = (profile) => {
    setEditingProfile(profile);
    setIsModalOpen(true);
  };
  
  // Fungsi untuk menyimpan SUB-PROFIL (dari modal)
  const handleSaveSubProfile = async (profileData) => {
    if (!userProfile) return;
    
    const currentProfiles = userProfile.profiles || [];
    let updatedProfiles;
    const isEditing = currentProfiles.some(p => p.profileId === profileData.profileId);
    
    if (isEditing) {
      // Ganti data lama dengan data baru
      updatedProfiles = currentProfiles.map(p => p.profileId === profileData.profileId ? profileData : p);
    } else {
      // Tambah data baru ke array
      updatedProfiles = [...currentProfiles, profileData];
    }

    try {
      const userDocRef = doc(db, 'users', userProfile.uid);
      await updateDoc(userDocRef, { profiles: updatedProfiles });
      alert("Profil berhasil disimpan!");
      refreshUserProfile();
      setIsModalOpen(false);
    } catch (error) {
      console.error("Gagal menyimpan sub-profil: ", error);
      alert("Gagal menyimpan sub-profil.");
    }
  };

  return (
    <AuthGuard>
      {isModalOpen && (
        <ProfileModal 
          onSave={handleSaveSubProfile}
          onClose={() => setIsModalOpen(false)}
          initialData={editingProfile}
        />
      )}
      <div className="flex min-h-screen">
        <Sidebar isExpanded={isSidebarExpanded} onMouseEnter={() => setSidebarExpanded(true)} onMouseLeave={() => setSidebarExpanded(false)} />
        <main className={`flex-1 transition-all duration-300 ease-in-out ${isSidebarExpanded ? 'md:pl-[17.5rem]' : 'md:pl-[6.5rem]'}`}>
          <div className="p-6 md:p-10 max-w-4xl mx-auto space-y-12">
            
            {/* Bagian 1: Kelola Sub-Profil (Anak & Kehamilan) */}
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-6">Kelola Profil</h1>
              <div className="space-y-4">
                {userProfile?.profiles?.map(profile => (
                  <ProfileCard key={profile.profileId} profile={profile} onEdit={handleEditSubProfile} />
                ))}
              </div>
              <button 
                onClick={handleAddNewSubProfile}
                className="mt-8 bg-teal-600 text-white font-semibold px-6 py-3 rounded-lg hover:bg-teal-700 transition-colors"
              >
                + Tambah Profil Baru
              </button>
            </div>

            {/* Bagian 2: Edit Profil Utama (Data Diri Anda) */}
            <div className="bg-white md:p-8 rounded-2xl md:shadow-lg space-y-6">
              <div>
                <h2 className="text-2xl font-bold mb-4">Profil Saya</h2>
                <label className="block text-sm font-medium text-gray-600">Nama Tampilan</label>
                <input type="text" value={displayName} onChange={e => setDisplayName(e.target.value)} className="w-full mt-1 p-2 border rounded-lg" />
              </div>
              
              <div>
                <h2 className="text-xl font-bold mb-4">Informasi Kesehatan</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-600">Tinggi (cm)</label>
                    <input type="number" value={height} onChange={e => setHeight(e.target.value)} className="w-full mt-1 p-2 border rounded-lg" />
                  </div>
                   <div>
                    <label className="block text-sm font-medium text-gray-600">Berat (kg)</label>
                    <input type="number" value={weight} onChange={e => setWeight(e.target.value)} className="w-full mt-1 p-2 border rounded-lg" />
                  </div>
                   <div>
                    <label className="block text-sm font-medium text-gray-600">Tanggal Lahir</label>
                    <input type="date" value={birthDate} onChange={e => setBirthDate(e.target.value)} className="w-full mt-1 p-2 border rounded-lg" />
                  </div>
                   <div>
                    <label className="block text-sm font-medium text-gray-600">Jenis Kelamin</label>
                    <select value={gender} onChange={e => setGender(e.target.value)} className="w-full mt-1 p-2 border rounded-lg">
                      <option>Wanita</option>
                      <option>Pria</option>
                    </select>
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-600">Tingkat Aktivitas</label>
                    <select value={activityLevel} onChange={e => setActivityLevel(e.target.value)} className="w-full mt-1 p-2 border rounded-lg">
                      <option value="Jarang">Jarang atau tidak pernah olahraga</option>
                      <option value="Ringan">Olahraga ringan (1-3 hari/minggu)</option>
                      <option value="Aktif">Olahraga aktif (3-5 hari/minggu)</option>
                      <option value="Sangat Aktif">Olahraga sangat aktif (6-7 hari/minggu)</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button 
                  onClick={handleSaveMainProfile}
                  disabled={isLoading}
                  className="bg-teal-600 text-white font-semibold px-8 py-3 rounded-lg hover:bg-teal-700 disabled:bg-gray-400 transition-colors"
                >
                  {isLoading ? 'Menyimpan...' : 'Simpan Perubahan'}
                </button>
              </div>
            </div>

          </div>
        </main>
      </div>
    </AuthGuard>
  );
}