import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { SiteSetting } from '@/types';
import { checkPermission } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const { allowed } = checkPermission(request, 'settings', 'read');
    if (!allowed) {
      return NextResponse.json({ error: 'Akses ditolak' }, { status: 403 });
    }

    const db = getDb();
    const settings = db.prepare('SELECT * FROM site_settings ORDER BY setting_group, setting_key').all() as SiteSetting[];
    return NextResponse.json(settings);
  } catch {
    return NextResponse.json({ error: 'Gagal mengambil pengaturan' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { allowed } = checkPermission(request, 'settings', 'write');
    if (!allowed) {
      return NextResponse.json({ error: 'Akses ditolak' }, { status: 403 });
    }

    const body = await request.json();
    const db = getDb();

    const stmt = db.prepare(`
      INSERT INTO site_settings (setting_key, setting_value, setting_type, setting_group)
      VALUES (?, ?, ?, ?)
      ON CONFLICT(setting_key) DO UPDATE SET setting_value = excluded.setting_value, setting_type = excluded.setting_type, updated_at = CURRENT_TIMESTAMP
    `);

    if (Array.isArray(body.settings)) {
      const insertMany = db.transaction((items: Array<{ key: string; value: string; type?: string; group?: string }>) => {
        for (const item of items) {
          stmt.run(item.key, item.value, item.type || 'text', item.group || 'general');
        }
      });
      insertMany(body.settings);
    } else {
      stmt.run(body.key, body.value, body.type || 'text', body.group || 'general');
    }

    return NextResponse.json({ message: 'Pengaturan berhasil disimpan' });
  } catch {
    return NextResponse.json({ error: 'Gagal menyimpan pengaturan' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { allowed } = checkPermission(request, 'settings', 'write');
    if (!allowed) {
      return NextResponse.json({ error: 'Akses ditolak' }, { status: 403 });
    }

    const body = await request.json();
    const db = getDb();

    const stmt = db.prepare(`
      UPDATE site_settings SET setting_value = ?, updated_at = CURRENT_TIMESTAMP WHERE setting_key = ?
    `);

    if (Array.isArray(body.settings)) {
      const updateMany = db.transaction((items: Array<{ key: string; value: string }>) => {
        for (const item of items) {
          stmt.run(item.value, item.key);
        }
      });
      updateMany(body.settings);
    } else {
      stmt.run(body.value, body.key);
    }

    return NextResponse.json({ message: 'Pengaturan berhasil diperbarui' });
  } catch {
    return NextResponse.json({ error: 'Gagal memperbarui pengaturan' }, { status: 500 });
  }
}
