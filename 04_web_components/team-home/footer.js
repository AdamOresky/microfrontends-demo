class HomeFooter extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <div class="footer d-flex flex-column align-items-center gap-2 pb-3 mb-0" style="margin-top:0;">
        <label style="cursor: pointer; font-size: 0.95rem; font-weight: 500; display: flex; align-items: center; gap: 0.5rem;">
          <input type="checkbox" id="show-teams-toggle" style="cursor: pointer;"> Zobraziť tímy
        </label>
        <span>MicroShop 2026 | Bakalárska práca</span>
      </div>
    `;

    if (window.setupElementTeamFrame) window.setupElementTeamFrame(this, 'DodgerBlue');
  }
}

window.customElements.define('home-footer', HomeFooter);
