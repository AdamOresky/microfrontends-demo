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

class CheckoutBuy extends HTMLElement {
    connectedCallback() {
        if (window.setupElementTeamFrame) window.setupElementTeamFrame(this, 'Orchid');
        this._handleClick = () => this.onClick();
        this.innerHTML = `
      <button class="btn btn-primary">Pridať do košíka</button>
    `;
        const btn = this.querySelector("button");
        if (btn) {
            btn.addEventListener("click", this._handleClick);
        }
    }

    disconnectedCallback() {
        const btn = this.querySelector("button");
        if (btn && this._handleClick) {
            btn.removeEventListener("click", this._handleClick);
        }
    }

    onClick() {
        let productId = this.getAttribute("product-id");

        if (!productId) {
            const params = new URLSearchParams(window.location.search);
            productId = params.get("productId");
        }

        if (!productId) {
            console.warn("buy-button: missing product-id (ani v URL)");
            return;
        }

        let cart = getCartFromCookie();
        cart[productId] = (cart[productId] || 0) + 1;
        saveCartToCookie(cart);

        window.dispatchEvent(new CustomEvent("cart-changed", { detail: { cart } }));

        alert("Produkt pridaný do košíka");
    }
}

window.customElements.define("buy-button", CheckoutBuy);
