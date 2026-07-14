import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { Promotion } from '@/types';
import { checkPermission } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const { allowed } = checkPermission(request, 'promotions', 'read');
    if (!allowed) {
      return NextResponse.json({ error: 'Akses ditolak' }, { status: 403 });
    }

    const db = getDb();
    const promotions = db.prepare('SELECT * FROM promotions ORDER BY id DESC').all() as Promotion[];
    return NextResponse.json(promotions);
  } catch {
    return NextResponse.json({ error: 'Gagal mengambil data promosi' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { allowed } = checkPermission(request, 'promotions', 'write');
    if (!allowed) {
      return NextResponse.json({ error: 'Akses ditolak' }, { status: 403 });
    }

    const body = await request.json();
    const db = getDb();

    const stmt = db.prepare(`
      INSERT INTO promotions (title, description, image_url, discount_text, start_date, end_date, is_active)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    const result = stmt.run(
      body.title,
      body.description || '',
      body.image_url || '',
      body.discount_text || '',
      body.start_date || null,
      body.end_date || null,
      body.is_active !== undefined ? (body.is_active ? 1 : 0) : 1
    );

    return NextResponse.json({ message: 'Promosi berhasil ditambahkan', id: result.lastInsertRowid }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Gagal menambahkan promosi' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { allowed } = checkPermission(request, 'promotions', 'write');
    if (!allowed) {
      return NextResponse.json({ error: 'Akses ditolak' }, { status: 403 });
    }

    const body = await request.json();
    const db = getDb();

    const stmt = db.prepare(`
      UPDATE promotions SET title=?, description=?, image_url=?, discount_text=?, start_date=?, end_date=?, is_active=?, updated_at=CURRENT_TIMESTAMP
      WHERE id=?
    `);

    const result = stmt.run(
      body.title,
      body.description || '',
      body.image_url || '',
      body.discount_text || '',
      body.start_date || null,
      body.end_date || null,
      body.is_active ? 1 : 0,
      body.id
    );

    if (result.changes === 0) {
      return NextResponse.json({ error: 'Promosi tidak ditemukan' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Promosi berhasil diperbarui' });
  } catch {
    return NextResponse.json({ error: 'Gagal memperbarui promosi' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { allowed } = checkPermission(request, 'promotions', 'write');
    if (!allowed) {
      return NextResponse.json({ error: 'Akses ditolak' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'ID diperlukan' }, { status: 400 });
    }

    const db = getDb();
    const result = db.prepare('DELETE FROM promotions WHERE id = ?').run(Number(id));

    if (result.changes === 0) {
      return NextResponse.json({ error: 'Promosi tidak ditemukan' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Promosi berhasil dihapus' });
  } catch {
    return NextResponse.json({ error: 'Gagal menghapus promosi' }, { status: 500 });
  }
}
