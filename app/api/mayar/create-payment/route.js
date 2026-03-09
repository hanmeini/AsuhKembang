import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { amount, productName, customerEmail, customerName, userId } =
      await request.json();

    if (!process.env.MAYAR_API_KEY) {
      return NextResponse.json(
        { error: "MAYAR_API_KEY belum diatur di server." },
        { status: 500 },
      );
    }

    // Tentukan endpoint berdasarkan kunci API
    // Jika kunci mengandung 'sandbox' atau jika kita ingin mendukung portal .club
    let endpoint = "https://api.mayar.id/hl/v1/payment/create";
    const apiKey = process.env.MAYAR_API_KEY.trim();

    // Deteksi token malformed (terpotong)
    if (apiKey.includes("..")) {
      return NextResponse.json(
        {
          error:
            "Token Mayar Bunda sepertinya terpotong atau tidak lengkap (terdapat karakter ..). Silakan salin ulang kuncinya dengan teliti.",
        },
        { status: 400 },
      );
    }

    // Jika menggunakan portal sandbox (web.mayar.club), gunakan endpoint sandbox
    // Catatan: Biasanya kunci sandbox diawali sk_sandbox_, tapi jika user pakai JWT,
    // kita beri pilihan atau coba deteksi.
    if (apiKey.length > 100 && !apiKey.includes("sk_live")) {
      // Asumsi: Jika token panjang (JWT) dan kita sedang testing di sandbox, gunakan endpoint club
      // Bunda bisa menyesuaikan ini jika sudah pindah ke production .id
      endpoint = "https://api.mayar.club/hl/v1/payment/create";
    }

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: customerName || "Bunda AsuhKembang",
        email: customerEmail || "bunda@example.com",
        amount: amount || 25000,
        description: `Langganan ${productName || "AsuhKembang Plus"} - ${userId || ""}`,
        mobile: "08123456789", // Kembali ke nomor sampel karena Mayar membatasi length 15
        redirect_url: `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/upgrade/success`,
      }),
    });

    const responseText = await response.text();
    let data;

    try {
      data = JSON.parse(responseText);
    } catch (parseError) {
      console.error("Gagal parse JSON dari Mayar. Raw response:", responseText);
      return NextResponse.json(
        {
          error: `Respon tidak valid dari Mayar: ${responseText.substring(0, 100)}...`,
        },
        { status: response.status },
      );
    }

    if (!response.ok) {
      console.error("Mayar API Error Detail:", data);
      return NextResponse.json(
        {
          error:
            data.message ||
            data.error ||
            "Gagal membuat link pembayaran Mayar.",
        },
        { status: response.status },
      );
    }

    return NextResponse.json({
      paymentUrl: data.data?.link || data.link || data.payment_url,
    });
  } catch (error) {
    console.error("Error in Mayar Route:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan sistem saat menghubungi Mayar." },
      { status: 500 },
    );
  }
}
