import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import admin from "../../../lib/firebaseAdmin";

const createChatPrompt = (message, context) => {
  let contextInfo = "Konteks saat ini adalah umum.";

  if (context.type === "scan_result") {
    const food = context.data.aiScanResult.display_name;
    const calories = context.data.nutritionData.calories;
    contextInfo = `Pengguna sedang melihat hasil scan makanan untuk "${food}" dengan estimasi ${calories} kkal.`;
  } else if (context.type === "journal_entry") {
    const week = context.data.week;
    contextInfo = `Pengguna sedang melihat entri jurnal kehamilan untuk minggu ke-${week}.`;
  }

  return `
      Anda adalah "Brocco", asisten kesehatan AI yang ramah, empatik, dan suportif khusus untuk ibu hamil dan anak.
      ${contextInfo}
      
      TUGAS: Jawab pertanyaan pengguna dengan bahasa Indonesia yang hangat, singkat, dan padat.
      PENTING: Hanya jawab pertanyaan yang berkaitan dengan kesehatan, gizi, kehamilan, dan tumbuh kembang anak. Jika pertanyaan di luar tema tersebut, jawablah dengan sopan bahwa Anda hanya bisa membantu seputar kesehatan Bunda dan si Kecil. Jangan memberikan diagnosis medis.
      
      Pertanyaan Pengguna: "${message}"
    `;
};

export async function POST(request) {
  let { message, context, history, chatId, userProfile } = await request.json();
  const db = admin.firestore();
  const userId = userProfile?.uid;

  if (!message || !userId) {
    return NextResponse.json(
      { error: "Data tidak lengkap (pesan dan user ID dibutuhkan)." },
      { status: 400 },
    );
  }

  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
    });

    const chatHistoryForAI = history.map((msg) => ({
      role: msg.sender === "user" ? "user" : "model",
      parts: [{ text: msg.text }],
    }));

    const fullPrompt = createChatPrompt(message, context);

    const chat = model.startChat({ history: chatHistoryForAI });
    const result = await chat.sendMessage(fullPrompt);
    const reply = result.response.text();

    const userMessageData = {
      sender: "user",
      text: message,
      timestamp: new Date(),
    };
    const aiMessageData = {
      sender: "ai",
      text: reply.trim(),
      timestamp: new Date(),
    };
    const allNewMessages = [userMessageData, aiMessageData];

    let chatDocRef;
    if (chatId) {
      chatDocRef = db.collection("chats").doc(chatId);
      await chatDocRef.update({
        messages: admin.firestore.FieldValue.arrayUnion(...allNewMessages),
        lastMessageTimestamp: admin.firestore.FieldValue.serverTimestamp(),
      });
    } else {
      const title =
        context.type === "scan_result"
          ? `Percakapan tentang ${context.data.aiScanResult.display_name}`
          : context.type === "journal_entry"
            ? `Diskusi Jurnal Minggu ke-${context.data.week}`
            : `Percakapan Umum`;

      const profileIdToSave =
        context.profileId || userProfile.activeProfileId || userId;

      const initialMessages = history.map((msg) => ({
        ...msg,
        timestamp: new Date(),
      }));

      chatDocRef = await db.collection("chats").add({
        userId,
        profileId: profileIdToSave,
        title,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        lastMessageTimestamp: admin.firestore.FieldValue.serverTimestamp(),
        messages: initialMessages.concat(allNewMessages),
      });
      chatId = chatDocRef.id;
    }

    return NextResponse.json({ reply: reply.trim(), chatId });
  } catch (error) {
    console.error("Error di API Chat:", error);

    const errorFallback =
      "Wah, Brocco sedang sangat sibuk melayani banyak Bunda hari ini! 😊 Silakan coba lagi sebentar lagi ya Bunda, atau tingkatkan ke Plus untuk akses tanpa hambatan.";
    return NextResponse.json({
      reply: errorFallback,
      chatId: chatId || null,
    });
  }
}
