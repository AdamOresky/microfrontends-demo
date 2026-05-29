class Product extends HTMLElement {
	async connectedCallback() {
		if (window.setupElementTeamFrame) window.setupElementTeamFrame(this, 'MediumSeaGreen');
		this.innerHTML = `<p>Načítavam produkt...</p>`;
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
		<img class="img-fluid border p-3" src="${product.imageUrl}" alt="${product.name}">
	</div>
	<div class="col-8">
		<h2>${product.name}</h2>
		<p class="text-muted mb-3">${product.description}</p>
		<p class="mb-0">Rok výroby: <span class="fw-bold">${product.year}</span></p>
		<p>Skladom: <span class="text-success fw-bold">${product.stock} ks</span></p>
		<h4 class="mb-4">Cena: ${product.price.toLocaleString('sk-SK')} €</h4>
		<div class="d-flex gap-2">
			<buy-button></buy-button>
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