class AllProducts extends HTMLElement {
    constructor() {
        super();
        this.products = [];
        this.activeBrands = new Set();
        this.sortField = null;
        this.sortDir = null;
    }

    async connectedCallback() {
        this.innerHTML = `
      <style>
        .sort-checkbox {
          appearance: none;
          -webkit-appearance: none;
          width: 1.2em;
          height: 1.2em;
          border: 2px solid #0d6efd;
          border-radius: 50%;
          margin-right: 0.5em;
          position: relative;
          cursor: pointer;
        }
        .sort-checkbox:checked::before {
          content: "";
          display: block;
          width: 0.6em;
          height: 0.6em;
          background-color: #0d6efd;
          border-radius: 50%;
          position: absolute;
          top: 0.2em;
          left: 0.2em;
        }
        .sort-label, .brand-label {
          margin-right: 1rem;
          font-size: 0.9rem;
          cursor: pointer;
          user-select: none;
          display: inline-flex;
          align-items: center;
        }
        .brand-checkbox {
          appearance: none;
          -webkit-appearance: none;
          width: 1.1em;
          height: 1.1em;
          border: 2px solid #198754;
          border-radius: 0.35rem;
          margin-right: 0.5em;
          position: relative;
          cursor: pointer;
        }
        .brand-checkbox:checked::before {
          content: "";
          display: block;
          width: 0.55em;
          height: 0.55em;
          background-color: #198754;
          position: absolute;
          top: 0.175em;
          left: 0.175em;
        }
        .filters-wrap {
          gap: 1rem;
          flex-wrap: wrap;
        }
        .filters-title {
          margin: 0 0.5rem 0 0;
          font-weight: 600;
        }
      </style>

      <div class="d-flex justify-content-between align-items-start mb-3 mt-3 filters-wrap">
        <div class="d-flex align-items-center">
          <span class="filters-title">Zoradenie:</span>
          <label class="sort-label">
            <input type="radio" name="sort" value="price-asc" class="sort-checkbox">
            Najlacnejšie
          </label>
          <label class="sort-label">
            <input type="radio" name="sort" value="price-desc" class="sort-checkbox">
            Najdrahšie
          </label>
          <label class="sort-label">
            <input type="radio" name="sort" value="year-asc" class="sort-checkbox">
            Najstaršie
          </label>
          <label class="sort-label">
            <input type="radio" name="sort" value="year-desc" class="sort-checkbox">
            Najnovšie
          </label>
        </div>

        <div class="d-flex align-items-center" id="brand-container">
          <span class="filters-title">Značka:</span>
        </div>
      </div>

      <div id="product-list" class="row"></div>
    `;

        this.listEl = this.querySelector('#product-list');
        this.sortRadios = this.querySelectorAll('input[name="sort"]');
        this.sortRadios.forEach(r => r.addEventListener('change', e => this.handleSortChange(e)));

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

    normalizeBrand(v) {
        return String(v ?? '').trim().toLowerCase();
    }

    buildBrandFilter() {
        const brandContainer = this.querySelector('#brand-container');
        const brands = [...new Set(
            this.products
                .map(([, p]) => this.normalizeBrand(p.brand))
                .filter(b => b.length)
        )].sort((a, b) => a.localeCompare(b));

        brands.forEach(brand => {
            const id = `brand-${brand}`;
            const label = document.createElement('label');
            label.className = 'brand-label';
            label.htmlFor = id;
            label.innerHTML = `
              <input type="checkbox" id="${id}" value="${brand}" class="brand-checkbox">
              ${brand}
            `;
            const input = label.querySelector('input');
            input.addEventListener('change', () => this.handleBrandChange(input));
            brandContainer.appendChild(label);
        });
    }

    handleBrandChange(input) {
        const brand = input.value;
        if (input.checked) this.activeBrands.add(brand);
        else this.activeBrands.delete(brand);
        this.render();
    }

    handleSortChange(event) {
        const [field, dir] = event.target.value.split('-');
        this.sortField = field;
        this.sortDir = dir;
        this.render();
    }

    getFilteredSorted() {
        let items = this.products;
        if (this.activeBrands.size) {
            items = items.filter(([, p]) => this.activeBrands.has(this.normalizeBrand(p.brand)));
        }
        if (this.sortField && this.sortDir) {
            items = [...items].sort(([, a], [, b]) => {
                const va = Number(a[this.sortField]);
                const vb = Number(b[this.sortField]);
                return this.sortDir === 'asc' ? va - vb : vb - va;
            });
        }
        return items;
    }

    render() {
        this.renderProducts(this.getFilteredSorted());
    }

    renderProducts(items) {
        this.listEl.innerHTML = '';
        items.forEach(([id, p]) => {
            const col = document.createElement('div');
            col.className = 'col-12 col-sm-6 col-md-4 col-lg-3 mb-4';
            col.innerHTML = `
        <a href="http://localhost:3002/product?productId=${id}"
           style="text-decoration:none;color:inherit;">
          <div class="card h-100">
            <img src="${p.imageUrl}"
                 class="card-img-top mt-3"
                 alt="${p.name}"
                 style="max-height:300px;object-fit:cover;">
            <div class="card-body">
              <h6 class="card-title">${p.name}</h6>
              <p class="card-text mb-1">${p.price} €</p>
            </div>
          </div>
        </a>
      `;
            this.listEl.appendChild(col);
        });
    }
}

window.customElements.define('all-products', AllProducts);