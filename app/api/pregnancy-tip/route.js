import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// 🔹 Data fallback lokal (dummy untuk tiap minggu)
const pregnancyData = {
  1: {
    perkembangan_janin: "Janin masih berupa sel kecil yang baru mulai berkembang, sering disebut sebagai zigot.",
    gejala_umum_ibu: "Ibu mungkin belum merasakan gejala yang jelas, tapi bisa ada sedikit kram atau flek."
  },
  12: {
    perkembangan_janin: "Janin seukuran plum, organ vital sudah terbentuk dan mulai berfungsi.",
    gejala_umum_ibu: "Mual berkurang, energi mulai kembali, tetapi mood swing masih mungkin terjadi."
  },
  20: {
    perkembangan_janin: "Janin seukuran pisang, sudah bisa menendang dan bergerak lebih aktif.",
    gejala_umum_ibu: "Ibu mulai merasakan gerakan janin, perut makin terlihat membesar."
  },
  32: {
    perkembangan_janin: "Janin seukuran labu kecil, berat badan bertambah cepat untuk persiapan lahir.",
    gejala_umum_ibu: "Sering buang air kecil, susah tidur, dan rasa tidak nyaman di punggung."
  },
  40: {
    perkembangan_janin: "Janin siap lahir, ukuran penuh seperti semangka kecil.",
    gejala_umum_ibu: "Kontraksi palsu mungkin terjadi, tubuh bersiap untuk persalinan."
  }
};

export async function POST(request) {
  const { week } = await request.json();

  if (!week || week < 1 || week > 42) {
    return NextResponse.json({ error: 'Minggu kehamilan tidak valid.' }, { status: 400 });
  }

  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash-latest',
      generationConfig: {
        responseMimeType: "application/json",
      },
    });

    const prompt = `
      Anda adalah "Brocco", asisten kehamilan yang ramah. 
      Berikan informasi umum dalam Bahasa Indonesia untuk kehamilan minggu ke-${week}.
      Format jawaban harus JSON seperti ini:
      {
        "perkembangan_janin": "Deskripsi singkat dan menarik tentang perkembangan janin di minggu ini, termasuk perbandingan ukuran dengan buah atau sayur.",
        "gejala_umum_ibu": "Deskripsi singkat tentang 2-3 gejala umum yang mungkin dialami ibu pada minggu ini."
      }
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;

    let raw = response.text();

    try {
      const data = JSON.parse(raw);
      return NextResponse.json(data);
    } catch (e) {
      console.error("Parsing gagal:", raw);

      // 🔹 fallback kalau AI balasnya rusak
      const fallback = pregnancyData[week] || {
        perkembangan_janin: `Informasi janin minggu ke-${week} belum tersedia dalam fallback.`,
        gejala_umum_ibu: "Silakan coba lagi nanti."
      };

      return NextResponse.json({ ...fallback, source: "fallback-local" });
    }

  } catch (error) {
    console.error('Error di API Info Kehamilan:', error);

    // 🔹 fallback kalau quota habis atau error koneksi
    const fallback = pregnancyData[week] || {
      perkembangan_janin: `Informasi janin minggu ke-${week} belum tersedia dalam fallback.`,
      gejala_umum_ibu: "Silakan coba lagi nanti."
    };

    return NextResponse.json({ ...fallback, source: "fallback-local" });
  }
}
