class AllProducts extends HTMLElement {
	constructor() {
		super();
		this.products = [];
		this.activeBrands = new Set();
		this.sortField = null;
		this.sortDir = null;
	}

	async connectedCallback() {
		if (window.setupElementTeamFrame) window.setupElementTeamFrame(this, 'MediumSeaGreen');
		this.innerHTML = `
			<div class="container flex-grow-1">
				<div class="card mb-4 mt-3">
					<div class="card-body">
						<div class="row align-items-center">
							<div class="col-12 col-lg-auto mb-3 mb-lg-0 fw-bold">
								Zoradenie:
							</div>
							<div class="col-12 col-lg-auto mb-3 mb-lg-0">
								<div class="btn-group" role="group">
									<input type="radio" class="btn-check sort-radio" name="sort" id="sort-price-asc" value="price-asc" autocomplete="off">
									<label class="btn btn-outline-primary" for="sort-price-asc">Najlacnejšie</label>

									<input type="radio" class="btn-check sort-radio" name="sort" id="sort-price-desc" value="price-desc" autocomplete="off">
									<label class="btn btn-outline-primary" for="sort-price-desc">Najdrahšie</label>

									<input type="radio" class="btn-check sort-radio" name="sort" id="sort-year-asc" value="year-asc" autocomplete="off">
									<label class="btn btn-outline-primary" for="sort-year-asc">Najstaršie</label>

									<input type="radio" class="btn-check sort-radio" name="sort" id="sort-year-desc" value="year-desc" autocomplete="off">
									<label class="btn btn-outline-primary" for="sort-year-desc">Najnovšie</label>
								</div>
							</div>

							<div class="col-12 col-lg-auto mb-2 mb-lg-0 ms-lg-auto fw-bold">
								Značka:
							</div>
							<div class="col-12 col-lg-auto">
								<div id="brand-container" class="d-flex flex-wrap gap-2"></div>
							</div>
						</div>
					</div>
				</div>

				<div id="product-list" class="row"></div>
			</div>
		`;

		this.listEl = this.querySelector('#product-list');
		this.sortRadios = this.querySelectorAll('input[name="sort"]');
		const self = this;
		for (let i = 0; i < this.sortRadios.length; i++) {
			this.sortRadios[i].addEventListener('change', function(event) {
				self.handleSortChange(event);
			});
		}

		try {
			const res = await fetch('http://localhost:3030/products.json');
			if (!res.ok) throw new Error(`HTTP ${res.status}`);
			const data = await res.json();
			this.products = Object.entries(data);
			this.buildBrandFilter();
			this.render();
		} catch (err) {
			console.error('Failed to load products.json:', err);
			this.listEl.innerHTML = `<p class="text-danger">Nepodarilo sa načítať produkty.</p>`;
		}
	}

	normalizeBrand(value) {
		if (value === null || value === undefined) {
			return '';
		}
		return String(value).trim().toLowerCase();
	}

	buildBrandFilter() {
		const brandContainer = this.querySelector('#brand-container');
		
		const uniqueBrands = new Set();
		for (let i = 0; i < this.products.length; i++) {
			const productEntry = this.products[i];
			const productData = productEntry[1];
			const brandName = this.normalizeBrand(productData.brand);
			if (brandName.length > 0) {
				uniqueBrands.add(brandName);
			}
		}

		const allBrands = Array.from(uniqueBrands);
		allBrands.sort(function (brandA, brandB) {
			return brandA.localeCompare(brandB);
		});

		brandContainer.innerHTML = allBrands.map(function (brand) {
			const id = `brand-${brand}`;
			return `
				<div>
					<input type="checkbox" class="btn-check brand-checkbox" id="${id}" value="${brand}" autocomplete="off">
					<label class="btn btn-outline-secondary" for="${id}">${brand}</label>
				</div>
			`;
		}).join('');

		const checkboxes = brandContainer.querySelectorAll('.brand-checkbox');
		const self = this;
		for (let i = 0; i < checkboxes.length; i++) {
			checkboxes[i].addEventListener('change', function () {
				self.handleBrandChange(checkboxes[i]);
			});
		}
	}

	handleBrandChange(input) {
		const brand = input.value;
		if (input.checked) {
			this.activeBrands.add(brand);
		} else {
			this.activeBrands.delete(brand);
		}
		this.render();
	}

	handleSortChange(event) {
		const sortParts = event.target.value.split('-');
		this.sortField = sortParts[0];
		this.sortDir = sortParts[1];
		this.render();
	}

	getFilteredSorted() {
		let items = this.products;
		
		if (this.activeBrands.size > 0) {
			const self = this;
			items = items.filter(function (productEntry) {
				const productData = productEntry[1];
				const normalizedBrandName = self.normalizeBrand(productData.brand);
				const isBrandSelected = self.activeBrands.has(normalizedBrandName);
				return isBrandSelected;
			});
		}

		if (this.sortField && this.sortDir) {
			const self = this;
			items = [...items].sort(function (firstEntry, secondEntry) {
				const firstProduct = firstEntry[1];
				const secondProduct = secondEntry[1];

				const firstValue = Number(firstProduct[self.sortField]);
				const secondValue = Number(secondProduct[self.sortField]);

				if (self.sortDir === 'asc') {
					return firstValue - secondValue;
				} else {
					return secondValue - firstValue;
				}
			});
		}
		return items;
	}

	render() {
		this.renderProducts(this.getFilteredSorted());
	}

	renderProducts(items) {
		this.listEl.innerHTML = '';
		for (let i = 0; i < items.length; i++) {
			const productEntry = items[i];
			const productId = productEntry[0];
			const productData = productEntry[1];

			const col = document.createElement('div');
			col.className = 'col-12 col-sm-6 col-md-4 col-lg-3 mb-4';
			col.innerHTML = `
				<a href="http://localhost:3002/product?productId=${productId}" style="text-decoration:none;color:inherit;">
					<div class="card">
						<img src="${productData.imageUrl}" class="card-img-top p-3" alt="${productData.name}" style="height:200px;object-fit:contain;">
						<div class="card-body text-center">
							<h6 class="card-title fw-bold">${productData.name}</h6>
							<p class="card-text mb-0 fw-bold">${productData.price.toLocaleString('sk-SK')} €</p>
						</div>
					</div>
				</a>
			`;
			this.listEl.appendChild(col);
		}
	}
}

window.customElements.define('all-products', AllProducts);