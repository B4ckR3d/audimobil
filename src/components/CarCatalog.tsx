'use client';

import { useState } from 'react';
import { Car } from '@/types';
import CarGrid from './CarGrid';

interface CarCatalogProps {
  cars: Car[];
}

export default function CarCatalog({ cars }: CarCatalogProps) {
  const [selectedBrand, setSelectedBrand] = useState('Semua');
  const [searchQuery, setSearchQuery] = useState('');

  const brands = ['Semua', ...Array.from(new Set(cars.map((c) => c.brand)))].sort((a, b) => {
    if (a === 'Semua') return -1;
    if (b === 'Semua') return 1;
    return a.localeCompare(b);
  });

  const filteredCars = cars.filter((car) => {
    const matchBrand = selectedBrand === 'Semua' || car.brand === selectedBrand;
    const matchSearch =
      searchQuery === '' ||
      car.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      car.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      car.model.toLowerCase().includes(searchQuery.toLowerCase());
    return matchBrand && matchSearch;
  });

  return (
    <div>
      {/* Search + Brand Filter */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-10">
        {/* Search bar */}
        <div className="relative flex-1 w-full max-w-md">
          <i className="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 text-sm"></i>
          <input
            type="text"
            placeholder="Cari merek atau model..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 rounded-xl bg-[#151518] border border-gray-800 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-gray-500 transition-colors"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-white transition-colors"
            >
              <i className="fas fa-times text-xs"></i>
            </button>
          )}
        </div>

        {/* Brand pills */}
        <div className="flex flex-wrap gap-2">
          {brands.map((brand) => (
            <button
              key={brand}
              type="button"
              onClick={() => setSelectedBrand(brand)}
              className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wide transition-all duration-300 ${
                selectedBrand === brand
                  ? 'bg-white text-black'
                  : 'bg-[#151518] text-gray-400 border border-gray-800 hover:border-gray-600 hover:text-white'
              }`}
            >
              {brand}
            </button>
          ))}
        </div>
      </div>

      {/* Results count */}
      {filteredCars.length > 0 && (
        <p className="text-gray-600 text-sm mb-6">
          Menampilkan <span className="text-gray-400">{filteredCars.length}</span> unit
          {selectedBrand !== 'Semua' && (
            <span> dari <span className="text-gray-400">{selectedBrand}</span></span>
          )}
          {searchQuery && (
            <span> untuk &ldquo;<span className="text-gray-400">{searchQuery}</span>&rdquo;</span>
          )}
        </p>
      )}

      <CarGrid cars={filteredCars} />
    </div>
  );
}
