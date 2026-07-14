import Link from 'next/link';

export default function Footer() {
  return (
    <footer id="kontak" className="bg-[#050505] border-t border-gray-900 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full border border-gray-600 flex items-center justify-center bg-gray-900">
                <i className="fas fa-car-side text-gray-400"></i>
              </div>
              <span className="font-display font-bold text-xl text-chrome-effect uppercase">Audi Motor</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed max-w-sm mb-6">
              Spesialis mobil keluarga bekas berkualitas premium. Kami menjamin setiap unit yang Anda bawa pulang adalah yang terbaik untuk keluarga Anda.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 rounded bg-gray-900 border border-gray-800 flex items-center justify-center text-gray-400 hover:text-white hover:border-gray-500 transition-all">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="#" className="w-10 h-10 rounded bg-gray-900 border border-gray-800 flex items-center justify-center text-gray-400 hover:text-white hover:border-gray-500 transition-all">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="#" className="w-10 h-10 rounded bg-gray-900 border border-gray-800 flex items-center justify-center text-gray-400 hover:text-white hover:border-gray-500 transition-all">
                <i className="fab fa-youtube"></i>
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6 font-display">Tautan Cepat</h4>
            <ul className="space-y-3">
              <li><Link href="/#koleksi" className="text-gray-400 hover:text-white text-sm transition-colors">Koleksi Mobil</Link></li>
              <li><Link href="/admin" className="text-gray-400 hover:text-white text-sm transition-colors">Simulasi Kredit</Link></li>
              <li><span className="text-gray-400 text-sm transition-colors">Titip Jual</span></li>
              <li><Link href="/#tentang" className="text-gray-400 hover:text-white text-sm transition-colors">Tentang Kami</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6 font-display">Kontak Showroom</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <i className="fas fa-map-marker-alt text-gray-500 mt-1"></i>
                <span className="text-gray-400 text-sm">
                  Jl. Jendral Sudirman No. 123,<br />Jakarta Selatan, 12345
                </span>
              </li>
              <li className="flex items-center gap-3">
                <i className="fas fa-phone-alt text-gray-500"></i>
                <span className="text-gray-400 text-sm">021 - 555 - 0123</span>
              </li>
              <li className="flex items-center gap-3">
                <i className="fab fa-whatsapp text-gray-500"></i>
                <span className="text-gray-400 text-sm">0812 - 3456 - 7890</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-900 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-600 text-xs text-center md:text-left mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} Audi Motor. Hak Cipta Dilindungi. <br className="md:hidden" />
            Bukan bagian dari Audi AG.
          </p>
          <div className="text-gray-600 text-xs flex gap-4">
            <a href="#" className="hover:text-gray-400">Syarat & Ketentuan</a>
            <a href="#" className="hover:text-gray-400">Kebijakan Privasi</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
