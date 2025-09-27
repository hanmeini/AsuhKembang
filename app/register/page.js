"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import Link from 'next/link'
import { auth, db } from "../../lib/firebase";
import {
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { useAuth } from "../../context/AuthContext"; 

const Register = () => {
  const router = useRouter()
  const { userProfile } = useAuth(); 
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
        if (userProfile) {
            router.push("/dashboard"); 
        }
  }, [userProfile, router.push]);

  const handleRegister = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {

            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            await updateProfile(user, { displayName: name });
            await setDoc(doc(db, "users", user.uid), {
                name: name,
                email: user.email,
                photoURL: user.photoURL, 
                role: "user", 
                createdAt: serverTimestamp() 
            });
        } catch (err) {
            console.error("Register error:", err.code);
            if (err.code === 'auth/email-already-in-use') {
                setError("Email ini sudah terdaftar. Silakan coba login.");
            } else if (err.code === 'auth/weak-password') {
                setError("Kata sandi terlalu lemah. Minimal 6 karakter.");
            } else {
                setError("Gagal membuat akun. Silakan coba lagi.");
            }
            setLoading(false); 
        }
    };

  const handleGoogle = async () => {
    router.push('/login')
  };

  return (
        <div className="w-full h-screen grid grid-cols-1 lg:grid-cols-2">
            
            {/* Kolom Kiri: GAMBAR (Hanya Desktop) */}
            <div className="hidden lg:block relative h-screen">
                <img src='/images/loginbg.jpg' alt="background" className="h-full w-full object-cover" />
                <div className="absolute inset-0 bg-teal-500/30 flex flex-col justify-end p-12 text-white">
                    <div className="mb-10">
                        <h1 className="text-4xl font-bold">Anak Sehat, Tumbuh Kuat</h1>
                        <p className="text-xl mt-2">Jadikan kesehatan sebagai prioritas hidupmu.</p>
                    </div>
                </div>
            </div>

            {/* FORM (Responsif) */}
            <div 
                style={{ '--bg-image-url': `url(/images/loginbg.jpg)` }}
                className="
                    relative h-screen flex flex-col justify-center items-center p-4
                    bg-cover bg-center bg-[image:var(--bg-image-url)] 
                    lg:bg-none lg:bg-white
                "
            >
                <div className="absolute inset-0 bg-teal-500/30 lg:hidden"></div>
                {/* Tombol kembali hanya untuk mobile */}

                {/* Kartu Form yang menjadi pusat di mobile */}
                <div className="w-full max-w-sm z-10 bg-white p-8 rounded-2xl shadow-xl lg:shadow-none lg:rounded-none lg:h-screen lg:flex lg:flex-col lg:justify-center">
                    <div className="w-full">
                        <h2 className="text-3xl font-semibold text-gray-800 text-center">Gabung Bersama Kami</h2>
                        <p className="text-gray-500 mt-1 mb-6 text-center">Mulai petualanganmu bersama Asuh Kembang</p>
                        
                        {error && <p className="bg-red-100 text-red-700 text-center p-3 rounded-lg mb-4 text-sm">{error}</p>}
                        
                        <button onClick={handleGoogle} disabled={loading} className="w-full flex items-center justify-center gap-2 border rounded-full px-6 py-3 hover:bg-gray-50 transition disabled:opacity-50">
                            <img src="https://img.icons8.com/color/48/000000/google-logo.png" className="w-5 h-5" alt="Google Logo"/>
                            <span className="text-sm font-semibold text-gray-700">Lanjut dengan Google</span>
                        </button>

                        <div className="my-6 w-full flex items-center justify-between">
                            <hr className="w-2/5 border-gray-300" />
                            <span className="text-xs text-gray-400">ATAU</span>
                            <hr className="w-2/5 border-gray-300" />
                        </div>
                        
                        <form onSubmit={handleRegister} className="w-full flex flex-col gap-4">
                            <div>
                                <label className="text-sm font-semibold text-gray-700 mb-1 block text-left">Nama Lengkap</label>
                                <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Masukkan namamu" className="w-full rounded-full bg-gray-100 px-5 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500" required />
                            </div>
                            <div>
                                <label className="text-sm font-semibold text-gray-700 mb-1 block text-left">Email</label>
                                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="contoh@gmail.com" className="w-full rounded-full bg-gray-100 px-5 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500" required />
                            </div>
                            <div>
                                <label className="text-sm font-semibold text-gray-700 mb-1 block text-left">Kata Sandi</label>
                                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Minimal 6 karakter" className="w-full rounded-full bg-gray-100 px-5 py-3 focus:outline-none focus:ring-2 focus:teal-blue-500" required />
                            </div>
                            <button type="submit" disabled={loading} className="bg-teal-500 text-white rounded-full py-3 mt-2 font-semibold hover:bg-teal-800 transition disabled:bg-teal-300">
                                {loading ? 'Membuat Akun...' : 'Daftar'}
                            </button>
                        </form>

                        <p className="mt-6 text-sm text-gray-500 text-center">
                            Sudah punya akun?{" "}
                            <Link href="/login" className="text-teal-500 font-medium hover:underline">
                                Masuk
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
  );
};

export default Register;
