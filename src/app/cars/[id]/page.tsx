import { notFound } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { getDb } from '@/lib/db';
import { Car } from '@/types';

async function getCar(id: string): Promise<Car | null> {
  try {
    const db = getDb();
    const row = db.prepare('SELECT * FROM cars WHERE id = ?').get(Number(id)) as Car | undefined;
    return row || null;
  } catch {
    return null;
  }
}

export default async function CarDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const car = await getCar(id);

  if (!car) {
    notFound();
  }

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);

  const fuelIcon = car.fuel.toLowerCase().includes('hybrid') ? 'fa-leaf' : 'fa-gas-pump';
  const fuelColor = car.fuel.toLowerCase().includes('hybrid') ? 'text-green-500' : 'text-gray-400';

  return (
    <>
      <Navbar />
      <main className="flex-1 pt-32 pb-20 bg-[#0a0a0c]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/#koleksi" className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors">
            <i className="fas fa-arrow-left"></i> Kembali ke Koleksi
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="relative h-96 lg:h-[500px] rounded-xl overflow-hidden border-glow">
              <img src={car.image_url} alt={car.name} className="w-full h-full object-cover" />
              <div className="absolute top-4 right-4 bg-black/70 backdrop-blur-md px-4 py-2 rounded text-sm font-bold text-white border border-gray-700">
                {car.is_featured ? 'Featured' : 'Tersedia'}
              </div>
            </div>

            <div>
              <h1 className="text-4xl font-display font-bold text-white mb-2">
                {car.brand} {car.name}
              </h1>
              <p className="text-gray-400 text-lg mb-6">{car.model} - {car.year}</p>

              <div className="text-3xl font-bold text-white mb-8">
                {formatPrice(car.price)}
                <p className="text-sm text-gray-500 font-normal mt-1">Harga Cash</p>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-8">
                {[
                  { label: 'Kilometer', value: `${car.mileage.toLocaleString('id-ID')} KM`, icon: 'fa-tachometer-alt' },
                  { label: 'Transmisi', value: car.transmission, icon: 'fa-cogs' },
                  { label: 'Bahan Bakar', value: car.fuel, icon: fuelIcon, color: fuelColor },
                  { label: 'Warna', value: car.color, icon: 'fa-palette' },
                ].map((item, i) => (
                  <div key={i} className="bg-[#151518] p-4 rounded-xl border border-gray-800">
                    <i className={`fas ${item.icon} ${item.color || 'text-gray-500'}`}></i>
                    <p className="text-xs text-gray-500 mb-1">{item.label}</p>
                    <p className="text-white font-semibold">{item.value}</p>
                  </div>
                ))}
              </div>

              {car.description && (
                <div className="mb-8">
                  <h3 className="text-white font-bold mb-3 font-display">Deskripsi</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{car.description}</p>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href={`https://wa.me/6281234567890?text=Halo%20Audi%20Motor,%20saya%20tertarik%20dengan%20${car.brand}%20${car.name}%20tahun%20${car.year}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-chrome px-8 py-4 rounded-md font-semibold text-center tracking-wide text-sm flex items-center justify-center gap-2"
                >
                  <i className="fab fa-whatsapp text-lg"></i> Tanya Via WhatsApp
                </a>
                <a href="tel:0215550123" className="px-8 py-4 rounded-md border border-gray-600 hover:border-gray-400 text-white font-semibold text-center tracking-wide text-sm transition-colors flex items-center justify-center gap-2">
                  <i className="fas fa-phone-alt"></i> Telepon Showroom
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
