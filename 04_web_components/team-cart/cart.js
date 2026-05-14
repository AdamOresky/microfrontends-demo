function getCartFromCookie() {
    const entry = document.cookie
        .split("; ")
        .find((row) => row.startsWith("cart="));
    if (!entry) return {};
    try {
        const value = entry.split("=")[1];
        return JSON.parse(decodeURIComponent(value));
    } catch (e) {
        console.error("Cannot parse cart cookie", e);
        return {};
    }
}

function saveCartToCookie(cart) {
    const value = encodeURIComponent(JSON.stringify(cart));
    document.cookie = `cart=${value}; Path=/; SameSite=Lax`;
}

class Cart extends HTMLElement {
    async connectedCallback() {
        if (window.setupElementTeamFrame) window.setupElementTeamFrame(this, 'Orchid');
        this.innerHTML = `
      <h5 class="mb-3 mt-3">Košík:</h5>
      <div id="product-list" class="row text-center"></div>
       <div class="row text-center">
            <div id="cart-total" class="mt-2 fw-bold"></div>
            <div id="finish-button" class="mt-2 mb-2"></div>
        </div>
    `;

        this._handleCartChanged = () => this.renderCart();
        window.addEventListener("cart-changed", this._handleCartChanged);

        this._handleClick = (e) => this.onClick(e);
        this.addEventListener("click", this._handleClick);

        await this.renderCart();
    }

    disconnectedCallback() {
        if (this._handleCartChanged) {
            window.removeEventListener("cart-changed", this._handleCartChanged);
        }
        if (this._handleClick) {
            this.removeEventListener("click", this._handleClick);
        }
    }

    onClick(e) {
        const checkoutBtn = e.target.closest(".cart-checkout");
        if (checkoutBtn) {
            const cart = {};
            saveCartToCookie(cart);
            try {
                localStorage.removeItem("cart");
            } catch (err) {
                console.warn("Cannot clear localStorage cart", err);
            }
            window.dispatchEvent(
                new CustomEvent("cart-changed", { detail: { cart: {} } })
            );
            this.renderCart();
            alert("Objednávka dokončená.");
            return;
        }

        const decreaseButton = e.target.closest(".cart-decrease");
        const increaserButton = e.target.closest(".cart-increase");
        const removeButton = e.target.closest(".cart-remove");

        if (!decreaseButton && !increaserButton && !removeButton) return;

        const source = decreaseButton || increaserButton || removeButton;
        const productId = source.dataset.productId;
        if (!productId) return;

        let cart = getCartFromCookie();

        if (increaserButton) {
            cart[productId] = (cart[productId] || 0) + 1;
        } else if (decreaseButton) {
            if (!cart[productId]) return;
            cart[productId] = cart[productId] - 1;
            if (cart[productId] <= 0) {
                delete cart[productId];
            }
        } else if (removeButton) {
            delete cart[productId];
        }

        saveCartToCookie(cart);
        this.renderCart();
    }

    async renderCart() {
        const productList = this.querySelector("#product-list");
        const totalEl = this.querySelector("#cart-total");
        const finishButton = this.querySelector("#finish-button");

        let cart = getCartFromCookie();

        if (!Object.keys(cart).length) {
            productList.innerHTML = "<p>Košík je prázdny.</p>";
            totalEl.textContent = "";
            finishButton.textContent = "";
            return;
        }

        try {
            const response = await fetch('http://localhost:3030/products.json');
            if (!response.ok) {
                throw new Error(response.statusText);
            }

            const data = await response.json();
            productList.innerHTML = "";

            let total = 0;

            Object.entries(cart).forEach(([productId, quantity]) => {
                const product = data[productId];
                if (!product) return;

                const subtotal = product.price * quantity;
                total += subtotal;

                const productEl = document.createElement("div");
                productEl.className = "col-12 col-sm-6 col-md-4 col-lg-3 mb-4";
                productEl.innerHTML = `
          <div class="card h-100 d-flex flex-column">
            <img
              src="${product.imageUrl}"
              class="card-img-top mt-3"
              alt="${product.name}"
              style="max-height: 300px; object-fit: cover;"
            >
            <div class="card-body d-flex flex-column">
              <h6 class="mb-3">${product.name}</h6>
              <p class="p-0 mb-1">Cena: ${product.price} €</p>
              <p class="p-0 mb-1">Počet: ${quantity} ks</p>
              <p class="p-0 mb-3">Spolu: ${subtotal.toLocaleString()} €</p>
              <div class="mt-auto d-flex align-items-center justify-content-between">
                <div class="btn-group btn-group-sm" role="group">
                  <button
                    type="button"
                    class="btn btn-outline-secondary cart-decrease"
                    data-product-id="${productId}"
                  >−</button>
                  <button
                    type="button"
                    class="btn btn-outline-secondary cart-increase"
                    data-product-id="${productId}"
                  >+</button>
                </div>
                <button
                  type="button"
                  class="btn btn-outline-danger btn-sm cart-remove"
                  data-product-id="${productId}"
                >Odstrániť</button>
              </div>
            </div>
          </div>
        `;
                productList.appendChild(productEl);
            });

            totalEl.textContent = `Celková cena: ${total} €`;

            finishButton.innerHTML = `
                <button type="button" class="btn btn-success cart-checkout">
                    Dokončiť objednávku
                </button>`
        } catch (error) {
            console.error('Failed to load products.json:', error);
            productList.innerHTML = "<p>Nepodarilo sa načítať košík.</p>";
            totalEl.textContent = "";
        }
    }
}

window.customElements.define("cart-view", Cart);
