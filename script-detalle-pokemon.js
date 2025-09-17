document.addEventListener("DOMContentLoaded", function () {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get("id");
    const pokemonDetailsContainer = document.getElementById("pokemon-details");
    const jsonURL = "cards-pokemon-1.json";

    // Muestra un loader mientras se cargan los datos
    pokemonDetailsContainer.innerHTML = `
        <div class="loader-container">
            <div class="loader"></div>
        </div>
    `;

    fetch(jsonURL)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(pokemonData => {
            if (pokemonData && pokemonData.data[id]) {
                const selectedPokemon = pokemonData.data[id];
                
                const price = getPrice(selectedPokemon);
                const priceText = price !== 'N/A' ? `$${price}` : 'No disponible';

                const detalleHtml = `
                    <div class="pokemon-card-detailed">
                        <div class="card-image">
                            <img src="${selectedPokemon.images.large}" alt="${selectedPokemon.name} Image">
                        </div>
                        <div class="card-info">
                            <h1>${selectedPokemon.name}</h1>
                            ${selectedPokemon.flavorText ? `<p class="flavor-text">"${selectedPokemon.flavorText}"</p>` : ''}
                            
                            <div class="stats">
                                <p><strong>HP:</strong> ${selectedPokemon.hp || 'N/A'}</p>
                                <p><strong>Tipo:</strong> ${selectedPokemon.types ? selectedPokemon.types.join(', ') : 'N/A'}</p>
                                <p><strong>Rareza:</strong> ${selectedPokemon.rarity || 'N/A'}</p>
                            </div>

                            ${selectedPokemon.attacks && selectedPokemon.attacks.length > 0 ? `
                            <div class="attacks">
                                <h3>Ataques</h3>
                                ${selectedPokemon.attacks.map(attack => `
                                    <div class="attack">
                                        <strong>${attack.name}</strong> (${attack.cost.join(', ')}) | Daño: ${attack.damage || '0'}
                                        <p>${attack.text}</p>
                                    </div>
                                `).join('')}
                            </div>
                            ` : ''}

                            <div class="purchase-section">
                                <p class="price"><strong>Precio:</strong> <span id="unit-price">${priceText}</span></p>
                                <div class="purchase-controls">
                                    <label for="quantity">Cantidad:</label>
                                    <input type="number" id="quantity" min="1" value="1">
                                    <button class="buy-button" onclick="realizarCompra()">Comprar</button>
                                </div>
                            </div>

                            <a href="index.html" class="back-button">‹ Volver al catálogo</a>
                        </div>
                    </div>
                `;
                pokemonDetailsContainer.innerHTML = detalleHtml;
            } else {
                // Manejar el caso en que no se encuentre el Pokémon
                pokemonDetailsContainer.innerHTML = "<p>No se pudo encontrar la información de la tarjeta. Por favor, vuelve al catálogo.</p>";
            }
        })
        .catch(error => {
            console.error("Error al cargar los detalles del Pokémon:", error);
            pokemonDetailsContainer.innerHTML = '<p style="text-align: center; color: red;">Error al cargar los detalles. Inténtalo de nuevo más tarde.</p>';
        });
});

function getPrice(pokemon) {
    if (pokemon.tcgplayer && pokemon.tcgplayer.prices) {
        const prices = pokemon.tcgplayer.prices;
        const priceSources = ['holofoil', 'reverseHolofoil', 'normal', '1stEditionHolofoil', 'unlimitedHolofoil'];
        for (const source of priceSources) {
            if (prices[source] && prices[source].market) {
                return prices[source].market.toFixed(2);
            }
        }
    }
    if (pokemon.cardmarket && pokemon.cardmarket.prices && pokemon.cardmarket.prices.averageSellPrice) {
        return pokemon.cardmarket.prices.averageSellPrice.toFixed(2);
    }
    return 'N/A';
}

function realizarCompra() {
    const priceText = document.getElementById('unit-price').textContent;
    if (priceText.includes('No disponible')) {
        window.alert('Esta tarjeta no está disponible para la compra en este momento.');
        return;
    }

    const cantidad = parseInt(document.getElementById('quantity').value, 10);
    const precioUnitario = parseFloat(priceText.replace('$', ''));

    if (isNaN(cantidad) || cantidad < 1) {
        window.alert('Por favor, introduce una cantidad válida.');
        return;
    }

    const precioTotal = cantidad * precioUnitario;
    const precioTotalFormateado = precioTotal.toFixed(2);

    const confirmacion = window.confirm(`El precio total es: $${precioTotalFormateado}. ¿Deseas realizar la compra?`);

    if (confirmacion) {
        const botonCompra = document.querySelector('.buy-button');
        botonCompra.textContent = 'Producto Enviado';
        botonCompra.disabled = true;
        
        setTimeout(() => {
            window.alert('Producto enviado. ¡Gracias por tu compra!');
        }, 1500);
    }
}
