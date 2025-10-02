import { NextResponse } from 'next/server';
import admin from '../../../../lib/firebaseAdmin';

/**
 * Endpoint DELETE untuk menghapus postingan.
 * URL: /api/posts/[postId]
 */
export async function DELETE(request, { params }) {
    // Memastikan destrukturisasi params dilakukan dengan aman
    const postId = params.postId; 
    const db = admin.firestore();
    
    // Mendapatkan userId dari body request (untuk verifikasi otorisasi)
    let userId;
    try {
        const body = await request.json();
        userId = body.userId;
    } catch (e) {
        // Jika body kosong atau parsing gagal, anggap saja userId tidak disediakan.
        userId = null; 
    }
    
    if (!postId || !userId) {
        return NextResponse.json({ error: 'ID Postingan atau ID Pengguna tidak lengkap.' }, { status: 400 });
    }

    const postRef = db.collection('posts').doc(postId);

    try {
        // --- Langkah 1: Verifikasi Kepemilikan ---
        const postDoc = await postRef.get();
        if (!postDoc.exists) {
            return NextResponse.json({ error: 'Postingan tidak ditemukan.' }, { status: 404 });
        }

        // Pastikan pengguna yang menghapus adalah penulis postingan
        if (postDoc.data().author.authorId !== userId) {
            return NextResponse.json({ error: 'Anda tidak memiliki izin untuk menghapus postingan ini.' }, { status: 403 });
        }
        
        // --- Langkah 2: Hapus Sub-koleksi (Komentar) ---
        // Karena Firestore tidak menghapus sub-koleksi secara otomatis,
        // kita perlu menghapusnya secara manual. Ini adalah praktik terbaik.
        const commentsSnapshot = await postRef.collection('comments').get();
        const batch = db.batch();

        commentsSnapshot.docs.forEach(doc => {
            batch.delete(doc.ref);
        });
        
        // --- Langkah 3: Hapus Postingan Utama ---
        batch.delete(postRef);

        // Eksekusi semua operasi hapus
        await batch.commit();

        return NextResponse.json({ success: true, message: 'Postingan dan komentarnya berhasil dihapus.' });

    } catch (error) {
        console.error('Error saat menghapus postingan:', error);
        return NextResponse.json({ error: 'Gagal menghapus postingan.' }, { status: 500 });
    }
}
