import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { checkPermission } from '@/lib/auth';

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { allowed } = checkPermission(request, 'cars', 'write');
    if (!allowed) {
      return NextResponse.json({ error: 'Akses ditolak' }, { status: 403 });
    }

    const { id } = await params;
    const body = await request.json();
    const db = getDb();

    const stmt = db.prepare(`
      UPDATE cars SET name=?, brand=?, model=?, year=?, price=?, mileage=?, transmission=?, fuel=?, color=?, description=?, image_url=?, status=?, is_featured=?, updated_at=CURRENT_TIMESTAMP
      WHERE id=?
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
      body.is_featured ? 1 : 0,
      Number(id)
    );

    if (result.changes === 0) {
      return NextResponse.json({ error: 'Mobil tidak ditemukan' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Mobil berhasil diperbarui' });
  } catch {
    return NextResponse.json({ error: 'Gagal memperbarui mobil' }, { status: 500 });
  }
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { allowed } = checkPermission(_request, 'cars', 'write');
    if (!allowed) {
      return NextResponse.json({ error: 'Akses ditolak' }, { status: 403 });
    }

    const { id } = await params;
    const db = getDb();

    const result = db.prepare('DELETE FROM cars WHERE id = ?').run(Number(id));

    if (result.changes === 0) {
      return NextResponse.json({ error: 'Mobil tidak ditemukan' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Mobil berhasil dihapus' });
  } catch {
    return NextResponse.json({ error: 'Gagal menghapus mobil' }, { status: 500 });
  }
}
