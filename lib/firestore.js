// firestoreService.js
import { 
  doc, 
  updateDoc, 
  setDoc, 
  addDoc, 
  getDocs, 
  onSnapshot, 
  collection, 
  query, 
  where, 
  Timestamp,
  orderBy,
  limit,
  deleteDoc
} from "firebase/firestore";
import { db } from "./firebase"; 

/* =============================
    UPDATE & FETCH USER PROFILE
============================= */

// Update atau tambahkan profil kesehatan user
export const updateUserHealthProfile = async (userId, healthData) => {
  if (!userId) throw new Error("User ID tidak ditemukan.");
  const userDocRef = doc(db, "users", userId);
  try {
    await updateDoc(userDocRef, { healthProfile: healthData });
    console.log("Profil kesehatan berhasil diperbarui!");
  } catch (error) {
    console.error("Error updating health profile: ", error);
    throw error;
  }
};


/* =============================
          SCAN TODAY
============================= */

// Realtime fetch scan hari ini berdasarkan user dan profile
// PERBAIKAN: Menggunakan koleksi 'scans' di level atas (root)
export const subscribeToTodaysScans = (userId, profileId, callback) => {
  if (!userId || !profileId) {
    console.error("❌ userId atau profileId kosong di subscribeToTodaysScans");
    return () => {};
  }

  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date();
  endOfDay.setHours(23, 59, 59, 999);

  const scansRef = collection(db, "scans"); 
  const q = query(
    scansRef,
    where("userId", "==", userId),
    where("profileId", "==", profileId), 
    where("timestamp", ">=", Timestamp.fromDate(startOfDay)),
    where("timestamp", "<=", Timestamp.fromDate(endOfDay))
  );

  return onSnapshot(q, (snapshot) => {
    const scans = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    scans.sort((a, b) => b.timestamp.seconds - a.timestamp.seconds);
    callback(scans);
  });
};


/* =============================
         WATER INTAKE
============================= */

// Ambil dokumen water intake hari ini
const getTodaysWaterEntryDoc = async (userId) => {
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const q = query(
    collection(db, "healthEntries"),
    where("userId", "==", userId),
    where("type", "==", "water"),
    where("timestamp", ">=", Timestamp.fromDate(startOfDay))
  );

  const querySnapshot = await getDocs(q);
  if (!querySnapshot.empty) {
    return querySnapshot.docs[0]; 
  }
  return null; 
};

// Listener realtime water intake hari ini
export const subscribeToTodaysWater = (userId, callback) => {
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const q = query(
    collection(db, "healthEntries"),
    where("userId", "==", userId),
    where("type", "==", "water"),
    where("timestamp", ">=", Timestamp.fromDate(startOfDay))
  );

  return onSnapshot(q, (snapshot) => {
    if (!snapshot.empty) {
      callback(snapshot.docs[0].data().value);
    } else {
      callback(0); // Default 0 jika belum ada
    }
  });
};

// Update atau tambah water intake hari ini
export const updateTodaysWater = async (userId, amount) => {
  const docToUpdate = await getTodaysWaterEntryDoc(userId);

  if (docToUpdate) {
    await setDoc(docToUpdate.ref, { value: amount }, { merge: true });
  } else {
    await addDoc(collection(db, "healthEntries"), {
      userId: userId,
      type: "water",
      value: amount,
      timestamp: new Date()
    });
  }
};

// Jurnal kehamilan
export const subscribeToJournals = (userId, profileId, callback) => {
  if (!userId || !profileId) {
    console.error("❌ userId atau profileId kosong di subscribeToJournals");
    return () => {}; 
  }
  const journalsRef = collection(db, "users", userId, "profiles", profileId, "journals");
  
  const q = query(journalsRef, orderBy("week", "desc")); 

  return onSnapshot(q, (snapshot) => {
    const entries = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    callback(entries);
  });
};

//save trimester
export const updateUserActiveTrimester = async (userId, trimester) => {
  if (!userId) throw new Error("User ID tidak ditemukan.");
  const userDocRef = doc(db, "users", userId);
  try {
    await updateDoc(userDocRef, { activeTrimester: trimester });
    console.log(`Trimester aktif untuk user ${userId} disimpan: ${trimester}`);
  } catch (error) {
    console.error("Gagal menyimpan trimester aktif: ", error);
    throw error;
  }
};

// fetch widget kehamilan
export const subscribeToLatestJournal = (userId, profileId, callback) => {
  if (!userId || !profileId) {
    return () => {};
  }

  const journalsRef = collection(db, "users", userId, "profiles", profileId, "journals");
  
  // Mengambil 1 entri terakhir berdasarkan minggu
  const q = query(journalsRef, orderBy("week", "desc"), limit(1)); 

  return onSnapshot(q, (snapshot) => {
    if (!snapshot.empty) {
      const latestEntry = { id: snapshot.docs[0].id, ...snapshot.docs[0].data() };
      callback(latestEntry);
    } else {
      callback(null);
    }
  });
};

// Listener realtime all chat sesi
export const subscribeToAllChats = (userId, callback) => {
  if (!userId) return () => {};

  const chatsRef = collection(db, "chats");
  const q = query(chatsRef, 
    where("userId", "==", userId),
    orderBy("lastMessageTimestamp", "desc")
  ); 

  return onSnapshot(q, (snapshot) => {
    const chats = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    callback(chats);
  });
};

// Listener 1 sesi chat
export const subscribeToChatMessages = (chatId, callback) => {
  if (!chatId) return () => {};

  const chatDocRef = doc(db, "chats", chatId);
  
  return onSnapshot(chatDocRef, (doc) => {
    if (doc.exists()) {
      callback(doc.data().messages);
    }
  });
};

// lisytener post
export const subscribeToPosts = (callback) => {
  const postsRef = collection(db, "posts");
  const q = query(postsRef, orderBy("createdAt", "desc")); 
  return onSnapshot(q, (snapshot) => {
    const posts = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    callback(posts);
  });
};

// listener comments
export const subscribeToComments = (postId, callback) => {
  if (!postId) return () => {};

  const commentsRef = collection(db, "posts", postId, "comments");
  const q = query(commentsRef, orderBy("createdAt", "asc")); 

  return onSnapshot(q, (snapshot) => {
    const comments = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    callback(comments);
  });
};

// fetch weeks spesiific for journals
export const getScansForWeek = async (userId, profileId, week) => {
  if (!userId || !profileId || !week) {
    return [];
  }

  const scansRef = collection(db, "scans");

  const q = query(
    scansRef,
    where("userId", "==", userId),
    where("profileId", "==", profileId),
    where("week", "==", Number(week))
  );

  const querySnapshot = await getDocs(q);
  const scans = querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  console.log(`Ditemukan ${scans.length} data scan untuk minggu ke-${week}`);
  return scans;
};

//  Menyimpan entri data pertumbuhan baru
export const addGrowthEntry = async (userId, profileId, entryData) => {
  if (!userId || !profileId) throw new Error("Data pengguna atau profil tidak lengkap.");
  
  // Menargetkan sub-koleksi 'growthEntries' di dalam profil anak
  const entriesRef = collection(db, "users", userId, "profiles", profileId, "growthEntries");
  
  // Menambahkan dokumen baru dengan data dari form
  // Convert date string to Firestore Timestamp if needed
  const dateValue = entryData.date && typeof entryData.date === 'string'
    ? Timestamp.fromDate(new Date(entryData.date))
    : entryData.date || Timestamp.now();

  await addDoc(entriesRef, {
    ...entryData,
    date: dateValue,
    createdAt: Timestamp.now() // Menambahkan timestamp server
  });
};

//  Listener realtime untuk semua entri pertumbuhan milik sebuah profil
export const subscribeToGrowthEntries = (userId, profileId, callback) => {
  if (!userId || !profileId) {
    return () => {}; // Kembalikan fungsi unsubscribe kosong jika data tidak lengkap
  }

  const entriesRef = collection(db, "users", userId, "profiles", profileId, "growthEntries");
  
  // Mengambil data dan mengurutkannya berdasarkan tanggal, dari yang terlama ke terbaru
  const q = query(entriesRef, orderBy("date", "asc")); 

  return onSnapshot(q, (snapshot) => {
    const entries = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    callback(entries);
  });
};

export const deleteGrowthEntry = async (userId, profileId, entryId) => {
  if (!userId || !profileId || !entryId) {
    throw new Error("Data pengguna, profil, atau ID entri tidak lengkap.");
  }
  const entryDocRef = doc(db, "users", userId, "profiles", profileId, "growthEntries", entryId);

  try {
    await deleteDoc(entryDocRef);
    console.log(`Entri pertumbuhan ${entryId} berhasil dihapus.`);
  } catch (error) {
    console.error("Gagal menghapus entri pertumbuhan: ", error);
    throw error;
  }
};
