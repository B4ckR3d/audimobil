import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { Car } from '@/types';

export async function GET() {
  try {
    const db = getDb();
    const cars = db
      .prepare('SELECT * FROM cars ORDER BY is_featured DESC, created_at DESC')
      .all() as Car[];
    return NextResponse.json(cars);
  } catch (error) {
    return NextResponse.json({ error: 'Gagal mengambil data mobil' }, { status: 500 });
  }
}
