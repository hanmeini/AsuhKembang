import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { admin, db } from "../../../lib/firebaseAdmin";

// 🧩 Fungsi bantu: ubah URL gambar jadi format base64 untuk dikirim ke Gemini
async function urlToGenerativePart(url, mimeType) {
  const response = await fetch(url).then((res) => res.arrayBuffer());
  const buffer = Buffer.from(response).toString("base64");
  return { inlineData: { data: buffer, mimeType } };
}

// 🧩 Bersihkan nilai nutrisi (pastikan angka bulat)
const cleanAndParseNumber = (value) => {
  if (typeof value === "number") return Math.round(value);
  if (typeof value === "string") {
    const match = value.match(/(\d+)/);
    return match ? parseInt(match[0], 10) : 0;
  }
  return 0;
};

// 🧩 Buat context profil untuk prompt
const getProfileContext = (profile) => {
  if (profile.type === "pregnant") return "seorang ibu hamil";
  if (profile.type === "child") {
    const age = profile.birthDate
      ? new Date().getFullYear() - new Date(profile.birthDate).getFullYear()
      : "anak";
    return `seorang anak berusia ${age} tahun`;
  }
  return "seorang dewasa";
};

// 🧩 Deteksi jika gambar bukan makanan
function isNotFood(displayName, bahan) {
  const lowerName = displayName.toLowerCase();
  const kataNonMakanan = [
    "pemandangan",
    "gunung",
    "laut",
    "pantai",
    "gedung",
    "langit",
    "air terjun",
    "bukit",
    "hutan",
    "pohon",
    "jalan",
    "mobil",
    "perahu",
    "kapal",
  ];

  const namaTidakCocok = kataNonMakanan.some((word) =>
    lowerName.includes(word),
  );
  const bahanKosong = !bahan || bahan.length === 0;

  return namaTidakCocok || bahanKosong;
}

export async function POST(request) {
  const { imageUrl, userId, activeProfile } = await request.json();

  if (!imageUrl || !userId || !activeProfile) {
    return NextResponse.json(
      {
        error:
          "Data tidak lengkap (imageUrl, userId, activeProfile dibutuhkan).",
      },
      { status: 400 },
    );
  }

  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      generationConfig: {
        responseMimeType: "application/json",
      },
    });

    // 🧠 PROMPT gabungan (Analisis Gizi + Rekomendasi sekaligus)
    const context = getProfileContext(activeProfile);
    const combinedPrompt = `
      Anda adalah "Brocco", ahli gizi AI. Analisis gambar makanan ini secara mendalam.
      Berikan hasil dalam format JSON berikut:
      {
        "display_name": "Nama lengkap dan deskriptif dalam Bahasa Indonesia.",
        "bahan_terdeteksi": [{"nama_bahan": "..."}],
        "total_estimasi_nutrisi": {
          "calories": 0,
          "protein": 0,
          "fat": 0,
          "carbohydrates": 0,
          "sugar": 0,
          "sodium": 0,
          "iron": 0,
          "folic_acid": 0
        },
        "recommendation": "Gunakan format JSON string di sini dengan schema: { 'intro': '...', 'segments': [{'title': '...', 'content': '...'}], 'outro': '...' }. Berikan saran gizi yang ramah sebagai Brocco terkait makanan ini."
      }
      PENTING: Semua nilai di dalam 'total_estimasi_nutrisi' HARUS berupa ANGKA INTEGER saja.
      'sodium' dalam mg, 'iron' dalam mg, 'folic_acid' dalam mcg.
    `;

    const imagePart = await urlToGenerativePart(imageUrl, "image/jpeg");
    const visionResultRaw = await model.generateContent([
      combinedPrompt,
      imagePart,
    ]);

    // Parsing hasil Gemini Vision
    const visionResult = JSON.parse(visionResultRaw.response.text());

    // 🧩 Cek jika bukan makanan
    if (
      !visionResult.display_name ||
      isNotFood(visionResult.display_name, visionResult.bahan_terdeteksi)
    ) {
      const errorResult = {
        userId,
        profileId: activeProfile.profileId,
        timestamp: new Date().toISOString(),
        imageUrl,
        aiScanResult: {
          display_name: "Tidak ada makanan terdeteksi",
          bahan_terdeteksi: [],
        },
        nutritionData: null,
        recommendation:
          "Gambar tidak berisi makanan yang dapat dikenali. Silakan coba lagi dengan gambar yang lebih jelas.",
      };

      const docRef = await db.collection("scans").add({
        ...errorResult,
        timestamp: admin.firestore.FieldValue.serverTimestamp(),
      });

      return NextResponse.json({ ...errorResult, id: docRef.id });
    }

    // --- 🧮 BERSIHKAN NILAI NUTRISI ---
    const totalNutritionEstimateRaw = visionResult.total_estimasi_nutrisi;
    const cleanNutritionData = {
      calories: cleanAndParseNumber(totalNutritionEstimateRaw.calories),
      protein: cleanAndParseNumber(totalNutritionEstimateRaw.protein),
      fat: cleanAndParseNumber(totalNutritionEstimateRaw.fat),
      carbohydrates: cleanAndParseNumber(
        totalNutritionEstimateRaw.carbohydrates,
      ),
      sugar: cleanAndParseNumber(totalNutritionEstimateRaw.sugar),
      sodium: cleanAndParseNumber(totalNutritionEstimateRaw.sodium),
      iron: cleanAndParseNumber(totalNutritionEstimateRaw.iron),
      folic_acid: cleanAndParseNumber(totalNutritionEstimateRaw.folic_acid),
    };

    // --- 💬 Rekomendasi AI diambil dari hasil Vision ---
    const recommendationText =
      visionResult.recommendation ||
      "Maaf, Brocco tidak bisa memberikan rekomendasi saat ini.";

    // --- 🍼 Hitung usia kehamilan (jika profil hamil) ---
    let pregnancyWeek = null;
    if (activeProfile.type === "pregnant" && activeProfile.dueDate) {
      const dueDate =
        typeof activeProfile.dueDate.toDate === "function"
          ? activeProfile.dueDate.toDate()
          : new Date(activeProfile.dueDate);
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

    const docRef = await db.collection("scans").add(finalResult);

    // --- 🏆 XP & Misi Harian ---
    let earnedXp = 10; // XP dasar
    if (cleanNutritionData.protein > cleanNutritionData.fat) {
      earnedXp += 5; // bonus “pilihan sehat”
    }

    const userRef = db.collection("users").doc(userId);
    await userRef.update({
      xp: admin.firestore.FieldValue.increment(earnedXp),
    });

    // Cek & update misi harian
    const today = new Date().toISOString().split("T")[0];
    const missionRef = userRef.collection("dailyMissions").doc(today);
    const missionDoc = await missionRef.get();
    const missionData = missionDoc.exists ? missionDoc.data() : {};

    // Ambil semua scan hari ini
    const scansSnapshot = await db
      .collection("scans")
      .where("userId", "==", userId)
      .where("timestamp", ">=", new Date(today))
      .get();

    const dailyTotals = scansSnapshot.docs.reduce(
      (acc, doc) => {
        const data = doc.data().nutritionData;
        acc.protein += data?.protein || 0;
        acc.iron += data?.iron || 0;
        return acc;
      },
      { protein: 0, iron: 0 },
    );

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
      await userRef.update({
        xp: admin.firestore.FieldValue.increment(missionXp),
      });
      await missionRef.set(updates, { merge: true });
    }

    // ✅ Kembalikan hasil akhir
    return NextResponse.json({
      ...finalResult,
      id: docRef.id,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error di API Scan:", error);

    // Fallback Global: Semua error diarahkan ke Upgrade
    const fallbackRecommendation = {
      intro:
        "Mohon maaf Bunda, Brocco sedang sangat sibuk menganalisis ribuan makanan hari ini! 😊",
      segments: [
        {
          title: "Analisis Tertunda",
          content:
            "Fitur analisis gizi mendalam sedang mengalami antrean panjang.",
        },
      ],
      outro: "Dapatkan hasil instan dan tanpa antre dengan AsuhKembang Plus!",
      quotaExceeded: true,
    };

    return NextResponse.json({
      aiScanResult: {
        display_name: "Makanan Terdeteksi",
        bahan_terdeteksi: [],
      },
      nutritionData: {
        calories: 0,
        protein: 0,
        carbohydrates: 0,
        fat: 0,
        iron: 0,
        folic_acid: 0,
        sugar: 0,
        sodium: 0,
      },
      recommendation: JSON.stringify(fallbackRecommendation),
      imageUrl: typeof imageUrl !== "undefined" ? imageUrl : "",
    });
  }
}
