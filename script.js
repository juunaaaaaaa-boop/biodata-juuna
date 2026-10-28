
const $ = (selector, root = document) =>
  root.querySelector(selector);

const $$ = (selector, root = document) =>
  [...root.querySelectorAll(selector)];

$("#year").textContent = new Date().getFullYear();

// ANIMASI SAAT SCROLL

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  $$(".reveal").forEach(el => observer.observe(el));
} else {
  $$(".reveal").forEach(el => el.classList.add("visible"));
}

// MENU HP

const menu = $("#mobileMenu");

$("#menuButton").addEventListener("click", () => {
  const opened = menu.classList.toggle("open");
  $("#menuButton").textContent = opened ? "×" : "☰";
});

$$("#mobileMenu a").forEach(link => {
  link.addEventListener("click", () => {
    menu.classList.remove("open");
    $("#menuButton").textContent = "☰";
  });
});

// POPUP HOBI

const hobbyData = {
  editing: {
    icon: "◈",
    title: "Video Editing",
    text: "Aku suka menyusun potongan video, memilih beat, mencoba transisi, dan mengatur warna supaya setiap edit punya suasana yang kuat. Setiap proyek menjadi latihan untuk meningkatkan kreativitas."
  },
  drawing: {
    icon: "✎",
    title: "Menggambar",
    text: "Menggambar menjadi cara untuk mengubah ide di kepala menjadi sesuatu yang bisa dilihat. Tidak harus langsung sempurna. Yang penting berani mencoba dan menikmati prosesnya."
  },
  music: {
    icon: "♫",
    title: "Musik",
    text: "Musik bisa mengubah suasana dalam beberapa detik. Aku tertarik mengeksplorasi ritme, membuat remix, dan belajar menyusun suara menjadi komposisi sendiri."
  },
  coding: {
    icon: "⌘",
    title: "Coding",
    text: "Aku suka melihat bagaimana ide bisa berubah menjadi website atau aplikasi yang bisa digunakan. Coding terasa seperti menyusun puzzle, satu bagian demi satu bagian."
  },
  anime: {
    icon: "✧",
    title: "Anime & Manga",
    text: "Cerita fantasi, karakter yang berkembang, dunia unik, dan visual yang berkesan adalah hal yang membuat anime dan manga menarik untuk diikuti."
  },
  lainnya: {
    icon: "＋",
    title: "Hal lainnya",
    text: "Masih banyak hal yang ingin kucoba. Setiap pengalaman baru bisa menjadi kesempatan untuk menemukan minat dan kemampuan yang sebelumnya belum diketahui."
  }
};

const modal = $("#hobbyModal");

function openModal(data, index) {
  $("#modalLabel").textContent = "HOBBY / " + index;
  $("#modalIcon").textContent = data.icon;
  $("#modalTitle").textContent = data.title;
  $("#modalDescription").textContent = data.text;

  modal.classList.add("open");
}

function closeModal() {
  modal.classList.remove("open");
}

$$("[data-hobby]").forEach(button => {
  button.addEventListener("click", () => {
    const key = button.dataset.hobby;
    const index = $$(".hobby-card").indexOf(button) + 1;
    openModal(hobbyData[key], String(index).padStart(2, "0"));
  });
});

$("#closeModal").addEventListener("click", closeModal);
$("#modalDone").addEventListener("click", closeModal);

modal.addEventListener("click", event => {
  if (event.target === modal) closeModal();
});

document.addEventListener("keydown", event => {
  if (event.key === "Escape") closeModal();
});

// PILIHAN MAKANAN FAVORIT

const foods = {
  mie: {
    title: "Mie ayam",
    description: "Makanan sederhana yang cocok dinikmati kapan saja. Rasa gurih dan suasana santai membuatnya terasa istimewa.",
    symbol: "✳"
  },
  nasigoreng: {
    title: "Nasi goreng",
    description: "Menu sederhana yang fleksibel dan punya banyak variasi. Cocok untuk makan santai tanpa banyak alasan.",
    symbol: "✦"
  },
  bakso: {
    title: "Bakso",
    description: "Kuah hangat, tekstur kenyal, dan pilihan pelengkap yang beragam. Cocok dinikmati saat ingin makanan yang menghangatkan.",
    symbol: "◉"
  },
  geprek: {
    title: "Ayam geprek",
    description: "Ayam dengan sambal yang tingkat pedasnya bisa disesuaikan. Sederhana, berbumbu, dan cocok untuk pencinta rasa pedas.",
    symbol: "✺"
  }
};

$$("[data-food]").forEach(button => {
  button.addEventListener("click", () => {
    $$(".favorite-item").forEach(item => {
      item.classList.toggle("active", item === button);
    });

    const data = foods[button.dataset.food];
    const index = Object.keys(foods).indexOf(button.dataset.food) + 1;

    $("#foodTitle").textContent = data.title;
    $("#foodDescription").textContent = data.description;
    $("#foodSymbol").textContent = data.symbol;
    $("#foodLabel").textContent =
      "COMFORT FOOD / " + String(index).padStart(2, "0");

    $("#foodNumber").textContent =
      String(index).padStart(2, "0") + " / 04";
  });
});

// MINI GAME BOLA

const stage = $("#orbStage");
const orb = $("#gameOrb");
const coords = $("#stageCoords");

let pos = { x: 0.5, y: 0.5 };
let dragging = false;
let last = { x: 0, y: 0, time: 0 };
let velocity = { x: 0, y: 0 };
let animationFrame = 0;

function placeOrb(x, y) {
  const width = stage.clientWidth;
  const height = stage.clientHeight;
  const padding = 30;

  x = Math.max(padding, Math.min(width - padding, x));
  y = Math.max(padding, Math.min(height - padding, y));

  pos.x = x / width;
  pos.y = y / height;

  orb.style.left = `${pos.x * 100}%`;
  orb.style.top = `${pos.y * 100}%`;

  coords.textContent =
    `x: ${Math.round(pos.x * 100)} · y: ${Math.round(pos.y * 100)}`;
}

function getPointer(event) {
  const rect = stage.getBoundingClientRect();

  return {
    x: event.clientX - rect.left,
    y: event.clientY - rect.top
  };
}

orb.addEventListener("pointerdown", event => {
  dragging = true;
  velocity = { x: 0, y: 0 };

  cancelAnimationFrame(animationFrame);
  orb.setPointerCapture(event.pointerId);

  const point = getPointer(event);

  last = {
    x: point.x,
    y: point.y,
    time: performance.now()
  };

  event.preventDefault();
});

orb.addEventListener("pointermove", event => {
  if (!dragging) return;

  const point = getPointer(event);
  const now = performance.now();
  const elapsed = Math.max(1, now - last.time);

  velocity.x = (point.x - last.x) / elapsed * 14;
  velocity.y = (point.y - last.y) / elapsed * 14;

  last = {
    x: point.x,
    y: point.y,
    time: now
  };

  placeOrb(point.x, point.y);
});

function releaseOrb() {
  if (!dragging) return;

  dragging = false;

  let vx = velocity.x;
  let vy = velocity.y;
  let previousTime = performance.now();

  function animate(now) {
    const delta = Math.min(32, now - previousTime);
    previousTime = now;

    const width = stage.clientWidth;
    const height = stage.clientHeight;

    let x = pos.x * width + vx * delta;
    let y = pos.y * height + vy * delta;

    vx *= Math.pow(0.92, delta / 16);
    vy *= Math.pow(0.92, delta / 16);

    if (x < 30 || x > width - 30) vx *= -0.72;
    if (y < 30 || y > height - 30) vy *= -0.72;

    placeOrb(x, y);

    if (Math.abs(vx) + Math.abs(vy) > 0.18) {
      animationFrame = requestAnimationFrame(animate);
    }
  }

  animationFrame = requestAnimationFrame(animate);
}

orb.addEventListener("pointerup", releaseOrb);
orb.addEventListener("pointercancel", releaseOrb);

$("#resetOrb").addEventListener("click", () => {
  cancelAnimationFrame(animationFrame);
  velocity = { x: 0, y: 0 };

  placeOrb(stage.clientWidth / 2, stage.clientHeight / 2);
  showToast("Bola kembali ke tengah.");
});

window.addEventListener("resize", () => {
  placeOrb(pos.x * stage.clientWidth, pos.y * stage.clientHeight);
});

requestAnimationFrame(() => {
  placeOrb(stage.clientWidth / 2, stage.clientHeight / 2);
});

// DRAWING PAD

const canvas = $("#drawingCanvas");
const ctx = canvas.getContext("2d");

let brushColor = "#f5f5f5";
let brushWidth = 4;
let erasing = false;
let drawing = false;
let previousPoint = null;

function setupCanvas() {
  const rect = canvas.getBoundingClientRect();
  const ratio = Math.max(1, window.devicePixelRatio || 1);

  const oldCanvas = document.createElement("canvas");
  oldCanvas.width = canvas.width;
  oldCanvas.height = canvas.height;

  if (oldCanvas.width && oldCanvas.height) {
    oldCanvas.getContext("2d").drawImage(canvas, 0, 0);
  }

  canvas.width = Math.round(rect.width * ratio);
  canvas.height = Math.round(rect.height * ratio);

  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  if (oldCanvas.width && oldCanvas.height) {
    ctx.drawImage(
      oldCanvas,
      0, 0, oldCanvas.width, oldCanvas.height,
      0, 0, rect.width, rect.height
    );
  }
}

setupCanvas();

let resizeTimer;

window.addEventListener("resize", () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(setupCanvas, 150);
});

function canvasPoint(event) {
  const rect = canvas.getBoundingClientRect();

  return {
    x: event.clientX - rect.left,
    y: event.clientY - rect.top
  };
}

canvas.addEventListener("pointerdown", event => {
  drawing = true;
  canvas.setPointerCapture(event.pointerId);
  previousPoint = canvasPoint(event);
  event.preventDefault();
});

canvas.addEventListener("pointermove", event => {
  if (!drawing) return;

  const point = canvasPoint(event);

  ctx.globalCompositeOperation =
    erasing ? "destination-out" : "source-over";

  ctx.strokeStyle = brushColor;
  ctx.lineWidth = brushWidth;
  ctx.beginPath();
  ctx.moveTo(previousPoint.x, previousPoint.y);
  ctx.lineTo(point.x, point.y);
  ctx.stroke();

  previousPoint = point;
});

function stopDrawing() {
  drawing = false;
  previousPoint = null;
}

canvas.addEventListener("pointerup", stopDrawing);
canvas.addEventListener("pointercancel", stopDrawing);

// WARNA KUAS

$$(".color").forEach(button => {
  button.addEventListener("click", () => {
    $$(".color").forEach(item => {
      item.classList.toggle("active", item === button);
    });

    brushColor = button.dataset.color;
    erasing = false;
  });
});

$("#brushSize").addEventListener("input", event => {
  brushWidth = Number(event.target.value);
});

$("#eraser").addEventListener("click", () => {
  erasing = !erasing;

  showToast(erasing ? "Penghapus aktif." : "Kuas aktif.");
});

$("#clearCanvas").addEventListener("click", () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  showToast("Kanvas dibersihkan.");
});

// SIMPAN GAMBAR PNG

$("#saveCanvas").addEventListener("click", () => {
  const output = document.createElement("canvas");

  output.width = canvas.width;
  output.height = canvas.height;

  const outputContext = output.getContext("2d");

  outputContext.fillStyle = "#0a0b0d";
  outputContext.fillRect(0, 0, output.width, output.height);
  outputContext.drawImage(canvas, 0, 0);

  const link = document.createElement("a");
  link.download = "juumao-drawing.png";
  link.href = output.toDataURL("image/png");
  link.click();

  showToast("Gambar siap disimpan.");
});

// CATATAN LOKAL

const note = $("#noteText");
const noteCount = $("#noteCount");

try {
  note.value = localStorage.getItem("juumao-note") || "";
} catch (_) {}

function updateNoteCount() {
  noteCount.textContent = `${note.value.length} / 500`;
}

updateNoteCount();

note.addEventListener("input", updateNoteCount);

$("#saveNote").addEventListener("click", () => {
  try {
    localStorage.setItem("juumao-note", note.value);
    showToast("Catatan tersimpan di browser ini.");
  } catch (_) {
    showToast("Penyimpanan lokal tidak tersedia.");
  }
});

// PESAN KECIL

let toastTimer;

function showToast(message) {
  const toast = $("#toast");

  toast.textContent = message;
  toast.classList.add("show");

  clearTimeout(toastTimer);

  toastTimer = setTimeout(() => {
    toast.classList.remove("show");
  }, 2200);
    }
  
