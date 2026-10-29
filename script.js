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

// Setup format dd/mm/yyyy pada input tanggal lahir
const birthDateInput = document.getElementById("birth-date");
if (birthDateInput) {
  birthDateInput.addEventListener("input", function (e) {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 8) value = value.substring(0, 8);
    
    if (value.length >= 5) {
      e.target.value = value.substring(0, 2) + "/" + value.substring(2, 4) + "/" + value.substring(4);
    } else if (value.length >= 3) {
      e.target.value = value.substring(0, 2) + "/" + value.substring(2);
    } else {
      e.target.value = value;
    }
  });
}

// UBAH TANGGAL SISA WAKTU DI SINI (Format: "Bulan Tanggal, Tahun Jam:Menit:Detik")
const targetDate = new Date("June 08, 2026 10:00:00").getTime();

// JANGAN ADA YANG DIUBAH DISINI
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
const posXRange = document.getElementById("posX-range");
const posYRange = document.getElementById("posY-range");
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

function compressImage(file, maxWidth, maxHeight, quality, callback) {
  const reader = new FileReader();
  reader.onload = function (e) {
    const img = new Image();
    img.onload = function () {
      const canvas = document.createElement("canvas");
      let width = img.width;
      let height = img.height;

      if (width > height) {
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width = Math.round((width * maxHeight) / height);
          height = maxHeight;
        }
      }

      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, width, height);

      const compressedDataUrl = canvas.toDataURL("image/jpeg", quality);
      callback(compressedDataUrl);
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
}

if (twibbonFileInput) {
  twibbonFileInput.addEventListener("change", function (e) {
    const file = e.target.files[0];
    if (file) {
      compressImage(file, 1000, 1000, 0.82, function (compressedBase64) {
        userImgSrc = compressedBase64;
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
        if (posXRange) posXRange.value = 0;
        if (posYRange) posYRange.value = 0;

        applyImgTransform();
      });
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
    if (posXRange) posXRange.value = imgPosX;
    if (posYRange) posYRange.value = imgPosY;
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
    if (posXRange) posXRange.value = imgPosX;
    if (posYRange) posYRange.value = imgPosY;
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

if (posXRange) {
  posXRange.addEventListener("input", function () {
    imgPosX = parseInt(this.value);
    applyImgTransform();
  });
}

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
    if (posXRange) posXRange.value = 0;
    if (posYRange) posYRange.value = 0;
    applyImgTransform();
  });
}

/* Save / Download Twibbon Fix */
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
    frameImg.src = "img/frame.png";

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

        const imgAspect = userImg.naturalWidth / userImg.naturalHeight;
        let drawWidth, drawHeight;

        if (imgAspect > (320 / 400)) {
          drawWidth = 320 * scaleFactorX;
          drawHeight = (320 / imgAspect) * scaleFactorY;
        } else {
          drawHeight = 400 * scaleFactorY;
          drawWidth = (400 * imgAspect) * scaleFactorX;
        }

        ctx.drawImage(
          userImg,
          -drawWidth / 2,
          -drawHeight / 2,
          drawWidth,
          drawHeight
        );

        ctx.restore();

        ctx.drawImage(frameImg, 0, 0, canvasWidth, canvasHeight);

        const link = document.createElement("a");
        link.download = "Twibbon-PKKMB-UPIL-2025.jpg";
        link.href = canvas.toDataURL("image/jpeg", 0.92);
        link.click();
      };
      userImg.onerror = () => {
        alert("Gagal memuat foto pengguna untuk dirender ke twibbon.");
      };
    };
    frameImg.onerror = () => {
      alert("Gagal memuat bingkai twibbon (img/frame.png). Pastikan file tersedia.");
    };
  });
}


const inputNama = document.getElementById("input-caption-nama");
const inputProdi = document.getElementById("input-caption-prodi");
const inputMotivasi = document.getElementById("input-caption-motivasi");
const captionTextarea = document.getElementById("caption-textarea");

function updateCaptionText() {
  const nama = inputNama && inputNama.value.trim() ? inputNama.value.trim() : "[Nama Lengkap Kamu]";
  const prodi = inputProdi && inputProdi.value.trim() ? inputProdi.value.trim() : "[Nama Prodi Kamu]";
  const motivasi = inputMotivasi && inputMotivasi.value.trim() ? inputMotivasi.value.trim() : "[Pesan atau harapan kamu]";

  captionTextarea.value = `[READY FOR PKKMB UPIL 2025]

Halo semuanya! Saya ${nama} dari Program Studi ${prodi} siap mengikuti PKKMB Universitas Peternakan Ikan Lele 2025!

"${motivasi}"

#PKKMBUPIL2025 #UniversitasPeternakanIkanLele`;
}

if (inputNama && inputProdi && inputMotivasi && captionTextarea) {
  inputNama.addEventListener("input", updateCaptionText);
  inputProdi.addEventListener("input", updateCaptionText);
  inputMotivasi.addEventListener("input", updateCaptionText);
  updateCaptionText();
}

const copyCaptionBtn = document.getElementById("copy-caption-btn");
const copyStatus = document.getElementById("copy-status");

if (copyCaptionBtn && captionTextarea) {
  copyCaptionBtn.addEventListener("click", () => {
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
      .catch(() => {
        try {
          captionTextarea.select();
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

let bookletSlideIndex = 0;

function moveBookletSlide(direction) {
  const images = document.querySelectorAll('.booklet-slide-img');
  const counter = document.getElementById('booklet-current-slide');

  if (!images.length || !counter) return;
  bookletSlideIndex = (bookletSlideIndex + direction + images.length) % images.length;
  images.forEach((img, index) => {
    if (index === bookletSlideIndex) {
      img.style.display = "block";
      img.classList.add("active");
    } else {
      img.style.display = "none";
      img.classList.remove("active");
    }
  });
  counter.textContent = bookletSlideIndex + 1;
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

  const btnPengumuman = document.getElementById("btn-tab-pengumuman");
  const btnPendaftaran = document.getElementById("btn-tab-pendaftaran");
  const navMenu = document.getElementById("nav-menu");

  if (tabPengumuman) tabPengumuman.classList.add("hidden");
  if (tabPendaftaran) tabPendaftaran.classList.add("hidden");

  if (btnPengumuman) btnPengumuman.classList.remove("active");
  if (btnPendaftaran) btnPendaftaran.classList.remove("active");

  if (tabName === "pengumuman") {
    if (tabPengumuman) tabPengumuman.classList.remove("hidden");
    if (btnPengumuman) btnPengumuman.classList.add("active");
  } else if (tabName === "pendaftaran") {
    if (tabPendaftaran) tabPendaftaran.classList.remove("hidden");
    if (btnPendaftaran) btnPendaftaran.classList.add("active");
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
  const rawDate = document.getElementById("birth-date").value.trim();
  const resultContainer = document.getElementById("result-container");

  if (!regNumber || !rawDate) {
    alert("Mohon masukkan NIM dan Tanggal Lahir Anda!");
    return;
  }

  let formattedDate = rawDate;
  if (rawDate.includes("/")) {
    const parts = rawDate.split("/");
    if (parts.length === 3) {
      formattedDate = `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
    }
  }

  resultContainer.classList.remove("hidden");
  resultContainer.innerHTML = `<div class="card" style="text-align: center; padding: 2rem;"><p>Sedang mengecek data ke database...</p></div>`;

  const logoUrl = "img/logo.png";
  const bgUrl = "img/background.jpg";

  const linkGrupWA = "https://chat.whatsapp.com/EXAMPLE";
  const kontakHelpdesk =
    "https://wa.me/6285811758818?text=Halo%20Kak%20Xyon,%20saya (nama kamu)%20dengan NIM (nim kamu)%20mengalami%20kendala%20mengenai%20(isi keluhan).";
  const kontakHelpdesk2 =
    "https://wa.me/6285865335055?text=Halo%20Kak%20Arya,%20saya (nama kamu)%20dengan NIM (nim kamu)%20mengalami%20kendala%20mengenai%20(isi keluhan).";

  const fetchUrl = `${apiUrl}?nim=${encodeURIComponent(regNumber)}&tanggal_lahir=${encodeURIComponent(formattedDate)}`;

  fetch(fetchUrl)
    .then((response) => response.json())
    .then((result) => {
      if (result.status !== "success" || !result.data) {
            const template = document.getElementById("templateError").content.cloneNode(true);
            
            template.querySelector(".js-logo").src = logoUrl;
            template.querySelector(".js-nim").textContent = regNumber;

            resultContainer.appendChild(template);
            resultContainer.scrollIntoView({ behavior: "smooth" });
            return;
        }

        const dataSiswa = result.data;
        const isLulus = parseInt(dataSiswa.lulus_engga) === 1;

        if (isLulus) {
            resultContainer.style.setProperty('--bg-url', `url('${bgUrl}')`);
            const template = document.getElementById("templateLulus").content.cloneNode(true);

            template.querySelector(".js-logo").src = logoUrl;
            template.querySelector(".js-nama").textContent = dataSiswa.nama_mahasiswa;
            template.querySelector(".js-nim").textContent = regNumber;
            template.querySelector(".js-wa-link").href = linkGrupWA;
            template.querySelector(".js-helpdesk-1").href = kontakHelpdesk;
            template.querySelector(".js-helpdesk-2").href = kontakHelpdesk2;

            resultContainer.appendChild(template);

            if (typeof confetti === "function") {
                confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
            }
        } 
        else {
            resultContainer.style.setProperty('--bg-url', `url('${bgUrl}')`);
            const template = document.getElementById("templateGagal").content.cloneNode(true);

            template.querySelector(".js-logo").src = logoUrl;
            template.querySelector(".js-nama").textContent = dataSiswa.nama_mahasiswa;
            template.querySelector(".js-nim").textContent = regNumber;

            resultContainer.appendChild(template);
        }
    resultContainer.scrollIntoView({ behavior: "smooth" });
    })
    .catch((error) => {
      console.error("Terjadi kesalahan koneksi:", error);
      alert("Gagal terhubung ke server database.");
    });
}
