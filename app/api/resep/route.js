import { NextResponse } from 'next/server';
import admin from '../../../lib/firebaseAdmin';
import { FieldValue } from 'firebase-admin/firestore';

// Handler untuk MENAMBAH resep baru
export async function POST(request) {
    const { userId, authorName, authorAvatar, title, description, imageUrl, category, ingredients, instructions } = await request.json();
    const db = admin.firestore();

    if (!userId || !title || !ingredients || !instructions) {
        return NextResponse.json({ error: 'Data resep tidak lengkap.' }, { status: 400 });
    }

    try {
        const newRecipe = {
            authorId: userId,
            author: {
                name: authorName,
                avatar: authorAvatar || null
            },
            title,
            description,
            imageUrl,
            category,
            ingredients,
            instructions,
            savesCount: 0,
            createdAt: FieldValue.serverTimestamp(),
        };

        // Simpan resep baru ke koleksi 'recipes'
        await db.collection('recipes').add(newRecipe);

        // Berikan XP kepada pengguna karena telah berkontribusi
        const userRef = db.collection('users').doc(userId);
        await userRef.update({
            xp: FieldValue.increment(25) // Beri +25 XP untuk setiap resep baru
        });

        return NextResponse.json({ success: true, message: 'Resep berhasil ditambahkan!' });

    } catch (error) {
        console.error('Error saat menambah resep:', error);
        return NextResponse.json({ error: 'Gagal menambah resep.' }, { status: 500 });
    }
}

// Handler untuk MENGAMBIL semua resep
export async function GET(request) {
    const db = admin.firestore();
    try {
        const snapshot = await db.collection('recipes').orderBy('createdAt', 'desc').get();
        if (snapshot.empty) {
            return NextResponse.json([]);
        }
        
        const recipes = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        return NextResponse.json(recipes);

    } catch (error) {
        console.error('Gagal mengambil resep:', error);
        return NextResponse.json({ error: 'Gagal mengambil data resep.' }, { status: 500 });
    }
}