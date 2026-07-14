import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { Car } from '@/types';

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const db = getDb();
    const car = db.prepare('SELECT * FROM cars WHERE id = ?').get(Number(id)) as Car | undefined;

    if (!car) {
      return NextResponse.json({ error: 'Mobil tidak ditemukan' }, { status: 404 });
    }

    return NextResponse.json(car);
  } catch (error) {
    return NextResponse.json({ error: 'Gagal mengambil data mobil' }, { status: 500 });
  }
}
