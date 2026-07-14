import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { HeroSection } from '@/types';
import { checkPermission } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const db = getDb();
    const hero = db.prepare('SELECT * FROM hero_sections WHERE is_active = 1 ORDER BY id DESC LIMIT 1').get() as HeroSection | undefined;
    return NextResponse.json(hero || null);
  } catch {
    return NextResponse.json({ error: 'Gagal mengambil data hero' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { allowed } = checkPermission(request, 'hero', 'write');
    if (!allowed) {
      return NextResponse.json({ error: 'Akses ditolak' }, { status: 403 });
    }

    const body = await request.json();
    const db = getDb();

    db.prepare('UPDATE hero_sections SET is_active = 0').run();

    const stmt = db.prepare(`
      INSERT INTO hero_sections (title, subtitle, badge, button_primary_text, button_primary_link, button_secondary_text, button_secondary_link, background_image, background_video, is_active)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 1)
    `);

    const result = stmt.run(
      body.title,
      body.subtitle,
      body.badge,
      body.button_primary_text,
      body.button_primary_link,
      body.button_secondary_text,
      body.button_secondary_link,
      body.background_image,
      body.background_video
    );

    return NextResponse.json({ message: 'Hero berhasil disimpan', id: result.lastInsertRowid }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Gagal menyimpan hero' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { allowed } = checkPermission(request, 'hero', 'write');
    if (!allowed) {
      return NextResponse.json({ error: 'Akses ditolak' }, { status: 403 });
    }

    const body = await request.json();
    const db = getDb();

    const stmt = db.prepare(`
      UPDATE hero_sections SET title=?, subtitle=?, badge=?, button_primary_text=?, button_primary_link=?, button_secondary_text=?, button_secondary_link=?, background_image=?, background_video=?, updated_at=CURRENT_TIMESTAMP
      WHERE id=?
    `);

    const result = stmt.run(
      body.title,
      body.subtitle,
      body.badge,
      body.button_primary_text,
      body.button_primary_link,
      body.button_secondary_text,
      body.button_secondary_link,
      body.background_image,
      body.background_video,
      body.id
    );

    if (result.changes === 0) {
      return NextResponse.json({ error: 'Hero tidak ditemukan' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Hero berhasil diperbarui' });
  } catch {
    return NextResponse.json({ error: 'Gagal memperbarui hero' }, { status: 500 });
  }
}
