import { getDb } from './db';
import crypto from 'crypto';
import { NextRequest } from 'next/server';

export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, passwordHash: string): boolean {
  const [salt, hash] = passwordHash.split(':');
  const hashToVerify = crypto.scryptSync(password, salt, 64).toString('hex');
  return hash === hashToVerify;
}

export function createSession(userId: number): string {
  const db = getDb();
  const token = crypto.randomBytes(32).toString('hex');
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

  db.prepare('DELETE FROM sessions WHERE user_id = ?').run(userId);
  db.prepare('INSERT INTO sessions (session_token, user_id, expires_at) VALUES (?, ?, ?)').run(token, userId, expiresAt);

  return token;
}

export function validateSession(token: string): { userId: number; username: string; role: string } | null {
  const db = getDb();
  const session = db.prepare(`
    SELECT s.user_id, u.username, u.role
    FROM sessions s
    JOIN users u ON s.user_id = u.id
    WHERE s.session_token = ? AND s.expires_at > datetime('now') AND u.is_active = 1
  `).get(token) as { user_id: number; username: string; role: string } | undefined;

  if (!session) return null;
  return { userId: session.user_id, username: session.username, role: session.role };
}

export function deleteSession(token: string): void {
  const db = getDb();
  db.prepare('DELETE FROM sessions WHERE session_token = ?').run(token);
}

export function getCookieValue(cookieHeader: string | null, name: string): string | null {
  if (!cookieHeader) return null;
  const match = cookieHeader.match(new RegExp(`(?:^|;\\s*)${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

export function getCurrentUser(request: NextRequest) {
  const cookieHeader = request.headers.get('cookie');
  const token = getCookieValue(cookieHeader, 'session_token');
  if (!token) return null;
  return validateSession(token);
}

export function getUserPermissions(roleName: string): Record<string, string> {
  const db = getDb();
  const role = db.prepare('SELECT permissions FROM roles WHERE name = ?').get(roleName) as { permissions: string } | undefined;
  if (!role) return {};
  try {
    return JSON.parse(role.permissions);
  } catch {
    return {};
  }
}

export function checkPermission(
  request: NextRequest,
  section: string,
  action: 'read' | 'write'
): { allowed: boolean; user: ReturnType<typeof getCurrentUser> } {
  const user = getCurrentUser(request);
  if (!user) return { allowed: false, user: null };

  // admin role has full access
  if (user.role === 'admin') return { allowed: true, user };

  const permissions = getUserPermissions(user.role);
  const perm = permissions[section] || 'none';

  if (action === 'read' && (perm === 'read' || perm === 'write')) {
    return { allowed: true, user };
  }
  if (action === 'write' && perm === 'write') {
    return { allowed: true, user };
  }

  return { allowed: false, user };
}
