/* =============================================
   NATIVE SMOOTH SCROLL
============================================= */
document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
        const id = a.getAttribute('href').slice(1);
        const el = document.getElementById(id);
        if (!el) return;
        e.preventDefault();
        el.scrollIntoView({ behavior: 'smooth' });
        closeDrawer();
    });
});

/* =============================================
   NAV PROGRESS BAR
============================================= */
const navProgress = document.getElementById('navProgress');

function getScrollFraction() {
    const total = document.body.scrollHeight - window.innerHeight;
    return total > 0 ? window.scrollY / total : 0;
}

/* =============================================
   ACTIVE SECTION + INDICATOR
============================================= */
const mainNav      = document.getElementById('mainNav');
const navIndicator = document.getElementById('navIndicator');
const pillLinks    = document.querySelectorAll('.nav-pill-link');
const sections     = ['home', 'about', 'skills', 'projects', 'contact'];

function getActiveSection() {
    const scrolled = window.scrollY + window.innerHeight * 0.35;
    let active = sections[0];
    for (const id of sections) {
        const el = document.getElementById(id);
        if (el && el.offsetTop <= scrolled) active = id;
    }
    return active;
}

function moveIndicator(linkEl) {
    if (!navIndicator || !linkEl) return;
    const wrap = document.getElementById('navPillWrap');
    if (!wrap) return;
    const wRect = wrap.getBoundingClientRect();
    const lRect = linkEl.getBoundingClientRect();
    navIndicator.style.left  = (lRect.left - wRect.left) + 'px';
    navIndicator.style.width = lRect.width + 'px';
}

function updateNav() {
    const active = getActiveSection();
    let activeLink = null;
    pillLinks.forEach(l => {
        const isActive = l.dataset.section === active;
        l.classList.toggle('active', isActive);
        if (isActive) activeLink = l;
    });
    moveIndicator(activeLink);
    mainNav && mainNav.classList.toggle('scrolled', window.scrollY > 60);
    document.querySelectorAll('.ndl').forEach(l => {
        const href = l.getAttribute('href').slice(1);
        l.classList.toggle('active-link', href === active);
    });
    if (navProgress) navProgress.style.width = (getScrollFraction() * 100) + '%';
}

/* Hover indicator follows cursor */
pillLinks.forEach(link => {
    link.addEventListener('mouseenter', () => moveIndicator(link));
    link.addEventListener('mouseleave', () => {
        const activeLink = document.querySelector('.nav-pill-link.active');
        moveIndicator(activeLink);
    });
});

window.addEventListener('scroll', updateNav, { passive: true });
window.addEventListener('load', () => { updateNav(); setTimeout(updateNav, 200); });
window.addEventListener('resize', updateNav);

/* =============================================
   MOBILE DRAWER
============================================= */
const navBurger   = document.getElementById('navBurger');
const navDrawer   = document.getElementById('navDrawer');
const navBackdrop = document.getElementById('navBackdrop');
const drawerClose = document.getElementById('navDrawerClose');

function openDrawer() {
    navDrawer.classList.add('open');
    navBackdrop.classList.add('visible');
    navBurger && navBurger.classList.add('open');
    navBurger && navBurger.setAttribute('aria-expanded', 'true');
    navDrawer.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
}

function closeDrawer() {
    if (!navDrawer) return;
    navDrawer.classList.remove('open');
    navBackdrop.classList.remove('visible');
    navBurger && navBurger.classList.remove('open');
    navBurger && navBurger.setAttribute('aria-expanded', 'false');
    navDrawer.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    document.querySelectorAll('.ndl').forEach(l => {
        l.style.opacity = '0';
        l.style.transform = 'translateX(30px)';
        l.style.animation = 'none';
        setTimeout(() => { l.style.animation = ''; }, 50);
    });
}

navBurger   && navBurger.addEventListener('click', openDrawer);
drawerClose && drawerClose.addEventListener('click', closeDrawer);
navBackdrop && navBackdrop.addEventListener('click', closeDrawer);
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeDrawer(); });

/* =============================================
   CURSOR
============================================= */
const cursor = document.getElementById('cursor');
const ring   = document.getElementById('cursorRing');
let mx = 0, my = 0, rx = 0, ry = 0;
let cursorVisible = false;

document.addEventListener('mousemove', e => {
    mx = e.clientX;
    my = e.clientY;
    if (!cursorVisible) {
        cursorVisible = true;
        cursor.style.opacity = '1';
        ring.style.opacity   = '1';
    }
    cursor.style.left = mx + 'px';
    cursor.style.top  = my + 'px';
});

document.addEventListener('mouseleave', () => {
    cursorVisible = false;
    cursor.style.opacity = '0';
    ring.style.opacity   = '0';
});

(function ringLoop() {
    rx += (mx - rx) * 0.14;
    ry += (my - ry) * 0.14;
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
    requestAnimationFrame(ringLoop);
})();

document.querySelectorAll('a, button').forEach(el => {
    el.addEventListener('mouseenter', () => {
        cursor.style.transform = 'translate(-50%,-50%) scale(2.5)';
        ring.style.width       = '60px';
        ring.style.height      = '60px';
        ring.style.borderColor = 'rgba(0,229,255,0.8)';
    });
    el.addEventListener('mouseleave', () => {
        cursor.style.transform = 'translate(-50%,-50%) scale(1)';
        ring.style.width       = '36px';
        ring.style.height      = '36px';
        ring.style.borderColor = 'rgba(0,229,255,0.5)';
    });
});

/* =============================================
   GLITCH + TYPEWRITER
============================================= */
function randomRange(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }

const glitchEl = document.querySelector('.hero-eyebrow .glitch');
if (glitchEl) {
    setInterval(() => {
        glitchEl.style.textShadow = `
            ${randomRange(-2,2)}px ${randomRange(-2,2)}px 0 rgba(255,0,128,0.7),
            ${randomRange(-2,2)}px ${randomRange(-2,2)}px 0 rgba(0,229,255,0.7)
        `;
    }, 300);
}

const roles = ['UI/UX Designer', 'Frontend Developer', 'Creative Coder', 'Video Editor', 'Music Producer'];
let ri = 0, ci = 0, deleting = false;
const typed = document.getElementById('heroTyped');

function typeWriter() {
    const current = roles[ri];
    if (!deleting) {
        typed.textContent = current.slice(0, ++ci);
        if (ci === current.length) { deleting = true; setTimeout(typeWriter, 1600); return; }
    } else {
        typed.textContent = current.slice(0, --ci);
        if (ci === 0) { deleting = false; ri = (ri + 1) % roles.length; }
    }
    setTimeout(typeWriter, deleting ? 50 : 90);
}
if (typed) typeWriter();

/* =============================================
   SCROLL REVEAL
============================================= */
const revealEls = document.querySelectorAll(
    '.section-label, .section-title, .about-image, .about-text, ' +
    '.about-stats, .about-quote, .skill-card, .bar-item, .project-card, .stat-box'
);

revealEls.forEach((el, i) => {
    el.style.opacity    = '0';
    el.style.transition = 'opacity 0.8s cubic-bezier(0.16,1,0.3,1), transform 0.8s cubic-bezier(0.16,1,0.3,1)';
    const type = i % 4;
    if      (type === 0) el.style.transform = 'translateY(60px) scale(0.95)';
    else if (type === 1) el.style.transform = 'translateX(-60px)';
    else if (type === 2) el.style.transform = 'translateX(60px)';
    else                 el.style.transform = 'scale(0.85)';
    el.dataset.type = type;
});

const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity   = '1';
            entry.target.style.transform = 'translateY(0) translateX(0) scale(1)';
        } else {
            const type = Number(entry.target.dataset.type);
            entry.target.style.opacity = '0';
            if      (type === 0) entry.target.style.transform = 'translateY(60px) scale(0.95)';
            else if (type === 1) entry.target.style.transform = 'translateX(-60px)';
            else if (type === 2) entry.target.style.transform = 'translateX(60px)';
            else                 entry.target.style.transform = 'scale(0.85)';
        }
    });
}, { threshold: 0.15 });

revealEls.forEach(el => observer.observe(el));

document.querySelectorAll('.skills-grid, .project-grid, .about-stats').forEach(container => {
    Array.from(container.children).forEach((child, i) => {
        child.style.transitionDelay = `${i * 0.1}s`;
    });
});

/* =============================================
   PROJECT MODAL
============================================= */
const modal       = document.getElementById('projectModal');
const modalIframe = document.getElementById('modalIframe');
const modalTitle  = document.getElementById('modalTitle');
const modalLaunch = document.getElementById('modalLaunch');
const modalLoader = document.getElementById('modalLoader');
const modalClose  = document.getElementById('modalClose');

document.querySelectorAll('.project-card').forEach(card => {
    card.style.cursor = 'pointer';
    card.addEventListener('click', function(e) {
        if (e.target.closest('.project-link')) return;
        const link  = card.querySelector('.project-link');
        const title = card.querySelector('.project-title');
        if (!link || !title) return;
        const url = link.getAttribute('href');
        modalTitle.textContent    = title.textContent;
        modalLaunch.href          = url;
        modalIframe.style.opacity = '0';
        modalLoader.style.display = 'flex';
        modalIframe.src           = url;
        modal.style.display       = 'flex';
        document.body.style.overflow = 'hidden';
          modalIframe.onload = () => {
            modalLoader.style.display = 'none';
            modalIframe.style.opacity = '1';
            modalIframe.style.pointerEvents = 'auto';
        };
    });
});

function closeModal() {
    if (!modal) return;
    modal.style.display          = 'none';
    modalIframe.src              = '';
    document.body.style.overflow = '';
}

modalClose && modalClose.addEventListener('click', closeModal);
modal      && modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

/* =============================================
   LIGHT / DARK THEME TOGGLE
============================================= */
const themeToggle = document.getElementById('themeToggle');
const themeIcon   = document.getElementById('themeIcon');

/* Load saved preference */
if (localStorage.getItem('theme') === 'light') {
    document.body.classList.add('light');
    themeIcon.classList.replace('fa-sun', 'fa-moon');
}

themeToggle && themeToggle.addEventListener('click', () => {
    const isLight = document.body.classList.toggle('light');
    if (isLight) {
        themeIcon.classList.replace('fa-sun', 'fa-moon');
        localStorage.setItem('theme', 'light');
    } else {
        themeIcon.classList.replace('fa-moon', 'fa-sun');
        localStorage.setItem('theme', 'dark');
    }
});