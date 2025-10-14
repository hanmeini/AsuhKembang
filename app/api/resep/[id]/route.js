import { NextResponse } from 'next/server';
import admin from '../../../../lib/firebaseAdmin';

// Handler ini akan mengambil SATU resep berdasarkan ID-nya
export async function GET(request, { params }) {
    const { id } = params; // Mengambil ID dari URL
    const db = admin.firestore();

    try {
        const docRef = db.collection('recipes').doc(id);
        const doc = await docRef.get();

        if (!doc.exists) {
            return NextResponse.json({ error: 'Resep tidak ditemukan.' }, { status: 404 });
        }
        
        return NextResponse.json({ id: doc.id, ...doc.data() });

    } catch (error) {
        console.error('Gagal mengambil detail resep:', error);
        return NextResponse.json({ error: 'Gagal mengambil data resep.' }, { status: 500 });
    }
}
