import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { SocialLink } from '@/types';
import { checkPermission } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const { allowed } = checkPermission(request, 'social', 'read');
    if (!allowed) {
      return NextResponse.json({ error: 'Akses ditolak' }, { status: 403 });
    }

    const db = getDb();
    const links = db.prepare('SELECT * FROM social_links ORDER BY sort_order ASC, id ASC').all() as SocialLink[];
    return NextResponse.json(links);
  } catch {
    return NextResponse.json({ error: 'Gagal mengambil data social links' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { allowed } = checkPermission(request, 'social', 'write');
    if (!allowed) {
      return NextResponse.json({ error: 'Akses ditolak' }, { status: 403 });
    }

    const body = await request.json();
    const db = getDb();

    const stmt = db.prepare(`
      INSERT INTO social_links (platform, url, icon, is_active, sort_order)
      VALUES (?, ?, ?, ?, ?)
    `);

    const result = stmt.run(
      body.platform,
      body.url,
      body.icon || '',
      body.is_active !== undefined ? (body.is_active ? 1 : 0) : 1,
      body.sort_order || 0
    );

    return NextResponse.json({ message: 'Social link berhasil ditambahkan', id: result.lastInsertRowid }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Gagal menambahkan social link' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { allowed } = checkPermission(request, 'social', 'write');
    if (!allowed) {
      return NextResponse.json({ error: 'Akses ditolak' }, { status: 403 });
    }

    const body = await request.json();
    const db = getDb();

    const stmt = db.prepare(`
      UPDATE social_links SET platform=?, url=?, icon=?, is_active=?, sort_order=?, updated_at=CURRENT_TIMESTAMP
      WHERE id=?
    `);

    const result = stmt.run(
      body.platform,
      body.url,
      body.icon || '',
      body.is_active ? 1 : 0,
      body.sort_order || 0,
      body.id
    );

    if (result.changes === 0) {
      return NextResponse.json({ error: 'Social link tidak ditemukan' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Social link berhasil diperbarui' });
  } catch {
    return NextResponse.json({ error: 'Gagal memperbarui social link' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { allowed } = checkPermission(request, 'social', 'write');
    if (!allowed) {
      return NextResponse.json({ error: 'Akses ditolak' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'ID diperlukan' }, { status: 400 });
    }

    const db = getDb();
    const result = db.prepare('DELETE FROM social_links WHERE id = ?').run(Number(id));

    if (result.changes === 0) {
      return NextResponse.json({ error: 'Social link tidak ditemukan' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Social link berhasil dihapus' });
  } catch {
    return NextResponse.json({ error: 'Gagal menghapus social link' }, { status: 500 });
  }
}
