import { NextResponse } from 'next/server';
import admin from '../../../../../../lib/firebaseAdmin';
import { FieldValue } from 'firebase-admin/firestore';

export async function DELETE(request, { params }) {
    const { postId, commentId } = params; // Ambil ID dari URL
    const db = admin.firestore();
    
    // Dapatkan userId dari body untuk verifikasi (opsional tapi disarankan)
    const { userId } = await request.json();

    if (!postId || !commentId || !userId) {
        return NextResponse.json({ error: 'Data tidak lengkap.' }, { status: 400 });
    }

    try {
        const postRef = db.collection('posts').doc(postId);
        const commentRef = postRef.collection('comments').doc(commentId);

        // Verifikasi kepemilikan (opsional, tapi sangat penting untuk keamanan)
        const commentDoc = await commentRef.get();
        if (!commentDoc.exists) {
            return NextResponse.json({ error: 'Komentar tidak ditemukan.' }, { status: 404 });
        }
        if (commentDoc.data().authorId !== userId) {
            return NextResponse.json({ error: 'Anda tidak memiliki izin untuk menghapus komentar ini.' }, { status: 403 });
        }

        // Aksi 1: Hapus dokumen komentar
        await commentRef.delete();

        // Aksi 2: Kurangi hitungan komentar di dokumen postingan utama
        await postRef.update({
            commentCount: FieldValue.increment(-1)
        });

        return NextResponse.json({ success: true, message: 'Komentar berhasil dihapus.' });

    } catch (error) {
        console.error('Error saat menghapus komentar:', error);
        return NextResponse.json({ error: 'Gagal menghapus komentar.' }, { status: 500 });
    }
}
