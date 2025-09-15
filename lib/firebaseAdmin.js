// File: lib/firebaseAdmin.js

import admin from 'firebase-admin';

// Ambil kredensial dari environment variables
const serviceAccount = {
  projectId: process.env.FIREBASE_PROJECT_ID,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  // Ganti escape sequence '\n' menjadi newline yang sebenarnya
  privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
};

// Cek agar tidak menginisialisasi aplikasi berulang kali (penting untuk Next.js)
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

// Ekspor objek admin yang sudah diinisialisasi untuk digunakan di tempat lain
export default admin;