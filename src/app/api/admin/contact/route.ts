import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { ContactInfo } from '@/types';
import { checkPermission } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const { allowed } = checkPermission(request, 'contact', 'read');
    if (!allowed) {
      return NextResponse.json({ error: 'Akses ditolak' }, { status: 403 });
    }

    const db = getDb();
    const contacts = db.prepare('SELECT * FROM contact_info ORDER BY sort_order ASC, id ASC').all() as ContactInfo[];
    return NextResponse.json(contacts);
  } catch {
    return NextResponse.json({ error: 'Gagal mengambil data kontak' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { allowed } = checkPermission(request, 'contact', 'write');
    if (!allowed) {
      return NextResponse.json({ error: 'Akses ditolak' }, { status: 403 });
    }

    const body = await request.json();
    const db = getDb();

    const stmt = db.prepare(`
      INSERT INTO contact_info (contact_type, contact_value, label, is_active, sort_order)
      VALUES (?, ?, ?, ?, ?)
    `);

    const result = stmt.run(
      body.contact_type,
      body.contact_value,
      body.label || '',
      body.is_active !== undefined ? (body.is_active ? 1 : 0) : 1,
      body.sort_order || 0
    );

    return NextResponse.json({ message: 'Kontak berhasil ditambahkan', id: result.lastInsertRowid }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Gagal menambahkan kontak' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { allowed } = checkPermission(request, 'contact', 'write');
    if (!allowed) {
      return NextResponse.json({ error: 'Akses ditolak' }, { status: 403 });
    }

    const body = await request.json();
    const db = getDb();

    const stmt = db.prepare(`
      UPDATE contact_info SET contact_type=?, contact_value=?, label=?, is_active=?, sort_order=?, updated_at=CURRENT_TIMESTAMP
      WHERE id=?
    `);

    const result = stmt.run(
      body.contact_type,
      body.contact_value,
      body.label || '',
      body.is_active ? 1 : 0,
      body.sort_order || 0,
      body.id
    );

    if (result.changes === 0) {
      return NextResponse.json({ error: 'Kontak tidak ditemukan' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Kontak berhasil diperbarui' });
  } catch {
    return NextResponse.json({ error: 'Gagal memperbarui kontak' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { allowed } = checkPermission(request, 'contact', 'write');
    if (!allowed) {
      return NextResponse.json({ error: 'Akses ditolak' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'ID diperlukan' }, { status: 400 });
    }

    const db = getDb();
    const result = db.prepare('DELETE FROM contact_info WHERE id = ?').run(Number(id));

    if (result.changes === 0) {
      return NextResponse.json({ error: 'Kontak tidak ditemukan' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Kontak berhasil dihapus' });
  } catch {
    return NextResponse.json({ error: 'Gagal menghapus kontak' }, { status: 500 });
  }
}
