'use client';

import { useState } from 'react';
import { Car } from '@/types';
import CarCard from './CarCard';

interface CarGridProps {
  cars: Car[];
}

const INITIAL_COUNT = 6;

export default function CarGrid({ cars }: CarGridProps) {
  const [showCount, setShowCount] = useState(INITIAL_COUNT);

  if (cars.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="w-20 h-20 mx-auto rounded-full border border-gray-800 bg-[#151518] flex items-center justify-center mb-6">
          <i className="fas fa-car-side text-3xl text-gray-600"></i>
        </div>
        <p className="text-gray-400 text-lg font-medium">Belum ada mobil tersedia saat ini.</p>
        <p className="text-gray-600 text-sm mt-2">Unit baru akan segera hadir.</p>
      </div>
    );
  }

  const visibleCars = cars.slice(0, showCount);
  const hasMore = showCount < cars.length;
  const remaining = cars.length - showCount;

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {visibleCars.map((car, index) => (
          <div
            key={car.id}
            className="animate-fade-in-up"
            style={{ animationDelay: `${(index % INITIAL_COUNT) * 80}ms` }}
          >
            <CarCard car={car} />
          </div>
        ))}
      </div>

      {hasMore && (
        <div className="flex justify-center mt-16">
          <button type="button"
            onClick={() => setShowCount((prev) => prev + INITIAL_COUNT)}
            className="group relative px-10 py-4 rounded-xl border border-gray-700 bg-[#151518] hover:border-gray-500 transition-all duration-300 text-sm font-semibold tracking-wide text-gray-300 hover:text-white flex items-center gap-3 overflow-hidden"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-gray-800/0 via-gray-800/50 to-gray-800/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></span>
            <span className="relative">Lihat Semua Koleksi</span>
            <span className="relative px-2.5 py-0.5 rounded-full bg-gray-800 text-xs text-gray-400 group-hover:text-white transition-colors">
              {remaining} lagi
            </span>
            <i className="fas fa-arrow-down relative text-xs group-hover:translate-y-0.5 transition-transform"></i>
          </button>
        </div>
      )}

      {!hasMore && cars.length > INITIAL_COUNT && (
        <div className="text-center mt-12">
          <p className="text-gray-600 text-sm">
            <i className="fas fa-check-circle mr-2 text-green-700"></i>
            Semua {cars.length} unit telah ditampilkan
          </p>
        </div>
      )}
    </div>
  );
}