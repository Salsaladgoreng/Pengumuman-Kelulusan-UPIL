import React, { useState, useRef } from 'react';
import { Download, Upload, RefreshCw } from 'lucide-react';

export default function TwibbonGenerator() {
  const [userImage, setUserImage] = useState(null);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  
  const fileInputRef = useRef(null);
  const canvasRef = useRef(null);

  // Pastikan file frame.png sudah ada di dalam folder public/ proyek Anda
  const frameSrc = '/frame.png'; 

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setUserImage(event.target.result);
        setScale(1);
        setPosition({ x: 0, y: 0 });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 1000;
    canvas.height = 1000;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const frameImg = new Image();
    frameImg.crossOrigin = 'anonymous';
    frameImg.src = frameSrc;
    frameImg.onload = () => {
      if (userImage) {
        const userImg = new Image();
        userImg.crossOrigin = 'anonymous';
        userImg.src = userImage;
        userImg.onload = () => {
          ctx.save();
          ctx.translate(canvas.width / 2 + position.x, canvas.height / 2 + position.y);
          ctx.scale(scale, scale);
          const size = 800;
          ctx.drawImage(userImg, -size / 2, -size / 2, size, size);
          ctx.restore();

          ctx.drawImage(frameImg, 0, 0, canvas.width, canvas.height);

          const link = document.createElement('a');
          link.download = 'twibbon-hasil.png';
          link.href = canvas.toDataURL('image/png');
          link.click();
        };
      } else {
        ctx.drawImage(frameImg, 0, 0, canvas.width, canvas.height);
        const link = document.createElement('a');
        link.download = 'twibbon-hasil.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
      }
    };
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-2xl shadow-xl border border-gray-100">
      <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">Buat Twibbon Pendaftaran</h2>

      {/* Area Preview Twibbon */}
      <div 
        className="relative w-72 h-72 sm:w-80 sm:h-80 mx-auto bg-gray-100 rounded-xl overflow-hidden border-2 border-dashed border-gray-300 cursor-move flex items-center justify-center shadow-inner"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {userImage ? (
          <img
            src={userImage}
            alt="User Upload"
            style={{
              transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
              transition: isDragging ? 'none' : 'transform 0.1s ease-out',
            }}
            className="absolute w-64 h-64 object-cover pointer-events-none select-none"
          />
        ) : (
          <div className="text-center p-4 text-gray-400">
            <Upload className="w-10 h-10 mx-auto mb-2 opacity-50" />
            <p className="text-sm">Belum ada foto yang diunggah</p>
          </div>
        )}

        {/* Bingkai Twibbon */}
        <img
          src={frameSrc}
          alt="Twibbon Frame"
          className="absolute inset-0 w-full h-full pointer-events-none z-10 object-contain"
          onError={(e) => {
            e.target.style.display = 'none';
          }}
        />
      </div>
      
      <p className="text-xs text-center text-gray-500 mt-2">💡 Tips: Anda bisa menggeser foto di dalam kotak preview.</p>

      {/* Kontrol Zoom / Skala Foto */}
      {userImage && (
        <div className="mt-4 flex items-center justify-center gap-4">
          <span className="text-sm font-medium text-gray-600">Zoom:</span>
          <input
            type="range"
            min="0.5"
            max="3"
            step="0.05"
            value={scale}
            onChange={(e) => setScale(parseFloat(e.target.value))}
            className="w-48 accent-blue-600 cursor-pointer"
          />
          <button
            onClick={() => { setScale(1); setPosition({ x: 0, y: 0 }); }}
            className="p-2 text-gray-500 hover:text-blue-600 rounded-full transition"
            title="Reset Posisi"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Tombol Aksi */}
      <div className="mt-6 flex flex-col sm:flex-row gap-3">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleImageUpload}
          accept="image/*"
          className="hidden"
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          className="flex-1 bg-gray-900 hover:bg-gray-800 text-white font-medium py-2.5 px-4 rounded-xl transition flex items-center justify-center gap-2 shadow-md cursor-pointer"
        >
          <Upload className="w-4 h-4" /> Pilih Foto
        </button>

        <button
          onClick={handleDownload}
          disabled={!userImage}
          className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white font-medium py-2.5 px-4 rounded-xl transition flex items-center justify-center gap-2 shadow-md cursor-pointer disabled:cursor-not-allowed"
        >
          <Download className="w-4 h-4" /> Unduh Twibbon
        </button>
      </div>

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}