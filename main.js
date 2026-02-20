/* ════════════════════════════════════════════
   main.js — JavaScript for index.html
   ════════════════════════════════════════════ */

// ── NAV SCROLL EFFECT ──
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 30);
});

// ── SCROLL REVEAL ──
const reveals = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 80);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });
reveals.forEach(el => revealObserver.observe(el));

// ── PHOTO GALLERY LIGHTBOX ──
const photos = [
  'Assets/public/DSC01069.jpg',
  'Assets/public/DSC01105.jpg',
  'Assets/public/DSC01108.jpg',
  'Assets/public/DSC01114.jpg',
  'Assets/public/DSC02013.jpg',
  'Assets/public/DSC02023.jpg',
  'Assets/public/DSC02040.jpg',
  'Assets/public/DSC02052.jpg',
  'Assets/public/DSC02402.jpg',
  'Assets/public/DSC02907.jpg',
  'Assets/public/DSC02968.jpg',
  'Assets/public/DSC02997.jpg',
  'Assets/public/DSC02998.jpg',
  'Assets/public/DSC03032_2.jpg',
  'Assets/public/DSC03044.jpg',
  'Assets/public/DSC03244.jpg',
];

let currentPhotoIdx = 0;

const photoOverlay = document.getElementById('photoOverlay');
const photoOverlayImg = document.getElementById('photoOverlayImg');

function openPhoto(idx) {
  currentPhotoIdx = idx;
  photoOverlayImg.src = photos[idx];
  photoOverlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closePhoto() {
  photoOverlay.classList.remove('open');
  document.body.style.overflow = '';
}

function prevPhoto() {
  currentPhotoIdx = (currentPhotoIdx - 1 + photos.length) % photos.length;
  photoOverlayImg.src = photos[currentPhotoIdx];
}

function nextPhoto() {
  currentPhotoIdx = (currentPhotoIdx + 1) % photos.length;
  photoOverlayImg.src = photos[currentPhotoIdx];
}

document.getElementById('photoClose').addEventListener('click', closePhoto);
document.getElementById('photoPrev').addEventListener('click', prevPhoto);
document.getElementById('photoNext').addEventListener('click', nextPhoto);
photoOverlay.addEventListener('click', e => { if (e.target === photoOverlay) closePhoto(); });

document.addEventListener('keydown', e => {
  if (!photoOverlay.classList.contains('open')) return;
  if (e.key === 'Escape')      closePhoto();
  if (e.key === 'ArrowLeft')   prevPhoto();
  if (e.key === 'ArrowRight')  nextPhoto();
});

// Wire up grid items
document.querySelectorAll('.photo-grid-item').forEach((item, i) => {
  item.addEventListener('click', () => openPhoto(i));
});