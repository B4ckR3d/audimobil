'use client';

import { useEffect, useState } from 'react';
import { ContactInfo } from '@/types';

const MAP_EMBED = 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.0!2d106.8!3d-6.2!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNsKwMTInMDAuMCJTIDEwNsKwNDgnMDAuMCJF!5e0!3m2!1sen!2sid!4v1';

export default function ShowroomMapSection() {
  const [contacts, setContacts] = useState<ContactInfo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/public/contact')
      .then(r => r.json())
      .then(d => setContacts(d))
      .catch(() => setContacts([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return null;
  if (contacts.length === 0) return null;

  const address = contacts.find(c => c.contact_type === 'address');
  const phone = contacts.find(c => c.contact_type === 'phone');
  const email = contacts.find(c => c.contact_type === 'email');
  const mapUrl = contacts.find(c => c.contact_type === 'map')?.contact_value || MAP_EMBED;

  return (
    <section id="lokasi" className="py-24 bg-[#0a0a0c] relative overflow-hidden">
      {/* Hex overlay */}
      <div className="absolute inset-0 opacity-[0.02]" style={{
        backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M30 5 L55 17.5 L55 42.5 L30 55 L5 42.5 L5 17.5 Z\' fill=\'none\' stroke=\'white\' stroke-width=\'0.5\'/%3E%3C/svg%3E\")',
        backgroundSize: '60px 60px'
      }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <p className="text-[#c8a45c] text-sm tracking-[0.2em] uppercase font-semibold mb-4">Hubungi Kami</p>
          <h2 className="text-4xl md:text-5xl font-display font-bold text-white">
            Lokasi<span className="text-[#c8a45c]"> Showroom</span>
          </h2>
          <div className="w-16 h-0.5 bg-[#c8a45c] mx-auto mt-6"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Map */}
          <div className="lg:col-span-3 rounded-2xl overflow-hidden border border-gray-800 h-[400px] lg:h-[500px]">
            <iframe
              src={mapUrl}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Showroom Location"
            />
          </div>

          {/* Contact info cards */}
          <div className="lg:col-span-2 space-y-4">
            {address && (
              <div className="bg-[#151518] p-6 rounded-2xl border border-gray-800 hover:border-[#c8a45c]/30 transition-colors">
                <i className="fas fa-map-marker-alt text-[#c8a45c] text-2xl mb-3"></i>
                <h3 className="text-white font-bold font-display mb-1">{address.label || 'Alamat'}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{address.contact_value}</p>
              </div>
            )}
            {phone && (
              <a href={`tel:${phone.contact_value}`} className="block bg-[#151518] p-6 rounded-2xl border border-gray-800 hover:border-[#c8a45c]/30 transition-colors group">
                <i className="fas fa-phone-alt text-[#c8a45c] text-2xl mb-3"></i>
                <h3 className="text-white font-bold font-display mb-1">{phone.label || 'Telepon'}</h3>
                <p className="text-gray-400 text-sm group-hover:text-white transition-colors">{phone.contact_value}</p>
              </a>
            )}
            {email && (
              <a href={`mailto:${email.contact_value}`} className="block bg-[#151518] p-6 rounded-2xl border border-gray-800 hover:border-[#c8a45c]/30 transition-colors group">
                <i className="fas fa-envelope text-[#c8a45c] text-2xl mb-3"></i>
                <h3 className="text-white font-bold font-display mb-1">{email.label || 'Email'}</h3>
                <p className="text-gray-400 text-sm group-hover:text-white transition-colors">{email.contact_value}</p>
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
