import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import admin from '../../../lib/firebaseAdmin';

// 🧩 Fungsi bantu: ubah URL gambar jadi format base64 untuk dikirim ke Gemini
async function urlToGenerativePart(url, mimeType) {
  const response = await fetch(url).then(res => res.arrayBuffer());
  const buffer = Buffer.from(response).toString('base64');
  return { inlineData: { data: buffer, mimeType } };
}

// 🧩 Bersihkan nilai nutrisi (pastikan angka bulat)
const cleanAndParseNumber = (value) => {
  if (typeof value === 'number') return Math.round(value);
  if (typeof value === 'string') {
    const match = value.match(/(\d+)/);
    return match ? parseInt(match[0], 10) : 0;
  }
  return 0;
};

// 🧩 Buat prompt untuk rekomendasi nutrisi personal
const createRecommendationPrompt = (profile, foodName, nutrition) => {
  let context = "seseorang yang peduli kesehatan";
  let specificNeeds = "";

  if (profile.type === 'pregnant') {
    context = `seorang ibu hamil`;
    specificNeeds = `
      Secara spesifik, analisis makanan ini dari sudut pandang kehamilan.
      - Apakah kandungan Asam Folat (${nutrition.folic_acid} mcg) cukup baik untuk perkembangan janin?
      - Apakah kandungan Zat Besi (${nutrition.iron} mg) membantu mencegah anemia?
      - Apakah kandungan Natrium (${nutrition.sodium} mg) perlu diwaspadai untuk menjaga tekanan darah?
    `;
  } else if (profile.type === 'child') {
    const age = profile.birthDate ? new Date().getFullYear() - new Date(profile.birthDate).getFullYear() : 'anak';
    context = `seorang anak berusia ${age} tahun`;
    specificNeeds = `
      Analisis makanan ini untuk tumbuh kembang anak.
      - Apakah kandungan Protein (${nutrition.protein} g) dan Zat Besi (${nutrition.iron} mg) baik untuk pertumbuhannya?
      - Apakah kandungan Gula (${nutrition.sugar} g) dan Garam/Natrium (${nutrition.sodium} mg) sesuai untuk anak-anak?
      - Jika makanan ini mengandung alergen yang umum seperti kacang, berikan peringatan.
    `;
  } else {
    context = `seorang dewasa`;
    specificNeeds = `Fokus pada keseimbangan gizi secara umum, terutama kandungan gula dan natrium. Berikan tips praktis.`;
  }

  return `
    Anda adalah "Brocco", ahli gizi AI. Berdasarkan data untuk makanan "${foodName}", berikan rekomendasi singkat (maksimal 3 kalimat) untuk ${context}.
    ${specificNeeds}
    Jawab dengan ramah dan mudah dimengerti.
  `;
};

// 🧩 Deteksi jika gambar bukan makanan
function isNotFood(displayName, bahan) {
  const lowerName = displayName.toLowerCase();
  const kataNonMakanan = [
    "pemandangan", "gunung", "laut", "pantai", "gedung", "langit",
    "air terjun", "bukit", "hutan", "pohon", "jalan", "mobil", "perahu", "kapal"
  ];

  const namaTidakCocok = kataNonMakanan.some(word => lowerName.includes(word));
  const bahanKosong = !bahan || bahan.length === 0;

  return namaTidakCocok || bahanKosong;
}

export async function POST(request) {
  const { imageUrl, userId, activeProfile } = await request.json(); 
  const db = admin.firestore();

  if (!imageUrl || !userId || !activeProfile) {
    return NextResponse.json({ error: 'Data tidak lengkap (imageUrl, userId, activeProfile dibutuhkan).' }, { status: 400 });
  }

  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const visionModel = genAI.getGenerativeModel({
      // bisa ubah ke "gemini-1.5-flash" jika error 404
      model: 'gemini-2.0-flash',
      generationConfig: { responseMimeType: "application/json" },
    });

    // 🧠 PROMPT untuk analisis gizi berbasis gambar
    const visionAndNutritionPrompt = `
      Analisis gambar makanan ini secara mendalam sebagai seorang ahli gizi.
      Struktur JSON harus seperti ini:
      {
        "display_name": "Nama lengkap dan deskriptif dalam Bahasa Indonesia.",
        "bahan_terdeteksi": [{"nama_bahan": "..."}],
        "total_estimasi_nutrisi": {
          "calories": 500,
          "protein": 25,
          "fat": 15,
          "carbohydrates": 40,
          "sugar": 10,
          "sodium": 500,
          "iron": 4,
          "folic_acid": 80
        }
      }
      PENTING: Semua nilai di dalam 'total_estimasi_nutrisi' HARUS berupa ANGKA INTEGER saja.
      'sodium' dalam mg, 'iron' dalam mg, 'folic_acid' dalam mcg.
    `;

    const imagePart = await urlToGenerativePart(imageUrl, 'image/jpeg');
    const visionResultRaw = await visionModel.generateContent([visionAndNutritionPrompt, imagePart]);

    // Parsing hasil Gemini Vision
    const visionResult = JSON.parse(visionResultRaw.response.text());

    // 🧩 Cek jika bukan makanan
    if (!visionResult.display_name || isNotFood(visionResult.display_name, visionResult.bahan_terdeteksi)) {
      const errorResult = {
        userId,
        profileId: activeProfile.profileId,
        timestamp: new Date().toISOString(),
        imageUrl,
        aiScanResult: {
          display_name: "Tidak ada makanan terdeteksi",
          bahan_terdeteksi: []
        },
        nutritionData: null,
        recommendation: "Gambar tidak berisi makanan yang dapat dikenali. Silakan coba lagi dengan gambar yang lebih jelas."
      };

      const docRef = await db.collection('scans').add({
        ...errorResult,
        timestamp: admin.firestore.FieldValue.serverTimestamp()
      });

      return NextResponse.json({ ...errorResult, id: docRef.id });
    }

    // --- 🧮 BERSIHKAN NILAI NUTRISI ---
    const totalNutritionEstimateRaw = visionResult.total_estimasi_nutrisi;
    const cleanNutritionData = {
      calories: cleanAndParseNumber(totalNutritionEstimateRaw.calories),
      protein: cleanAndParseNumber(totalNutritionEstimateRaw.protein),
      fat: cleanAndParseNumber(totalNutritionEstimateRaw.fat),
      carbohydrates: cleanAndParseNumber(totalNutritionEstimateRaw.carbohydrates),
      sugar: cleanAndParseNumber(totalNutritionEstimateRaw.sugar),
      sodium: cleanAndParseNumber(totalNutritionEstimateRaw.sodium),
      iron: cleanAndParseNumber(totalNutritionEstimateRaw.iron),
      folic_acid: cleanAndParseNumber(totalNutritionEstimateRaw.folic_acid),
    };

    // --- 💬 Rekomendasi AI berdasarkan profil ---
    const textModel = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
    const recommendationPrompt = createRecommendationPrompt(activeProfile, visionResult.display_name, totalNutritionEstimateRaw);
    const recommendationResultRaw = await textModel.generateContent(recommendationPrompt);
    const recommendationText = recommendationResultRaw.response.text().trim();

    // --- 🍼 Hitung usia kehamilan (jika profil hamil) ---
    let pregnancyWeek = null;
    if (activeProfile.type === 'pregnant' && activeProfile.dueDate) {
      const dueDate = typeof activeProfile.dueDate.toDate === 'function' ? activeProfile.dueDate.toDate() : new Date(activeProfile.dueDate);
      const today = new Date();
      const diffTime = dueDate.getTime() - today.getTime();
      const daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      const weekNumber = 40 - Math.floor(daysRemaining / 7);
      if (weekNumber > 0 && weekNumber <= 42) {
        pregnancyWeek = weekNumber;
      }
    }

    // --- 🧩 Simpan hasil scan ---
    const finalResult = {
      userId,
      profileId: activeProfile.profileId,
      week: pregnancyWeek,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
      imageUrl,
      aiScanResult: {
        display_name: visionResult.display_name,
        bahan_terdeteksi: visionResult.bahan_terdeteksi || [],
      },
      nutritionData: cleanNutritionData,
      recommendation: recommendationText,
    };

    const docRef = await db.collection('scans').add(finalResult);

    // --- 🏆 XP & Misi Harian ---
    let earnedXp = 10; // XP dasar
    if (cleanNutritionData.protein > cleanNutritionData.fat) {
      earnedXp += 5; // bonus “pilihan sehat”
    }

    const userRef = db.collection('users').doc(userId);
    await userRef.update({
      xp: admin.firestore.FieldValue.increment(earnedXp)
    });

    // Cek & update misi harian
    const today = new Date().toISOString().split('T')[0];
    const missionRef = userRef.collection('dailyMissions').doc(today);
    const missionDoc = await missionRef.get();
    const missionData = missionDoc.exists ? missionDoc.data() : {};

    // Ambil semua scan hari ini
    const scansSnapshot = await db.collection('scans')
      .where('userId', '==', userId)
      .where('timestamp', '>=', new Date(today))
      .get();

    const dailyTotals = scansSnapshot.docs.reduce((acc, doc) => {
      const data = doc.data().nutritionData;
      acc.protein += data?.protein || 0;
      acc.iron += data?.iron || 0;
      return acc;
    }, { protein: 0, iron: 0 });

    // Target sederhana (bisa dikembangkan)
    const proteinTarget = 75;
    const ironTarget = 18;

    let missionXp = 0;
    const updates = {};

    if (!missionData.proteinAchieved && dailyTotals.protein >= proteinTarget) {
      missionXp += 15;
      updates.proteinAchieved = true;
    }

    if (!missionData.ironAchieved && dailyTotals.iron >= ironTarget) {
      missionXp += 15;
      updates.ironAchieved = true;
    }

    if (missionXp > 0) {
      await userRef.update({ xp: admin.firestore.FieldValue.increment(missionXp) });
      await missionRef.set(updates, { merge: true });
    }

    // ✅ Kembalikan hasil akhir
    return NextResponse.json({
      ...finalResult,
      id: docRef.id,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error in API route:', error);
    return NextResponse.json({ error: 'Terjadi kesalahan saat menganalisis gambar.' }, { status: 500 });
  }
}
