import { NextResponse } from 'next/server';
import admin from '../../../../../lib/firebaseAdmin';
import { FieldValue } from 'firebase-admin/firestore';

// PERBAIKAN: Mengubah cara parameter diakses untuk kompatibilitas
export async function POST(request, context) {
    try {
        const { userId, content, authorName, authorAvatar } = await request.json();
        
        // PERBAIKAN: Mengambil postId dari context.params
        const { postId } = context.params; 
        
        const db = admin.firestore();
        
        // Menargetkan dokumen postingan utama dan sub-koleksi komentarnya
        const postRef = db.collection('posts').doc(postId);
        const commentsRef = postRef.collection('comments');

        if (!userId || !content || !authorName) {
            return NextResponse.json({ error: 'Data tidak lengkap.' }, { status: 400 });
        }

        // Aksi 1: Menambahkan dokumen komentar baru di dalam sub-koleksi
        await commentsRef.add({
            authorId: userId,
            author: { name: authorName, avatar: authorAvatar || null },
            content,
            createdAt: FieldValue.serverTimestamp()
        });
        await postRef.update({
            commentCount: FieldValue.increment(1)
        });

        return NextResponse.json({ success: true, message: 'Komentar berhasil ditambahkan.' });

    } catch (error) {
        console.error('Error saat menambah komentar:', error);
        return NextResponse.json({ error: 'Gagal menambah komentar.' }, { status: 500 });
    }
}

