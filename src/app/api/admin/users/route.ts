import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { hashPassword, checkPermission } from '@/lib/auth';
import { User } from '@/types';

export async function GET(request: NextRequest) {
  try {
    const { allowed } = checkPermission(request, 'users', 'read');
    if (!allowed) {
      return NextResponse.json({ error: 'Akses ditolak' }, { status: 403 });
    }

    const db = getDb();
    const users = db.prepare('SELECT id, username, full_name, role, is_active, created_at, updated_at FROM users ORDER BY created_at DESC').all() as User[];
    return NextResponse.json(users);
  } catch {
    return NextResponse.json({ error: 'Gagal mengambil data users' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { allowed } = checkPermission(request, 'users', 'write');
    if (!allowed) {
      return NextResponse.json({ error: 'Akses ditolak' }, { status: 403 });
    }

    const body = await request.json();
    const { username, password, full_name, role } = body;

    if (!username || !password) {
      return NextResponse.json({ error: 'Username dan password harus diisi' }, { status: 400 });
    }

    const db = getDb();
    const existing = db.prepare('SELECT id FROM users WHERE username = ?').get(username);
    if (existing) {
      return NextResponse.json({ error: 'Username sudah digunakan' }, { status: 400 });
    }

    const passwordHash = hashPassword(password);
    const result = db.prepare(
      'INSERT INTO users (username, password_hash, full_name, role, is_active) VALUES (?, ?, ?, ?, 1)'
    ).run(username, passwordHash, full_name || '', role || 'editor');

    return NextResponse.json({ message: 'User berhasil ditambahkan', id: result.lastInsertRowid }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Gagal menambahkan user' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { allowed, user } = checkPermission(request, 'users', 'write');
    if (!allowed) {
      return NextResponse.json({ error: 'Akses ditolak' }, { status: 403 });
    }

    const body = await request.json();
    const { id, username, password, full_name, role, is_active } = body;

    if (!id) {
      return NextResponse.json({ error: 'ID diperlukan' }, { status: 400 });
    }

    const db = getDb();

    // Non-admin users cannot change roles
    if (user?.role !== 'admin' && role) {
      return NextResponse.json({ error: 'Hanya admin yang bisa mengubah role' }, { status: 403 });
    }

    if (password) {
      const passwordHash = hashPassword(password);
      db.prepare('UPDATE users SET username=?, password_hash=?, full_name=?, role=?, is_active=?, updated_at=CURRENT_TIMESTAMP WHERE id=?')
        .run(username, passwordHash, full_name, role, is_active ? 1 : 0, id);
    } else {
      db.prepare('UPDATE users SET username=?, full_name=?, role=?, is_active=?, updated_at=CURRENT_TIMESTAMP WHERE id=?')
        .run(username, full_name, role, is_active ? 1 : 0, id);
    }

    return NextResponse.json({ message: 'User berhasil diperbarui' });
  } catch {
    return NextResponse.json({ error: 'Gagal memperbarui user' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { allowed, user } = checkPermission(request, 'users', 'write');
    if (!allowed) {
      return NextResponse.json({ error: 'Akses ditolak' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'ID diperlukan' }, { status: 400 });
    }

    if (Number(id) === user?.userId) {
      return NextResponse.json({ error: 'Tidak bisa menghapus akun sendiri' }, { status: 400 });
    }

    const db = getDb();
    const result = db.prepare('DELETE FROM users WHERE id = ?').run(Number(id));

    if (result.changes === 0) {
      return NextResponse.json({ error: 'User tidak ditemukan' }, { status: 404 });
    }

    return NextResponse.json({ message: 'User berhasil dihapus' });
  } catch {
    return NextResponse.json({ error: 'Gagal menghapus user' }, { status: 500 });
  }
}
