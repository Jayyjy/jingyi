/* ════════════════════════════════════════════
   work.js — JavaScript for work.html
   ════════════════════════════════════════════ */

const CORRECT_PASSWORD = 'JING';

// ── FULL-PAGE PASSWORD GATE ──
const pwGate      = document.getElementById('pwGate');
const pwInput     = document.getElementById('pwInput');
const pwError     = document.getElementById('pwError');
const pageContent = document.getElementById('pageContent');

function attemptUnlock() {
  if (pwInput.value === CORRECT_PASSWORD) {
    pwGate.classList.add('unlocked');
    pageContent.classList.add('visible');
    document.body.style.overflow = '';
    // Remove gate from DOM after transition
    setTimeout(() => pwGate.remove(), 600);
    // Trigger scroll reveal now that content is visible
    initReveal();
  } else {
    pwError.textContent = 'Incorrect password. Please try again.';
    pwInput.classList.add('error');
    setTimeout(() => pwInput.classList.remove('error'), 400);
    pwInput.value = '';
    pwInput.focus();
  }
}

document.getElementById('pwSubmitBtn').addEventListener('click', attemptUnlock);
pwInput.addEventListener('keydown', e => { if (e.key === 'Enter') attemptUnlock(); });

// Prevent scrolling while gate is shown
document.body.style.overflow = 'hidden';


// ── SCROLL REVEAL ──
function initReveal() {
  const reveals = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('visible'), i * 80);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  reveals.forEach(el => observer.observe(el));
}


// ── FILTER ──
const filterBtns = document.querySelectorAll('.filter-btn');
const cards = document.querySelectorAll('.project-card');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    cards.forEach(card => {
      const match = filter === 'all' || card.dataset.category === filter;
      card.style.display = match ? '' : 'none';
    });
  });
});


// ── LIGHTBOX ──
const lightbox      = document.getElementById('lightbox');
const modalMedia    = document.getElementById('modalMedia');
const modalBrand    = document.getElementById('modalBrand');
const modalTitle    = document.getElementById('modalTitle');
const modalDesc     = document.getElementById('modalDesc');
const modalTags     = document.getElementById('modalTags');
const modalMediaNav = document.getElementById('modalMediaNav');

function showMedia(media, idx) {
  modalMedia.innerHTML = '';
  const m = media[idx];

  if (m.type === 'image') {
    const img = document.createElement('img');
    img.src = m.src;
    img.alt = '';
    modalMedia.appendChild(img);
  } else if (m.type === 'video') {
    const vid = document.createElement('video');
    vid.src = m.src;
    vid.controls = true;
    vid.style.cssText = 'width:100%;max-height:55vh;';
    modalMedia.appendChild(vid);
  } else if (m.type === 'pdf') {
    const frame = document.createElement('iframe');
    frame.src = m.src;
    modalMedia.appendChild(frame);
  }

  modalMediaNav.querySelectorAll('.media-thumb-btn').forEach((btn, i) => {
    btn.classList.toggle('active', i === idx);
  });
}

function openLightbox(card) {
  const media = JSON.parse(card.dataset.media || '[]');

  modalBrand.textContent = card.dataset.brand || '';
  modalTitle.textContent = card.dataset.title || '';
  modalDesc.textContent  = card.dataset.desc  || '';
  modalTags.innerHTML = (card.dataset.tags || '')
    .split(',')
    .map(t => `<span class="modal-tag">${t.trim()}</span>`)
    .join('');

  modalMediaNav.innerHTML = '';
  if (media.length > 1) {
    media.forEach((m, i) => {
      const btn = document.createElement('button');
      btn.className = 'media-thumb-btn';
      if (m.type === 'image') {
        btn.innerHTML = `<img src="${m.src}" alt="" />`;
      } else if (m.type === 'video') {
        btn.innerHTML = `<svg width="20" height="20" fill="none" stroke="#907057" viewBox="0 0 24 24"><polygon points="5,3 19,12 5,21"/></svg>`;
      } else {
        btn.innerHTML = `<svg width="20" height="20" fill="none" stroke="#907057" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14,2 14,8 20,8"/></svg>`;
      }
      btn.addEventListener('click', () => showMedia(media, i));
      modalMediaNav.appendChild(btn);
    });
  }

  showMedia(media, 0);
  lightbox.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  lightbox.classList.remove('open');
  modalMedia.innerHTML = '';
  document.body.style.overflow = '';
}

document.getElementById('lightboxClose').addEventListener('click', closeLightbox);
lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeLightbox();
});

// Wire up project cards
cards.forEach(card => {
  card.addEventListener('click', () => openLightbox(card));
});