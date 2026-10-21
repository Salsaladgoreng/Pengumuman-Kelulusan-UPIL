const databaseKelulusan = {
    "640141004": { lulus: true, nama: "Saikou Yutta" },
    "640141005": { lulus: false, nama: "belute" },
};

const targetDate = new Date("June 07, 2026 10:00:00").getTime();

const countdownInterval = setInterval(function() {
    const now = new Date().getTime();
    const distance = targetDate - now;

    const submitBtn = document.getElementById("submit-btn");
    const statusBanner = document.getElementById("countdown-status-banner");
    const statusText = document.getElementById("status-text");

    if (distance < 0) {
        clearInterval(countdownInterval);
        document.getElementById("days").innerText = "00";
        document.getElementById("hours").innerText = "00";
        document.getElementById("minutes").innerText = "00";
        document.getElementById("seconds").innerText = "00";

        if (submitBtn) {
            submitBtn.removeAttribute("disabled");
        }

        if (statusBanner && statusText) {
            statusBanner.style.backgroundColor = "#ecfdf5";
            statusBanner.style.borderColor = "#a7f3d0";
            statusBanner.style.color = "#065f46";
            statusText.innerHTML = '<i class="fas fa-unlock status-icon" style="color: #059669;"></i><strong>Pengumuman Telah Dibuka!</strong> Silakan masukkan Nomor Induk Mahasiswa Anda.';
        }
    } else {
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        document.getElementById("days").innerText = String(days).padStart(2, '0');
        document.getElementById("hours").innerText = String(hours).padStart(2, '0');
        document.getElementById("minutes").innerText = String(minutes).padStart(2, '0');
        document.getElementById("seconds").innerText = String(seconds).padStart(2, '0');

        if (submitBtn) {
            submitBtn.setAttribute("disabled", "true");
        }
    }
}, 1000);

function takeScreenshot() {
    const targetElement = document.querySelector("#result-container .card");
    
    if (!targetElement) return;

    html2canvas(targetElement, {
        scale: 2, 
        useCORS: true
    }).then(canvas => {
        const link = document.createElement('a');
        link.download = 'Bukti-Kelulusan.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
    });
}

function handleFormSubmit(event) {
    event.preventDefault();

    const regNumber = document.getElementById("reg-number").value.trim();
    const resultContainer = document.getElementById("result-container");

    resultContainer.classList.remove("hidden");
    const dataSiswa = databaseKelulusan[regNumber];

    if (!dataSiswa) {
        resultContainer.innerHTML = `
            <div class="card" style="text-align: center; border-top: 4px solid #f59e0b;">
                <div style="width: 4rem; height: 4rem; background-color: #fef3c7; color: #d97706; border-radius: 9999px; display: flex; align-items: center; justify-content: center; margin: 0 auto 1rem auto; font-size: 1.5rem;">
                    <i class="fas fa-exclamation-triangle"></i>
                </div>
                <span class="badge-pill" style="background-color: #fef3c7; color: #b45309;">DATA TIDAK DITEMUKAN / INVALID</span>
                <h3 class="section-title" style="margin-top: 0.75rem;">Nomor Tidak Terdaftar</h3>
                <p style="font-size: 0.875rem; color: #4b5563; margin-bottom: 1.5rem;">Nomor Induk Mahasiswa <strong>${regNumber}</strong> tidak ditemukan di sistem. Periksa kembali inputan Anda.</p>
                <button onclick="location.reload()" class="submit-button" style="width: auto; display: inline-flex; margin: 0 auto; background-color: #0f2c59; cursor: pointer;">
                    Coba Lagi
                </button>
            </div>
        `;
        resultContainer.scrollIntoView({ behavior: 'smooth' });
        return;
    }

    if (dataSiswa.lulus) {
        const qrUrl = "qr.png"; 

        resultContainer.innerHTML = `
            <div class="card" style="text-align: center; border-top: 4px solid #10b981;">
                <div style="width: 4rem; height: 4rem; background-color: #d1fae5; color: #059669; border-radius: 9999px; display: flex; align-items: center; justify-content: center; margin: 0 auto 1rem auto; font-size: 1.5rem;">
                    <i class="fas fa-check"></i>
                </div>
                <span class="badge-pill" style="background-color: #d1fae5; color: #065f46;">SELAMAT! ANDA DINYATAKAN LULUS</span>
                <h3 class="section-title" style="margin-top: 0.75rem;">Hasil Seleksi Masuk</h3>
                <p style="font-size: 0.875rem; color: #4b5563; margin-bottom: 0.5rem;">Nama: <strong>${dataSiswa.nama}</strong></p>
                <p style="font-size: 0.875rem; color: #4b5563; margin-bottom: 1.5rem;">Nomor Induk Mahasiswa: <strong>${regNumber}</strong></p>
                
                <!-- KOTAK INFORMASI + QR CODE LOKAL DI SAMPING -->
                <div style="background-color: #f9fafb; padding: 1.25rem; border-radius: 0.75rem; max-width: 32rem; margin: 0 auto 1.5rem auto; font-size: 0.875rem; border: 1px solid #e5e7eb; display: flex; align-items: center; justify-content: space-between; gap: 1rem; text-align: left;">
                    <div>
                        <p style="margin-bottom: 0.5rem;"><strong>Universitas:</strong> Universitas Peternakan Ikan Lele</p>
                        <p style="margin-bottom: 0.5rem;"><strong>Status:</strong> <span style="color: #059669; font-weight: bold;">Diterima Sebagai Mahasiswa Baru 2025</span></p>
                        <p style="font-size: 0.75rem; color: #6b7280; margin: 0;">Scan QR Code untuk membuka sertifikat kelulusan.</p>
                    </div>
                    
                    <!-- KOTAK GAMBAR QR CODE LOKAL -->
                    <div style="text-align: center; flex-shrink: 0; background: #ffffff; padding: 0.5rem; border-radius: 0.5rem; border: 1px solid #d1d5db;">
                        <img src="${qrUrl}" alt="Sertifikat Kelulusan" style="width: 100px; height: 100px; display: block;">
                    </div>
                </div>

                <button onclick="takeScreenshot()" class="submit-button" style="width: auto; display: inline-flex; margin: 0 auto; background-color: #0f2c59; cursor: pointer;">
                    <i class="fas fa-camera" style="margin-right: 0.5rem;"></i> Screenshot (PNG)
                </button>
            </div>
        `;

        if (typeof confetti === "function") {
            confetti({
                particleCount: 120,
                spread: 80,
                origin: { y: 0.6 }
            });
        }
    } else {
        resultContainer.innerHTML = `
            <div class="card" style="text-align: center; border-top: 4px solid #ef4444;">
                <div style="width: 4rem; height: 4rem; background-color: #fee2e2; color: #dc2626; border-radius: 9999px; display: flex; align-items: center; justify-content: center; margin: 0 auto 1rem auto; font-size: 1.5rem;">
                    <i class="fas fa-times"></i>
                </div>
                <span class="badge-pill" style="background-color: #fee2e2; color: #991b1b;">MOHON MAAF, ANDA BELUM LULUS</span>
                <h3 class="section-title" style="margin-top: 0.75rem;">Hasil Seleksi</h3>
                <p style="font-size: 0.875rem; color: #4b5563; margin-bottom: 0.5rem;">Nama: <strong>${dataSiswa.nama}</strong></p>

                <div style="background-color: #f9fafb; padding: 1rem; border-radius: 0.75rem; text-align: left; max-width: 28rem; margin: 0 auto 1.5rem auto; font-size: 0.875rem;">
                    <p style="color: #4b5563;">Tetap semangat dan jangan putus asa! Sampai Jumpa di Season Berikutnya.</p>
                </div>

                <button onclick="location.reload()" class="submit-button" style="width: auto; display: inline-flex; margin: 0 auto; background-color: #6b7280; cursor: pointer;">
                    Muat Ulang Halaman
                </button>
            </div>
        `;
    }

    resultContainer.scrollIntoView({ behavior: 'smooth' });
}