'use client';

import React, { useState, useEffect, useRef } from 'react';
import AuthGuard from '../../context/AuthGuard';
import Sidebar from '../../components/Sidebar';
import { useAuth } from '../../context/AuthContext';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase'
import { getAuth, updateProfile, signOut } from "firebase/auth";
import ProfileModal from '../../components/profileModal';
import BottomNavBar from '../../components/BottomNav';
import FloatingChatButton from '../../components/FloatingChatButton';
import { FaUserCircle, FaPen, FaSignOutAlt } from 'react-icons/fa';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

const ProfileCard = ({ profile, onEdit }) => (
  <div className="bg-white p-6 rounded-2xl shadow-md flex items-center justify-between hover:shadow-lg transition-shadow">
    <div className="flex items-center gap-4">
      <div>
        <p className="font-semibold text-gray-800">{profile.name}</p>
        <p className="text-sm text-gray-500 capitalize">
          {profile.type === 'pregnant'
            ? 'Kehamilan'
            : profile.type === 'child'
            ? 'Anak'
            : 'Umum'}
        </p>
      </div>
    </div>
    <button
      onClick={() => onEdit(profile)}
      className="text-teal-600 font-semibold hover:underline"
    >
      Edit
    </button>
  </div>
);

export default function ProfilePage() {
  const { userProfile, refreshUserProfile } = useAuth();
  const [isSidebarExpanded, setSidebarExpanded] = useState(false);
  const [displayName, setDisplayName] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [gender, setGender] = useState('Wanita');
  const [activityLevel, setActivityLevel] = useState('Ringan');
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProfile, setEditingProfile] = useState(null);
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState('');
  const fileInputRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    if (userProfile) {
      setDisplayName(userProfile.displayName || '');
      setPhotoPreview(userProfile.photoURL || '');
      const hp = userProfile.healthProfile;
      if (hp) {
        setHeight(hp.height || ''); setWeight(hp.weight || ''); setBirthDate(hp.birthDate || '');
        setGender(hp.gender || 'Wanita'); setActivityLevel(hp.activityLevel || 'Ringan');
      }
    }
  }, [userProfile]);

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhotoFile(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

const handleSaveAllChanges = async () => {
  if (!userProfile) return;
  setIsLoading(true);

  try {
    let updatedPhotoURL = userProfile.photoURL;

    if (photoFile) {
      try {
        const formData = new FormData();
        formData.append("file", photoFile);
        formData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET);

        const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`;
        const cloudinaryResponse = await fetch(cloudinaryUrl, {
          method: "POST",
          body: formData,
        });

        const cloudinaryData = await cloudinaryResponse.json();
        if (!cloudinaryResponse.ok) {
          throw new Error(cloudinaryData.error?.message || "Gagal unggah foto.");
        }

        updatedPhotoURL = cloudinaryData.secure_url;
      } catch (uploadError) {
        throw new Error(`Gagal mengunggah foto ke Cloudinary: ${uploadError.message}`);
      }
    }

    try {
      const auth = getAuth();
      if (!auth.currentUser) throw new Error("User tidak terautentikasi.");

      await updateProfile(auth.currentUser, {
        displayName: displayName,
        photoURL: updatedPhotoURL,
      });

      await auth.currentUser.reload();
    } catch (authError) {
      throw new Error(`Gagal memperbarui profil autentikasi: ${authError.message}`);
    }

    try {
      const userDocRef = doc(db, "users", userProfile.uid);
      await updateDoc(userDocRef, {
        displayName: displayName,
        photoURL: updatedPhotoURL,
        healthProfile: {
          height: Number(height),
          weight: Number(weight),
          birthDate: birthDate,
          gender: gender,
          activityLevel: activityLevel,
        },
      });
    } catch (firestoreError) {
      throw new Error(`Gagal memperbarui data di database: ${firestoreError.message}`);
    }

    await refreshUserProfile();
    setPhotoFile(null);

  } catch (error) {
    console.error("❌ Gagal memperbarui profil:", error);
    alert("Terjadi kesalahan: " + error.message);
  } finally {
    setIsLoading(false);
  }
};

  const handleAddNewSubProfile = () => {
    setEditingProfile(null);
    setIsModalOpen(true);
  };

  const handleEditSubProfile = (profile) => {
    setEditingProfile(profile);
    setIsModalOpen(true);
  };

  const handleSaveSubProfile = async (profileData) => {
    if (!userProfile) return;

    const currentProfiles = userProfile.profiles || [];
    let updatedProfiles;
    const isEditing = currentProfiles.some(
      (p) => p.profileId === profileData.profileId
    );

    if (isEditing) {
      updatedProfiles = currentProfiles.map((p) =>
        p.profileId === profileData.profileId ? profileData : p
      );
    } else {
      updatedProfiles = [...currentProfiles, profileData];
    }

    try {
      const userDocRef = doc(db, 'users', userProfile.uid);
      await updateDoc(userDocRef, { profiles: updatedProfiles });
      alert('Profil berhasil disimpan!');
      refreshUserProfile();
      setIsModalOpen(false);
    } catch (error) {
      console.error('Gagal menyimpan sub-profil: ', error);
      alert('Gagal menyimpan sub-profil.');
    }
  };

  const handleLogout = async () => {
    const auth = getAuth();
    try {
      await signOut(auth);
      router.push('/login');
    } catch (error) {
      console.error('Gagal keluar:', error);
      alert('Gagal keluar. Silakan coba lagi.');
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

      <div className="flex min-h-screen bg-gray-50">
        <Sidebar
          isExpanded={isSidebarExpanded}
          onMouseEnter={() => setSidebarExpanded(true)}
          onMouseLeave={() => setSidebarExpanded(false)}
        />

        <main
          className={`flex-1 transition-all duration-300 pb-20 ease-in-out ${
            isSidebarExpanded ? 'md:pl-[17.5rem]' : 'md:pl-[6.5rem]'
          }`}
        >
          <div className="p-6 md:p-10 max-w-4xl mx-auto space-y-12">
            <div>
              <div className='flex flex-row justify-between items-center p-4'>
                <h1 className="text-lg md:text-3xl font-bold text-gray-800">
                  Kelola Sub-Profil
                </h1>
                <button 
                  onClick={handleLogout}
                  className="bg-white flex justify-center items-center gap-1 border-red-500 border hover:bg-red-400 hover:text-white text-red-400 font-semibold px-6 py-2 rounded-lg transition-colors duration-300"
                        >
                          <FaSignOutAlt/>
                  Logout
                </button>
              </div>
              <div className="space-y-4">
                {userProfile?.profiles?.map((profile) => (
                  <ProfileCard
                    key={profile.profileId}
                    profile={profile}
                    onEdit={handleEditSubProfile}
                  />
                ))}
              </div>
              <button
                onClick={handleAddNewSubProfile}
                className="mt-8 bg-teal-600 text-white font-semibold px-6 py-3 rounded-xl shadow hover:bg-teal-700 transition-colors"
              >
                + Tambah Profil Baru
              </button>
            </div>

            <div className="bg-white md:p-8 rounded-2xl md:shadow-lg space-y-6">
              <h2 className="text-2xl font-bold mb-4">Profil Saya</h2>

              <div className="flex items-center gap-6">
                    <div className="flex flex-col items-center gap-4">
                        <div className="relative w-24 h-24">
                           {photoPreview ? (
                                <Image src={photoPreview} alt="Pratinjau" fill className="rounded-full object-cover"/>
                           ) : (
                                <FaUserCircle size={96} className="text-gray-300"/>
                           )}
                           <button onClick={() => fileInputRef.current.click()} className="absolute bottom-0 right-0 bg-white p-2 rounded-full shadow-md hover:bg-gray-100">
                               <FaPen size={12}/>
                           </button>
                           <input type="file" ref={fileInputRef} onChange={handlePhotoChange} accept="image/*" className="hidden"/>
                        </div>
                    </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-600">
                    Nama Tampilan
                  </label>
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="w-full mt-1 p-2 border rounded-lg"
                  />
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold mb-4">Informasi Kesehatan</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-600">
                      Tinggi (cm)
                    </label>
                    <input
                      type="number"
                      value={height}
                      onChange={(e) => setHeight(e.target.value)}
                      className="w-full mt-1 p-2 border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600">
                      Berat (kg)
                    </label>
                    <input
                      type="number"
                      value={weight}
                      onChange={(e) => setWeight(e.target.value)}
                      className="w-full mt-1 p-2 border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600">
                      Tanggal Lahir
                    </label>
                    <input
                      type="date"
                      value={birthDate}
                      onChange={(e) => setBirthDate(e.target.value)}
                      className="w-full mt-1 p-2 border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600">
                      Jenis Kelamin
                    </label>
                    <select
                      value={gender}
                      onChange={(e) => setGender(e.target.value)}
                      className="w-full mt-1 p-2 border rounded-lg"
                    >
                      <option>Wanita</option>
                      <option>Pria</option>
                    </select>
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-600">
                      Tingkat Aktivitas
                    </label>
                    <select
                      value={activityLevel}
                      onChange={(e) => setActivityLevel(e.target.value)}
                      className="w-full mt-1 p-2 border rounded-lg"
                    >
                      <option value="Jarang">
                        Jarang atau tidak pernah olahraga
                      </option>
                      <option value="Ringan">
                        Olahraga ringan (1-3 hari/minggu)
                      </option>
                      <option value="Aktif">
                        Olahraga aktif (3-5 hari/minggu)
                      </option>
                      <option value="Sangat Aktif">
                        Olahraga sangat aktif (6-7 hari/minggu)
                      </option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="pt-4 flex gap-2 md:justify-end items-center">
                <button
                  onClick={handleSaveAllChanges}
                  disabled={isLoading}
                  className="bg-teal-600 text-white font-semibold px-8 py-3 rounded-lg hover:bg-teal-700 disabled:bg-gray-400"
                >
                  {isLoading ? 'Menyimpan...' : 'Simpan Semua Perubahan'}
                </button>
              </div>
        </div>
      </div>
      </main>

        <div className="fixed bottom-24 right-4 z-50 md:hidden">
          <FloatingChatButton />
        </div>
        <BottomNavBar />
      </div>
    </AuthGuard>
  );
}
