// Cursor tracking
const cursor = document.getElementById('cursor');
const ring   = document.getElementById('cursorRing');
let mx = 0, my = 0, rx = 0, ry = 0;

// Use window instead of document to catch all mouse events
window.addEventListener('mousemove', e => {
    mx = e.clientX;
    my = e.clientY;
    cursor.style.left = mx + 'px';
    cursor.style.top  = my + 'px';
    cursor.style.opacity = '1';
    ring.style.opacity = '1';
}, true); // true = capture phase, fires before anything else

// Only hide when mouse leaves the entire browser window
window.addEventListener('mouseout', e => {
    if (!e.relatedTarget && !e.toElement) {
        cursor.style.opacity = '0';
        ring.style.opacity = '0';
    }
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
const roles = ['UI/UX Designer', 'Frontend Developer', 'Creative Coder', 'Video Editor', 'Music Producer'];
let ri = 0, ci = 0, deleting = false;
const typed = document.getElementById('heroTyped');

function typeWriter() {
    const current = roles[ri];
    if (!deleting) {
        typed.textContent = current.slice(0, ++ci);
        if (ci === current.length) { 
            deleting = true; 
            setTimeout(typeWriter, 1600); 
            return; 
        }
    } else {
        typed.textContent = current.slice(0, --ci);
        if (ci === 0) { 
            deleting = false; 
            ri = (ri + 1) % roles.length; 
        }
    }
    setTimeout(typeWriter, deleting ? 50 : 90);
}   

if (typed) typeWriter();

// Intersection Observer for scroll animations
const revealEls = document.querySelectorAll('.section-label, .section-title, .about-image, .about-text, .about-stats, .about-quote, .skill-card, .bar-item, .project-card, .stat-box');

// Set initial hidden state per element
revealEls.forEach((el, i) => {
    el.style.opacity = '0';
    el.style.transition = 'opacity 0.8s cubic-bezier(0.16,1,0.3,1), transform 0.8s cubic-bezier(0.16,1,0.3,1)';
    const type = i % 4;
    if (type === 0) el.style.transform = 'translateY(60px) scale(0.95)';
    else if (type === 1) el.style.transform = 'translateX(-60px)';
    else if (type === 2) el.style.transform = 'translateX(60px)';
    else el.style.transform = 'scale(0.85)';
    el.dataset.type = i % 4;
});

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0) translateX(0) scale(1)';
        } else {
            const type = Number(entry.target.dataset.type);
            entry.target.style.opacity = '0';
            if (type === 0) entry.target.style.transform = 'translateY(60px) scale(0.95)';
            else if (type === 1) entry.target.style.transform = 'translateX(-60px)';
            else if (type === 2) entry.target.style.transform = 'translateX(60px)';
            else entry.target.style.transform = 'scale(0.85)';
        }
    });
}, { threshold: 0.15 });

revealEls.forEach(el => observer.observe(el));

// Staggered children: skill cards, project cards, stat boxes
document.querySelectorAll('.skills-grid, .project-grid, .about-stats').forEach(container => {
    Array.from(container.children).forEach((child, i) => {
        child.style.transitionDelay = `${i * 0.1}s`;
    });
});

// Hamburger menu
const hamburger = document.getElementById('navHamburger');
const navLinks = document.querySelector('.nav-links');

if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('open');
        navLinks.classList.toggle('open');
    });

    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('open');
            navLinks.classList.remove('open');
        });
    });
}
// Project card preview modal
const modal = document.getElementById('projectModal');
const modalIframe = document.getElementById('modalIframe');
const modalTitle = document.getElementById('modalTitle');
const modalLaunch = document.getElementById('modalLaunch');
const modalLoader = document.getElementById('modalLoader');
const modalClose = document.getElementById('modalClose');

document.querySelectorAll('.project-card').forEach(card => {
    card.style.cursor = 'pointer';
    card.addEventListener('click', function(e) {
        // Don't trigger if clicking the Launch Project link
        if (e.target.closest('.project-link')) return;

        const link = card.querySelector('.project-link');
        const title = card.querySelector('.project-title');
        if (!link || !title) return;

        const url = link.getAttribute('href');

        // Set modal content
        modalTitle.textContent = title.textContent;
        modalLaunch.href = url;
        modalIframe.style.opacity = '0';
        modalLoader.style.display = 'flex';
        modalIframe.src = url;

// Show modal
modal.style.display = 'flex';
document.body.style.overflow = 'hidden';

        // Show iframe when loaded
        modalIframe.onload = () => {
            modalLoader.style.display = 'none';
            modalIframe.style.opacity = '1';
        };
    });
});



function closeModal() {
    modal.style.display = 'none';
    modalIframe.src = '';
    document.body.style.overflow = '';
}

modalClose.addEventListener('click', closeModal);
modal.addEventListener('click', function(e) {
    if (e.target === modal) closeModal();
});
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') closeModal();
});