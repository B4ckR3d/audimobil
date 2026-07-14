import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { Page } from '@/types';
import { checkPermission } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const { allowed } = checkPermission(request, 'pages', 'read');
    if (!allowed) {
      return NextResponse.json({ error: 'Akses ditolak' }, { status: 403 });
    }

    const db = getDb();
    const pages = db.prepare('SELECT * FROM pages ORDER BY id ASC').all() as Page[];
    return NextResponse.json(pages);
  } catch {
    return NextResponse.json({ error: 'Gagal mengambil data halaman' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { allowed } = checkPermission(request, 'pages', 'write');
    if (!allowed) {
      return NextResponse.json({ error: 'Akses ditolak' }, { status: 403 });
    }

    const body = await request.json();
    const db = getDb();

    const stmt = db.prepare(`
      INSERT INTO pages (slug, title, content, meta_description, is_active)
      VALUES (?, ?, ?, ?, ?)
    `);

    const result = stmt.run(
      body.slug,
      body.title,
      body.content || '',
      body.meta_description || '',
      body.is_active !== undefined ? (body.is_active ? 1 : 0) : 1
    );

    return NextResponse.json({ message: 'Halaman berhasil ditambahkan', id: result.lastInsertRowid }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Gagal menambahkan halaman' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { allowed } = checkPermission(request, 'pages', 'write');
    if (!allowed) {
      return NextResponse.json({ error: 'Akses ditolak' }, { status: 403 });
    }

    const body = await request.json();
    const db = getDb();

    const stmt = db.prepare(`
      UPDATE pages SET slug=?, title=?, content=?, meta_description=?, is_active=?, updated_at=CURRENT_TIMESTAMP
      WHERE id=?
    `);

    const result = stmt.run(
      body.slug,
      body.title,
      body.content || '',
      body.meta_description || '',
      body.is_active ? 1 : 0,
      body.id
    );

    if (result.changes === 0) {
      return NextResponse.json({ error: 'Halaman tidak ditemukan' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Halaman berhasil diperbarui' });
  } catch {
    return NextResponse.json({ error: 'Gagal memperbarui halaman' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { allowed } = checkPermission(request, 'pages', 'write');
    if (!allowed) {
      return NextResponse.json({ error: 'Akses ditolak' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'ID diperlukan' }, { status: 400 });
    }

    const db = getDb();
    const result = db.prepare('DELETE FROM pages WHERE id = ?').run(Number(id));

    if (result.changes === 0) {
      return NextResponse.json({ error: 'Halaman tidak ditemukan' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Halaman berhasil dihapus' });
  } catch {
    return NextResponse.json({ error: 'Gagal menghapus halaman' }, { status: 500 });
  }
}
