import { NextResponse } from 'next/server';
import admin from '../../../lib/firebaseAdmin';
import { ethers } from 'ethers';

// --- KONFIGURASI BLOCKCHAIN ---
const SEPOLIA_RPC_URL = process.env.SEPOLIA_RPC_URL;
const SERVER_PRIVATE_KEY = process.env.SERVER_PRIVATE_KEY;
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;

const contractABI = [
  "function recordJournalHash(bytes32 journalHash)"
];

export async function POST(request) {
  const { userId, profileId, journalId } = await request.json(); 
  const db = admin.firestore();

  if (!userId || !profileId || !journalId) {
    return NextResponse.json({ error: 'Data tidak lengkap.' }, { status: 400 });
  }

  try {
    // 1. Ambil data jurnal dari Firestore
    const journalRef = db.collection('users').doc(userId).collection('profiles').doc(profileId).collection('journals').doc(journalId);
    const journalDoc = await journalRef.get();
    if (!journalDoc.exists) {
      return NextResponse.json({ error: 'Jurnal tidak ditemukan.' }, { status: 404 });
    }
    const journalData = journalDoc.data();

    // 2. Buat "Sidik Jari Digital" (Hash)
    const dataString = JSON.stringify(journalData);
    
    // PERBAIKAN: Menggunakan sintaks ethers v6
    const journalHash = ethers.keccak256(ethers.toUtf8Bytes(dataString));

    // 3. Hubungkan ke Blockchain
    const provider = new ethers.JsonRpcProvider(SEPOLIA_RPC_URL);
    const signer = new ethers.Wallet(SERVER_PRIVATE_KEY, provider);
    const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, signer);

    // 4. Kirim Transaksi untuk Mencatat Hash
    console.log("Mengirim transaksi ke smart contract...");
    const tx = await contract.recordJournalHash(journalHash);
    
    // 5. Tunggu Konfirmasi & Dapatkan "Nomor Resi"
    await tx.wait();
    const transactionHash = tx.hash;
    console.log("Transaksi berhasil dengan hash:", transactionHash);

    // 6. Simpan Bukti ke Firestore
    await journalRef.update({
      isVerified: true,
      verificationHash: journalHash,
      transactionHash: transactionHash
    });

    return NextResponse.json({ success: true, transactionHash });

  } catch (error) {
    console.error('Error saat verifikasi jurnal:', error);
    return NextResponse.json({ error: 'Gagal memverifikasi jurnal di blockchain.' }, { status: 500 });
  }
}

