"use client";
import React, { useContext, useState, useEffect, createContext } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
  onSnapshot,
} from "firebase/firestore";
import { auth, db } from "../lib/firebase";

const AuthContext = createContext(null);

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubscribeSnapshot = null;

    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      // Jika ada listener lama, matikan dulu
      if (unsubscribeSnapshot) {
        unsubscribeSnapshot();
        unsubscribeSnapshot = null;
      }

      if (user) {
        const docRef = doc(db, "users", user.uid);

        // Gunakan onSnapshot untuk pembaruan real-time (Lencana Plus otomatis muncul)
        unsubscribeSnapshot = onSnapshot(
          docRef,
          (docSnap) => {
            if (docSnap.exists()) {
              setUserProfile({
                ...docSnap.data(),
                uid: user.uid,
                email: user.email,
                photoURL: user.photoURL,
                name:
                  user.displayName || docSnap.data().name || "Pengguna Baru",
              });
            } else {
              // Jika dokumen belum ada, buat baru
              const newUserProfile = {
                name: user.displayName || "Pengguna Baru",
                email: user.email,
                photoURL: user.photoURL || null,
                role: "user",
                createdAt: serverTimestamp(),
              };
              setDoc(docRef, newUserProfile).then(() => {
                setUserProfile({
                  uid: user.uid,
                  ...newUserProfile,
                });
              });
            }
          },
          (error) => {
            console.error("❌ Error pada Firestore listener:", error);
          },
        );
      } else {
        console.log("👤 Tidak ada user login");
        setUserProfile(null);
      }

      setLoading(false);
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeSnapshot) unsubscribeSnapshot();
    };
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
      const docRef = doc(db, "users", updatedUser.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const firestoreData = docSnap.data();

        setUserProfile({
          uid: updatedUser.uid,
          email: updatedUser.email,
          displayName:
            updatedUser.displayName ||
            firestoreData.displayName ||
            "Pengguna Baru",
          photoURL: updatedUser.photoURL || firestoreData.photoURL || "",
          ...firestoreData, // merge data lain (healthProfile, profiles, dsb)
        });

        console.log("✅ Profil berhasil diperbarui di state.");
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
