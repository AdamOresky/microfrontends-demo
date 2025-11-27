window.renderRecommendations = function (productId) {
    const container = document.getElementById("recommendations");
    if (!container) return;

    fetch("http://localhost:3030/products.json")
        .then(r => r.json())
        .then(data => {
            const product = data[productId];
            if (!product || !product.recommendations) {
                container.innerHTML = "<p>Žiadne odporúčané produkty.</p>";
                return;
            }

            container.innerHTML = "";

            product.recommendations.forEach(recId => {
                const rec = data[recId];
                if (!rec) return;

                const col = document.createElement("div");
                col.className = "col-3 mb-4";
                col.innerHTML = `
                    <div class="card h-100 shadow-sm">
                      <img src="${rec.imageUrl}" class="card-img-top" alt="${rec.name}">
                      <div class="card-body text-center">
                        <h5 class="card-title">${rec.name}</h5>
                        <a href="product?id=${recId}">Detail produktu</a>
                      </div>
                    </div>
                `;
                container.appendChild(col);
            });
        })
        .catch(err => {
            console.error(err);
            container.innerHTML =
                "<p>Nepodarilo sa načítať odporúčané produkty.</p>";
        });
};
