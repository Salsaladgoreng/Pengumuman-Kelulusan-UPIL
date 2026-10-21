//UBAH DATA DI SINI
const databaseKelulusan = {
    "640141004": { lulus: true, nama: "Saikou Yutta" },
    "640141005": { lulus: false, nama: "Belute" },
};

//UBAH TANGGAL SISA WAKTU DI SINI (Format: "Bulan Tanggal, Tahun Jam:Menit:Detik")
const targetDate = new Date("June 08, 2026 10:00:00").getTime();


//JANGAN ADA YANG DIUBAH DISINI
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

function switchTab(tabName) {
    const tabPengumuman = document.getElementById('tab-pengumuman');
    const tabKarakter = document.getElementById('tab-karakter');
    const btnPengumuman = document.getElementById('btn-tab-pengumuman');
    const btnKarakter = document.getElementById('btn-tab-karakter');

    if (tabName === 'pengumuman') {
        tabPengumuman.classList.remove('hidden');
        tabKarakter.classList.add('hidden');
        btnPengumuman.classList.add('active');
        btnKarakter.classList.remove('active');
    } else if (tabName === 'karakter') {
        tabKarakter.classList.remove('hidden');
        tabPengumuman.classList.add('hidden');
        btnKarakter.classList.add('active');
        btnPengumuman.classList.remove('active');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function handleFormSubmit(event) {
    event.preventDefault();

    const regNumber = document.getElementById("reg-number").value.trim();
    const resultContainer = document.getElementById("result-container");

    resultContainer.classList.remove("hidden");
    const dataSiswa = databaseKelulusan[regNumber];

    const logoUrl = "logo.png"; 
    const bgUrl = "background.jpg"; 

    // Ganti tautan di bawah ini dengan link grup WA dan nomor WhatsApp helpdesk Anda
    const linkGrupWA = "https://chat.whatsapp.com/GrupMahasiswaBaru2025"; 
    const kontakHelpdesk = "https://wa.me/6281234567890?text=Halo%20Admin,%20saya%20mengalami%20kendala%20mengenai%20kelulusan.";

    if (!dataSiswa) {
        resultContainer.innerHTML = `
            <div class="card" style="text-align: center; border-top: 4px solid #f59e0b; padding: 2rem 1.5rem; border-radius: 1rem;">
                <div style="margin-bottom: 1rem;">
                    <img src="${logoUrl}" alt="Logo Universitas Peternakan Ikan Lele" style="
                        width: 80px; 
                        height: auto; 
                        filter: drop-shadow(0px 4px 6px rgba(0,0,0,0.15));
                    ">
                </div>

                <div style="width: 3.5rem; height: 3.5rem; background-color: #fef3c7; color: #d97706; border-radius: 9999px; display: flex; align-items: center; justify-content: center; margin: 0 auto 1rem auto; font-size: 1.25rem;">
                    <i class="fas fa-exclamation-triangle"></i>
                </div>

                <span class="badge-pill" style="background-color: #fef3c7; color: #b45309; display: inline-block; padding: 0.25rem 0.75rem; border-radius: 9999px; font-weight: 600;">
                    DATA TIDAK DITEMUKAN
                </span>

                <h3 class="section-title" style="margin-top: 0.75rem; color: #1f2937; font-weight: 800;">
                    Hasil Seleksi Universitas Peternakan Ikan Lele
                </h3>

                <p style="font-size: 0.875rem; color: #4b5563; margin-bottom: 1.5rem;">
                    Nomor Induk Mahasiswa <strong>${regNumber}</strong> tidak ditemukan di sistem. Periksa kembali NIM Anda.
                </p>

                <button onclick="location.reload()" class="submit-button" style="width: auto; display: inline-flex; margin: 0 auto; background-color: #0f2c59; color: #ffffff; padding: 0.65rem 1.5rem; border-radius: 0.5rem; border: none; cursor: pointer;">
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
            <div class="card" style="
                text-align: center; 
                border-top: 5px solid #10b981; 
                background: linear-gradient(rgba(255, 255, 255, 0.92), rgba(255, 255, 255, 0.92)), url('${bgUrl}'); 
                background-size: cover; 
                background-position: center; 
                border-radius: 1rem; 
                padding: 2rem 1.5rem; 
                box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
            ">
                <div style="margin-bottom: 1rem;">
                    <img src="${logoUrl}" alt="Logo Universitas Peternakan Ikan Lele" style="
                        width: 90px; 
                        height: auto; 
                        filter: drop-shadow(0px 4px 6px rgba(0,0,0,0.2));
                    ">
                </div>

                <span class="badge-pill" style="
                    background-color: #d1fae5; 
                    color: #065f46; 
                    font-weight: 700; 
                    padding: 0.5rem 1rem; 
                    border-radius: 9999px; 
                    letter-spacing: 0.5px;
                    font-size: 0.85rem;
                ">SELAMAT! ANDA DINYATAKAN LULUS</span>

                <h3 class="section-title" style="margin-top: 1rem; color: #1f2937; font-weight: 800;">
                    Hasil Seleksi Universitas Peternakan Ikan Lele
                </h3>
                
                <p style="font-size: 0.95rem; color: #374151; margin-bottom: 0.35rem;">Nama: <strong style="color: #111827;">${dataSiswa.nama}</strong></p>
                <p style="font-size: 0.95rem; color: #374151; margin-bottom: 1.5rem;">Nomor Induk Mahasiswa: <strong style="color: #111827;">${regNumber}</strong></p>
                
                <!-- Box Detail & QR Code -->
                <div style="
                    background-color: rgba(255, 255, 255, 0.95); 
                    padding: 1.25rem; 
                    border-radius: 0.75rem; 
                    max-width: 32rem; 
                    margin: 0 auto 1.5rem auto; 
                    font-size: 0.875rem; 
                    border: 1px solid #e5e7eb; 
                    display: flex; 
                    align-items: center; 
                    justify-content: space-between; 
                    gap: 1rem; 
                    text-align: left;
                    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
                ">
                    <div>
                        <p style="margin-bottom: 0.5rem; color: #1f2937;"><strong>Universitas:</strong> Universitas Peternakan Ikan Lele</p>
                        <p style="margin-bottom: 0.5rem; color: #1f2937;"><strong>Status:</strong> <span style="color: #059669; font-weight: bold;">Diterima Sebagai Mahasiswa Baru 2025</span></p>
                        <p style="font-size: 0.75rem; color: #6b7280; margin: 0;">Scan QR Code untuk membuka sertifikat kelulusan.</p>
                    </div>
                    
                    <div style="text-align: center; flex-shrink: 0; background: #ffffff; padding: 0.5rem; border-radius: 0.5rem; border: 1px solid #d1d5db;">
                        <img src="${qrUrl}" alt="Sertifikat Kelulusan" style="width: 100px; height: 100px; display: block;">
                    </div>
                </div>

                <!-- Tombol Aksi (Screenshot & Join WA berdampingan di bawah box QR) -->
                <div style="display: flex; flex-wrap: wrap; justify-content: center; gap: 0.75rem; margin-bottom: 1.25rem;">
                    <button onclick="takeScreenshot()" class="submit-button" style="
                        width: auto; 
                        display: inline-flex; 
                        align-items: center;
                        background-color: #0f2c59; 
                        color: #ffffff;
                        padding: 0.65rem 1.5rem;
                        border-radius: 0.5rem;
                        font-weight: 600;
                        cursor: pointer;
                        border: none;
                        transition: background-color 0.2s;
                    ">
                        <i class="fas fa-camera" style="margin-right: 0.5rem;"></i> Screenshot
                    </button>

                    <a href="${linkGrupWA}" target="_blank" style="
                        display: inline-flex; 
                        align-items: center;
                        background-color: #25d366; 
                        color: #ffffff;
                        padding: 0.65rem 1.5rem;
                        border-radius: 0.5rem;
                        font-weight: 600;
                        text-decoration: none;
                        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
                        transition: background-color 0.2s;
                    ">
                        <i class="fab fa-whatsapp" style="margin-right: 0.5rem; font-size: 1.1rem;"></i> Join Grup WhatsApp
                    </a>
                </div>

                <!-- Pemberitahuan Kontak Kendala (Tepat di bawah tombol screenshot & WA) -->
                <div style="
                    background-color: #f0fdf4; 
                    border: 1px solid #bbf7d0; 
                    padding: 0.85rem 1rem; 
                    border-radius: 0.5rem; 
                    max-width: 32rem; 
                    margin: 0 auto; 
                    font-size: 0.8rem; 
                    color: #166534;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 0.5rem;
                ">
                    <i class="fas fa-headset" style="font-size: 1rem; color: #15803d;"></i>
                    <span>Ada kendala atau pertanyaan? Hubungi <a href="${kontakHelpdesk}" target="_blank" style="color: #15803d; font-weight: bold; text-decoration: underline;">Helpdesk WhatsApp Admin</a></span>
                </div>
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
            <div class="card" style="
                background: linear-gradient(rgba(255, 255, 255, 0.92), rgba(255, 255, 255, 0.92)), url('${bgUrl}'); 
                background-size: cover; 
                background-position: center; 
                border-radius: 1rem; 
                padding: 2rem 1.5rem; 
                box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1); 
                text-align: center; 
                border-top: 5px solid #ef4444;
            ">
                <div style="margin-bottom: 1rem;">
                    <img src="${logoUrl}" alt="Logo Universitas Peternakan Ikan Lele" style="
                        width: 90px; 
                        height: auto; 
                        filter: drop-shadow(0px 4px 6px rgba(0,0,0,0.2));
                    ">
                </div>

                <span class="badge-pill" style="background-color: #fee2e2; color: #991b1b; display: inline-block; padding: 0.25rem 0.75rem; border-radius: 9999px; font-weight: 600; font-size: 0.85rem;">
                    MOHON MAAF, ANDA BELUM LULUS
                </span>
                
                <h3 class="section-title" style="margin-top: 0.75rem; color: #1f2937; font-weight: 800;">
                    Hasil Seleksi Universitas Peternakan Ikan Lele
                </h3>
                
                <p style="font-size: 0.875rem; color: #4b5563; margin-bottom: 0.5rem;">
                    Nama: <strong>${dataSiswa.nama}</strong>
                </p>
                <p style="font-size: 0.875rem; color: #4b5563; margin-bottom: 1.5rem;">
                    Nomor Induk Mahasiswa: <strong>${regNumber}</strong>
                </p>

                <div style="background-color: #f9fafb; padding: 1rem; border-radius: 0.75rem; text-align: left; max-width: 28rem; margin: 0 auto 1.5rem auto; font-size: 0.875rem; border: 1px solid #e5e7eb;">
                    <p style="color: #4b5563; margin: 0;">Tetap semangat dan jangan putus asa! Sampai Jumpa di Season Berikutnya.</p>
                </div>

                <button onclick="location.reload()" class="submit-button" style="width: auto; display: inline-flex; margin: 0 auto; background-color: #6b7280; color: #ffffff; padding: 0.65rem 1.5rem; border-radius: 0.5rem; border: none; cursor: pointer;">
                    Muat Ulang Halaman
                </button>
            </div>
        `;
    }

    resultContainer.scrollIntoView({ behavior: 'smooth' });
}
