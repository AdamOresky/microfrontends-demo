class Header extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
            <h1 class="header">
                <span class="header-left">
                    <a class="logo-link" href="http://localhost:3001/home">MicroShop</a>
                </span>
                <span class="header-right">
                    <a href="http://localhost:3001/home">Produkty</a>
                    <a href="http://localhost:3003/cart">Košík</a>
                </span>
            </h1>
        `;
    }
}

window.customElements.define("home-header", Header);