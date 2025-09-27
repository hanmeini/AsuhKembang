import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Fungsi untuk menyederhanakan data pertumbuhan menjadi teks
const formatGrowthDataForAI = (entries) => {
  if (!entries || entries.length === 0) return "Belum ada data pertumbuhan.";
  return entries.map(entry => 
    `- Pada tanggal ${entry.date}: Berat ${entry.weight} kg, Tinggi ${entry.height} cm`
  ).join('\n');
};

export async function POST(request) {
  const { growthEntries, childProfile } = await request.json();

  if (!growthEntries || !childProfile) {
    return NextResponse.json({ error: 'Data tidak lengkap.' }, { status: 400 });
  }

  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    
    // PERBAIKAN: Gunakan generationConfig di sini untuk hasil yang lebih andal
    const model = genAI.getGenerativeModel({ 
        model: 'gemini-2.0-flash',
        generationConfig: {
            responseMimeType: "application/json",
        },
    });
    
    const formattedData = formatGrowthDataForAI(growthEntries);

    const prompt = `
      Anda adalah "Brocco", seorang asisten kesehatan anak yang ramah dan suportif.
      Seorang pengguna sedang memantau pertumbuhan anaknya, ${childProfile.name}.
      Berikut adalah data pertumbuhan terakhirnya:
      ${formattedData}

      Berdasarkan data ini, berikan sebuah "Kesimpulan Pertumbuhan" singkat (2-3 kalimat) dalam Bahasa Indonesia.
      Fokus pada tren positif. Jika ada data, sebutkan data terakhir.
      PENTING: Jangan pernah memberikan diagnosis medis atau mengatakan pertumbuhannya "tidak normal". Selalu akhiri dengan saran untuk berkonsultasi dengan dokter atau posyandu.
      
      Contoh Jawaban: "Luar biasa! Pertumbuhan ${childProfile.name} terus menunjukkan tren positif. Pada catatan terakhir, beratnya mencapai ${growthEntries[growthEntries.length - 1].weight} kg. Terus pantau dan catat pertumbuhannya setiap bulan ya, Bun. Untuk evaluasi lebih lanjut, jangan lupa diskusikan grafik ini dengan dokter di posyandu."

      Format jawaban harus JSON seperti ini:
      {
        "summary": "Teks kesimpulan dan saran dari AI di sini."
      }
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    if (!response) throw new Error("Gagal mendapatkan respons dari AI.");

    // PERBAIKAN: Membersihkan respons sebelum parsing (sebagai lapisan pengaman tambahan)
    const rawText = response.text();
    const cleanedText = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
    const data = JSON.parse(cleanedText);
    
    return NextResponse.json(data);

  } catch (error) {
    console.error('Error di API Analisis Pertumbuhan:', error);
    return NextResponse.json({ error: 'Gagal membuat kesimpulan.' }, { status: 500 });
  }
}

