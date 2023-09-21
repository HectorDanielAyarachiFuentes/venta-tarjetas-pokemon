document.addEventListener("DOMContentLoaded", function () {
    // Obtén el ID del Pokémon desde la URL
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get("id");

    // Obtén los datos de Pokémon desde el localStorage
    const pokemonData = JSON.parse(localStorage.getItem("pokemonData"));

    // Accede al Pokémon seleccionado por su ID
    const selectedPokemon = pokemonData.data[id];

    // Crea el contenido HTML con la información detallada del Pokémon
    const detalleHtml = `
        <div class="pokemon-card">
            <img src="${selectedPokemon.images.large}" alt="${selectedPokemon.name} Image">
            <p><strong>Puntos de Salud (HP):</strong> ${selectedPokemon.hp}</p>
            <p><strong>Ataque:</strong> ${selectedPokemon.attacks[0].name}</p>
            <p><strong>Descripción:</strong> ${selectedPokemon.flavorText}</p>
            <p><strong>Precio:</strong> $5.00</p>

            <button class="buy-button">Comprar</button>
            <a href="index.html" class="back-button">Volver</a>

        </div>
    `;

    // Muestra los detalles del Pokémon seleccionado en el contenedor correspondiente
    const pokemonDetails = document.getElementById("pokemon-details");
    pokemonDetails.innerHTML = detalleHtml;
});

function realizarCompra() {
    // Obtener la cantidad y el precio
    const cantidad = parseFloat(document.getElementById('quantity').value);
    const precioUnitario = parseFloat(document.getElementById('total-price').textContent.replace('$', ''));

    // Calcular el precio total
    const precioTotal = cantidad * precioUnitario;

    // Dar formato al precio total con dos decimales
    const precioTotalFormateado = precioTotal.toFixed(2);

    // Mostrar una alerta de confirmación
    const confirmacion = window.confirm(`El precio total es: $${precioTotalFormateado}. ¿Deseas realizar la compra?`);

    if (confirmacion) {
        // Cambiar el texto del botón
        const botonCompra = document.querySelector('.buy-button');
        botonCompra.textContent = 'Producto Enviado';

        // Simular el envío del producto (aquí puedes agregar lógica adicional si es necesario)
        setTimeout(() => {
            window.alert('Producto enviado. ¡Gracias por tu compra!');
        }, 2000); // Simulamos el envío después de 2 segundos

        // Deshabilitar el botón después de la compra
        botonCompra.disabled = true;
    }
}
