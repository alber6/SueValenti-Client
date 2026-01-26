

export const Sessions = async () => {
    try {
        const respuesta = await fetch('/data/sesiones.json');
        if (!respuesta.ok) throw new Error("Error al cargar el JSON");
        
        const sesiones = await respuesta.json();

        const sesionesHTML = sesiones.map(s => `
            <div class="card-sesion">
                <h4>${s.nombre}</h4>
                <p>Descripción: ${s.descripcion}</p>
                <p class="price">${s.precio}€</p>
                <button class="btn btn-add" id="${s.id}">Añadir</button> 
            </div>
        `).join("");

        return `<div class="sessions-grid">${sesionesHTML}</div>`;
    } catch (error) {
        console.error(error);
        return "<p>Hubo un error cargando las sesiones.</p>";
    }
}

