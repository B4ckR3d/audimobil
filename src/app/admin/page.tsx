'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import AdminSidebar from '@/components/AdminSidebar';
import PermissionGuard from '@/components/PermissionGuard';
import { Car } from '@/types';

interface Stats {
  total: number;
  available: number;
  sold: number;
  featured: number;
  totalValue: number;
}

export default function AdminPage() {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<Stats>({ total: 0, available: 0, sold: 0, featured: 0, totalValue: 0 });

  const fetchCars = async () => {
    try {
      const res = await fetch('/api/cars');
      const data = await res.json();
      setCars(data);

      const total = data.length;
      const available = data.filter((c: Car) => c.status === 'available').length;
      const sold = data.filter((c: Car) => c.status === 'sold').length;
      const featured = data.filter((c: Car) => c.is_featured).length;
      const totalValue = data.reduce((sum: number, c: Car) => sum + c.price, 0);

      setStats({ total, available, sold, featured, totalValue });
    } catch (err) {
      console.error('Gagal mengambil data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCars();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm('Yakin ingin menghapus mobil ini?')) return;
    try {
      const res = await fetch(`/api/admin/cars/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchCars();
      } else {
        alert('Gagal menghapus mobil');
      }
    } catch {
      alert('Gagal menghapus mobil');
    }
  };

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);

  return (
    <PermissionGuard section="cars" action="read">
    <div className="flex min-h-screen bg-[#0a0a0c]">
      <AdminSidebar />
      <main className="flex-1 p-8 overflow-auto">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-display font-bold text-white">Dashboard</h1>
              <p className="text-gray-400 text-sm mt-1">Kelola showroom Audi Motor</p>
            </div>
            <Link
              href="/admin/add"
              className="btn-chrome px-5 py-2.5 rounded-md font-semibold text-sm flex items-center gap-2"
            >
              <i className="fas fa-plus"></i> Tambah Mobil
            </Link>
          </div>

          {loading ? (
            <div className="text-center py-16">
              <i className="fas fa-spinner fa-spin text-3xl text-gray-500"></i>
              <p className="text-gray-400 mt-4">Memuat data...</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <div className="bg-[#151518] rounded-xl border border-gray-800 p-5">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-gray-400 text-sm">Total Mobil</span>
                    <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                      <i className="fas fa-car text-blue-400"></i>
                    </div>
                  </div>
                  <p className="text-3xl font-bold text-white">{stats.total}</p>
                  <p className="text-gray-500 text-xs mt-1">unit terdaftar</p>
                </div>

                <div className="bg-[#151518] rounded-xl border border-gray-800 p-5">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-gray-400 text-sm">Tersedia</span>
                    <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                      <i className="fas fa-check-circle text-green-400"></i>
                    </div>
                  </div>
                  <p className="text-3xl font-bold text-green-400">{stats.available}</p>
                  <p className="text-gray-500 text-xs mt-1">siap dijual</p>
                </div>

                <div className="bg-[#151518] rounded-xl border border-gray-800 p-5">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-gray-400 text-sm">Terjual</span>
                    <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center">
                      <i className="fas fa-hand-holding-usd text-red-400"></i>
                    </div>
                  </div>
                  <p className="text-3xl font-bold text-red-400">{stats.sold}</p>
                  <p className="text-gray-500 text-xs mt-1">unit terjual</p>
                </div>

                <div className="bg-[#151518] rounded-xl border border-gray-800 p-5">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-gray-400 text-sm">Total Nilai</span>
                    <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
                      <i className="fas fa-coins text-amber-400"></i>
                    </div>
                  </div>
                  <p className="text-xl font-bold text-white">{formatPrice(stats.totalValue)}</p>
                  <p className="text-gray-500 text-xs mt-1">nilai inventory</p>
                </div>
              </div>

              <div className="bg-[#151518] rounded-xl border border-gray-800 overflow-hidden">
                <div className="p-6 border-b border-gray-800">
                  <h2 className="text-lg font-bold text-white">Inventory Mobil</h2>
                </div>
                {cars.length === 0 ? (
                  <div className="text-center py-12">
                    <i className="fas fa-car-side text-4xl text-gray-600 mb-4"></i>
                    <p className="text-gray-400">Belum ada mobil. Tambahkan mobil pertama Anda!</p>
                    <Link href="/admin/add" className="btn-chrome inline-flex items-center gap-2 px-6 py-3 rounded-md font-semibold text-sm mt-4">
                      <i className="fas fa-plus"></i> Tambah Mobil
                    </Link>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-gray-800 text-gray-400">
                          <th className="text-left py-4 px-6 font-medium">Mobil</th>
                          <th className="text-left py-4 px-6 font-medium">Tahun</th>
                          <th className="text-left py-4 px-6 font-medium">Harga</th>
                          <th className="text-left py-4 px-6 font-medium">KM</th>
                          <th className="text-left py-4 px-6 font-medium">Status</th>
                          <th className="text-right py-4 px-6 font-medium">Aksi</th>
                        </tr>
                      </thead>
                      <tbody>
                        {cars.map((car) => (
                          <tr key={car.id} className="border-b border-gray-800 hover:bg-gray-900/50 transition-colors">
                            <td className="py-4 px-6">
                              <div className="flex items-center gap-3">
                                <img
                                  src={car.image_url || '/placeholder-car.jpg'}
                                  alt={car.name}
                                  className="w-12 h-12 rounded-lg object-cover"
                                />
                                <div>
                                  <p className="text-white font-medium">{car.brand} {car.name}</p>
                                  <p className="text-gray-500 text-xs">{car.model}</p>
                                </div>
                              </div>
                            </td>
                            <td className="py-4 px-6 text-gray-300">{car.year}</td>
                            <td className="py-4 px-6 text-white font-medium">{formatPrice(car.price)}</td>
                            <td className="py-4 px-6 text-gray-300">{car.mileage.toLocaleString('id-ID')}</td>
                            <td className="py-4 px-6">
                              <span className={`px-2 py-1 rounded text-xs font-medium ${
                                car.status === 'available' ? 'bg-green-900/50 text-green-400 border border-green-800' :
                                car.status === 'sold' ? 'bg-red-900/50 text-red-400 border border-red-800' :
                                'bg-yellow-900/50 text-yellow-400 border border-yellow-800'
                              }`}>
                                {car.status === 'available' ? 'Tersedia' : car.status === 'sold' ? 'Terjual' : 'Featured'}
                              </span>
                            </td>
                            <td className="py-4 px-6 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <Link
                                  href={`/admin/edit/${car.id}`}
                                  className="px-3 py-1.5 rounded border border-gray-700 text-gray-300 hover:text-white hover:border-gray-500 transition-colors text-xs"
                                >
                                  Edit
                                </Link>
                                <button
                                  onClick={() => handleDelete(car.id)}
                                  className="px-3 py-1.5 rounded border border-red-900 text-red-400 hover:bg-red-900/30 transition-colors text-xs"
                                >
                                  Hapus
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </main>
    </div>
    </PermissionGuard>
  );
}
