import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { Testimonial } from '@/types';
import { checkPermission } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const { allowed } = checkPermission(request, 'testimonials', 'read');
    if (!allowed) {
      return NextResponse.json({ error: 'Akses ditolak' }, { status: 403 });
    }

    const db = getDb();
    const testimonials = db.prepare('SELECT * FROM testimonials ORDER BY sort_order ASC, id DESC').all() as Testimonial[];
    return NextResponse.json(testimonials);
  } catch {
    return NextResponse.json({ error: 'Gagal mengambil data testimonial' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { allowed } = checkPermission(request, 'testimonials', 'write');
    if (!allowed) {
      return NextResponse.json({ error: 'Akses ditolak' }, { status: 403 });
    }

    const body = await request.json();
    const db = getDb();

    const stmt = db.prepare(`
      INSERT INTO testimonials (customer_name, customer_avatar, rating, comment, car_purchased, is_active, sort_order)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    const result = stmt.run(
      body.customer_name,
      body.customer_avatar || '',
      body.rating || 5,
      body.comment,
      body.car_purchased || '',
      body.is_active !== undefined ? (body.is_active ? 1 : 0) : 1,
      body.sort_order || 0
    );

    return NextResponse.json({ message: 'Testimonial berhasil ditambahkan', id: result.lastInsertRowid }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Gagal menambahkan testimonial' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { allowed } = checkPermission(request, 'testimonials', 'write');
    if (!allowed) {
      return NextResponse.json({ error: 'Akses ditolak' }, { status: 403 });
    }

    const body = await request.json();
    const db = getDb();

    const stmt = db.prepare(`
      UPDATE testimonials SET customer_name=?, customer_avatar=?, rating=?, comment=?, car_purchased=?, is_active=?, sort_order=?, updated_at=CURRENT_TIMESTAMP
      WHERE id=?
    `);

    const result = stmt.run(
      body.customer_name,
      body.customer_avatar || '',
      body.rating || 5,
      body.comment,
      body.car_purchased || '',
      body.is_active ? 1 : 0,
      body.sort_order || 0,
      body.id
    );

    if (result.changes === 0) {
      return NextResponse.json({ error: 'Testimonial tidak ditemukan' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Testimonial berhasil diperbarui' });
  } catch {
    return NextResponse.json({ error: 'Gagal memperbarui testimonial' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { allowed } = checkPermission(request, 'testimonials', 'write');
    if (!allowed) {
      return NextResponse.json({ error: 'Akses ditolak' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'ID diperlukan' }, { status: 400 });
    }

    const db = getDb();
    const result = db.prepare('DELETE FROM testimonials WHERE id = ?').run(Number(id));

    if (result.changes === 0) {
      return NextResponse.json({ error: 'Testimonial tidak ditemukan' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Testimonial berhasil dihapus' });
  } catch {
    return NextResponse.json({ error: 'Gagal menghapus testimonial' }, { status: 500 });
  }
}
