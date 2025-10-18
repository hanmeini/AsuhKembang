'use client';

import { useState, useRef, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import AuthGuard from '../../context/AuthGuard';
import Sidebar from '../../components/Sidebar';
import { useAuth } from '../../context/AuthContext';
import { FaCamera, FaChevronLeft, FaFileUpload } from 'react-icons/fa';
import ScanningAnimation from '../../components/scanAnimation'; 
import ScanResultCard from '../../components/cardScan'; 
import { subscribeToTodaysScans } from '../../lib/firestore'; 
import ProfileSelector from '../../components/profileSelector';
import Image from 'next/image';
import BottomNavBar from '../../components/BottomNav';
import { motion } from 'framer-motion';
import imageCompression from 'browser-image-compression';
import { useRouter } from 'next/navigation';
import WelcomeModal from '../../components/WelcomeModal';

// Komponen kecil baru untuk menampilkan item di riwayat
const HistoryItem = ({ scan, onClick, isActive }) => {
  const calories = scan.nutritionData?.calories; // gunakan optional chaining

  return (
    <button 
      onClick={onClick} 
      className={`w-full flex items-center justify-between p-3 rounded-lg border text-left transition-all duration-200
                ${isActive ? 'bg-teal-50 border-teal-300 shadow-sm' : 'bg-gray-50 hover:bg-teal-50 hover:border-teal-200'}`}
    >
      <div className="flex items-center gap-3 overflow-hidden">
        <Image 
          src={scan.imageUrl}
          alt={scan.aiScanResult.display_name}
          width={48}
          height={48}
          className="w-12 h-12 object-cover rounded-md flex-shrink-0"
        />
        <div className="flex-grow overflow-hidden">
          <p className="text-sm font-semibold text-gray-800 truncate">
            {scan.aiScanResult.display_name}
          </p>
          <p className="text-xs text-gray-500">
            {new Date(scan.timestamp?.toDate?.() ?? scan.timestamp).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>
      </div>

      {/* ✅ tampilkan kalori hanya kalau ada datanya */}
      {calories !== undefined && calories !== null ? (
        <span className="text-sm font-bold text-teal-600 flex-shrink-0 ml-2">
          {Math.round(calories)} kkal
        </span>
      ) : (
        <span className="text-xs text-gray-400 flex-shrink-0 ml-2">
          Tidak ada data
        </span>
      )}
    </button>
  );
};


export default function ScanPage() {
  const { userProfile } = useAuth();
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isSidebarExpanded, setSidebarExpanded] = useState(false);
  const [todaysScans, setTodaysScans] = useState([]);
  const profiles = userProfile?.profiles || [];
  const [activeProfile, setActiveProfile] = useState(null);
  const [selectedHistoryScan, setSelectedHistoryScan] = useState(null);
  const router = useRouter();
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  // Efek untuk memeriksa apakah pengguna baru (belum punya sub-profil)
  useEffect(() => {
    if (userProfile && (!userProfile.profiles || userProfile.profiles.length === 0)) {
        setShowWelcomeModal(true);
    } else {
        setShowWelcomeModal(false);
    }
  }, [userProfile]);


  
  // Listener untuk mengambil riwayat scan hari ini secara real-time
  useEffect(() => {
    // Hanya jalankan jika user DAN profil aktif sudah ada
    if (userProfile?.uid && activeProfile?.profileId) {
      const unsubscribe = subscribeToTodaysScans(userProfile.uid, activeProfile.profileId, (scans) => {
        scans.sort((a, b) => (b.timestamp?.seconds || 0) - (a.timestamp?.seconds || 0));
        setTodaysScans(scans);
      });
      return () => unsubscribe();
    }
  }, [userProfile, activeProfile]); 


  const toggleCamera = async () => {
    if (isCameraOpen) {
      const stream = videoRef.current?.srcObject;
      stream?.getTracks().forEach(track => track.stop());
      if (videoRef.current) videoRef.current.srcObject = null;
      setIsCameraOpen(false);
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) videoRef.current.srcObject = stream;
        setIsCameraOpen(true);
        setImageFile(null);
        setPreviewUrl('');
      } catch (err) {
        console.error("Error accessing camera: ", err);
        setError("Tidak bisa mengakses kamera. Pastikan Anda memberikan izin.");
      }
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    console.log(`Ukuran asli: ${(file.size / 1024 / 1024).toFixed(2)} MB`);

    const options = {
      maxSizeMB: 1,         
      maxWidthOrHeight: 1024,
      useWebWorker: true,
    };

    try {
      const compressedFile = await imageCompression(file, options);
      console.log(`Ukuran setelah kompresi: ${(compressedFile.size / 1024 / 1024).toFixed(2)} MB`);
      
      setImageFile(compressedFile);
      setPreviewUrl(URL.createObjectURL(compressedFile));
    } catch (error) {
      console.error("Error saat kompresi gambar:", error);
      setError("Gagal memproses gambar. Coba lagi.");
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleCapture = () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (!canvas || !video) return;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d').drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
    
    canvas.toBlob((blob) => {
      const capturedFile = new File([blob], `capture-${uuidv4()}.jpg`, { type: 'image/jpeg' });
      setImageFile(capturedFile);
      setPreviewUrl(URL.createObjectURL(capturedFile));
      toggleCamera(); 
    }, 'image/jpeg');
  };

  const handleSubmit = async () => {
    if (!userProfile) { alert("Anda harus login untuk melakukan scan!"); return; }
    if (!imageFile) { setError("Silakan pilih gambar atau ambil foto terlebih dahulu."); return; }

    setIsLoading(true);
    setResult(null);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', imageFile);
      formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET);

      const cloudinaryCloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
      const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${cloudinaryCloudName}/image/upload`;
      const cloudinaryResponse = await fetch(cloudinaryUrl, { method: 'POST', body: formData });
      const cloudinaryData = await cloudinaryResponse.json();
      if (!cloudinaryResponse.ok) { throw new Error(cloudinaryData.error.message || 'Gagal mengunggah gambar.'); }
      
      const imageUrl = cloudinaryData.secure_url;
      const scanResponse = await fetch('/api/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          imageUrl,
          userId: userProfile.uid,
          activeProfile: activeProfile
         }),
      });
      const scanData = await scanResponse.json();
      if (!scanResponse.ok) { throw new Error(scanData.error || 'Gagal menganalisis gambar.'); }
      
      setResult(scanData);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Fungsi untuk memulai scan dari awal lagi
  const handleReset = () => {
    setResult(null);
    setImageFile(null);
    setPreviewUrl('');
    setSelectedHistoryScan(null);
    setError(null);
  };

  // fetch active profile
  useEffect(() => {
  if (userProfile && profiles.length > 0) {
    const currentProfile = profiles.find(p => p.profileId === userProfile.activeProfileId);
    setActiveProfile(currentProfile || profiles[0]);
  }
}, [userProfile, profiles]);


  const handleHistoryClick = (scan) => {
    setSelectedHistoryScan(scan);
    setResult(null); 
  };

const currentResult = result || selectedHistoryScan;

  return (
    <AuthGuard>
      {showWelcomeModal && <WelcomeModal />}
      {isLoading && <ScanningAnimation />}
      <div className="flex bg-gray-50 pb-20">
        <Sidebar isExpanded={isSidebarExpanded} onMouseEnter={() => setSidebarExpanded(true)} onMouseLeave={() => setSidebarExpanded(false)} />
        <main className={`flex-1 transition-all duration-300 ease-in-out ${isSidebarExpanded ? 'md:pl-[17.5rem]' : 'md:pl-[6.5rem]'}`}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 p-6 md:p-10">
            <div className="lg:col-span-2 relative">
              {currentResult ? (
                // Tampilan Hasil
                <div className='relative overflow-visible'>
                  <button onClick={handleReset} className=" z-10 text-teal-500 font-semibold py-5 px-6 bg-white shadow-lg absolute -top-5 border-teal-500 left-2 rounded-full items-center md:hidden flex justify-center border-2 hover:bg-teal-700 transition-transform hover:scale-105">
                    <FaChevronLeft />
                  </button>
                  <ScanResultCard result={currentResult} />
                  <div className="text-center mt-8">
                    <button onClick={handleReset} className="bg-teal-600 text-white font-semibold px-8 py-3 rounded-lg hover:bg-teal-700 transition-transform hover:scale-105">
                      Pindai Makanan Lain
                    </button>
                  </div>
                </div>
              ) : (
                // Tampilan Awal untuk Upload
                <div>
                  <ProfileSelector profiles={userProfile?.profiles} activeProfile={activeProfile} onProfileChange={setActiveProfile} />
                  <div className="w-full max-w-2xl">
                    <div className="relative border-2 border-dashed border-gray-300 rounded-lg p-6 text-center mb-4 min-h-[300px] flex justify-center items-center bg-white">
                      {previewUrl && <img src={previewUrl} alt="Preview" className="max-h-64 rounded-lg" />}
                      {isCameraOpen && (
                        <div>
                          <video ref={videoRef} autoPlay className="w-full rounded-lg" />
                          <canvas ref={canvasRef} className="hidden" />
                        </div>
                      )}
                      {!previewUrl && !isCameraOpen && 
                      <div className='relative flex flex-col items-center justify-center group'>
                        {/* Bubble Chat "Brocco" */}
                        <div className="absolute top-0 flex items-center bg-white/80 backdrop-blur-sm px-12 py-2 rounded-full shadow-md">
                          <span className="text-sm font-semibold text-gray-700">Analisis makanan bersama <span className='text-orange-500 font-bold'>Brocco</span> yuk!</span>
                        </div>
                        {/* Bubble Chat "Hi" */}
                        <div className="absolute top-1/2 -left-10 bg-white px-6 py-3 rounded-full shadow-md opacity-0 scale-90 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300 ease-in-out transform translate-x-1/4 group-hover:-rotate-3 -translate-y-1/2">
                          <span className="text-lg font-medium">Hi 👋</span>
                          <div className="absolute right-full top-0 -translate-y-1/2 w-0 h-0 border-t-8 border-t-transparent border-b-8 border-b-transparent border-r-8 border-r-white"></div>
                        </div>
                        <video
                          className="object-contain w-64 h-64 rounded-2xl
                                    transition-transform duration-500 ease-in-out
                                    transform"
                          autoPlay
                          loop
                          muted
                          playsInline
                        >
                          <source src="/images/Cheerful_Broccoli_Animation_Generated.mp4" type="video/mp4" />
                          Your browser does not support the video tag.
                        </video>
                        <p className="text-gray-500">Pilih gambar atau buka kamera</p>
                      </div>
                      }
                    </div>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
                      <motion.label 
                        className="cursor-pointer px-6 py-3 w-full bg-white border-2 border-gray-300 text-gray-700 font-semibold rounded-lg shadow-sm hover:border-teal-500 hover:text-teal-600 text-center flex items-center justify-center gap-2 transition-all duration-200"
                        whileHover={{ y: -2 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <FaFileUpload /> Pilih dari Galeri
                        <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                      </motion.label>
                      <motion.label 
                        className="cursor-pointer px-6 py-3 w-full bg-white border-2 border-gray-300 text-gray-700 font-semibold rounded-lg shadow-sm hover:border-pink-500 hover:text-pink-600 text-center flex items-center justify-center gap-2 transition-all duration-200"
                        whileHover={{ y: -2 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <FaCamera /> Gunakan Kamera
                        <input type="file" accept="image/*" capture="environment" onChange={handleFileChange} className="hidden" />
                      </motion.label>
                    </div>
                    
                    <motion.button 
                      onClick={handleSubmit} 
                      disabled={!imageFile} 
                      className="w-full px-6 py-4 bg-teal-600 text-white font-bold rounded-lg shadow-lg hover:bg-teal-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-lg transition-all duration-300"
                      whileHover={imageFile ? { scale: 1.02, y: -2 } : {}}
                      whileTap={imageFile ? { scale: 0.98 } : {}}
                    >
                      Analisis Makanan Ini
                    </motion.button>
                  </div>
                  {error && <p className="mt-4 text-red-500 text-center bg-red-100 p-4 rounded-lg">Error: {error}</p>}
                </div>
              )}
            </div>

            {/* Kolom Kanan: Riwayat Hari Ini */}
            <div className="bg-white p-6 rounded-2xl shadow-lg">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Riwayat Hari Ini</h2>
              <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
                {todaysScans.length > 0 ? (
                  todaysScans.map(scan => 
                    <HistoryItem 
                      key={scan.id} 
                      scan={scan} 
                      onClick={() => handleHistoryClick(scan)}
                      isActive={selectedHistoryScan?.id === scan.id}
                    />
                  )
                ) : (
                  <div className="text-center relative group py-8 flex items-center flex-col">
                    <div className="absolute top-5 left-0 bg-white px-6 py-3 rounded-full shadow-md opacity-0 scale-90 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300 ease-in-out transform translate-x-1/4 group-hover:-rotate-3 -translate-y-1/2">
                      <span className="text-sm font-medium">Masih kosong, ayo makan 🧐</span>
                      <div className="absolute right-full top-0 -translate-y-1/2 w-0 h-0 border-t-8 border-t-transparent border-b-8 border-b-transparent border-r-8 border-r-white"></div>
                    </div>
                    <video
                      className="object-contain w-44 h-44 rounded-2xl
                                transition-transform duration-500 ease-in-out
                                transform"
                      autoPlay
                      loop
                      muted
                      playsInline
                    >
                      <source src="/images/brokoli-think.mp4" type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                    <p className="mt-4 text-gray-500 text-sm">Belum ada makanan yang dipindai hari ini. <br/>Ayo mulai!</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
        <BottomNavBar />
      </div>
    </AuthGuard>
  );
}