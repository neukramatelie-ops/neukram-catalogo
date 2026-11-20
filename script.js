const grid = document.getElementById("productGrid");
const filtersEl = document.getElementById("filters");
const searchInput = document.getElementById("searchInput");
const emptyState = document.getElementById("emptyState");
const resultCount = document.getElementById("resultCount");
document.getElementById("year").textContent = new Date().getFullYear();

let activeCategory = "Todos";
const categories = ["Todos", ...new Set(products.map(p => p.category).filter(Boolean))];

function safeText(value="") {
  return String(value).replace(/[&<>"']/g, ch => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[ch]));
}
function makeFilters() {
  filtersEl.innerHTML = categories.map(cat =>
    `<button class="filter-btn ${cat===activeCategory?"active":""}" type="button" data-category="${safeText(cat)}">${safeText(cat)}</button>`
  ).join("");
  filtersEl.querySelectorAll("button").forEach(btn => btn.addEventListener("click", () => {
    activeCategory = btn.dataset.category; makeFilters(); render();
  }));
}
function render() {
  const query = searchInput.value.trim().toLocaleLowerCase("pt-BR");
  const filtered = products.filter(p => {
    const matchesCategory = activeCategory === "Todos" || p.category === activeCategory;
    const matchesQuery = [p.name,p.category,p.description].join(" ").toLocaleLowerCase("pt-BR").includes(query);
    return matchesCategory && matchesQuery;
  });
  resultCount.textContent = `${filtered.length} ${filtered.length===1?"produto":"produtos"}`;
  emptyState.hidden = filtered.length > 0;
  grid.innerHTML = filtered.map(p => {
    const image = p.image ? `<img src="${safeText(p.image)}" alt="${safeText(p.name)}" loading="lazy" onerror="this.style.display='none';this.nextElementSibling.style.display='block'"><div class="image-placeholder" style="display:none">Adicione a foto<br>do produto</div>` : `<div class="image-placeholder">Adicione a foto<br>do produto</div>`;
    const links = [
      ["Shopee",p.shopee],["Amazon",p.amazon],["Mercado Livre",p.mercadoLivre]
    ].filter(([_,url]) => url && url.trim()).map(([label,url]) =>
      `<button class="buy-btn" type="button" data-url="${safeText(url)}">${label} ↗</button>`
    ).join("");
    return `<article class="product-card">
      <div class="product-image">${image}</div>
      <div class="product-info">
        <span class="product-category">${safeText(p.category || "Produto")}</span>
        <h3>${safeText(p.name)}</h3>
        <p class="product-description">${safeText(p.description || "")}</p>
        ${p.price ? `<div class="product-price">${safeText(p.price)}</div>` : ""}
        <div class="buy-links">${links || '<span class="product-category">Link de compra em breve</span>'}</div>
      </div>
    </article>`;
  }).join("");
  grid.querySelectorAll("[data-url]").forEach(btn => btn.addEventListener("click", () => {
    const url = btn.dataset.url;
    try {
      const parsed = new URL(url);
      if (parsed.protocol === "https:" || parsed.protocol === "http:") window.open(parsed.href, "_blank", "noopener,noreferrer");
    } catch (_) {}
  }));
}
searchInput.addEventListener("input", render);
makeFilters(); render();
