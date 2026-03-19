// Función genérica para inyectar componentes HTML
function loadComponent(elementId, filePath) {
    return fetch(filePath) // Agregamos 'return' aquí
        .then(response => {
            if (!response.ok) {
                throw new Error('No se pudo cargar ' + filePath);
            }
            return response.text();
        })
        .then(data => {
            document.getElementById(elementId).innerHTML = data;
        })
        .catch(error => console.error('Error inyectando componente:', error));
}

// Cargar el header, footer y home al iniciar la página
document.addEventListener("DOMContentLoaded", () => {
    loadComponent("inject-header", "components/header.html");
    loadComponent("inject-footer", "components/footer.html");

    // Cargar la página de inicio y HASTA QUE TERMINE, arrancar el JS principal
    loadComponent("main-content", "components/home.html").then(() => {
        // Esta función existirá en tu main.js
        initInteractiveElements(); 
    });
});