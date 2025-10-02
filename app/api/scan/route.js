import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import admin from '../../../lib/firebaseAdmin';

// Fungsi helper untuk mengubah URL gambar
async function urlToGenerativePart(url, mimeType) {
  const response = await fetch(url).then(res => res.arrayBuffer());
  const buffer = Buffer.from(response).toString('base64');
  return { inlineData: { data: buffer, mimeType } };
}

// Fungsi helper untuk membersihkan data menjadi angka
const cleanAndParseNumber = (value) => {
  if (typeof value === 'number') return Math.round(value);
  if (typeof value === 'string') {
    const match = value.match(/(\d+)/);
    return match ? parseInt(match[0], 10) : 0;
  }
  return 0;
};

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
  } else if (profile.type === 'general') {
    context = `seorang dewasa`;
    specificNeeds = `Fokus pada keseimbangan gizi secara umum, terutama kandungan gula dan natrium. Berikan tips praktis.`;
  }

  return `
    Anda adalah "Brocco", ahli gizi AI. Berdasarkan data untuk makanan "${foodName}", berikan rekomendasi singkat (maksimal 3 kalimat) untuk ${context}.
    ${specificNeeds}
    Jawab dengan ramah dan mudah dimengerti.
  `;
};


export async function POST(request) {
  const { imageUrl, userId, activeProfile } = await request.json(); 
  const db = admin.firestore();

  if (!imageUrl || !userId || !activeProfile) {
    return NextResponse.json({ error: 'Data tidak lengkap (imageUrl, userId, activeProfile dibutuhkan).' }, { status: 400 });
  }

  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    
    const visionModel = genAI.getGenerativeModel({
      model: 'gemini-2.0-flash',
      generationConfig: { responseMimeType: "application/json" },
    });

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
      PENTING: Semua nilai di dalam 'total_estimasi_nutrisi' HARUS berupa ANGKA INTEGER saja. 'sodium' dalam mg, 'iron' dalam mg, 'folic_acid' dalam mcg.
    `;

    const imagePart = await urlToGenerativePart(imageUrl, 'image/jpeg');
    const visionResultRaw = await visionModel.generateContent([visionAndNutritionPrompt, imagePart]);
    const visionResult = JSON.parse(visionResultRaw.response.text());
    const totalNutritionEstimateRaw = visionResult.total_estimasi_nutrisi;

    // Membuat Rekomendasi berdasarkan Profil
    const textModel = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
    const recommendationPrompt = createRecommendationPrompt(activeProfile, visionResult.display_name, totalNutritionEstimateRaw);
    const recommendationResultRaw = await textModel.generateContent(recommendationPrompt);
    const recommendationText = recommendationResultRaw.response.text();

    // Membersihkan dan Menyimpan Data
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
      recommendation: recommendationText.trim(),
    };
    
    const docRef = await db.collection('scans').add(finalResult);
    
    const resultForFrontend = { ...finalResult, id: docRef.id, timestamp: new Date().toISOString() };
    return NextResponse.json(resultForFrontend);

  } catch (error) {
    console.error('Error in API route:', error);
    return NextResponse.json({ error: 'Terjadi kesalahan saat menganalisis gambar.' }, { status: 500 });
  }
}

