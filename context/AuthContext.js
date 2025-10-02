"use client"
import React, { useContext, useState, useEffect, createContext } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../lib/firebase'; 

const AuthContext = createContext(null);

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const docRef = doc(db, 'users', user.uid);
        try {
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            setUserProfile({
              ...docSnap.data(),
              uid: user.uid,
              email: user.email,
              photoURL: user.photoURL,
              name: user.displayName || docSnap.data().name || 'Pengguna Baru',
            });
          } else {
            const newUserProfile = {
              name: user.displayName || 'Pengguna Baru',
              email: user.email,
              photoURL: user.photoURL || null,
              role: 'user',
              createdAt: serverTimestamp(),
            };
            await setDoc(docRef, newUserProfile);

            setUserProfile({
              uid: user.uid,
              ...newUserProfile,
            });
          }
        } catch (error) {
          console.error('❌ Gagal memuat profil pengguna:', error);
          await signOut(auth);
        }
      } else {
        console.log('👤 Tidak ada user login');
        setUserProfile(null);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const logout = () => {
    return signOut(auth);
  };

const refreshUserProfile = async () => {
  const currentUser = auth.currentUser;
  if (!currentUser) return;

  try {

    // Force reload biar photoURL & displayName terbaru
    await currentUser.reload();
    const updatedUser = auth.currentUser;

    // Ambil data tambahan dari Firestore
    const docRef = doc(db, 'users', updatedUser.uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const firestoreData = docSnap.data();

      setUserProfile({
        uid: updatedUser.uid,
        email: updatedUser.email,
        displayName: updatedUser.displayName || firestoreData.displayName || 'Pengguna Baru',
        photoURL: updatedUser.photoURL || firestoreData.photoURL || '',
        ...firestoreData, // merge data lain (healthProfile, profiles, dsb)
      });

      console.log('✅ Profil berhasil diperbarui di state.');
    }
  } catch (err) {
    console.error("❌ Gagal refresh user profile:", err);
  }
};

  const value = {
    userProfile,
    loading,
    logout,
    refreshUserProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
