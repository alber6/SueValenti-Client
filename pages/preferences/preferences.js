export const toggleTheme = () => {
    const themeBtn = document.querySelector("#themeBtn");
    const body = document.body;

    // 1. Cambiamos la clase del body
    body.classList.toggle("light");

    // 2. Cambiamos el icono basándonos en si tiene la clase o no
    if (body.classList.contains("light")) {
        themeBtn.innerText = "☾"; // Luna (modo claro activado, mostrar opción ir a oscuro)
    } else {
        themeBtn.innerText = "☀"; // Sol (modo oscuro activado)
    }
};