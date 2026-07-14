export default function Features() {
  const features = [
    {
      icon: 'fa-shield-alt',
      title: 'Inspeksi Ketat',
      desc: 'Setiap unit melewati 150+ titik inspeksi standar dealer resmi. Menjamin keamanan dan performa maksimal.',
    },
    {
      icon: 'fa-file-contract',
      title: 'Dokumen Terjamin',
      desc: 'Legalitas surat-surat kendaraan terverifikasi 100%. Bebas masalah hukum dan pajak terurus rapi.',
    },
    {
      icon: 'fa-hand-holding-usd',
      title: 'Harga Transparan',
      desc: 'Tanpa biaya tersembunyi. Kami menyediakan opsi kredit dengan bunga kompetitif dan proses cepat.',
    },
  ];

  return (
    <section id="tentang" className="py-20 bg-[#050505] border-t border-b border-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">
            Standar <span className="text-gray-400">Premium</span> Kami
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-gray-700 to-gray-400 mx-auto rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((f, i) => (
            <div
              key={i}
              className="border-glow bg-[#0a0a0c] p-8 rounded-xl text-center group"
            >
              <div className="w-16 h-16 mx-auto bg-gray-800 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <i className={`fas ${f.icon} text-2xl text-gray-300 group-hover:text-white transition-colors`}></i>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{f.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
