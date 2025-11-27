(async function () {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get("id");

    fetch("http://localhost:3030/products.json")
        .then(r => r.json())
        .then(async data => {
            const p = data[productId];
            const c = document.getElementById("product-container");

            if (!p) {
                c.innerHTML = "<p>Produkt nebol nájdený.</p>";
                return;
            }

            document.title = p.name;

            c.innerHTML = `
                <h2>${p.name}</h2>
                <div class="col-4 mt-3">
                    <img class="image img-fluid" src="${p.imageUrl}" alt="${p.name}">
                </div>
                <div class="col-8 mt-3">
                    <p>${p.description}</p>
                    <p>Dostupných: ${p.stock} ks</p>
                    <p>Cena: ${p.price} €</p>
                </div>
            `;

            await import("http://localhost:3002/static/recommendation.js");

            if (window.renderRecommendations) {
                window.renderRecommendations(productId);
            }
        })
        .catch(err => {
            console.error(err);
            document.getElementById("product-container").innerHTML =
                "<p>Nepodarilo sa načítať dáta produktu.</p>";
        });
})();
