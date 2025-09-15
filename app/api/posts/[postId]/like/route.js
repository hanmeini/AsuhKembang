import { NextResponse } from 'next/server';
import admin from '../../../../../lib/firebaseAdmin';
import { FieldValue } from 'firebase-admin/firestore';

// Handler khusus untuk metode POST (saat pengguna menyukai postingan)
export async function POST(request, { params }) {
    try {
        const { userId } = await request.json();
        const { postId } = params; // 'params' sekarang bisa diakses dengan benar
        const db = admin.firestore();
        const postRef = db.collection('posts').doc(postId);

        if (!userId) {
            return NextResponse.json({ error: 'Autentikasi dibutuhkan.' }, { status: 401 });
        }

        // Tambahkan userId ke dalam array 'likes'
        await postRef.update({
            likes: FieldValue.arrayUnion(userId)
        });
        return NextResponse.json({ success: true, message: 'Postingan disukai.' });

    } catch (error) {
        console.error('Error saat memproses suka (POST):', error);
        return NextResponse.json({ error: 'Gagal memproses suka.' }, { status: 500 });
    }
}

// Handler khusus untuk metode DELETE (saat pengguna batal menyukai)
export async function DELETE(request, { params }) {
    try {
        const { userId } = await request.json();
        const { postId } = params; // 'params' sekarang bisa diakses dengan benar
        const db = admin.firestore();
        const postRef = db.collection('posts').doc(postId);

        if (!userId) {
            return NextResponse.json({ error: 'Autentikasi dibutuhkan.' }, { status: 401 });
        }

        // Hapus userId dari array 'likes'
        await postRef.update({
            likes: FieldValue.arrayRemove(userId)
        });
        return NextResponse.json({ success: true, message: 'Suka dibatalkan.' });
        
    } catch (error) {
        console.error('Error saat memproses suka (DELETE):', error);
        return NextResponse.json({ error: 'Gagal memproses suka.' }, { status: 500 });
    }
}

