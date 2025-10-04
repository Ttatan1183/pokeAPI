// Selecciona el elemento donde irá el nombre
const nombrePokemon = document.getElementById("nombre_pokemon");

// Selecciona la imagen donde se mostrará el Pokémon
const imgPokemon = document.getElementById("img");

const peticionAPI = async () => { // Función para pedir datos a la API

    // Hace la petición a la API de Pokémon.
    const peticionGET = await fetch("https://pokeapi.co/api/v2/pokemon/pikachu");

    // Convierte la respuesta en JSON
    const datosPokemon = await peticionGET.json();

    // Muestra en consola la URL de la imagen
    console.log(datosPokemon.sprites.other.dream_world.front_default);

    // Guarda la imagen de Pikachu
    const imagenPikachu = datosPokemon.sprites.other.dream_world.front_default;
    // Pone la imagen en el <img>
    imgPokemon.src = imagenPikachu;

    // Guarda el nombre del Pokémon
    const nombrePikachu = datosPokemon.name;
    // Pone el nombre en el HTML
    nombrePokemon.textContent = nombrePikachu;
};

// Ejecuta la función
peticionAPI();