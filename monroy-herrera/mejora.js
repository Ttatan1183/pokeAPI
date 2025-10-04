// --- 1. SELECCIÓN DE ELEMENTOS ---
const $ = (id) => document.getElementById(id); // Función helper corta

// Variables de la única tarjeta
const tarjetaPokemonEl = $("pokemonCard");
const tituloTarjetaEl = $("cardTitle");
const nombreResultadoEl = $("result_name");
const imagenResultadoEl = $("result_img");

// Variables del buscador
const inputBuscar = $("inputPokemon");
const botonBuscar = $("btnBuscar");
const mensajeEstadoEl = $("statusMessage");

// --- 2. FUNCIONES DE PROMESA Y API ---

/**
 * Obtiene los datos del Pokémon de la API.
 * @param {string} nombre El nombre o ID del Pokémon a buscar.
 * @returns {Promise<object>} Los datos del Pokémon en formato JSON.
 * @throws {Error} Si el Pokémon no se encuentra.
 */

const obtenerDatosPokemon = async (nombre) => {
    // Convierte el nombre a minúsculas para la URL de la API
    const url = `https://pokeapi.co/api/v2/pokemon/${nombre.toLowerCase()}`;
    const respuesta = await fetch(url);

    // Verifica si la respuesta es exitosa (status 200-299)
    if (!respuesta.ok) {
        // Tira un error si no encuentra el Pokémon (ej: status 404)
        throw new Error("Pokémon no encontrado. Verifique el nombre.");
    }

    // Devuelve el JSON
    return respuesta.json();
};

/**
 * Pinta el nombre y la imagen en la única tarjeta.
 * @param {object} datos El objeto JSON con los datos del Pokémon.
 */
const mostrarPokemonEnTarjeta = (datos) => {
    // Actualiza el título y el nombre del Pokémon
    tituloTarjetaEl.textContent = "¡Pokémon Encontrado!"; // Título genérico al encontrar
    nombreResultadoEl.textContent = datos.name;

    // Lógica para la imagen: intenta usar la imagen de "dream world" (alta calidad)
    // y si no existe, usa la imagen estándar (sprites.front_default)
    const urlImagen = datos.sprites.other.dream_world.front_default || datos.sprites.front_default;
    imagenResultadoEl.src = urlImagen;

    // Actualiza el texto alternativo (alt) de la imagen
    imagenResultadoEl.alt = `Imagen de ${datos.name}`;

    // Asegura que la tarjeta esté visible (en caso de que estuviera oculta)
    tarjetaPokemonEl.style.display = 'block';
};

// --- 3. UTILIDAD PARA EL ESTADO (Carga y Errores) ---
/**
 * Actualiza la interfaz de usuario para reflejar el estado de la aplicación (cargando, error, o finalizado).
 * @param {boolean} cargando Indica si la aplicación está en estado de carga (true) o ha terminado (false).
 * @param {string} mensaje El mensaje a mostrar en la caja de estado.
 */
const actualizarEstadoUI = ({
    cargando,
    mensaje = ""
}) => {
    mensajeEstadoEl.textContent = mensaje;
    botonBuscar.disabled = cargando; // Deshabilita el botón

    if (cargando) {
        tituloTarjetaEl.textContent = "Buscando...";
        nombreResultadoEl.textContent = "Cargando...";
        imagenResultadoEl.src = "";
        nombreResultadoEl.classList.add('loading'); // Aplica animación de carga
        tarjetaPokemonEl.style.display = 'block';
    } else {
        nombreResultadoEl.classList.remove('loading'); // Quita animación
        // La tarjeta se mantiene visible.
    }
};

// --- 4. CARGA INICIAL (Pikachu) ---
/**
 * Carga los datos de Pikachu al iniciar la aplicación.
 */
const cargarPokemonPorDefecto = async () => {
    // 1. Inicia el estado de carga en la UI (deshabilita botón, muestra "Cargando...")
    actualizarEstadoUI({
        cargando: true
    });

    try {
        // 2. Obtiene los datos de Pikachu
        const datos = await obtenerDatosPokemon("pikachu");

        // 3. Pinta los datos en la tarjeta
        mostrarPokemonEnTarjeta(datos);

        // 4. Sobreescribe el título para darle un toque especial al Pokémon inicial
        tituloTarjetaEl.textContent = "Pokémon Inicial (Pikachu)"; 
        
    } catch (error) {
        // 5. Manejo de errores: Si falla la carga inicial (ej. sin conexión)
        tituloTarjetaEl.textContent = "Error de Carga";
        nombreResultadoEl.textContent = "No se pudo cargar el Pokémon inicial.";
        // Nota: La tarjeta se mantiene visible para mostrar el error.
        
    } finally {
        // 6. Finaliza el estado de carga (se ejecuta siempre)
        nombreResultadoEl.classList.remove('loading');
        botonBuscar.disabled = false;
        
    }
};

// --- 5. LÓGICA PRINCIPAL DE BÚSQUEDA (Solo por Nombre) ---

/**
 * Función asíncrona principal que maneja la búsqueda de un Pokémon.
 */
const buscarPokemon = async () => {
    // Obtiene el valor del input, elimina espacios en blanco y lo guarda en 'nombre'
    const nombre = inputBuscar.value.trim();

    // 1. VALIDACIÓN DE INPUT VACÍO
    if (!nombre) {
        mensajeEstadoEl.textContent = "Debe escribir un nombre para buscar.";
        return; // Para la función si está vacío
    }

    // 2. VALIDACIÓN: Bloquea si es un número (es decir, un ID).
    // La expresión regular /^\d+$/ verifica si la cadena completa son solo dígitos.
    if (/^\d+$/.test(nombre)) {
        mensajeEstadoEl.textContent = "Búsqueda por ID no permitida. Use el nombre del Pokémon.";
        return;
    }

    // Muestra carga antes de llamar a la API
    actualizarEstadoUI({
        cargando: true
    });
    tituloTarjetaEl.textContent = "Buscando Pokémon...";

    try {
        // Llama a la API (la función obtenerDatosPokemon es donde está el fetch)
        const datos = await obtenerDatosPokemon(nombre); 

        // 3. ÉXITO
        mostrarPokemonEnTarjeta(datos);
        
        // Finaliza la carga y muestra mensaje de éxito
        actualizarEstadoUI({
            cargando: false, 
            mensaje: `¡${datos.name} encontrado!`
        });
        
        // Limpia el input después de una búsqueda exitosa
        inputBuscar.value = ""; 

    } catch (error) {
        // 4. ERROR
        tituloTarjetaEl.textContent = "Pokémon No Encontrado";
        nombreResultadoEl.textContent = "No encontrado";
        
        // Muestra una imagen de error (URL de la imagen de un 404)
        imagenResultadoEl.src = "https://placeholder.co/150x150/d63031/ffffff?text=404"; 

        // Finaliza la carga y muestra el mensaje de error capturado
        actualizarEstadoUI({
            cargando: false, 
            mensaje: error.message
        });
    }
};

// // --- 6. EVENT LISTENERS ---

// Espera a que todo el DOM esté completamente cargado antes de ejecutar el código
document.addEventListener("DOMContentLoaded", () => {
    cargarPokemonPorDefecto(); // Carga Pikachu al iniciar
    
    // Conecta el clic del botón de búsqueda a la función buscarPokemon
    botonBuscar.addEventListener("click", buscarPokemon); 
    
    // Conecta la pulsación de la tecla al campo de input
    inputBuscar.addEventListener("keypress", (e) => {
        // Verifica si la tecla presionada es 'Enter'
        if (e.key === 'Enter') {
            buscarPokemon(); // Llama a la función de búsqueda
        }
    });
});