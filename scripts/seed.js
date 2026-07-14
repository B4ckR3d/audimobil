const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

const dbPath = path.join(__dirname, '..', 'data', 'audi-motor.db');

const dataDir = path.join(__dirname, '..', 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const db = new Database(dbPath);
db.pragma('journal_mode = WAL');

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
    button_secondary_link TEXT DEFAULT 'https://wa.me/6281329400272',
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
`);

// Migration: add background_video if missing (after CREATE TABLE so table exists)
const heroColumns = db.prepare("PRAGMA table_info(hero_sections)").all();
if (!heroColumns.some(c => c.name === 'background_video')) {
  db.exec("ALTER TABLE hero_sections ADD COLUMN background_video TEXT DEFAULT ''");
  console.log('Migration: added background_video column to hero_sections');
}

db.exec('DELETE FROM cars');
db.exec('DELETE FROM site_settings');
db.exec('DELETE FROM hero_sections');
db.exec('DELETE FROM features');
db.exec('DELETE FROM gallery');
db.exec('DELETE FROM contact_info');
db.exec('DELETE FROM social_links');
db.exec('DELETE FROM pages');
db.exec('DELETE FROM testimonials');
db.exec('DELETE FROM promotions');
db.exec('DELETE FROM users');
db.exec('DELETE FROM sessions');

const carStmt = db.prepare(`
  INSERT INTO cars (name, brand, model, year, price, mileage, transmission, fuel, color, description, image_url, status, is_featured)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

const cars = [
  {
    name: 'Alphard', brand: 'Toyota', model: '2.5 G AT', year: 2021, price: 985000000,
    mileage: 32000, transmission: 'Automatic', fuel: 'Bensin', color: 'Hitam Metalik',
    description: 'Toyota Alphard 2.5 G AT tahun 2021 dengan kondisi premium. Interior terawat, AC dingin, audio system original, dan complete service history. Cocok untuk keluarga yang mengutamakan kenyamanan perjalanan.',
    image_url: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    status: 'available', is_featured: 1,
  },
  {
    name: 'Innova Zenix', brand: 'Toyota', model: '2.0 Q HV CVT', year: 2023, price: 580000000,
    mileage: 15000, transmission: 'CVT', fuel: 'Hybrid', color: 'Putih',
    description: 'Toyota Innova Zenix Hybrid 2.0 Q HV CVT. Irit bahan bakar berkat teknologi hybrid. Kondisi masih seperti baru, pajak panjang, garansi dealer masih berlaku.',
    image_url: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    status: 'available', is_featured: 1,
  },
  {
    name: 'Pajero Sport', brand: 'Mitsubishi', model: 'Dakar 2.4 AT', year: 2020, price: 485000000,
    mileage: 45000, transmission: 'Automatic', fuel: 'Diesel', color: 'Abu-abu',
    description: 'Mitsubishi Pajero Sport Dakar 2.4 AT. Mesin diesel bertenaga, cocok untuk perjalanan jauh dan medan berat. Interior bersih, ban original, dan rutin servis di bengkel resmi.',
    image_url: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    status: 'available', is_featured: 0,
  },
  {
    name: 'Creta', brand: 'Hyundai', model: '1.5 Prime AT', year: 2022, price: 325000000,
    mileage: 22000, transmission: 'Automatic', fuel: 'Bensin', color: 'Silver',
    description: 'Hyundai Creta Prime 1.5 AT. SUV kompak dengan fitur keselamatan lengkap. Sunroof, keyless entry, modern dashboard. Hemat bahan bakar dan stylish.',
    image_url: 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    status: 'available', is_featured: 1,
  },
  {
    name: 'CR-V', brand: 'Honda', model: '1.5 Turbo Prestige', year: 2022, price: 575000000,
    mileage: 28000, transmission: 'CVT', fuel: 'Bensin', color: 'Hitam',
    description: 'Honda CR-V Turbo Prestige 2022. Mesin 1.5L Turbo bertenaga, kabin luas, fitur Honda Sensing. Pilihan tepat untuk keluarga modern.',
    image_url: 'https://images.unsplash.com/photo-1568844293986-ca79e1e0b60a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    status: 'available', is_featured: 0,
  },
  {
    name: 'Xpander', brand: 'Mitsubishi', model: '1.5 Ultimate AT', year: 2021, price: 245000000,
    mileage: 38000, transmission: 'Automatic', fuel: 'Bensin', color: 'Putih',
    description: 'Mitsubishi Xpander Ultimate 1.5 AT. MPV keluarga dengan desain modern, kabin lapang untuk 7 penumpang. Konsumsi BBM irit dan ground clearance tinggi.',
    image_url: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    status: 'available', is_featured: 0,
  },
];

const insertCars = db.transaction((items) => {
  for (const car of items) {
    carStmt.run(car.name, car.brand, car.model, car.year, car.price, car.mileage, car.transmission, car.fuel, car.color, car.description, car.image_url, car.status, car.is_featured);
  }
});
insertCars(cars);

const settingStmt = db.prepare(`INSERT INTO site_settings (setting_key, setting_value, setting_type, setting_group) VALUES (?, ?, ?, ?)`);
const settings = [
  ['site_name', 'Audi Motor', 'text', 'general'],
  ['site_tagline', 'Dealer Mobil Keluarga Terpercaya', 'text', 'general'],
  ['site_description', 'Spesialis mobil keluarga bekas berkualitas premium.', 'textarea', 'general'],
  ['whatsapp_number', '6281329400272', 'text', 'contact'],
  ['email', 'info@audimotor.com', 'text', 'contact'],
  ['address', 'Dsn. Bero 001/001, Ds. Caruban, Kec. Kandangan, Kabupaten Temanggung, Jawa Tengah 56281', 'textarea', 'contact'],
  ['facebook_url', '#', 'text', 'social'],
  ['instagram_url', '#', 'text', 'social'],
  ['meta_title', 'Audi Motor - Dealer Mobil Keluarga Terpercaya', 'text', 'seo'],
  ['meta_description', 'Dealer mobil bekas berkualitas premium untuk keluarga Anda.', 'textarea', 'seo'],
];
const insertSettings = db.transaction((items) => { for (const s of items) settingStmt.run(...s); });
insertSettings(settings);

db.prepare(`INSERT INTO hero_sections (title, subtitle, badge, button_primary_text, button_primary_link, button_secondary_text, button_secondary_link, background_image, background_video, is_active) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 1)`).run(
  'Masa Depan Keluarga Anda Dimulai di Sini.',
  'Kami menghadirkan koleksi mobil bekas premium, terawat, dan berkualitas tinggi khusus untuk kenyamanan dan keamanan perjalanan keluarga Anda.',
  'Dealer Mobil Keluarga Terpercaya',
  'Lihat Koleksi', '/#koleksi',
  'Konsultasi WA', 'https://wa.me/6281329400272',
  'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
  ''
);

const featureStmt = db.prepare(`INSERT INTO features (icon, title, description, sort_order, is_active) VALUES (?, ?, ?, ?, 1)`);
const featuresData = [
  ['fa-shield-alt', 'Inspeksi Ketat', 'Setiap unit melewati 150+ titik inspeksi standar dealer resmi. Menjamin keamanan dan performa maksimal.', 1],
  ['fa-file-contract', 'Dokumen Terjamin', 'Legalitas surat-surat kendaraan terverifikasi 100%. Bebas masalah hukum dan pajak terurus rapi.', 2],
  ['fa-hand-holding-usd', 'Harga Transparan', 'Tanpa biaya tersembunyi. Kami menyediakan opsi kredit dengan bunga kompetitif dan proses cepat.', 3],
];
const insertFeatures = db.transaction((items) => { for (const f of items) featureStmt.run(...f); });
insertFeatures(featuresData);

const contactStmt = db.prepare(`INSERT INTO contact_info (contact_type, contact_value, label, is_active, sort_order) VALUES (?, ?, ?, 1, ?)`);
const contacts = [
  ['address', 'Dsn. Bero 001/001, Ds. Caruban, Kec. Kandangan, Kabupaten Temanggung, Jawa Tengah 56281', 'Alamat Showroom', 1],
  ['whatsapp', '0813-2940-0272', 'WhatsApp', 2],
];
const insertContacts = db.transaction((items) => { for (const c of items) contactStmt.run(...c); });
insertContacts(contacts);

const socialStmt = db.prepare(`INSERT INTO social_links (platform, url, icon, is_active, sort_order) VALUES (?, ?, ?, 1, ?)`);
const socials = [
  ['instagram', 'https://www.instagram.com/audimotor_?igsh=YjV5dmM5NmU4a2Uy', 'fab fa-instagram', 1],
  ['facebook', 'https://www.facebook.com/share/1R4ZqEzk62/', 'fab fa-facebook-f', 2],
];
const insertSocials = db.transaction((items) => { for (const s of items) socialStmt.run(...s); });
insertSocials(socials);

const pageStmt = db.prepare(`INSERT INTO pages (slug, title, content, meta_description, is_active) VALUES (?, ?, ?, ?, 1)`);
const pages = [
  ['syarat-ketentuan', 'Syarat & Ketentuan', '<h2>Syarat dan Ketentuan</h2><p>Berlaku untuk semua transaksi di Audi Motor.</p>', 'Syarat dan ketentuan berlaku di Audi Motor', ],
  ['kebijakan-privasi', 'Kebijakan Privasi', '<h2>Kebijakan Privasi</h2><p>Kami menjaga privasi data pelanggan kami.</p>', 'Kebijakan privasi Audi Motor', ],
];
const insertPages = db.transaction((items) => { for (const p of items) pageStmt.run(...p); });
insertPages(pages);

const testStmt = db.prepare(`INSERT INTO testimonials (customer_name, rating, comment, car_purchased, is_active, sort_order) VALUES (?, ?, ?, ?, 1, ?)`);
const testimonials = [
  ['Budi Santoso', 5, 'Pelayanan sangat profesional! Mobil dalam kondisi prima sesuai deskripsi.', 'Toyota Alphard 2021', 1],
  ['Siti Rahayu', 5, 'Proses cepat dan mudah. Dokumen lengkap dan harga sangat transparan.', 'Honda CR-V 2022', 2],
  ['Ahmad Fauzi', 4, 'Mobil bekas tapi kondisi seperti baru. Sangat recommended!', 'Mitsubishi Xpander 2021', 3],
];
const insertTestimonials = db.transaction((items) => { for (const t of items) testStmt.run(...t); });
insertTestimonials(testimonials);

const crypto = require('crypto');

function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${hash}`;
}

const adminPasswordHash = hashPassword('admin123');
db.prepare(`INSERT INTO users (username, password_hash, full_name, role, is_active) VALUES (?, ?, ?, ?, 1)`).run(
  'admin', adminPasswordHash, 'Administrator', 'admin'
);

db.close();

console.log('Seed data berhasil ditambahkan!');
console.log(`${cars.length} mobil, ${settings.length} settings, ${featuresData.length} features, ${contacts.length} contacts, ${socials.length} social links, ${pages.length} pages, ${testimonials.length} testimonials, 1 admin user berhasil dimasukkan.`);
console.log('');
console.log('Login credentials:');
console.log('  Username: admin');
console.log('  Password: admin123');
