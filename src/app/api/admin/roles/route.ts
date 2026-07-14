import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { checkPermission } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const { allowed } = checkPermission(request, 'roles', 'read');
    if (!allowed) {
      return NextResponse.json({ error: 'Akses ditolak' }, { status: 403 });
    }

    const db = getDb();
    const roles = db.prepare('SELECT * FROM roles ORDER BY id ASC').all();
    return NextResponse.json(roles);
  } catch {
    return NextResponse.json({ error: 'Gagal mengambil data roles' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { allowed } = checkPermission(request, 'roles', 'write');
    if (!allowed) {
      return NextResponse.json({ error: 'Akses ditolak' }, { status: 403 });
    }

    const body = await request.json();
    const { name, label, description, permissions } = body;

    if (!name || !label) {
      return NextResponse.json({ error: 'Name dan label harus diisi' }, { status: 400 });
    }

    const db = getDb();
    const existing = db.prepare('SELECT id FROM roles WHERE name = ?').get(name);
    if (existing) {
      return NextResponse.json({ error: 'Role name sudah digunakan' }, { status: 400 });
    }

    const permsJson = typeof permissions === 'string' ? permissions : JSON.stringify(permissions || {});
    const result = db.prepare(
      'INSERT INTO roles (name, label, description, permissions) VALUES (?, ?, ?, ?)'
    ).run(name, label, description || '', permsJson);

    return NextResponse.json({ message: 'Role berhasil ditambahkan', id: result.lastInsertRowid }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Gagal menambahkan role' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { allowed } = checkPermission(request, 'roles', 'write');
    if (!allowed) {
      return NextResponse.json({ error: 'Akses ditolak' }, { status: 403 });
    }

    const body = await request.json();
    const { id, name, label, description, permissions, is_active } = body;

    if (!id) {
      return NextResponse.json({ error: 'ID diperlukan' }, { status: 400 });
    }

    const db = getDb();
    const permsJson = typeof permissions === 'string' ? permissions : JSON.stringify(permissions || {});
    db.prepare('UPDATE roles SET name=?, label=?, description=?, permissions=?, is_active=?, updated_at=CURRENT_TIMESTAMP WHERE id=?')
      .run(name, label, description || '', permsJson, is_active ? 1 : 0, id);

    return NextResponse.json({ message: 'Role berhasil diperbarui' });
  } catch {
    return NextResponse.json({ error: 'Gagal memperbarui role' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { allowed } = checkPermission(request, 'roles', 'write');
    if (!allowed) {
      return NextResponse.json({ error: 'Akses ditolak' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'ID diperlukan' }, { status: 400 });
    }

    const db = getDb();
    const role = db.prepare('SELECT name FROM roles WHERE id = ?').get(Number(id)) as { name: string } | undefined;
    if (role && (role.name === 'admin' || role.name === 'editor')) {
      return NextResponse.json({ error: 'Tidak bisa menghapus role default' }, { status: 400 });
    }

    const result = db.prepare('DELETE FROM roles WHERE id = ?').run(Number(id));
    if (result.changes === 0) {
      return NextResponse.json({ error: 'Role tidak ditemukan' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Role berhasil dihapus' });
  } catch {
    return NextResponse.json({ error: 'Gagal menghapus role' }, { status: 500 });
  }
}
