'use client';

import ScrollReveal from './ScrollReveal';

export default function CatalogHeader() {
  return (
    <ScrollReveal animation="animate-fade-in-up" className="flex flex-col md:flex-row justify-between items-end mb-16">
      <div>
        <h2 className="text-3xl md:text-4xl font-display font-bold text-[var(--text-1)] mb-4">
          Unit <span className="text-chrome-shimmer">Keluarga Pilihan</span>
        </h2>
        <div className="w-16 h-px bg-gradient-to-r from-transparent via-[var(--text-5)] to-transparent mb-4"></div>
        <p className="text-[var(--text-3)] max-w-2xl text-sm md:text-base">
          Temukan mobil yang sempurna untuk menemani setiap momen berharga keluarga Anda.
        </p>
      </div>
    </ScrollReveal>
  );
}
