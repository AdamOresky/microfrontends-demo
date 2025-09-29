class RecommendedProducts extends HTMLElement {
    async connectedCallback() {
        this.innerHTML = `<h5 class="mb-3 mt-5">Odporúčané produkty:</h5><div id="product-list" class="row"></div>`;

        try {
            const response = await fetch('http://localhost:3030/products.json');
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();
            const productList = this.querySelector("#product-list");

            // Get productId from URL
            const urlParams = new URLSearchParams(window.location.search);
            const productId = urlParams.get("productId");

            const currentProduct = data[productId];
            if (!currentProduct || !currentProduct.recommendations) return;

            currentProduct.recommendations
                .filter(id => data[id]) // ensure the recommended product exists
                .forEach(recId => {
                    const product = data[recId];
                    const productEl = document.createElement("div");
                    productEl.className = "col-12 col-sm-6 col-md-4 col-lg-3 mb-4";
                    productEl.innerHTML = `
                        <a href="http://localhost:3002/product?productId=${recId}" style="text-decoration: none; color: inherit;">
                            <div class="card h-100">
                                <img src="${product.imageUrl}" class="card-img-top mt-3" alt="${product.name}" style="max-height: 300px; object-fit: cover;">
                                <div class="card-body">
                                    <h6 class="card-title">${product.name}</h6>
                                    <p class="card-text">${product.price} €</p>
                                </div>
                            </div>
                        </a>
                    `;
                    productList.appendChild(productEl);
                });

        } catch (error) {
            console.error('Failed to load products.json:', error);
        }
    }
}

window.customElements.define("recommended-products", RecommendedProducts);
