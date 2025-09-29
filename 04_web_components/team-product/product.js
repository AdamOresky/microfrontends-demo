class Product extends HTMLElement {
    connectedCallback() {
        const productId = this.getAttribute('product-id');
        if (!productId) return;

        fetch('http://localhost:3030/products.json')
            .then(response => response.json())
            .then(data => {
                const product = data[productId];
                if (product) {
                    this.innerHTML = `
<div class="row mt-5">
    <div class="col-4">
        <img style="max-width: 100%" src="${product.imageUrl}" alt="${product.name}">    
    </div>
    <div class="col-8">
        <h2 class="row">${product.name}</h2>
        <p class="row mt-3">${product.description}</p>
        <div class="row mt-3">
            <p class="p-0 mb-1"><strong>Rok výroby:</strong> ${product.year}</p>
            <p class="p-0 mb-1"><strong>Na sklade:</strong> ${product.stock} ks</p>
            <div class="row">
                <p class="col-3 p-0"><strong>Cena:</strong> ${product.price} €</p>
                <div class="mt-2">
                    <checkout-buy></checkout-buy>
                </div>
            </div>
        </div>    
    </div>      
</div>
          `;
                } else {
                    this.innerHTML = `<p>Produkt neexistuje.</p>`;
                }
            });
    }
}

customElements.define('product-item', Product);