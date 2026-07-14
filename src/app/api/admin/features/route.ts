import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { Feature } from '@/types';
import { checkPermission } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const { allowed } = checkPermission(request, 'features', 'read');
    if (!allowed) {
      return NextResponse.json({ error: 'Akses ditolak' }, { status: 403 });
    }

    const db = getDb();
    const features = db.prepare('SELECT * FROM features ORDER BY sort_order ASC, id ASC').all() as Feature[];
    return NextResponse.json(features);
  } catch {
    return NextResponse.json({ error: 'Gagal mengambil data fitur' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { allowed } = checkPermission(request, 'features', 'write');
    if (!allowed) {
      return NextResponse.json({ error: 'Akses ditolak' }, { status: 403 });
    }

    const body = await request.json();
    const db = getDb();

    const stmt = db.prepare(`
      INSERT INTO features (icon, title, description, sort_order, is_active)
      VALUES (?, ?, ?, ?, ?)
    `);

    const result = stmt.run(
      body.icon,
      body.title,
      body.description,
      body.sort_order || 0,
      body.is_active !== undefined ? (body.is_active ? 1 : 0) : 1
    );

    return NextResponse.json({ message: 'Fitur berhasil ditambahkan', id: result.lastInsertRowid }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Gagal menambahkan fitur' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { allowed } = checkPermission(request, 'features', 'write');
    if (!allowed) {
      return NextResponse.json({ error: 'Akses ditolak' }, { status: 403 });
    }

    const body = await request.json();
    const db = getDb();

    const stmt = db.prepare(`
      UPDATE features SET icon=?, title=?, description=?, sort_order=?, is_active=?, updated_at=CURRENT_TIMESTAMP
      WHERE id=?
    `);

    const result = stmt.run(
      body.icon,
      body.title,
      body.description,
      body.sort_order || 0,
      body.is_active ? 1 : 0,
      body.id
    );

    if (result.changes === 0) {
      return NextResponse.json({ error: 'Fitur tidak ditemukan' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Fitur berhasil diperbarui' });
  } catch {
    return NextResponse.json({ error: 'Gagal memperbarui fitur' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { allowed } = checkPermission(request, 'features', 'write');
    if (!allowed) {
      return NextResponse.json({ error: 'Akses ditolak' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'ID diperlukan' }, { status: 400 });
    }

    const db = getDb();
    const result = db.prepare('DELETE FROM features WHERE id = ?').run(Number(id));

    if (result.changes === 0) {
      return NextResponse.json({ error: 'Fitur tidak ditemukan' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Fitur berhasil dihapus' });
  } catch {
    return NextResponse.json({ error: 'Gagal menghapus fitur' }, { status: 500 });
  }
}
