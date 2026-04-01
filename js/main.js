// Agrupamos la lógica en una función reutilizable
function initInteractiveElements() {
    // 1. Lógica de los Acordeones
    const accordions = document.querySelectorAll('.accordion-header');
    
    // Primero removemos eventos anteriores para evitar duplicados si cambiamos de página
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
            } else {
                content.classList.add('open');
            }
        });
    });

    // 2. Lógica del Slider (Splide)
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
                768: {
                    gap: '1rem',
                    arrows: false,
                    perPage: 1,
                }
            }
        }).mount();
    }
}

// 3. Función de Navegación
function navigateTo(componentPath) {
    fetch(componentPath)
        .then(response => {
            if(!response.ok) throw new Error("No se encontró " + componentPath);
            return response.text();
        })
        .then(data => {
            document.getElementById('main-content').innerHTML = data;
            window.scrollTo(0, 0); 
            
            // IMPORTANTE: Volvemos a inicializar los acordeones y sliders de la nueva página cargada
            initInteractiveElements(); 
            loadMaestrosTicker();
        })
        .catch(err => console.error(err));
}

/* ==========================================================
   FUNCIONES DEL MENÚ Y NAVEGACIÓN
   ========================================================== */

// Abre y cierra el menú hamburguesa
function toggleMobileMenu() {
    const nav = document.getElementById('main-nav');
    nav.classList.toggle('active');
}

// Cierra el menú hamburguesa automáticamente al dar clic en un enlace
function closeMobileMenu() {
    const nav = document.getElementById('main-nav');
    if (nav && nav.classList.contains('active')) {
        nav.classList.remove('active');
    }
    
    // NUEVA LÍNEA: Desmarca el checkbox oculto para regresar la "X" a "Hamburguesa"
    const checkbox = document.getElementById('check-icon');
    if (checkbox) {
        checkbox.checked = false;
    }

    // Cierra también los submenús
    const dropdowns = document.querySelectorAll('.dropdown-menu');
    dropdowns.forEach(menu => menu.classList.remove('active'));
}

// Abre el submenú de "Oferta Académica" SOLO en versión móvil
function toggleDropdown(event) {
    if (window.innerWidth <= 720) {
        event.preventDefault(); // Evita que la página salte al inicio
        const dropdownMenu = event.currentTarget.nextElementSibling;
        dropdownMenu.classList.toggle('active');
    }
}

function renderMaestrosTicker() {
    const maestros = [
        {
            nombre: "Pbro. Nazario Vázquez",
            puesto: "Pastor",
            imagen: "assets/img/maestros/Nazario-Vazquez.jpg"
        },
        {
            nombre: "Juan Cavazos",
            puesto: "Maestro",
            imagen: "assets/img/maestros/Juan-Cavazos.jpg"
        },
        {
            nombre: "Pbro. Ricardo Vázquez",
            puesto: "Pastor",
            imagen: "assets/img/maestros/Ricardo-Vazquez.jpg"
        },
        {
            nombre: "Rubén Sánchez",
            puesto: "Maestro",
            imagen: "assets/img/maestros/Ruben-Sanchez.jpg"
        },
        {
            nombre: "Pbro. Oscar Brambila",
            puesto: "Pastor",
            imagen: "assets/img/maestros/Oscar-Brambila.jpg"
        },
        {
            nombre: "Rocío Garza",
            puesto: "Maestra",
            imagen: "assets/img/maestros/Rocio-Garza.jpg"
        },
        {
            nombre: "Pbro. Hector Ponce",
            puesto: "Pastor",
            imagen: "assets/img/maestros/Hector-Ponce.jpg"
        },
        {
            nombre: "Alberto Echartea",
            puesto: "Evangelista",
            imagen: "assets/img/maestros/Alberto-Echartea.jpg"
        },
    ];

    const track = document.getElementById('maestros-track');
    if (!track) return;

    let contenido = '';

    maestros.forEach(maestro => {
        contenido += `
            <div class="maestro-item">
                <img src="${maestro.imagen}" alt="${maestro.nombre}">
                <div class="maestro-info">
                    <span class="maestro-puesto">${maestro.puesto}</span>
                    <h3>${maestro.nombre}</h3>
                </div>
            </div>
        `;
    });

    // Duplicado automático
    track.innerHTML = contenido + contenido;

    // Velocidad configurable
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