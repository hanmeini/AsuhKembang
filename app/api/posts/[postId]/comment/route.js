import { NextResponse } from 'next/server';
import admin from '../../../../../lib/firebaseAdmin';

export async function DELETE(request, context) {
  try {
    // ✅ params harus di-await
    const { postId } = await context.params;

    const db = admin.firestore();

    // ✅ Ambil userId dari body request
    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { error: 'UserId wajib dikirim.' },
        { status: 400 }
      );
    }

    const postRef = db.collection('posts').doc(postId);
    const postDoc = await postRef.get();

    if (!postDoc.exists) {
      return NextResponse.json(
        { error: 'Postingan tidak ditemukan.' },
        { status: 404 }
      );
    }

    const postData = postDoc.data();

    // ✅ Cek author
    if (postData.authorId !== userId) {
      return NextResponse.json(
        { error: 'Anda tidak memiliki izin untuk menghapus postingan ini.' },
        { status: 403 }
      );
    }

    // ✅ Hapus postingan
    await postRef.delete();

    return NextResponse.json({
      success: true,
      message: 'Postingan berhasil dihapus.',
    });
  } catch (error) {
    console.error('Error saat menghapus postingan:', error);
    return NextResponse.json(
      { error: 'Gagal menghapus postingan.' },
      { status: 500 }
    );
  }
}
