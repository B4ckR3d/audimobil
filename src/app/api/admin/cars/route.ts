import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { checkPermission } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { allowed } = checkPermission(request, 'cars', 'write');
    if (!allowed) {
      return NextResponse.json({ error: 'Akses ditolak' }, { status: 403 });
    }

    const body = await request.json();
    const db = getDb();

    const stmt = db.prepare(`
      INSERT INTO cars (name, brand, model, year, price, mileage, transmission, fuel, color, description, image_url, status, is_featured)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const result = stmt.run(
      body.name,
      body.brand,
      body.model,
      body.year,
      body.price,
      body.mileage,
      body.transmission || 'Automatic',
      body.fuel || 'Bensin',
      body.color || 'Hitam',
      body.description || '',
      body.image_url || '',
      body.status || 'available',
      body.is_featured ? 1 : 0
    );

    return NextResponse.json({ message: 'Mobil berhasil ditambahkan', id: result.lastInsertRowid }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Gagal menambahkan mobil' }, { status: 500 });
  }
}
