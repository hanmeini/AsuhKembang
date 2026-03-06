import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { amount, productName, customerEmail, customerName } =
      await request.json();

    if (!process.env.MAYAR_API_KEY) {
      return NextResponse.json(
        { error: "MAYAR_API_KEY belum diatur di server." },
        { status: 500 },
      );
    }

    // Panggil API Mayar.id untuk membuat payment link
    // URL Headless Mayar menggunakan prefix /hl/v1
    const endpoint = "https://api.mayar.id/hl/v1/payment/create";

    console.log("Menghubungi Mayar di:", endpoint);

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.MAYAR_API_KEY.trim()}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: customerName || "Bunda AsuhKembang",
        email: customerEmail || "bunda@example.com",
        amount: amount || 25000,
        description: `Langganan ${productName || "AsuhKembang Plus"}`,
        mobile: "08123456789",
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
