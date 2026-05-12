function showLoader() {
    const loader = document.getElementById('page-loader');
    if (loader) loader.classList.add('active');
}

function hideLoader() {
    const loader = document.getElementById('page-loader');
    if (loader) loader.classList.remove('active');
}

function loadComponent(elementId, filePath) {
    showLoader();
    return fetch(filePath)
        .then(response => {
            if (!response.ok) {
                throw new Error('No se pudo cargar ' + filePath);
            }
            return response.text();
        })
        .then(data => {
            document.getElementById(elementId).innerHTML = data;
            hideLoader();
        })
        .catch(error => {
            console.error('Error inyectando componente:', error);
            hideLoader();
            document.getElementById(elementId).innerHTML = `
                <div style="text-align:center;padding:60px 20px;">
                    <h2 style="color:var(--primary-color);">Error al cargar</h2>
                    <p style="color:#666;">No se pudo cargar el contenido. Intenta de nuevo.</p>
                    <a href="#" onclick="navigateTo('components/home.html')" class="btn-primary">Volver al inicio</a>
                </div>
            `;
        });
}

document.addEventListener("DOMContentLoaded", () => {
    loadComponent("inject-header", "components/header.html").then(() => {
        if (typeof initDarkMode === 'function') initDarkMode();
    });
    loadComponent("inject-footer", "components/footer.html");
    loadComponent("main-content", "components/home.html").then(() => {
        initInteractiveElements();
        initScrollAnimations();
        initScrollIndicator();
        initRippleEffect();
        initParticles();
        hideLoader();
    });
});
