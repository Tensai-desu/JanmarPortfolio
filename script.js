// Cursor tracking
const cursor = document.getElementById('cursor');
const ring   = document.getElementById('cursorRing');
let mx = 0, my = 0, rx = 0, ry = 0;

document.addEventListener('mousemove', e => {
    mx = e.clientX; 
    my = e.clientY;
    cursor.style.left = mx + 'px';
    cursor.style.top  = my + 'px';
});

(function loop() {
    rx += (mx - rx) * 0.14;
    ry += (my - ry) * 0.14;
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
    requestAnimationFrame(loop);
})();

document.querySelectorAll('a, button').forEach(el => {
    el.addEventListener('mouseenter', () => {
        cursor.style.transform = 'translate(-50%,-50%) scale(2.5)';
        ring.style.width = ring.style.height = '60px';
        ring.style.borderColor = 'rgba(0,229,255,0.8)';
    });
    el.addEventListener('mouseleave', () => {
        cursor.style.transform = 'translate(-50%,-50%) scale(1)';
        ring.style.width = ring.style.height = '36px';
        ring.style.borderColor = 'rgba(0,229,255,0.5)';
    });
});

// Glitch effect
const glitchEl = document.querySelector('.hero-eyebrow .glitch');
if (glitchEl) {
    setInterval(() => {
        glitchEl.style.textShadow = `
            ${randomRange(-2,2)}px ${randomRange(-2,2)}px 0 rgba(255,0,128,0.7),
            ${randomRange(-2,2)}px ${randomRange(-2,2)}px 0 rgba(0,229,255,0.7)
        `;
    }, 300);
}

function randomRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Typewriter Effect
const roles = ['UI/UX Designer', 'Frontend Developer', 'Creative Coder', 'Video Editor'];
let ri = 0, ci = 0, deleting = false;
const typed = document.getElementById('heroTyped');

function typeWriter() {
    const current = roles[ri];
    if (!deleting) {
        typed.textContent = current.slice(0, ++ci);
        if (ci === current.length) { 
            deleting = true; 
            setTimeout(typeWriter, 1800); 
            return; 
        }
    } else {
        typed.textContent = current.slice(0, --ci);
        if (ci === 0) { 
            deleting = false; 
            ri = (ri + 1) % roles.length; 
        }
    }
    setTimeout(typeWriter, deleting ? 60 : 100);
}

if (typed) typeWriter();

// Intersection Observer for scroll animations
const revealEls = document.querySelectorAll('.section-label, .section-title, .about-image, .about-text, .about-stats, .about-quote, .skill-card, .bar-item, .project-card, .stat-box');

const animations = [
    { hidden: 'opacity:0; transform:translateY(60px) scale(0.95)', visible: 'opacity:1; transform:translateY(0) scale(1)' },
    { hidden: 'opacity:0; transform:translateX(-80px)', visible: 'opacity:1; transform:translateX(0)' },
    { hidden: 'opacity:0; transform:translateX(80px)', visible: 'opacity:1; transform:translateX(0)' },
    { hidden: 'opacity:0; transform:scale(0.8)', visible: 'opacity:1; transform:scale(1)' }
];

revealEls.forEach((el, i) => {
    const anim = animations[i % animations.length];
    el.style.transition = 'all 0.9s cubic-bezier(0.16, 1, 0.3, 1)';
});

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, { threshold: 0.15 });

revealEls.forEach(el => observer.observe(el));