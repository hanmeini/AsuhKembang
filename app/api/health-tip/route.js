import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { admin, db } from "../../../lib/firebaseAdmin";

const fallbackTips = [
  "Minum air putih minimal 8 gelas sehari.",
  "Jangan lupa olahraga ringan 15 menit setiap hari.",
  "Konsumsi buah dan sayur segar untuk menjaga imun.",
  "Kurangi konsumsi gula berlebih untuk kesehatan jantung.",
  "Tidur cukup 7-8 jam agar tubuh segar kembali.",
];

export async function POST(request) {
  const { userId } = await request.json();
  const db = admin.firestore();

  if (!userId) {
    return NextResponse.json({ error: "User ID is required" }, { status: 400 });
  }

  try {
    const userDoc = await db.collection("users").doc(userId).get();
    const userData = userDoc.data();

    let context = "seseorang yang peduli kesehatan";
    if (userData?.pregnancyInfo?.currentTrimester) {
      context = `seorang ibu hamil di trimester ke-${userData.pregnancyInfo.currentTrimester}`;
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });

    const prompt = `
      Anda adalah "Brocco", asisten kesehatan yang ramah dari aplikasi Healthier.
      Berikan satu tips kesehatan yang singkat, praktis, dan positif (maksimal 2 kalimat) untuk ${context}.
      Fokus pada topik gizi, hidrasi, atau kesehatan mental ringan.
      Contoh: "Jangan lupa minum segelas air putih saat bangun tidur untuk memulai metabolisme tubuh Anda dengan baik!"
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const tip = response.text();
    return NextResponse.json({ tip: tip.trim() });
  } catch (err) {
    console.error("Error fetch AI, fallback dipakai:", err.message);
    const randomTip =
      fallbackTips[Math.floor(Math.random() * fallbackTips.length)];
    return NextResponse.json({ tip: randomTip });
  }
}
