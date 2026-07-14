'use client';

import { useEffect, useState } from 'react';
import AdminSidebar from '@/components/AdminSidebar';

interface Feature {
  id: number;
  icon: string;
  title: string;
  description: string;
  sort_order: number;
  is_active: boolean;
}

const iconOptions = [
  'fa-shield-alt', 'fa-file-contract', 'fa-hand-holding-usd', 'fa-car', 'fa-wrench',
  'fa-check-circle', 'fa-award', 'fa-headset', 'fa-tools', 'fa-certificate',
  'fa-star', 'fa-heart', 'fa-clock', 'fa-bolt', 'fa-gem',
];

export default function CmsFeaturesPage() {
  const [features, setFeatures] = useState<Feature[]>([]);
  const [editing, setEditing] = useState<Feature | null>(null);
  const [form, setForm] = useState({ icon: 'fa-shield-alt', title: '', description: '', sort_order: 0, is_active: true });
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchFeatures = async () => {
    try {
      const res = await fetch('/api/admin/features');
      const data = await res.json();
      setFeatures(data);
    } catch {
      console.error('Gagal mengambil data fitur');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchFeatures(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const method = editing ? 'PUT' : 'POST';
      const body = editing ? { ...form, id: editing.id } : form;
      await fetch('/api/admin/features', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      setForm({ icon: 'fa-shield-alt', title: '', description: '', sort_order: 0, is_active: true });
      setEditing(null);
      fetchFeatures();
    } catch {
      alert('Gagal menyimpan fitur');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Yakin ingin menghapus fitur ini?')) return;
    try {
      await fetch(`/api/admin/features?id=${id}`, { method: 'DELETE' });
      fetchFeatures();
    } catch {
      alert('Gagal menghapus fitur');
    }
  };

  const handleEdit = (feature: Feature) => {
    setEditing(feature);
    setForm({ icon: feature.icon, title: feature.title, description: feature.description, sort_order: feature.sort_order, is_active: feature.is_active });
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-[#0a0a0c]">
        <AdminSidebar />
        <main className="flex-1 flex items-center justify-center">
          <i className="fas fa-spinner fa-spin text-3xl text-gray-500"></i>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#0a0a0c]">
      <AdminSidebar />
      <main className="flex-1 p-8 overflow-auto">
        <div className="max-w-4xl">
          <h1 className="text-3xl font-display font-bold text-white mb-2">Kelola Fitur</h1>
          <p className="text-gray-400 text-sm mb-8">Tambah, edit, atau hapus fitur yang ditampilkan di homepage</p>

          <form onSubmit={handleSubmit} className="bg-[#151518] rounded-xl border border-gray-800 p-6 mb-8">
            <h2 className="text-lg font-bold text-white mb-4">{editing ? 'Edit Fitur' : 'Tambah Fitur Baru'}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-gray-400 text-sm mb-2">Icon</label>
                <select value={form.icon} onChange={(e) => setForm(prev => ({ ...prev, icon: e.target.value }))} className="w-full bg-[#0a0a0c] border border-gray-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-gray-500 transition-colors text-sm">
                  {iconOptions.map(icon => (
                    <option key={icon} value={icon}><i className={`fas ${icon}`}></i> {icon}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-gray-400 text-sm mb-2">Judul</label>
                <input type="text" required value={form.title} onChange={(e) => setForm(prev => ({ ...prev, title: e.target.value }))} className="w-full bg-[#0a0a0c] border border-gray-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-gray-500 transition-colors text-sm" placeholder="Judul fitur" />
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-gray-400 text-sm mb-2">Deskripsi</label>
              <textarea required value={form.description} onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))} rows={3} className="w-full bg-[#0a0a0c] border border-gray-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-gray-500 transition-colors text-sm" placeholder="Deskripsi fitur" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-gray-400 text-sm mb-2">Urutan</label>
                <input type="number" value={form.sort_order} onChange={(e) => setForm(prev => ({ ...prev, sort_order: Number(e.target.value) }))} className="w-full bg-[#0a0a0c] border border-gray-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-gray-500 transition-colors text-sm" />
              </div>
              <div className="flex items-end">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" checked={form.is_active} onChange={(e) => setForm(prev => ({ ...prev, is_active: e.target.checked }))} className="w-4 h-4 rounded border-gray-700 bg-[#0a0a0c]" />
                  <span className="text-gray-300 text-sm">Aktif</span>
                </label>
              </div>
            </div>
            <div className="flex gap-3">
              <button type="submit" disabled={saving} className="btn-chrome px-6 py-2.5 rounded-md font-semibold text-sm disabled:opacity-50">
                {saving ? <i className="fas fa-spinner fa-spin mr-2"></i> : null}
                {editing ? 'Update' : 'Tambah'} Fitur
              </button>
              {editing && (
                <button type="button" onClick={() => { setEditing(null); setForm({ icon: 'fa-shield-alt', title: '', description: '', sort_order: 0, is_active: true }); }} className="px-6 py-2.5 rounded-md border border-gray-700 text-gray-300 hover:text-white transition-colors text-sm">
                  Batal
                </button>
              )}
            </div>
          </form>

          <div className="space-y-4">
            {features.map(feature => (
              <div key={feature.id} className="bg-[#151518] rounded-xl border border-gray-800 p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center">
                    <i className={`fas ${feature.icon} text-gray-300`}></i>
                  </div>
                  <div>
                    <h3 className="text-white font-bold">{feature.title}</h3>
                    <p className="text-gray-400 text-sm">{feature.description}</p>
                    <p className="text-gray-600 text-xs mt-1">Urutan: {feature.sort_order} | {feature.is_active ? 'Aktif' : 'Nonaktif'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => handleEdit(feature)} className="px-3 py-1.5 rounded border border-gray-700 text-gray-300 hover:text-white hover:border-gray-500 transition-colors text-xs">Edit</button>
                  <button onClick={() => handleDelete(feature.id)} className="px-3 py-1.5 rounded border border-red-900 text-red-400 hover:bg-red-900/30 transition-colors text-xs">Hapus</button>
                </div>
              </div>
            ))}
            {features.length === 0 && (
              <div className="text-center py-12 bg-[#151518] rounded-xl border border-gray-800">
                <i className="fas fa-star text-4xl text-gray-600 mb-4"></i>
                <p className="text-gray-400">Belum ada fitur. Tambahkan fitur pertama Anda!</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
