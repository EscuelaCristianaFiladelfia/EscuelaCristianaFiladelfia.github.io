/* ==========================================================
   FUNCIONES DE INTERACCIÓN (Acordeones, Splide)
   ========================================================== */
function initInteractiveElements() {
    initAccordions();
    initSplide();
}

function initAccordions() {
    const accordions = document.querySelectorAll('.accordion-header');
    const newAccordions = Array.from(accordions).map(acc => {
        const clone = acc.cloneNode(true);
        acc.parentNode.replaceChild(clone, acc);
        return clone;
    });
    newAccordions.forEach(acc => {
        acc.addEventListener('click', function() {
            this.classList.toggle('active');
            const content = this.nextElementSibling;
            if (content.classList.contains('open')) {
                content.classList.remove('open');
                content.style.maxHeight = '0';
            } else {
                content.classList.add('open');
                content.style.maxHeight = content.scrollHeight + 'px';
            }
        });
    });
}

function initSplide() {
    if (document.getElementById('announcements-slider')) {
        new Splide('#announcements-slider', {
            type: 'loop',
            updateOnMove: true,
            autoplay: true,
            interval: 3500,
            gap: '1.5rem',
            pauseOnHover: false,
            perPage: 1,
            arrows: false,
            breakpoints: {
                768: { gap: '1rem', arrows: false, perPage: 1 }
            }
        }).mount();
    }
}

/* ==========================================================
   NAVEGACIÓN SPA CON TRANSICIÓN
   ========================================================== */
function navigateTo(componentPath) {
    const mainContent = document.getElementById('main-content');
    const loader = document.getElementById('page-loader');

    if (loader) loader.classList.add('active');
    mainContent.classList.add('page-exiting');

    setTimeout(() => {
        fetch(componentPath)
            .then(response => {
                if (!response.ok) throw new Error("No se encontró " + componentPath);
                return response.text();
            })
            .then(data => {
                mainContent.innerHTML = data;
                window.scrollTo({ top: 0, behavior: 'smooth' });
                mainContent.classList.remove('page-exiting');

                initInteractiveElements();
                loadMaestrosTicker();
                initScrollAnimations();
                initScrollIndicator();
                initRippleEffect();

                if (loader) loader.classList.remove('active');
            })
            .catch(err => {
                console.error(err);
                mainContent.innerHTML = `
                    <div style="text-align:center;padding:80px 20px;">
                        <h2 style="color:var(--primary-color);">Página no encontrada</h2>
                        <p style="color:#666;margin-bottom:20px;">Lo sentimos, no pudimos cargar esta sección.</p>
                        <a href="#" onclick="navigateTo('components/home.html')" class="btn-primary">Ir al inicio</a>
                    </div>
                `;
                mainContent.classList.remove('page-exiting');
                if (loader) loader.classList.remove('active');
            });
    }, 150);
}

/* ==========================================================
   SCROLL ANIMATIONS (INTERSECTION OBSERVER)
   ========================================================== */
function initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    document.querySelectorAll('.animate-on-scroll, .animate-on-scroll-left, .animate-on-scroll-right').forEach(el => {
        observer.observe(el);
    });

    const staggerObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                staggerObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.stagger-children').forEach(el => {
        staggerObserver.observe(el);
    });
}

/* ==========================================================
   SCROLL INDICATOR (FLECHA DEL HERO)
   ========================================================== */
function initScrollIndicator() {
    const indicator = document.querySelector('.scroll-indicator');
    if (!indicator) return;

    const hero = indicator.closest('.hero');
    if (!hero) return;

    const heroHeight = hero.offsetHeight;

    indicator.addEventListener('click', () => {
        const nextSection = hero.nextElementSibling;
        if (nextSection) {
            nextSection.scrollIntoView({ behavior: 'smooth' });
        }
    });

    const onScroll = () => {
        if (window.scrollY > heroHeight * 0.5) {
            indicator.classList.add('hidden');
        } else {
            indicator.classList.remove('hidden');
        }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
}

/* ==========================================================
   RIPPLE EFFECT EN BOTONES
   ========================================================== */
function initRippleEffect() {
    document.querySelectorAll('.btn-primary, .btn-whatsapp-large, .fb-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            ripple.classList.add('ripple');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
            ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
            this.appendChild(ripple);
            ripple.addEventListener('animationend', () => ripple.remove());
        });
    });
}

/* ==========================================================
   MENÚ HAMBURGUESA Y NAVEGACIÓN
   ========================================================== */
function toggleMobileMenu() {
    const nav = document.getElementById('main-nav');
    nav.classList.toggle('active');
}

function closeMobileMenu() {
    const nav = document.getElementById('main-nav');
    if (nav && nav.classList.contains('active')) {
        nav.classList.remove('active');
    }
    const checkbox = document.getElementById('check-icon');
    if (checkbox) {
        checkbox.checked = false;
    }
    const dropdowns = document.querySelectorAll('.dropdown-menu');
    dropdowns.forEach(menu => menu.classList.remove('active'));
}

function toggleDropdown(event) {
    if (window.innerWidth <= 720) {
        event.preventDefault();
        const dropdownMenu = event.currentTarget.nextElementSibling;
        dropdownMenu.classList.toggle('active');
    }
}

/* ==========================================================
   CINTA DE MAESTROS
   ========================================================== */
function renderMaestrosTicker() {
    const maestros = [
        { nombre: "Pbro. Nazario Vázquez",    puesto: "Pastor",      imagen: "assets/img/maestros/Nazario-Vazquez.jpg" },
        { nombre: "Juan Cavazos",              puesto: "Maestro",     imagen: "assets/img/maestros/Juan-Cavazos.png" },
        { nombre: "Pbro. Ricardo Vázquez",     puesto: "Pastor",      imagen: "assets/img/maestros/Ricardo-Vazquez.png" },
        { nombre: "Rubén Sánchez",             puesto: "Maestro",     imagen: "assets/img/maestros/Ruben-Sanchez.png" },
        { nombre: "Pbro. Oscar Brambila",      puesto: "Pastor",      imagen: "assets/img/maestros/Oscar-Brambila.png" },
        { nombre: "Rocío Garza",               puesto: "Maestra",     imagen: "assets/img/maestros/Rocio-Garza.png" },
        { nombre: "Pbro. Hector Ponce",        puesto: "Pastor",      imagen: "assets/img/maestros/Hector-Ponce.png" },
        { nombre: "Alberto Echartea",          puesto: "Evangelista", imagen: "assets/img/maestros/Alberto-Echartea.png" },
        { nombre: "Delia Díaz G.",             puesto: "Maestra",     imagen: "assets/img/maestros/Delia-Diaz.png" },
        { nombre: "Pbro. Ruperto Nava",        puesto: "Pastor",      imagen: "assets/img/maestros/Ruperto-Nava.png" },
        { nombre: "María de Jesús Pérez",      puesto: "Maestra",     imagen: "assets/img/maestros/Maria-Perez.png" },
        { nombre: "Azareel Pérez Zapata",      puesto: "Pastor",      imagen: "assets/img/maestros/Azareel-Zapata.png" },
        { nombre: "Abel Ramírez",              puesto: "Maestro",     imagen: "assets/img/maestros/Abel-Ramirez.png" },
        { nombre: "Pbra. Beatriz Medina",      puesto: "Pastora",     imagen: "assets/img/maestros/Betty-Medina.png" },
        { nombre: "Daniel López M.",           puesto: "Maestro",     imagen: "assets/img/maestros/Daniel-Lopez.png" },
        { nombre: "Pbra. Yolanda Alanís",      puesto: "Pastora",     imagen: "assets/img/maestros/Yolanda-Alanis.png" },
        { nombre: "Mayra Huerta",              puesto: "Maestra",     imagen: "assets/img/maestros/Mayra-Huerta.png" },
    ];
    const track = document.getElementById('maestros-track');
    if (!track) return;
    let contenido = '';
    maestros.forEach(maestro => {
        contenido += `
            <div class="maestro-item">
                <img src="${maestro.imagen}" alt="${maestro.nombre}" loading="lazy">
                <div class="maestro-info">
                    <span class="maestro-puesto">${maestro.puesto}</span>
                    <h3>${maestro.nombre}</h3>
                </div>
            </div>
        `;
    });
    track.innerHTML = contenido + contenido;
    track.style.setProperty('--ticker-speed', `${maestros.length * 6}s`);
}

function loadMaestrosTicker() {
    const placeholder = document.getElementById('maestros-cinta-placeholder');
    if (!placeholder) return;
    fetch('components/maestros-cinta.html')
        .then(response => response.text())
        .then(html => {
            placeholder.innerHTML = html;
            renderMaestrosTicker();
        })
        .catch(err => console.error('Error cargando cinta:', err));
}

/* ==========================================================
   DARK MODE TOGGLE
   ========================================================== */
function initDarkMode() {
    const toggle = document.getElementById('dark-mode-toggle');
    if (!toggle) return;

    const saved = localStorage.getItem('theme');
    if (saved === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        toggle.innerHTML = '<i class="fas fa-sun"></i>';
    }

    toggle.addEventListener('click', () => {
        const html = document.documentElement;
        const isDark = html.getAttribute('data-theme') === 'dark';
        if (isDark) {
            html.removeAttribute('data-theme');
            localStorage.setItem('theme', 'light');
            toggle.innerHTML = '<i class="fas fa-moon"></i>';
        } else {
            html.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
            toggle.innerHTML = '<i class="fas fa-sun"></i>';
        }
    });
}

/* ==========================================================
   TILT 3D EN CARDS
   ========================================================== */
function initTilt3D() {
    document.querySelectorAll('.tilt-3d').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;
            card.style.transform = `
                perspective(800px)
                rotateY(${x * 8}deg)
                rotateX(${-y * 8}deg)
            `;
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(800px) rotateY(0) rotateX(0)';
        });
    });
}

/* ==========================================================
   SCROLL PROGRESS BAR
   ========================================================== */
function initScrollProgress() {
    const bar = document.getElementById('scroll-progress');
    if (!bar) return;
    window.addEventListener('scroll', () => {
        const scrollable = document.documentElement.scrollHeight - window.innerHeight;
        const progress = (window.scrollY / scrollable) * 100;
        bar.style.width = progress + '%';
    }, { passive: true });
}

/* ==========================================================
   CONTADORES ANIMADOS
   ========================================================== */
function initCounters() {
    document.querySelectorAll('.stat-number').forEach(el => {
        const target = parseInt(el.dataset.target, 10);
        if (isNaN(target)) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounter(el, target);
                    observer.unobserve(el);
                }
            });
        }, { threshold: 0.5 });
        observer.observe(el);
    });
}

function animateCounter(el, target, duration = 2000) {
    let start = 0;
    const step = Math.ceil(target / (duration / 16));
    const timer = setInterval(() => {
        start += step;
        if (start >= target) {
            start = target;
            clearInterval(timer);
        }
        el.textContent = start;
    }, 16);
}

/* ==========================================================
   PARTICLES
   ========================================================== */
function initParticles() {
    if (typeof tsParticles !== 'undefined' && document.getElementById('particles-container')) {
        tsParticles.load('particles-container', {
            fpsLimit: 60,
            particles: {
                number: { value: 35, density: { enable: true } },
                color: { value: '#ffffff' },
                shape: { type: 'circle' },
                opacity: { value: 0.25, random: true },
                size: { value: 3, random: { enable: true, minimumValue: 1 } },
                links: { enable: false },
                move: {
                    enable: true,
                    speed: 0.6,
                    direction: 'none',
                    random: true,
                    straight: false,
                    outModes: 'bounce'
                }
            },
            interactivity: {
                events: {
                    onHover: { enable: true, mode: 'bubble' },
                    onClick: { enable: true, mode: 'push' }
                },
                modes: {
                    bubble: { distance: 150, size: 5, opacity: 0.4 },
                    push: { quantity: 3 }
                }
            },
            background: { color: 'transparent' },
            detectRetina: true
        });
    }
}

/* ==========================================================
   VIEW TRANSITIONS API (Progressive Enhancement)
   ========================================================== */
function navigateTo(componentPath) {
    const mainContent = document.getElementById('main-content');
    const loader = document.getElementById('page-loader');

    const doNavigation = () => {
        if (loader) loader.classList.add('active');
        mainContent.classList.add('page-exiting');

        setTimeout(() => {
            fetch(componentPath)
                .then(response => {
                    if (!response.ok) throw new Error("No se encontró " + componentPath);
                    return response.text();
                })
                .then(data => {
                    mainContent.innerHTML = data;
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                    mainContent.classList.remove('page-exiting');

                    initInteractiveElements();
                    loadMaestrosTicker();
                    initScrollAnimations();
                    initScrollIndicator();
                    initRippleEffect();
                    initTilt3D();
                    initCounters();
                    initParticles();

                    if (loader) loader.classList.remove('active');
                })
                .catch(err => {
                    console.error(err);
                    mainContent.innerHTML = `
                        <div style="text-align:center;padding:80px 20px;">
                            <h2 style="color:var(--primary-color);">Página no encontrada</h2>
                            <p style="color:#666;margin-bottom:20px;">Lo sentimos, no pudimos cargar esta sección.</p>
                            <a href="#" onclick="navigateTo('components/home.html')" class="btn-primary">Ir al inicio</a>
                        </div>
                    `;
                    mainContent.classList.remove('page-exiting');
                    if (loader) loader.classList.remove('active');
                });
        }, 150);
    };

    if (document.startViewTransition) {
        document.startViewTransition(doNavigation);
    } else {
        doNavigation();
    }
}

/* ==========================================================
   INICIALIZACIÓN GLOBAL
   ========================================================== */
document.addEventListener('DOMContentLoaded', () => {
    initDarkMode();
    initScrollProgress();
    initTilt3D();
    initCounters();
    initParticles();
    setTimeout(() => {
        initRippleEffect();
        initScrollAnimations();
        initScrollIndicator();
    }, 100);
});
