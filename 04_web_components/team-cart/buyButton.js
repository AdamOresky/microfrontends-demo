class CheckoutBuy extends HTMLElement {
    connectedCallback() {
        console.log("AAA");
        this.innerHTML = `
      <button class="btn btn-success btn-xl">Pridať do košíka</button>
    `;
        this.querySelector("button").addEventListener("click", () => {
            this.onClick();
        });
    }

    disconnectedCallback() {
        this.querySelector("button").removeEventListener("click");
    }

    onClick() {
        const productId = this.getAttribute("product-id");
        const cart = JSON.parse(localStorage.getItem("cart")) || {};
        cart[productId] = (cart[productId] || 0) + 1;
        localStorage.setItem("cart", JSON.stringify(cart));
        alert("Produkt pridaný do košíka 🛒");
    }
}

window.customElements.define("checkout-buy", CheckoutBuy);
