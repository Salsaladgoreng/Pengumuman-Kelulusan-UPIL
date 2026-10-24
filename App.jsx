import React, { useState } from 'react';
import TwibbonGenerator from './components/TwibbonGenerator';

export default function App() {
  const [activeTab, setActiveTab] = useState('pengumuman');

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-between">
      {/* Header & Navigasi */}
      <header className="bg-[#0f2c59] text-white shadow-md">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="Logo" className="w-10 h-10 object-contain" />
            <div>
              <h1 className="font-bold text-lg">Universitas Peternakan Ikan Lele</h1>
              <p className="text-xs text-blue-200">Portal Resmi Pendaftaran & Pengumuman</p>
            </div>
          </div>

          <nav className="flex gap-2">
            <button 
              onClick={() => setActiveTab('pengumuman')}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${activeTab === 'pengumuman' ? 'bg-sky-400 text-slate-900' : 'bg-white/10 text-slate-200 hover:bg-white/20'}`}
            >
              Pengumuman
            </button>
            <button 
              onClick={() => setActiveTab('pendaftaran')}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${activeTab === 'pendaftaran' ? 'bg-sky-400 text-slate-900' : 'bg-white/10 text-slate-200 hover:bg-white/20'}`}
            >
              Pendaftaran (Twibbon)
            </button>
            <button 
              onClick={() => setActiveTab('karakter')}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${activeTab === 'karakter' ? 'bg-sky-400 text-slate-900' : 'bg-white/10 text-slate-200 hover:bg-white/20'}`}
            >
              Seputar Info
            </button>
          </nav>
        </div>
      </header>

      {/* Konten Utama Berdasarkan Tab */}
      <main className="max-w-4xl mx-auto px-4 py-10 w-full flex-grow">
        {activeTab === 'pengumuman' && (
          <div className="bg-white p-6 rounded-xl shadow">
            <h2 className="text-xl font-bold text-[#0f2c59] mb-4">Pengumuman Kelulusan</h2>
            <p className="text-gray-600">Fitur cek kelulusan ada di sini...</p>
          </div>
        )}

        {activeTab === 'pendaftaran' && (
          <div>
            {/* FUNGSI TWIBBON DITARUH DI SINI */}
            <TwibbonGenerator />
          </div>
        )}

        {activeTab === 'karakter' && (
          <div className="bg-white p-6 rounded-xl shadow">
            <h2 className="text-xl font-bold text-[#0f2c59] mb-4">Seputar Info & Karakter</h2>
            <p className="text-gray-600">Informasi seputar kampus dan karakter...</p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-[#0f2c59] text-white text-center py-4 text-xs">
        &copy; 2025 Universitas Peternakan Ikan Lele. All rights reserved.
      </footer>
    </div>
  );
}