import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
const db = admin.firestore()
import admin from '../../../lib/firebaseAdmin';


// Fungsi untuk membuat prompt AI yang dinamis
const createPrompts = (week, dailyInputs) => {
    const generalInfoPrompt = `
        Anda adalah seorang ahli kandungan. Berikan informasi untuk kehamilan minggu ke-${week}.
        Berikan jawaban dalam format JSON dengan struktur:
        {
          "perkembangan_janin": "Deskripsi singkat perkembangan janin...",
          "gejala_umum_ibu": "Deskripsi singkat gejala umum yang mungkin dialami ibu..."
        }
    `;

    const summaryPrompt = `
        Anda adalah "Brocco", asisten kehamilan yang empatik dan cerdas.
        Seorang pengguna di minggu ke-${week} kehamilan telah mencatat data harian berikut:
        - Suasana Hati: ${dailyInputs.mood || 'Tidak dicatat'}
        - Gejala: ${dailyInputs.symptoms?.join(', ') || 'Tidak ada'}
        - Berat Badan: ${dailyInputs.weight ? `${dailyInputs.weight} kg` : 'Tidak dicatat'}
        - Catatan Pribadi: "${dailyInputs.note || 'Tidak ada'}"

        Berdasarkan semua data ini, berikan sebuah "kesimpulan AI" yang positif dan mendukung dalam 2-3 kalimat. Berikan semangat dan mungkin satu saran praktis yang relevan.
    `;

    return { generalInfoPrompt, summaryPrompt };
};

export async function POST(request) {
  // Menerima semua data dari form di frontend
  const { userId, profileId, week, dailyInputs } = await request.json(); 
  const db = admin.firestore();

  if (!userId || !profileId || !week || !dailyInputs) {
    return NextResponse.json({ error: 'Data tidak lengkap.' }, { status: 400 });
  }

  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    const { generalInfoPrompt, summaryPrompt } = createPrompts(week, dailyInputs);

    // --- Panggilan AI #1: Informasi Umum Mingguan ---
    console.log("Meminta informasi umum untuk minggu ke-", week);
    const generalInfoResultRaw = await model.generateContent(generalInfoPrompt);
    const generalInfoResponse = await generalInfoResultRaw.response;
    // Tambahkan JSON Mode untuk memastikan output valid
    const generalInfo = JSON.parse(generalInfoResponse.text().replace(/```json/g, '').replace(/```/g, '').trim());

    // --- Panggilan AI #2: Rangkuman Personal ---
    console.log("Meminta rangkuman personal...");
    const summaryResultRaw = await model.generateContent(summaryPrompt);
    const summaryResponse = await summaryResultRaw.response;
    const summaryText = summaryResponse.text();

    // --- Gabungkan Semua Data untuk Disimpan ---
    const newJournalEntry = {
        userId,
        profileId,
        week: Number(week),
        date: new Date().toLocaleDateString('id-ID', {day: 'numeric', month: 'long', year: 'numeric'}),
        timestamp: admin.firestore.FieldValue.serverTimestamp(),
        dailyInputs: dailyInputs, // Data dari pengguna
        result: {
            ...generalInfo, // Data dari AI #1
            kesimpulan_ai: summaryText.trim(), // Data dari AI #2
        }
    };
    
    // Simpan ke sub-koleksi 'journals' di dalam profil pengguna
    const docRef = await db.collection('users').doc(userId).collection('profiles').doc(profileId).collection('journals').add(newJournalEntry);
    
    console.log("Jurnal baru berhasil disimpan dengan ID: ", docRef.id);

    return NextResponse.json({ id: docRef.id, ...newJournalEntry });

  } catch (error) {
    console.error('Error di API Jurnal:', error);
    return NextResponse.json({ error: 'Gagal membuat rangkuman jurnal.' }, { status: 500 });
  }
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');
  const profileId = searchParams.get('profileId');
  const db = admin.firestore()
  try {
    const snapshot = await db
      .collection('users')
      .doc(userId)
      .collection('profiles')
      .doc(profileId)
      .collection('journals')
      .orderBy('timestamp', 'desc') 
      .limit(1)
      .get();

    if (snapshot.empty) {
      return NextResponse.json({ error: 'Belum ada jurnal.' }, { status: 404 });
    }

    const doc = snapshot.docs[0];
    return NextResponse.json({ id: doc.id, ...doc.data() });
  } catch (error) {
    console.error('Error ambil jurnal:', error);
    return NextResponse.json({ error: 'Gagal mengambil jurnal.' }, { status: 500 });
  }
}