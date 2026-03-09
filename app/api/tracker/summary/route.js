import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(request) {
  const { week, totals, targets, profileType } = await request.json();

  if (!totals || !targets) {
    return NextResponse.json({ error: "Data tidak lengkap." }, { status: 400 });
  }

  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });

    const context =
      profileType === "pregnant" ? "seorang ibu hamil" : "seseorang";

    const prompt = `
      Anda adalah "Brocco", seorang ahli gizi AI yang suportif.
      Seorang ${context} di minggu ke-${week} kehamilan memiliki ringkasan gizi mingguan sebagai berikut:
      - Total Kalori: ${totals.calories} kkal (Target: ${targets.calories} kkal)
      - Total Protein: ${totals.protein} g (Target: ${targets.protein} g)

      Berdasarkan data ini, berikan satu kesimpulan singkat yang positif dan satu saran praktis yang bisa ditindaklanjuti untuk minggu depan. Buatlah terdengar ramah dan memotivasi.
      Format jawaban harus JSON seperti ini:
      {
        "summary": "Teks kesimpulan dan saran dari AI di sini."
      }
    `;

    const result = await model.generateContent(prompt, {
      responseMimeType: "application/json",
    });
    const response = await result.response;

    if (!response) {
      throw new Error("Gagal mendapatkan respons dari AI.");
    }

    const data = JSON.parse(response.text());
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error di API Rangkuman Jurnal:", error);
    return NextResponse.json(
      { error: "Gagal membuat rangkuman." },
      { status: 500 },
    );
  }
}
