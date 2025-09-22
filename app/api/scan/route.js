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

// Fungsi BARU untuk membuat prompt rekomendasi yang dinamis
const createRecommendationPrompt = (profile, foodName, nutrition) => {
  let context = "seseorang yang peduli kesehatan";
  let specificNeeds = "";

  // Menyesuaikan konteks dan kebutuhan berdasarkan tipe profil
  if (profile.type === 'pregnant') {
    context = `seorang ibu hamil`;
    specificNeeds = "Fokus pada nutrisi penting untuk kehamilan seperti Asam Folat, Zat Besi, dan Kalsium. Beri peringatan jika ada bahan yang berisiko (contoh: keju yang tidak dipasteurisasi).";
  } else if (profile.type === 'child') {
    const age = new Date().getFullYear() - new Date(profile.birthDate).getFullYear();
    context = `seorang anak berusia ${age} tahun`;
    specificNeeds = `Fokus pada nutrisi untuk tumbuh kembang seperti Kalsium dan Protein. Jika makanan ini mengandung alergen umum seperti kacang atau susu, berikan peringatan.`;
  } else if (profile.type === 'general') { 
    context = `seorang dewasa`;
    specificNeeds = `Fokus pada keseimbangan gizi secara umum. Berikan tips praktis terkait porsi atau cara memasak yang lebih sehat.`;
  }

  return `
    Anda adalah "Brocco", ahli gizi AI yang ramah. Berdasarkan estimasi nutrisi untuk makanan bernama "${foodName}" berikut:
    - Kalori: ${nutrition.calories} kcal
    - Protein: ${nutrition.protein} g
    - Lemak: ${nutrition.fat} g
    - Karbohidrat: ${nutrition.carbohydrates} g
    
    Berikan analisis dan rekomendasi singkat (maksimal 3 kalimat) untuk ${context}.
    ${specificNeeds}
    Gunakan bahasa yang mudah dimengerti.
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
      model: 'gemini-1.5-flash-latest',
      generationConfig: { responseMimeType: "application/json" },
    });

    const visionAndNutritionPrompt = `
      Analisis gambar makanan ini...
      Struktur JSON harus seperti ini:
      {
        "display_name": "Nama lengkap...",
        "bahan_terdeteksi": [{"nama_bahan": "..."}],
        "total_estimasi_nutrisi": { "calories": 500, "protein": 25, "fat": 15, "carbohydrates": 40 }
      }
      PENTING: Semua nilai di 'total_estimasi_nutrisi' HARUS berupa ANGKA INTEGER.
    `;

    const imagePart = await urlToGenerativePart(imageUrl, 'image/jpeg');
    const visionResultRaw = await visionModel.generateContent([visionAndNutritionPrompt, imagePart]);
    const visionResult = JSON.parse(visionResultRaw.response.text());
    const totalNutritionEstimateRaw = visionResult.total_estimasi_nutrisi;

    // Membuat Rekomendasi berdasarkan Profil
    const textModel = genAI.getGenerativeModel({ model: 'gemini-1.5-flash-latest' });
    
    const recommendationPrompt = createRecommendationPrompt(
      activeProfile,
      visionResult.display_name,
      totalNutritionEstimateRaw
    );

    const recommendationResultRaw = await textModel.generateContent(recommendationPrompt);
    const recommendationText = recommendationResultRaw.response.text();

    //  Membersihkan dan Menyimpan Data
    const cleanNutritionData = {
        calories: cleanAndParseNumber(totalNutritionEstimateRaw.calories),
        protein: cleanAndParseNumber(totalNutritionEstimateRaw.protein),
        fat: cleanAndParseNumber(totalNutritionEstimateRaw.fat),
        carbohydrates: cleanAndParseNumber(totalNutritionEstimateRaw.carbohydrates),
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
      userId: userId, 
      profileId: activeProfile.profileId,
      week: pregnancyWeek,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
      imageUrl: imageUrl,
      aiScanResult: {
          display_name: visionResult.display_name,
          bahan_terdeteksi: visionResult.bahan_terdeteksi || [],
      },
      nutritionData: cleanNutritionData,
      recommendation: recommendationText.trim(),
    };
    
    const docRef = await db.collection('scans').add(finalResult);
    
    return NextResponse.json({ ...finalResult, id: docRef.id });

  } catch (error) {
    console.error('Error in API route:', error);
    return NextResponse.json({ error: 'Terjadi kesalahan saat menganalisis gambar.' }, { status: 500 });
  }
}

