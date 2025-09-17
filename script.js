document.addEventListener("DOMContentLoaded", function () {
    // URL del JSON (reemplaza con la ubicación real del JSON)
    const jsonURL = "cards-pokemon-1.json";

    // Elemento donde se mostrarán los Pokémon
    const pokemonContainer = document.getElementById("pokemon-container");
    const loaderContainer = document.getElementById("loader-container");

    // Promesa para el fetch de datos
    const fetchData = fetch(jsonURL).then((response) => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    });

    // Promesa para un retraso mínimo, para que el loader sea visible al menos un instante
    const minimumWait = new Promise(resolve => setTimeout(resolve, 800)); // 800ms de espera

    // Espera a que tanto el fetch como el retraso mínimo se completen
    Promise.all([fetchData, minimumWait])
        .then(([data]) => { // Desestructuramos para obtener solo 'data' del resultado
            // Oculta el loader y muestra el contenedor de las tarjetas
            if (loaderContainer) {
                loaderContainer.style.display = "none";
            }
            pokemonContainer.style.display = "grid";

            // Itera a través de los datos de los Pokémon y los muestra en cascada
            data.data.forEach((pokemonData, index) => {
                setTimeout(() => {
                    // Crea el elemento de la tarjeta
                    const cardElement = document.createElement("div");
                    cardElement.classList.add("pokemon-card");
                    if (pokemonData.types && pokemonData.types.length > 0) {
                        cardElement.dataset.pokemonType = pokemonData.types[0].toLowerCase();
                    }

                    // Crea el contenido HTML con el enlace para ver más detalles
                    // Se agrega loading="lazy" a la imagen para mejorar el rendimiento de carga
                    const htmlContent = `
                        <h2>${pokemonData.name}</h2>
                        <img src="${pokemonData.images.large}" alt="${pokemonData.name} Image" loading="lazy">

                        <div class="ver-button-container">
                            <a href="detalle-pokemon.html?id=${index}" class="ver-button">Ver más</a>
                        </div>
                    `;

                    cardElement.innerHTML = htmlContent;

                    // Agrega la tarjeta al contenedor
                    pokemonContainer.appendChild(cardElement);

                    // Se agrega la clase 'visible' para activar la transición CSS
                    requestAnimationFrame(() => {
                        cardElement.classList.add("visible");
                    });
                }, index * 100); // Retraso de 100ms entre cada tarjeta
            });
        })
        .catch((error) => {
            console.error("Error al cargar el JSON:", error);
            // Oculta el loader y muestra un mensaje de error si falla la carga
            if (loaderContainer) {
                loaderContainer.innerHTML = '<p style="text-align: center; color: red;">Error al cargar los Pokémon. Inténtalo de nuevo más tarde.</p>';
            }
        });
});