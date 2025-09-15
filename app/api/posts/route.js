import { NextResponse } from 'next/server';
import admin from '../../../lib/firebaseAdmin';

export async function POST(request) {
  const { userId, content, imageUrl, authorName, authorAvatar } = await request.json(); 
  const db = admin.firestore();

  if (!userId || !authorName) {
    return NextResponse.json({ error: 'Data pengguna tidak lengkap.' }, { status: 401 });
  }
  if (!content && !imageUrl) {
    return NextResponse.json({ error: 'Postingan tidak boleh kosong.' }, { status: 400 });
  }

  try {
    const newPost = {
      authorId: userId,
      author: {
        name: authorName,
        avatar: authorAvatar || null
      },
      content: content || "",
      imageUrl: imageUrl || null,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      likes: [],
      commentCount: 0,
    };

    const docRef = await db.collection('posts').add(newPost);
    
    return NextResponse.json({ success: true, id: docRef.id });

  } catch (error) {
    console.error('Error saat membuat postingan:', error);
    return NextResponse.json({ error: 'Gagal membuat postingan.' }, { status: 500 });
  }
}

