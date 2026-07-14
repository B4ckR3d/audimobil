import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { hashPassword, verifyPassword, validateSession, getCookieValue } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const cookieHeader = request.headers.get('cookie');
    const token = getCookieValue(cookieHeader, 'session_token');
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const session = validateSession(token);
    if (!session) {
      return NextResponse.json({ error: 'Sesi berakhir' }, { status: 401 });
    }

    const db = getDb();
    const user = db.prepare('SELECT id, username, full_name, role, created_at FROM users WHERE id = ?').get(session.userId);
    return NextResponse.json(user);
  } catch {
    return NextResponse.json({ error: 'Gagal mengambil profil' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const cookieHeader = request.headers.get('cookie');
    const token = getCookieValue(cookieHeader, 'session_token');
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const session = validateSession(token);
    if (!session) {
      return NextResponse.json({ error: 'Sesi berakhir' }, { status: 401 });
    }

    const body = await request.json();
    const { full_name, current_password, new_password } = body;

    const db = getDb();

    if (new_password) {
      if (!current_password) {
        return NextResponse.json({ error: 'Password lama harus diisi' }, { status: 400 });
      }

      const user = db.prepare('SELECT password_hash FROM users WHERE id = ?').get(session.userId) as { password_hash: string };
      if (!verifyPassword(current_password, user.password_hash)) {
        return NextResponse.json({ error: 'Password lama salah' }, { status: 400 });
      }

      const passwordHash = hashPassword(new_password);
      db.prepare('UPDATE users SET full_name=?, password_hash=?, updated_at=CURRENT_TIMESTAMP WHERE id=?')
        .run(full_name || '', passwordHash, session.userId);
    } else {
      db.prepare('UPDATE users SET full_name=?, updated_at=CURRENT_TIMESTAMP WHERE id=?')
        .run(full_name || '', session.userId);
    }

    return NextResponse.json({ message: 'Profil berhasil diperbarui' });
  } catch {
    return NextResponse.json({ error: 'Gagal memperbarui profil' }, { status: 500 });
  }
}
