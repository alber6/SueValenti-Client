import { home } from "./pages/home/Home.js"
import { agregar, renderizarCarrito } from "./pages/carrito/carrito.js";
import { Sessions } from "./pages/sessions/Sessions.js";
import { toggleTheme } from "./pages/preferences/preferences.js";

export const Inicio = () => {
    const body = document.querySelector("body");
    
    // Crear o recuperar container
    let container = document.getElementById("container");
    if (!container) {
        container = document.createElement("div");
        container.id = "container";
    }

    const header = document.createElement("header");
    const footer = document.createElement("footer");

    header.innerHTML = `
    <h1>Sueños Valenti – Sesiones Interactivas</h1>
    <p>Bienvenido. Selecciona una opción para continuar.</p>
    <div class="botones">
        <button class="btn" id="btnHome">Inicio</button>
        <button class="btn" id="btnSessions">Sesiones</button>
        <button class="btn" id="btnCarrito">🛒 Carrito <span id="contador-carrito"> 0 </span></button>
        <button class="btn" id="btnPreferencias">Preferencias</button>
    </div>
    `;

    footer.innerHTML = `
    <div class="footer-content">
        <p>&copy; 2024 Sueños Valenti. Todos los derechos reservados.</p>
        <div class="footer-links">
            <a href="#">Instagram</a> | 
            <a href="#">Aviso Legal</a> | 
            <a href="#">Contacto</a>
        </div>
        <p class="small">Elevando la consciencia, una sesión a la vez.</p>
    </div>
    `;

    // Lógica para insertar header solo si no existe
    if (!document.querySelector("header")) {
        body.insertBefore(header, container);
    }
    
    container.innerHTML = home;
    
    if (!document.querySelector("footer")) {
        body.appendChild(footer);
    }
};

export const Butons = () => {
    const container = document.getElementById("container");
    const botonesNavegacion = document.querySelectorAll(".botones .btn");

    // 1. DELEGACIÓN DE EVENTOS (Para los botones "Añadir" de las sesiones)
    // Escuchamos en el contenedor porque los botones de sesiones se crean dinámicamente
    container.addEventListener("click", (ev) => {
        // Verificamos si lo que se pulsó tiene la clase 'btn-add'
        if (ev.target.classList.contains("btn-add")) {
            const idProducto = ev.target.id;
            agregar(idProducto); // Llama a la lógica de datos
        }
        if (ev.target.id === "themeBtn") {
            toggleTheme(); // Llamamos a la lógica limpia
        }
        if (ev.target.id === "linkIrSesiones"){
            document.getElementById("btnSessions").click()
        }
    });

    // 2. NAVEGACIÓN PRINCIPAL
    botonesNavegacion.forEach((boton) => {
        boton.addEventListener("click", async (e) => {
            const id = e.target.id;

            if (id === "btnHome") {
                container.innerHTML = home;
            } 
            else if (id === "btnSessions") {
                container.innerHTML = "<p>Cargando catálogo...</p>";
                const htmlSesiones = await Sessions();
                container.innerHTML = htmlSesiones;
            } 
            else if (id === "btnCarrito") {
                // Primero pintamos la estructura HTML del carrito
                container.innerHTML = `
                <section class="card">
                    <h3>Carrito de Compras</h3>
                    <ul id="listaCarrito" class="list"></ul>
                    <div class="cart-summary">
                        <p>Unidades: <span id="txtUnidades">0 ud</span></p>
                        <p>Total: <strong id="txtTotal">0.00 €</strong></p>
                    </div>
                    <button id="btnVaciar" class="btn">Vaciar Carrito</button>
                </section>`;

                // Después llamamos a la función que rellena los datos
                renderizarCarrito();
            } 
            else if (id === "btnPreferencias") {
                container.innerHTML = `
                <div id="apariencia">
                    <h2>Apariencia</h2>
                    <p>Cambia el tema visual</p>
                    <button id="themeBtn">☀</button>
                </div>
                `;
            }
        });
    });
};