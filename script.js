// ini fetch buat api php
const apiUrl = "http://localhost/Pengumuman-Kelulusan-UPIL/api.php";

fetch(apiUrl)
  .then((response) => response.json())
  .then((result) => {
    if (result.status === "success") {
      console.log("Data mahasiswa berhasil diambil:", result.data);

      result.data.forEach((mhs) => {
        console.log(
          `Nama: ${mhs.nama_mahasiswa}, Status Lulus: ${mhs.lulus_engga}`,
        );
      });
    } else {
      console.error("Gagal mengambil data:", result.message);
    }
  })
  .catch((error) => {
    console.error("Terjadi kesalahan koneksi:", error);
  });

//   ==================================================================================================

//UBAH DATA DI SINI
// const databaseKelulusan = {
//     "640141004": { lulus: true, nama: "Saikou Yutta" },
//     "640141005": { lulus: false, nama: "Belute" },
// };

//UBAH TANGGAL SISA WAKTU DI SINI (Format: "Bulan Tanggal, Tahun Jam:Menit:Detik")
const targetDate = new Date("June 08, 2026 10:00:00").getTime();

//JANGAN ADA YANG DIUBAH DISINI
const countdownInterval = setInterval(function () {
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
      statusText.innerHTML =
        '<i class="fas fa-unlock status-icon" style="color: #059669;"></i><strong> Pengumuman Telah Dibuka!</strong> Silakan masukkan Nomor Induk Mahasiswa Anda.';
    }
  } else {
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
    );
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    document.getElementById("days").innerText = String(days).padStart(2, "0");
    document.getElementById("hours").innerText = String(hours).padStart(2, "0");
    document.getElementById("minutes").innerText = String(minutes).padStart(
      2,
      "0",
    );
    document.getElementById("seconds").innerText = String(seconds).padStart(
      2,
      "0",
    );

    if (submitBtn) {
      submitBtn.setAttribute("disabled", "true");
    }
  }
}, 1000);

const twibbonFileInput = document.getElementById("twibbon-file-input");
const uploadedUserImg = document.getElementById("uploaded-user-image");
const twibbonPlaceholder = document.getElementById("twibbon-placeholder");
const controlsWrapper = document.getElementById("controls-wrapper");
const zoomRange = document.getElementById("zoom-range");
const rotateRange = document.getElementById("rotate-range");
const resetControlBtn = document.getElementById("reset-control-btn");
const downloadTwibbonBtn = document.getElementById("download-twibbon-btn");
const previewContainer = document.getElementById("twibbon-preview-container");

let userImgSrc = "";
let imgScale = 1;
let imgRotation = 0;
let imgPosX = 0;
let imgPosY = 0;
let isDraggingImg = false;
let startDragX = 0;
let startDragY = 0;

if (twibbonFileInput) {
  twibbonFileInput.addEventListener("change", function (e) {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (event) {
        userImgSrc = event.target.result;
        uploadedUserImg.src = userImgSrc;
        uploadedUserImg.style.display = "block";
        twibbonPlaceholder.style.display = "none";
        controlsWrapper.style.display = "flex";

        downloadTwibbonBtn.removeAttribute("disabled");
        downloadTwibbonBtn.style.opacity = "1";
        downloadTwibbonBtn.style.cursor = "pointer";

        imgScale = 1;
        imgRotation = 0;
        imgPosX = 0;
        imgPosY = 0;
        if (zoomRange) zoomRange.value = 1;
        if (rotateRange) rotateRange.value = 0;

        applyImgTransform();
      };
      reader.readAsDataURL(file);
    }
  });
}

function applyImgTransform() {
  if (uploadedUserImg) {
    uploadedUserImg.style.transform = `translate(${imgPosX}px, ${imgPosY}px) scale(${imgScale}) rotate(${imgRotation}deg)`;
  }
}

if (previewContainer && uploadedUserImg) {
  previewContainer.addEventListener("mousedown", (e) => {
    if (!userImgSrc) return;
    isDraggingImg = true;
    startDragX = e.clientX - imgPosX;
    startDragY = e.clientY - imgPosY;
    previewContainer.style.cursor = "grabbing";
  });

  window.addEventListener("mousemove", (e) => {
    if (!isDraggingImg) return;
    imgPosX = e.clientX - startDragX;
    imgPosY = e.clientY - startDragY;
    applyImgTransform();
  });

  window.addEventListener("mouseup", () => {
    isDraggingImg = false;
    if (previewContainer) previewContainer.style.cursor = "grab";
  });

  previewContainer.addEventListener("touchstart", (e) => {
    if (!userImgSrc) return;
    isDraggingImg = true;
    const touch = e.touches[0];
    startDragX = touch.clientX - imgPosX;
    startDragY = touch.clientY - imgPosY;
  });

  window.addEventListener("touchmove", (e) => {
    if (!isDraggingImg) return;
    const touch = e.touches[0];
    imgPosX = touch.clientX - startDragX;
    imgPosY = touch.clientY - startDragY;
    applyImgTransform();
  });

  window.addEventListener("touchend", () => {
    isDraggingImg = false;
  });
}

if (zoomRange) {
  zoomRange.addEventListener("input", function () {
    imgScale = parseFloat(this.value);
    applyImgTransform();
  });
}

if (rotateRange) {
  rotateRange.addEventListener("input", function () {
    imgRotation = parseInt(this.value);
    applyImgTransform();
  });
}

if (resetControlBtn) {
  resetControlBtn.addEventListener("click", () => {
    imgScale = 1;
    imgRotation = 0;
    imgPosX = 0;
    imgPosY = 0;
    if (zoomRange) zoomRange.value = 1;
    if (rotateRange) rotateRange.value = 0;
    applyImgTransform();
  });
}

const posYRange = document.getElementById("posY-range");

if (posYRange) {
  posYRange.addEventListener("input", function () {
    imgPosY = parseInt(this.value);
    applyImgTransform();
  });
}

if (resetControlBtn) {
  resetControlBtn.addEventListener("click", () => {
    imgScale = 1;
    imgRotation = 0;
    imgPosX = 0;
    imgPosY = 0;
    if (zoomRange) zoomRange.value = 1;
    if (rotateRange) rotateRange.value = 0;
    if (posYRange) posYRange.value = 0;
    applyImgTransform();
  });
}

if (downloadTwibbonBtn) {
  downloadTwibbonBtn.addEventListener("click", () => {
    if (!userImgSrc) return;

    const canvas = document.getElementById("twibbon-canvas");
    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    const canvasWidth = 1000;
    const canvasHeight = 1250;

    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    const frameImg = new Image();
    frameImg.crossOrigin = "anonymous";
    frameImg.src = "frame.png";

    frameImg.onload = () => {
      const userImg = new Image();
      userImg.crossOrigin = "anonymous";
      userImg.src = userImgSrc;

      userImg.onload = () => {
        ctx.save();

        const scaleFactorX = canvasWidth / 320;
        const scaleFactorY = canvasHeight / 400;
        const centerX = canvasWidth / 2 + imgPosX * scaleFactorX;
        const centerY = canvasHeight / 2 + imgPosY * scaleFactorY;
        ctx.translate(centerX, centerY);
        ctx.rotate((imgRotation * Math.PI) / 180);
        ctx.scale(imgScale, imgScale);
        const renderSize = 875;
        ctx.drawImage(
          userImg,
          -renderSize / 2,
          -renderSize / 2,
          renderSize,
          renderSize,
        );
        ctx.restore();
        ctx.drawImage(frameImg, 0, 0, canvasWidth, canvasHeight);

        const link = document.createElement("a");
        link.download = "Twibbon-PKKMB-UPIL-2025.jpg";
        link.href = canvas.toDataURL("image");
        link.click();
      };
    };
  });
}

const copyCaptionBtn = document.getElementById("copy-caption-btn");
const captionTextarea = document.getElementById("caption-textarea");
const copyStatus = document.getElementById("copy-status");

if (copyCaptionBtn && captionTextarea) {
  copyCaptionBtn.addEventListener("click", () => {
    captionTextarea.select();
    captionTextarea.setSelectionRange(0, 99999);
    navigator.clipboard
      .writeText(captionTextarea.value)
      .then(() => {
        if (copyStatus) {
          copyStatus.style.display = "block";
          setTimeout(() => {
            copyStatus.style.display = "none";
          }, 3000);
        }
      })
      .catch((err) => {
        try {
          document.execCommand("copy");
          if (copyStatus) {
            copyStatus.style.display = "block";
            setTimeout(() => {
              copyStatus.style.display = "none";
            }, 3000);
          }
        } catch (e) {
          alert("Gagal menyalin teks. Silakan salin secara manual.");
        }
      });
  });
}

const slideIndices = {
  bem: 0,
  asbem: 0,
  mahasiswa: 0,
};

function moveGroupSlide(groupName, direction) {
  const images = document.querySelectorAll(`.${groupName}-slide-img`);
  const counter = document.getElementById(`${groupName}-current-slide`);

  if (!images.length || !counter) return;
  slideIndices[groupName] =
    (slideIndices[groupName] + direction + images.length) % images.length;
  images.forEach((img, index) => {
    if (index === slideIndices[groupName]) {
      img.style.display = "block";
      img.classList.add("active");
    } else {
      img.style.display = "none";
      img.classList.remove("active");
    }
  });
  counter.textContent = slideIndices[groupName] + 1;
}

function takeScreenshot() {
  const targetElement = document.querySelector("#result-container .card");

  if (!targetElement) return;

  html2canvas(targetElement, {
    scale: 2,
    useCORS: true,
  }).then((canvas) => {
    const link = document.createElement("a");
    link.download = "Bukti-Kelulusan.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  });
}
function switchTab(tabName) {
  const tabPengumuman = document.getElementById("tab-pengumuman");
  const tabPendaftaran = document.getElementById("tab-pendaftaran");
  const tabKarakter = document.getElementById("tab-karakter");

  const btnPengumuman = document.getElementById("btn-tab-pengumuman");
  const btnPendaftaran = document.getElementById("btn-tab-pendaftaran");
  const btnKarakter = document.getElementById("btn-tab-karakter");
  const navMenu = document.getElementById("nav-menu");

  if (tabPengumuman) tabPengumuman.classList.add("hidden");
  if (tabPendaftaran) tabPendaftaran.classList.add("hidden");
  if (tabKarakter) tabKarakter.classList.add("hidden");

  if (btnPengumuman) btnPengumuman.classList.remove("active");
  if (btnPendaftaran) btnPendaftaran.classList.remove("active");
  if (btnKarakter) btnKarakter.classList.remove("active");

  if (tabName === "pengumuman") {
    if (tabPengumuman) tabPengumuman.classList.remove("hidden");
    if (btnPengumuman) btnPengumuman.classList.add("active");
  } else if (tabName === "pendaftaran") {
    if (tabPendaftaran) tabPendaftaran.classList.remove("hidden");
    if (btnPendaftaran) btnPendaftaran.classList.add("active");
  } else if (tabName === "karakter") {
    if (tabKarakter) tabKarakter.classList.remove("hidden");
    if (btnKarakter) btnKarakter.classList.add("active");
  }

  if (navMenu) {
    navMenu.classList.remove("show");
  }

  window.scrollTo({ top: 0, behavior: "smooth" });
}

function toggleMobileMenu() {
  const navMenu = document.getElementById("nav-menu");
  if (navMenu) {
    navMenu.classList.toggle("show");
  }
}

function handleFormSubmit(event) {
  event.preventDefault();

  const regNumber = document.getElementById("reg-number").value.trim();
  const tanggalLahir = document.getElementById("birth-date").value.trim(); //--
  const resultContainer = document.getElementById("result-container");

  if (!regNumber || !tanggalLahir) {
    alert("Mohon masukkan NIM dan Tanggal Lahir Anda!");
    return;
  }

  resultContainer.classList.remove("hidden");
  resultContainer.innerHTML = `<div class="card" style="text-align: center; padding: 2rem;"><p>Sedang mengecek data ke database...</p></div>`;

  const logoUrl = "img/logo.png";
  const bgUrl = "img/background.jpg";

  const linkGrupWA = "https://chat.whatsapp.com/EXAMPLE";
  const kontakHelpdesk =
    "https://wa.me/6285811758818?text=Halo%20Kak%20Xyon,%20saya(nama kamu)%20mengalami%20kendala%20mengenai%20(isi keluhan).";
  const kontakHelpdesk2 =
    "https://wa.me/6285865335055?text=Halo%20Kak%20Arya,%20saya(nama kamu)%20mengalami%20kendala%20mengenai%20(isi keluhan).";

  const fetchUrl = `${apiUrl}?nim=${encodeURIComponent(regNumber)}&tanggal_lahir=${encodeURIComponent(tanggalLahir)}`;

  fetch(fetchUrl)
    .then((response) => response.json())
    .then((result) => {
      // Jika NIM dan Tanggal Lahir tidak ditemukan di database
      if (result.status !== "success" || !result.data) {
        resultContainer.innerHTML = `
            <div class="card" style="text-align: center; border-top: 4px solid #f59e0b; padding: 1.5rem 1rem; border-radius: 1rem;">
                <div style="margin-bottom: 0.75rem;">
                    <img src="${logoUrl}" alt="Logo Universitas Peternakan Ikan Lele" style="width: 70px; height: auto;">
                </div>
                <span class="badge-pill" style="background-color: #fef3c7; color: #b45309; display: inline-block; padding: 0.25rem 0.75rem; border-radius: 9999px; font-weight: 600;">
                    DATA / PASSWORD SALAH
                </span>
                <h3 class="section-title" style="margin-top: 0.5rem; color: #1f2937; font-weight: 800;">
                    Hasil Seleksi Universitas Peternakan Ikan Lele
                </h3>
                <p style="font-size: 0.85rem; color: #4b5563; margin-bottom: 1.25rem;">
                    NIM <strong>${regNumber}</strong> atau Tanggal Lahir tidak cocok dengan sistem. Periksa kembali data Anda.
                </p>
                <button onclick="location.reload()" class="submit-button" style="width: auto; display: inline-flex; margin: 0 auto; background-color: #0f2c59; color: #ffffff; padding: 0.65rem 1.5rem; border-radius: 0.5rem; border: none; cursor: pointer;">
                    Coba Lagi
                </button>
            </div>
        `;
        resultContainer.scrollIntoView({ behavior: "smooth" });
        return;
      }

      const dataSiswa = result.data;
      const isLulus = parseInt(dataSiswa.lulus_engga) === 1; // 1 = Lulus, 0 = Tidak Lulus

      if (isLulus) {
        const qrUrl = "img/qr.png";
        resultContainer.innerHTML = `
            <div class="card" style="
                text-align: center; 
                border-top: 5px solid #10b981; 
                background: linear-gradient(rgba(255, 255, 255, 0.92), rgba(255, 255, 255, 0.92)), url('${bgUrl}'); 
                background-size: cover; 
                background-position: center; 
                border-radius: 1rem; 
                padding: 1.5rem 1rem; 
                box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
            ">
                <div style="margin-bottom: 0.75rem;">
                    <img src="${logoUrl}" alt="Logo Universitas" style="width: 75px; height: auto;">
                </div>

                <span class="badge-pill" style="background-color: #d1fae5; color: #065f46; font-weight: 700; padding: 0.4rem 0.85rem; border-radius: 9999px; font-size: 0.75rem;">
                    SELAMAT! ANDA DINYATAKAN LULUS
                </span>

                <h3 class="section-title" style="margin-top: 0.75rem; color: #1f2937; font-weight: 800;">
                    Hasil Seleksi Universitas Peternakan Ikan Lele
                </h3>
                
                <p style="font-size: 0.9rem; color: #374151; margin-bottom: 0.25rem;">Nama: <strong style="color: #111827;">${dataSiswa.nama_mahasiswa}</strong></p>
                <p style="font-size: 0.9rem; color: #374151; margin-bottom: 1.25rem;">Nomor Induk Mahasiswa: <strong style="color: #111827;">${regNumber}</strong></p>
                
                <div class="result-detail-box">
                    <div>
                        <p style="margin-bottom: 0.35rem; color: #1f2937;"><strong>Universitas:</strong> Universitas Peternakan Ikan Lele</p>
                        <p style="margin-bottom: 0.35rem; color: #1f2937;"><strong>Status:</strong> <span style="color: #059669; font-weight: bold;">Diterima Sebagai Mahasiswa Baru</span></p>
                        <p style="font-size: 0.725rem; color: #6b7280; margin: 0;">Scan QR Code untuk membuka sertifikat kelulusan.</p>
                    </div>
                    <div style="text-align: center; flex-shrink: 0; background: #ffffff; padding: 0.5rem; border-radius: 0.5rem; border: 1px solid #d1d5db; margin: 0 auto;">
                        <img src="${qrUrl}" alt="Sertifikat" style="width: 90px; height: 90px; display: block;">
                    </div>
                </div>

                <div class="result-actions-wrapper">
                    <button onclick="takeScreenshot()" class="action-btn-hp" style="background-color: #0f2c59; color: #ffffff;">
                        <i class="fas fa-camera" style="margin-right: 0.5rem;"></i> Screenshot
                    </button>
                    <a href="${linkGrupWA}" target="_blank" class="action-btn-hp" style="background-color: #25d366; color: #ffffff;">
                        <i class="fab fa-whatsapp" style="margin-right: 0.5rem; font-size: 1.1rem;"></i> Join Grup WhatsApp
                    </a>
                </div>

                <div style="background-color: #f0fdf4; border: 1px solid #bbf7d0; padding: 0.75rem; border-radius: 0.5rem; max-width: 32rem; margin: 0 auto; font-size: 0.775rem; color: #166534; text-align: center;">
                    <i class="fas fa-headset"></i> Kendala? Hubungi <a href="${kontakHelpdesk}" target="_blank" style="color: #15803d; font-weight: bold;">Helpdesk 1</a> atau <a href="${kontakHelpdesk2}" target="_blank" style="color: #15803d; font-weight: bold;">Helpdesk 2</a>
                </div>
            </div>
        `;

        if (typeof confetti === "function") {
          confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
        }
      } else {
        resultContainer.innerHTML = `
            <div class="card" style="background: linear-gradient(rgba(255, 255, 255, 0.92), rgba(255, 255, 255, 0.92)), url('${bgUrl}'); background-size: cover; background-position: center; border-radius: 1rem; padding: 1.5rem 1rem; box-shadow: 0 10px 25px -5px rgba(239, 68, 68, 0.3); text-align: center; border-top: 6px solid #ef4444;">
                <div style="margin-bottom: 0.75rem;">
                    <img src="${logoUrl}" alt="Logo" style="width: 75px; height: auto;">
                </div>
                <span class="badge-pill" style="background-color: #fee2e2; color: #dc2626; display: inline-block; padding: 0.35rem 1rem; border-radius: 9999px; font-weight: 800; font-size: 0.8rem;">
                     MOHON MAAF, ANDA BELUM LULUS
                </span>

                <h3 class="section-title" style="margin-top: 0.75rem; color: #1f2937; font-weight: 800;">
                    Hasil Seleksi Universitas Peternakan Ikan Lele
                </h3>
                <p style="font-size: 0.85rem; color: #4b5563; margin-bottom: 0.35rem;">Nama: <strong>${dataSiswa.nama_mahasiswa}</strong></p>
                <p style="font-size: 0.85rem; color: #4b5563; margin-bottom: 1.25rem;">Nomor Induk Mahasiswa: <strong>${regNumber}</strong></p>
                
                <div style="background-color: #fef2f2; padding: 0.85rem; border-radius: 0.75rem; text-align: center; max-width: 28rem; margin: 0 auto 1.25rem auto; font-size: 0.825rem; border: 1px solid #fecaca;">
                    <p style="color: #991b1b; margin: 0; font-weight: 500;">Tetap semangat dan jangan putus asa! Sampai Jumpa di Season Berikutnya.</p>
                </div>
                <button onclick="location.reload()" class="submit-button" style="width: auto; display: inline-flex; margin: 0 auto; background-color: #4b5563; color: #ffffff; padding: 0.65rem 1.5rem; border-radius: 0.5rem; border: none; cursor: pointer; font-weight: 600;">
                    Muat Ulang Halaman
                </button>
            </div>
        `;
      }
      resultContainer.scrollIntoView({ behavior: "smooth" });
    })
    .catch((error) => {
      console.error("Terjadi kesalahan koneksi:", error);
      alert("Gagal terhubung ke server database.");
    });
}
