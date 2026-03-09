import { NextResponse } from "next/server";
import admin from "../../../../lib/firebaseAdmin";

export async function POST(request) {
  try {
    const body = await request.json();

    // Verifikasi status pembayaran dari Mayar
    // Struktur body Mayar biasanya: { event: 'payment.success', data: { status: 'success', mobile: 'USER_ID_DISINI', ... } }
    const event = body.event;
    const paymentStatus = body.data?.status;

    // Ekstrak userId dari description (Format: "Langganan ... - UID")
    const description = body.data?.description || "";
    const parts = description.split(" - ");
    const userId = parts.length > 1 ? parts.pop().trim() : null;

    if (event === "payment.success" || paymentStatus === "success") {
      if (!userId || userId === "08123456789") {
        console.warn(
          "Webhook success tapi userId tidak valid/default:",
          userId,
        );
        return NextResponse.json(
          { message: "No valid user ID found" },
          { status: 200 },
        );
      }

      const db = admin.firestore();

      // Update status premium di Firestore
      // Asumsi: Kita simpan status di collection 'users' atau 'profiles'
      const userRef = db.collection("users").doc(userId);

      await userRef.set(
        {
          isPremium: true,
          premiumUpdatedAt: admin.firestore.FieldValue.serverTimestamp(),
          subscriptionStatus: "active",
        },
        { merge: true },
      );

      return NextResponse.json({ message: "Webhook processed, user upgraded" });
    }

    return NextResponse.json({ message: "Event ignored" });
  } catch (error) {
    console.error("Webhook Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
