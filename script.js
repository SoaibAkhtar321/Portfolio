/* ============================================================
   SOAIB AKHTAR — PORTFOLIO JAVASCRIPT
   script.js
   ============================================================ */

/* ---------- 1. Custom Cursor ---------- */
const cursor    = document.getElementById('cursor');
const ring      = document.getElementById('cursorRing');
let mx = 0, my = 0;   // mouse position
let rx = 0, ry = 0;   // ring position (lagged)

// Move dot cursor instantly
document.addEventListener('mousemove', e => {
  mx = e.clientX;
  my = e.clientY;
  cursor.style.transform = `translate(${mx - 6}px, ${my - 6}px)`;
});

// Animate ring with smooth lag
function animateCursor() {
  rx += (mx - rx) * 0.12;
  ry += (my - ry) * 0.12;
  ring.style.transform = `translate(${rx - 18}px, ${ry - 18}px)`;
  requestAnimationFrame(animateCursor);
}
animateCursor();

// Expand ring on interactive elements
document.querySelectorAll('a, button, .btn, .project-card, .skill-card').forEach(el => {
  el.addEventListener('mouseenter', () => {
    ring.style.width       = '60px';
    ring.style.height      = '60px';
    ring.style.borderColor = '#7c3aed';
  });
  el.addEventListener('mouseleave', () => {
    ring.style.width       = '36px';
    ring.style.height      = '36px';
    ring.style.borderColor = '#06b6d4';
  });
});


/* ---------- 2. Particle Network Canvas Background ---------- */
const canvas = document.getElementById('bgCanvas');
const ctx    = canvas.getContext('2d');

// Size canvas to viewport
canvas.width  = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener('resize', () => {
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
});

// Generate particles
const particles = [];
for (let i = 0; i < 80; i++) {
  particles.push({
    x:   Math.random() * canvas.width,
    y:   Math.random() * canvas.height,
    r:   Math.random() * 1.5 + 0.3,
    dx:  (Math.random() - 0.5) * 0.4,
    dy:  (Math.random() - 0.5) * 0.4,
    a:   Math.random(),
    col: Math.random() > 0.5 ? '124,58,237' : '6,182,212'
  });
}

// Draw loop
function drawParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  particles.forEach((p, i) => {
    // Move
    p.x += p.dx;
    p.y += p.dy;

    // Bounce off edges
    if (p.x < 0 || p.x > canvas.width)  p.dx *= -1;
    if (p.y < 0 || p.y > canvas.height) p.dy *= -1;

    // Draw dot
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${p.col},${p.a})`;
    ctx.fill();

    // Draw lines to nearby particles
    for (let j = i + 1; j < particles.length; j++) {
      const d = Math.hypot(p.x - particles[j].x, p.y - particles[j].y);
      if (d < 120) {
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.strokeStyle = `rgba(124,58,237,${0.08 * (1 - d / 120)})`;
        ctx.lineWidth   = 0.5;
        ctx.stroke();
      }
    }
  });

  requestAnimationFrame(drawParticles);
}
drawParticles();


/* ---------- 3. Scroll Reveal ---------- */
// Add class to body so CSS knows JS is active
document.body.classList.add('js-loaded');

const reveals  = document.querySelectorAll('.reveal');
const revealOb = new IntersectionObserver(entries => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 60);
      revealOb.unobserve(entry.target); // stop watching once revealed
    }
  });
}, { threshold: 0.05, rootMargin: '0px 0px -40px 0px' });

reveals.forEach(el => revealOb.observe(el));


/* ---------- 4. Typing Effect ---------- */
const phrases = [
  'Android Dev.',
  'Kotlin Enthusiast.',
  'Clean Arch Believer.',
  'MVVM Practitioner.'
];

let phraseIndex = 0;   // current phrase
let charIndex   = 0;   // current character position
let isDeleting  = false;

const typedEl = document.getElementById('typed');

function typeLoop() {
  const current = phrases[phraseIndex];

  if (!isDeleting) {
    // Type forward
    typedEl.textContent = current.slice(0, ++charIndex);
    if (charIndex === current.length) {
      isDeleting = true;
      setTimeout(typeLoop, 1600); // pause before deleting
      return;
    }
  } else {
    // Delete backward
    typedEl.textContent = current.slice(0, --charIndex);
    if (charIndex === 0) {
      isDeleting  = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
    }
  }

  setTimeout(typeLoop, isDeleting ? 55 : 100);
}

typeLoop();


/* ---------- 5. Animated Counter (utility) ---------- */
/**
 * Animates a numeric counter from 0 to `target`.
 * @param {HTMLElement} el      - Element whose textContent to update.
 * @param {number}      target  - Final value to count to.
 * @param {string}      suffix  - Optional string appended after number (e.g. "+").
 */
function animateCount(el, target, suffix = '') {
  let count        = 0;
  const step       = target / 60;
  const interval   = setInterval(() => {
    count = Math.min(count + step, target);
    el.textContent = Math.floor(count) + suffix;
    if (count >= target) clearInterval(interval);
  }, 25);
}