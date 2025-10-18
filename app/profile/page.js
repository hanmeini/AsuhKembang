'use client';

import React, { useState, useRef, useEffect } from 'react';
import AuthGuard from '../../context/AuthGuard';
import Sidebar from '../../components/Sidebar';
import { useAuth } from '../../context/AuthContext';
import { getAuth, signOut, updateProfile } from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";
import { db } from '../../lib/firebase';
import ProfileModal from '../../components/profileModal';
import BottomNavBar from '../../components/BottomNav';
import { FaUserCircle, FaSignOutAlt, FaChevronRight, FaEdit } from 'react-icons/fa';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FaBaby, FaFemale } from 'react-icons/fa'; 
import { MdPregnantWoman } from "react-icons/md";
import { ImManWoman } from "react-icons/im";

const ProfileCard = ({ profile, onEdit, onDelete }) => (
  <div className="bg-white p-5 rounded-xl shadow-sm flex items-center justify-between 
                  hover:bg-gray-50 transition-all group border border-gray-100">
    <div className="flex items-center gap-4">
      <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center">
        <span className="text-teal-600 font-medium">
          {profile.type === 'pregnant' ? <MdPregnantWoman/> : profile.type === 'child' ? <FaBaby/> : <ImManWoman/>}
        </span>
      </div>
      <div>
        <p className="font-medium text-gray-800">{profile.name}</p>
        <p className="text-sm text-gray-500 capitalize">
          {profile.type === 'pregnant' ? 'Kehamilan' : profile.type === 'child' ? 'Anak' : 'Umum'}
        </p>
      </div>
    </div>
    <div className="flex gap-3 transition-opacity
      opacity-100
      md:opacity-0 md:group-hover:opacity-100">
      <button 
        onClick={() => onEdit(profile)} 
        className="px-3 py-1 rounded-lg bg-teal-50 text-teal-600 text-sm font-medium 
                 hover:bg-teal-100 transition-colors"
      >
        Edit
      </button>
      <button 
        onClick={() => onDelete(profile.profileId)} 
        className="px-3 py-1 rounded-lg bg-red-50 text-red-600 text-sm font-medium 
                 hover:bg-red-100 transition-colors"
      >
        Hapus
      </button>
    </div>
  </div>
);

const MenuItem = ({ href, icon, label, description }) => (
  <Link href={href} className="flex items-center justify-between py-5 px-4 border-b border-gray-200 hover:bg-gray-100 transition-colors">
    <div className="flex items-center gap-4">
      {icon}
      <div>
        <p className="font-semibold text-gray-800">{label}</p>
        {description && <p className="text-sm text-gray-500">{description}</p>}
      </div>
    </div>
    <FaChevronRight className="text-gray-400" />
  </Link>
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
        setHeight(hp.height || ''); 
        setWeight(hp.weight || ''); 
        setBirthDate(hp.birthDate || '');
        setGender(hp.gender || 'Wanita'); 
        setActivityLevel(hp.activityLevel || 'Ringan');
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

  const handleEditPhotoClick = () => {
    fileInputRef.current?.click();
  };

  const handleSaveAllChanges = async () => {
    if (!userProfile) return;
    setIsLoading(true);

    try {
      let updatedPhotoURL = userProfile.photoURL;

      if (photoFile) {
        const formData = new FormData();
        formData.append("file", photoFile);
        formData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET);

        const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`;
        const response = await fetch(cloudinaryUrl, {
          method: "POST",
          body: formData,
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error?.message || "Gagal unggah foto.");
        updatedPhotoURL = data.secure_url;
      }

      const auth = getAuth();
      if (!auth.currentUser) throw new Error("User tidak terautentikasi.");

      await updateProfile(auth.currentUser, {
        displayName,
        photoURL: updatedPhotoURL,
      });

      await updateDoc(doc(db, "users", userProfile.uid), {
        displayName,
        photoURL: updatedPhotoURL,
        healthProfile: {
          height: Number(height),
          weight: Number(weight),
          birthDate,
          gender,
          activityLevel,
        },
      });

      await refreshUserProfile();
      setPhotoFile(null);
      alert('Perubahan berhasil disimpan!');
    } catch (err) {
      alert('Terjadi kesalahan: ' + err.message);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddNewSubProfile = () => {
    setEditingProfile(null);
    setIsModalOpen(true);
  };

  const handleSaveSubProfile = async (newProfile) => {
    if (!userProfile) return;
    try {
      const userDocRef = doc(db, 'users', userProfile.uid);

      // Ambil array lama dan tambahkan/replace profile baru
      const updatedProfiles = userProfile.profiles
        ? [...userProfile.profiles.filter(p => p.profileId !== newProfile.profileId), newProfile]
        : [newProfile];

      await updateDoc(userDocRef, { profiles: updatedProfiles });
      await refreshUserProfile();
      setIsModalOpen(false);
      alert('Sub-profil berhasil disimpan!');
    } catch (error) {
      console.error("Gagal menyimpan sub-profil:", error);
      alert("Gagal menyimpan sub-profil.");
    }
  };


  const handleEditSubProfile = (profile) => {
    setEditingProfile(profile);
    setIsModalOpen(true);
  };

  const handleDeleteSubProfile = async (profileId) => {
    if (!userProfile || !confirm("Yakin ingin menghapus sub-profil ini?")) return;
    try {
      const updatedProfiles = userProfile.profiles.filter(p => p.profileId !== profileId);
      const userDocRef = doc(db, 'users', userProfile.uid);
      await updateDoc(userDocRef, { profiles: updatedProfiles });
      alert('Sub-profil berhasil dihapus!');
      refreshUserProfile();
    } catch (error) {
      alert('Gagal menghapus sub-profil.');
      console.error(error);
    }
  };

  const handleLogout = async () => {
    const auth = getAuth();
    await signOut(auth);
    router.push('/login');
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
      <div className="flex bg-gray-50 min-h-screen">
        <Sidebar isExpanded={isSidebarExpanded} onMouseEnter={() => setSidebarExpanded(true)} onMouseLeave={() => setSidebarExpanded(false)} />
        <main className={`flex-1 transition-all duration-300 pb-20 ease-in-out ${isSidebarExpanded ? 'md:pl-[17.5rem]' : 'md:pl-[6.5rem]'}`}>
            <header className='bg-teal-500 w-full h-44'>

            </header>
            
            {/* Header Profil Pengguna */}
          <div className="flex flex-col items-center p-10 -mt-40 mb-10 text-center relative">
            {userProfile?.photoURL ? (
              <div className='relative p-1 border-white border-2 rounded-full'>
                <Image
                  src={photoPreview || userProfile.photoURL}
                  alt="Profil"
                  width={96}
                  height={96}
                  className="w-28 h-28 rounded-full object-cover shadow-md"
                />
                <button
                  onClick={handleEditPhotoClick}
                  className="absolute bottom-1 right-1 bg-teal-600 text-white p-2 rounded-full shadow hover:bg-teal-700"
                  title="Edit Foto"
                >
                  <FaEdit size={14} />
                </button>
              </div>
            ) : (
              <FaUserCircle size={96} className="text-gray-300" />
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
              className="hidden"
            />
          </div>

            
            <div className='-mt-30 bg-gray-50 rounded-4xl py-20 px-4 md:px-10'>
              <div className='flex flex-col items-start mb-10 bg-white p-6 rounded-2xl shadow-sm border border-gray-100'>
                <div className="flex items-center gap-4 w-full">
                  <div className="flex-1">
                    <h1 className="text-2xl font-bold text-gray-800">{userProfile?.displayName || 'Pengguna'}</h1>
                    <p className="text-gray-500 mt-1">{userProfile?.email}</p>
                  </div>
                </div>
              </div>

              {/* Bagian Sub-Profil */}
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-gray-800">Sub-Profil Anda</h2>
                  <span className="text-sm text-gray-500">
                    {userProfile?.profiles?.length || 0} profil
                  </span>
                </div>
                
                <div className="space-y-4">
                  {userProfile?.profiles?.map(profile => (
                    <ProfileCard 
                      key={profile.profileId} 
                      profile={profile} 
                      onEdit={handleEditSubProfile} 
                      onDelete={handleDeleteSubProfile} 
                    />
                  ))}
                  
                  <button 
                    onClick={handleAddNewSubProfile} 
                    className="w-full border-2 border-dashed border-gray-200 text-gray-600 p-5 rounded-xl 
                             hover:border-teal-500 hover:text-teal-600 hover:bg-teal-50/30 
                             transition-all flex items-center justify-center gap-2 font-medium"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                    </svg>
                    Tambah Profil Baru
                  </button>
                </div>
              </div>

            {/* Bagian Menu Aksi */}
            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm space-y-8 mb-10">
              <div className="space-y-6">
                <h1 className="text-2xl font-bold text-gray-800">Edit Profil Saya</h1>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Nama Tampilan
                  </label>
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl 
                             focus:border-gray-300 focus:ring focus:ring-gray-200 focus:ring-opacity-50 
                             transition-all outline-none text-gray-600"
                  />
                </div>
              </div>

              <div className="space-y-6">
                <h3 className="text-xl font-bold text-gray-800">Informasi Kesehatan</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Tinggi (cm)
                    </label>
                    <input
                      type="number"
                      value={height}
                      onChange={(e) => setHeight(e.target.value)}
                      className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl 
                               focus:border-gray-300 focus:ring focus:ring-gray-200 focus:ring-opacity-50 
                               transition-all outline-none text-gray-600"
                      placeholder="Masukkan tinggi badan"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Berat (kg)
                    </label>
                    <input
                      type="number"
                      value={weight}
                      onChange={(e) => setWeight(e.target.value)}
                      className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl 
                               focus:border-gray-300 focus:ring focus:ring-gray-200 focus:ring-opacity-50 
                               transition-all outline-none text-gray-600"
                      placeholder="Masukkan berat badan"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Tanggal Lahir
                    </label>
                    <input
                      type="date"
                      value={birthDate}
                      onChange={(e) => setBirthDate(e.target.value)}
                      className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl 
                               focus:border-gray-300 focus:ring focus:ring-gray-200 focus:ring-opacity-50 
                               transition-all outline-none text-gray-600"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Jenis Kelamin
                    </label>
                    <select
                      value={gender}
                      onChange={(e) => setGender(e.target.value)}
                      className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl 
                               focus:border-gray-300 focus:ring focus:ring-gray-200 focus:ring-opacity-50 
                               transition-all outline-none text-gray-600"
                    >
                      <option>Wanita</option>
                      <option>Pria</option>
                    </select>
                  </div>
                  <div className="sm:col-span-2 space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Tingkat Aktivitas
                    </label>
                    <select
                      value={activityLevel}
                      onChange={(e) => setActivityLevel(e.target.value)}
                      className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl 
                               focus:border-gray-300 focus:ring focus:ring-gray-200 focus:ring-opacity-50 
                               transition-all outline-none text-gray-600"
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

              <div className="pt-6 flex justify-end">
                <button
                  onClick={handleSaveAllChanges}
                  disabled={isLoading}
                  className="px-8 py-3 rounded-xl bg-teal-600 text-white font-medium 
                           hover:bg-teal-700 disabled:bg-gray-400 disabled:cursor-not-allowed
                           transition-all active:scale-95 focus:ring-2 focus:ring-teal-500 
                           focus:ring-offset-2 flex items-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Menyimpan...</span>
                    </>
                  ) : 'Simpan Perubahan'}
                </button>
              </div>
            </div>
            <button 
              onClick={handleLogout} 
              className="flex items-center gap-2 w-full px-4 bg-red-50 py-4 rounded-xl border border-red-200 
                       text-red-600 hover:bg-red-100 transition-colors"
            >
              <FaSignOutAlt size={16} />
              <span className="text-sm font-medium">Logout</span>
            </button>
            </div>
        </main>
        <BottomNavBar />
      </div>
    </AuthGuard>
  );
}