import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { GalleryItem } from '@/types';
import { checkPermission } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const { allowed } = checkPermission(request, 'gallery', 'read');
    if (!allowed) {
      return NextResponse.json({ error: 'Akses ditolak' }, { status: 403 });
    }

    const db = getDb();
    const items = db.prepare('SELECT * FROM gallery ORDER BY sort_order ASC, id DESC').all() as GalleryItem[];
    return NextResponse.json(items);
  } catch {
    return NextResponse.json({ error: 'Gagal mengambil data gallery' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { allowed } = checkPermission(request, 'gallery', 'write');
    if (!allowed) {
      return NextResponse.json({ error: 'Akses ditolak' }, { status: 403 });
    }

    const body = await request.json();
    const db = getDb();

    const stmt = db.prepare(`
      INSERT INTO gallery (title, description, image_url, category, sort_order, is_active)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    const result = stmt.run(
      body.title,
      body.description || '',
      body.image_url,
      body.category || 'general',
      body.sort_order || 0,
      body.is_active !== undefined ? (body.is_active ? 1 : 0) : 1
    );

    return NextResponse.json({ message: 'Gambar berhasil ditambahkan', id: result.lastInsertRowid }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Gagal menambahkan gambar' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { allowed } = checkPermission(request, 'gallery', 'write');
    if (!allowed) {
      return NextResponse.json({ error: 'Akses ditolak' }, { status: 403 });
    }

    const body = await request.json();
    const db = getDb();

    const stmt = db.prepare(`
      UPDATE gallery SET title=?, description=?, image_url=?, category=?, sort_order=?, is_active=?, updated_at=CURRENT_TIMESTAMP
      WHERE id=?
    `);

    const result = stmt.run(
      body.title,
      body.description || '',
      body.image_url,
      body.category || 'general',
      body.sort_order || 0,
      body.is_active ? 1 : 0,
      body.id
    );

    if (result.changes === 0) {
      return NextResponse.json({ error: 'Gambar tidak ditemukan' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Gambar berhasil diperbarui' });
  } catch {
    return NextResponse.json({ error: 'Gagal memperbarui gambar' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { allowed } = checkPermission(request, 'gallery', 'write');
    if (!allowed) {
      return NextResponse.json({ error: 'Akses ditolak' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'ID diperlukan' }, { status: 400 });
    }

    const db = getDb();
    const result = db.prepare('DELETE FROM gallery WHERE id = ?').run(Number(id));

    if (result.changes === 0) {
      return NextResponse.json({ error: 'Gambar tidak ditemukan' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Gambar berhasil dihapus' });
  } catch {
    return NextResponse.json({ error: 'Gagal menghapus gambar' }, { status: 500 });
  }
}
