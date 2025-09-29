class Cart extends HTMLElement {
    async connectedCallback() {
        this.innerHTML = `<h5 class="mb-3 mt-3">Košík:</h5><div id="product-list" class="row"></div><div id="cart-total" class="mt-4 fw-bold"></div>`;

        const cart = JSON.parse(localStorage.getItem("cart")) || {};

        if (Object.keys(cart).length === 0) {
            this.querySelector("#product-list").innerHTML = "<p>Košík je prázdny.</p>";
            return;
        }

        try {
            const response = await fetch('http://localhost:3030/products.json');
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            const productList = this.querySelector("#product-list");

            let total = 0;

            Object.entries(cart).forEach(([productId, quantity]) => {
                const product = data[productId];
                if (!product) return;

                const subtotal = product.price * quantity;
                total += subtotal;

                const productEl = document.createElement("div");
                productEl.className = "col-12 col-sm-6 col-md-4 col-lg-3 mb-4";
                productEl.innerHTML = `
                    <div class="card h-100">
                        <img src="${product.imageUrl}" class="card-img-top mt-3" alt="${product.name}" style="max-height: 300px; object-fit: cover;">
                        <div class="card-body">
                            <h6 class="card-title">${product.name}</h6>
                            <p class="card-text">Cena: ${product.price} €</p>
                            <p class="card-text">Počet: ${quantity} ks</p>
                            <p class="card-text">Spolu: ${subtotal.toFixed(2)} €</p>
                        </div>
                    </div>
                `;
                productList.appendChild(productEl);
            });

            this.querySelector("#cart-total").textContent = `Celková cena: ${total.toFixed(2)} €`;

        } catch (error) {
            console.error('Failed to load products.json:', error);
        }
    }
}

window.customElements.define("cart-view", Cart);
