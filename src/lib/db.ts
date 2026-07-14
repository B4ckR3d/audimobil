import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.join(process.cwd(), 'data', 'audi-motor.db');

let db: Database.Database | null = null;

export function getDb(): Database.Database {
  if (!db) {
    db = new Database(dbPath);
    db.pragma('journal_mode = WAL');
    db.pragma('foreign_keys = ON');
    initSchema(db);
  }
  return db;
}

function initSchema(db: Database.Database): void {
  db.exec(`
    CREATE TABLE IF NOT EXISTS cars (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      brand TEXT NOT NULL,
      model TEXT NOT NULL,
      year INTEGER NOT NULL,
      price INTEGER NOT NULL,
      mileage INTEGER NOT NULL,
      transmission TEXT NOT NULL DEFAULT 'Automatic',
      fuel TEXT NOT NULL DEFAULT 'Bensin',
      color TEXT NOT NULL DEFAULT 'Hitam',
      description TEXT DEFAULT '',
      image_url TEXT DEFAULT '',
      status TEXT NOT NULL DEFAULT 'available',
      is_featured INTEGER NOT NULL DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS site_settings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      setting_key TEXT UNIQUE NOT NULL,
      setting_value TEXT DEFAULT '',
      setting_type TEXT DEFAULT 'text',
      setting_group TEXT DEFAULT 'general',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS hero_sections (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL DEFAULT 'Masa Depan Keluarga Anda Dimulai di Sini.',
      subtitle TEXT DEFAULT 'Kami menghadirkan koleksi mobil bekas premium, terawat, dan berkualitas tinggi khusus untuk kenyamanan dan keamanan perjalanan keluarga Anda.',
      badge TEXT DEFAULT 'Dealer Mobil Keluarga Terpercaya',
      button_primary_text TEXT DEFAULT 'Lihat Koleksi',
      button_primary_link TEXT DEFAULT '/#koleksi',
      button_secondary_text TEXT DEFAULT 'Konsultasi WA',
      button_secondary_link TEXT DEFAULT 'https://wa.me/6281234567890',
      background_image TEXT DEFAULT '',
      background_video TEXT DEFAULT '',
      is_active INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS features (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      icon TEXT NOT NULL DEFAULT 'fa-shield-alt',
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      sort_order INTEGER DEFAULT 0,
      is_active INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS gallery (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT DEFAULT '',
      image_url TEXT NOT NULL,
      category TEXT DEFAULT 'general',
      sort_order INTEGER DEFAULT 0,
      is_active INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS contact_info (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      contact_type TEXT NOT NULL,
      contact_value TEXT NOT NULL,
      label TEXT DEFAULT '',
      is_active INTEGER DEFAULT 1,
      sort_order INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS social_links (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      platform TEXT NOT NULL,
      url TEXT NOT NULL,
      icon TEXT DEFAULT '',
      is_active INTEGER DEFAULT 1,
      sort_order INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS pages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      slug TEXT UNIQUE NOT NULL,
      title TEXT NOT NULL,
      content TEXT DEFAULT '',
      meta_description TEXT DEFAULT '',
      is_active INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS testimonials (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      customer_name TEXT NOT NULL,
      customer_avatar TEXT DEFAULT '',
      rating INTEGER DEFAULT 5,
      comment TEXT NOT NULL,
      car_purchased TEXT DEFAULT '',
      is_active INTEGER DEFAULT 1,
      sort_order INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS promotions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT DEFAULT '',
      image_url TEXT DEFAULT '',
      discount_text TEXT DEFAULT '',
      start_date TEXT,
      end_date TEXT,
      is_active INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      full_name TEXT DEFAULT '',
      role TEXT DEFAULT 'admin',
      is_active INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS sessions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      session_token TEXT UNIQUE NOT NULL,
      user_id INTEGER NOT NULL,
      expires_at DATETIME NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS roles (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT UNIQUE NOT NULL,
      label TEXT NOT NULL,
      description TEXT DEFAULT '',
      permissions TEXT DEFAULT '{}',
      is_active INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  const heroColumns = db.prepare("PRAGMA table_info(hero_sections)").all() as { name: string }[];
  if (!heroColumns.some((c) => c.name === 'background_video')) {
    db.exec("ALTER TABLE hero_sections ADD COLUMN background_video TEXT DEFAULT ''");
  }

  const testimonialColumns = db.prepare("PRAGMA table_info(testimonials)").all() as { name: string }[];
  if (!testimonialColumns.some((c) => c.name === 'is_active')) {
    db.exec("ALTER TABLE testimonials ADD COLUMN is_active INTEGER DEFAULT 1");
  }
  if (!testimonialColumns.some((c) => c.name === 'sort_order')) {
    db.exec("ALTER TABLE testimonials ADD COLUMN sort_order INTEGER DEFAULT 0");
  }

  const roleCount = db.prepare("SELECT COUNT(*) as count FROM roles").get() as { count: number };
  const roleColumns = db.prepare("PRAGMA table_info(roles)").all() as { name: string }[];
  if (!roleColumns.some((c) => c.name === 'permissions')) {
    db.exec("ALTER TABLE roles ADD COLUMN permissions TEXT DEFAULT '{}'");
  }
  if (roleCount.count === 0) {
    const insert = db.prepare("INSERT INTO roles (name, label, description, permissions) VALUES (?, ?, ?, ?)");
    const fullPerms = JSON.stringify({ hero: 'write', features: 'write', gallery: 'write', testimonials: 'write', promotions: 'write', pages: 'write', contact: 'write', social: 'write', cars: 'write', users: 'write', roles: 'write', settings: 'write' });
    const editorPerms = JSON.stringify({ hero: 'write', features: 'write', gallery: 'write', testimonials: 'write', promotions: 'write', pages: 'write', contact: 'write', social: 'write', cars: 'write', users: 'none', roles: 'none', settings: 'none' });
    insert.run('admin', 'Admin (Full)', 'Akses penuh ke semua fitur', fullPerms);
    insert.run('editor', 'Editor', 'Bisa mengelola konten dan mobil', editorPerms);
  }
}

export function closeDb(): void {
  if (db) {
    db.close();
    db = null;
  }
}
