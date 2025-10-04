// --- 1. SELECCIÓN DE ELEMENTOS ---
const $ = (id) => document.getElementById(id); // Función helper

// Elementos de la tarjeta
const pokemonCardEl = $("pokemonCard");
const cardTitleEl = $("cardTitle");
const resultNameEl = $("result_name");
const resultImgEl = $("result_img");

// Nuevos elementos para los datos adicionales
const pokemonIdEl = $("pokemon-id");
const pokemonHeightEl = $("pokemon-height");
const pokemonWeightEl = $("pokemon-weight");
const pokemonAbilitiesEl = $("pokemon-abilities");

// Elementos del buscador
const inputPokemonEl = $("inputPokemon");
const btnBuscarEl = $("btnBuscar");
const statusMessageEl = $("statusMessage");

// --- 2. LÓGICA DE LA API ---

// Función para obtener los datos. Funciona con nombre o ID.
const getPokemonData = async (pokemonIdentifier) => {
    const url = `https://pokeapi.co/api/v2/pokemon/${pokemonIdentifier.toLowerCase()}`;
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error("Pokémon no encontrado. Revisa el nombre o ID.");
    }
    return response.json();
};

// Función para mostrar los datos en la tarjeta
const displayPokemon = (data) => {
    cardTitleEl.textContent = "¡Pokémon Encontrado!";
    resultNameEl.textContent = data.name;
    resultImgEl.src = data.sprites.other.dream_world.front_default || data.sprites.front_default;
    resultImgEl.alt = `Imagen de ${data.name}`;

    // Mostramos los datos adicionales
    pokemonIdEl.textContent = `ID: #${data.id}`;
    pokemonHeightEl.textContent = `Altura: ${data.height / 10} m`; // Convertir a metros
    pokemonWeightEl.textContent = `Peso: ${data.weight / 10} kg`; // Convertir a kg

    // Limpiamos la lista de habilidades anterior
    pokemonAbilitiesEl.innerHTML = '';
    // Llenamos la lista con las nuevas habilidades
    data.abilities.forEach(abilityInfo => {
        const listItem = document.createElement('li');
        listItem.textContent = abilityInfo.ability.name;
        pokemonAbilitiesEl.appendChild(listItem);
    });

    pokemonCardEl.style.display = 'flex'; // Usamos flex para que se vea bien
};

// --- 3. MANEJO DE ESTADOS DE UI (CARGA Y ERRORES) ---
const setUIState = (isLoading, message = "") => {
    statusMessageEl.textContent = message;
    statusMessageEl.style.display = message ? 'block' : 'none';
    btnBuscarEl.disabled = isLoading;

    if (isLoading) {
        cardTitleEl.textContent = "Buscando...";
        pokemonCardEl.style.display = 'flex';
        resultNameEl.textContent = "";
        resultImgEl.src = "";
        pokemonIdEl.textContent = "";
        pokemonHeightEl.textContent = "";
        pokemonWeightEl.textContent = "";
        pokemonAbilitiesEl.innerHTML = "";
    }
};

// --- 4. LÓGICA PRINCIPAL DE BÚSQUEDA ---
const searchPokemon = async () => {
    const query = inputPokemonEl.value.trim();
    if (!query) {
        setUIState(false, "Por favor, escribe un nombre o ID.");
        return;
    }

    setUIState(true); // Inicia el estado de carga

    try {
        const pokemonData = await getPokemonData(query);
        displayPokemon(pokemonData);
        setUIState(false, `¡${pokemonData.name} encontrado!`);
    } catch (error) {
        pokemonCardEl.style.display = 'none'; // Oculta la tarjeta si hay error
        setUIState(false, error.message);
    }
};

// --- 5. EVENT LISTENERS ---
const loadInitialPokemon = async () => {
    setUIState(true, "Cargando Pokémon inicial...");
    try {
        const initialPokemon = await getPokemonData("pikachu");
        displayPokemon(initialPokemon);
        cardTitleEl.textContent = "Pokémon Inicial (Pikachu)";
        setUIState(false);
    } catch (error) {
        setUIState(false, "No se pudo cargar el Pokémon inicial.");
    }
}

// Cargar Pikachu al iniciar
document.addEventListener("DOMContentLoaded", loadInitialPokemon);

// Buscar al hacer clic en el botón
btnBuscarEl.addEventListener("click", searchPokemon);

// Buscar al presionar "Enter" en el input
inputPokemonEl.addEventListener("keypress", (e) => {
    if (e.key === 'Enter') {
        searchPokemon();
    }
});