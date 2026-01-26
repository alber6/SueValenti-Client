

// Helpers internos
const precioConIVA = (precio = 0, iva = 0.21) => precio + (precio * iva);
const aEuros = (importe) => `${importe.toFixed(2)} €`;

// Función auxiliar para actualizar el numerito del botón
const actualizarContadorHeader = () => {
    const contador = document.querySelector("#contador-carrito");
    // Sumamos la cantidad de todos los productos en el array
    const totalUnidades = carrito.reduce((acc, item) => acc + item.cantidad, 0);
    
    if (contador) {
        contador.textContent = `(${totalUnidades})`;
    }
};

const buscarProducto = async (id) => {
    try {
        const respuesta = await fetch('/data/sesiones.json');
        const sesiones = await respuesta.json();
        // Convertimos a Number para asegurar que coincida con el ID del JSON
        return sesiones.find(s => s.id === Number(id));
    } catch (error) {
        console.error("Error buscando producto:", error);
    }
};

// Estado del carrito
let carrito = [];

// --- LOGICA DE DATOS (MODELO) ---

export const agregar = async (idSesion) => {
    const s = await buscarProducto(idSesion);
    
    if (!s) {
        console.error("Producto no encontrado");
        return;
    }

    const linea = carrito.find(l => l.id === s.id);

    if (linea) {
        linea.cantidad += 1;
        linea.subtotal = linea.cantidad * s.precio;
    } else {
        carrito.push({ 
            id: s.id, 
            nombre: s.nombre, 
            cantidad: 1, 
            subtotal: s.precio 
        });
    }

    // BUENA PRÁCTICA: Aquí solo confirmamos la acción. 
    // NO intentamos pintar el carrito porque el usuario está en la vista de Sesiones.
    console.log("Carrito actualizado:", carrito);
    actualizarContadorHeader();
    
    // Opcional: Si quieres un efecto visual rápido en el botón
    const btn = document.getElementById("btnCarrito");
    btn.style.transform = "scale(1.2)";
    setTimeout(() => btn.style.transform = "scale(1)", 200);
};

const eliminarProducto = (idSesion) => {
    const index = carrito.findIndex(p => p.id === idSesion);
    if (index !== -1) {
        carrito.splice(index, 1);
        // Aquí SÍ redibujamos porque estamos dentro de la vista carrito
        dibujarCarrito(carrito);
        actualizarContadorHeader();
    }
};

const vaciarCarritoLogic = () => {
    carrito.length = 0;
    dibujarCarrito(carrito);
    actualizarContadorHeader();
};

// --- LOGICA VISUAL (VISTA) ---

const dibujarCarrito = (lineas = []) => {
    const ulCarrito = document.querySelector("#listaCarrito");
    const txtTotal = document.querySelector("#txtTotal");
    const txtUds = document.querySelector("#txtUnidades");
    const btnVaciar = document.querySelector("#btnVaciar");

    // CLÁUSULA DE GUARDIA: Si no existe el HTML del carrito, salimos sin error.
    if (!ulCarrito) return;

    ulCarrito.innerHTML = "";
    let tUnidades = 0;
    let tImporte = 0;

    lineas.forEach(l => {
        const li = document.createElement("li");
        // Añadimos clases para CSS
        li.className = "cart-item"; 
        li.textContent = `${l.nombre} - ${l.cantidad} uds - ${aEuros(l.subtotal)} `;
        
        const button = document.createElement("button");
        button.textContent = "Quitar";
        button.className = "btn btn-danger"; // Clase para estilo rojo si quieres
        
        // Evento directo al botón de eliminar
        button.addEventListener('click', () => eliminarProducto(l.id));

        li.appendChild(button);
        ulCarrito.appendChild(li);

        tUnidades += l.cantidad;
        tImporte += l.subtotal;
    });

    // Actualizamos totales
    if (txtUds) txtUds.textContent = `${tUnidades} ud`;
    if (txtTotal) txtTotal.textContent = `Total con IVA: ${aEuros(precioConIVA(tImporte))}`;

    // Asignamos el evento vaciar (reemplazando el nodo para limpiar eventos viejos es un truco, 
    // pero aquí simplemente verificamos si ya tiene listener o lo sobrescribimos)
    if (btnVaciar) {
        btnVaciar.onclick = vaciarCarritoLogic;
    }
};

// Esta es la función que llamaremos desde functions.js al entrar en la sección
export const renderizarCarrito = () => {
    dibujarCarrito(carrito);
};