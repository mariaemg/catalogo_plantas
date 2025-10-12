// Referencias a elementos del DOM
const grid = document.getElementById("bonsai-grid");
const pagination = document.getElementById("pagination");
const buscarInput = document.getElementById("buscarInput");
const filtroTipo = document.getElementById("filtroTipo");
const ordenarSelect = document.getElementById("ordenar");

const itemsPerPage = 6;
let bonsais = [];
let filteredBonsais = [];
let currentPage = 1;

// Cargar bonsáis desde la API
fetch("/api/bonsais")
  .then(response => response.json())
  .then(data => {
    bonsais = data;
    filteredBonsais = bonsais;
    renderPage(currentPage);
    renderPagination();
  })
  .catch(err => console.error("Error cargando bonsáis:", err));

// === Función para renderizar las tarjetas ===
function renderPage(page) {
  grid.innerHTML = "";
  const start = (page - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  const pageItems = filteredBonsais.slice(start, end);

  if (pageItems.length === 0) {
    grid.innerHTML = `<p class="no-resultados">No se encontraron bonsáis :(</p>`;
    return;
  }

  pageItems.forEach(bonsai => {
    const div = document.createElement("div");
    div.className = "bonsai-card";

    // Tomamos la primera foto si existe
    const imagen = bonsai.fotos && bonsai.fotos.length > 0
      ? bonsai.fotos[0]   // <-- ahora sí, ya es la ruta directamente
      : "/static/img/default-bonsai.jpg"; // Imagen por defecto si no hay fotos

    div.innerHTML = `
      <img src="${imagen}" alt="${bonsai.nombre}">
      <h3>${bonsai.nombre}</h3>
      <p>${bonsai.tipo} • ${bonsai.edad} años</p>
      <p class="precio">Precio: ${bonsai.precio ? `$${bonsai.precio}` : "Consultar"}</p>
    `;

    div.addEventListener("click", () => {
      window.location.href = `/bonsai/${bonsai.id}`;
    });

    grid.appendChild(div);
  });
}

// === Función para crear los botones de paginación ===
function renderPagination() {
  pagination.innerHTML = "";
  const totalPages = Math.ceil(filteredBonsais.length / itemsPerPage);

  for (let i = 1; i <= totalPages; i++) {
    const btn = document.createElement("button");
    btn.textContent = i;
    btn.className = i === currentPage ? "active" : "";
    btn.addEventListener("click", () => {
      currentPage = i;
      renderPage(currentPage);
      renderPagination();
    });
    pagination.appendChild(btn);
  }
}

// === Filtrado y orden dinámico ===
function filtrarYOrdenar() {
  const tipo = filtroTipo.value;
  const orden = ordenarSelect.value;
  const busqueda = buscarInput.value.toLowerCase();

  filteredBonsais = bonsais.filter(b => {
    const coincideTipo = tipo === "" || b.tipo_cuidado.toLowerCase() === tipo.toLowerCase();
    const coincideBusqueda =
      b.nombre.toLowerCase().includes(busqueda) ||
      b.tipo.toLowerCase().includes(busqueda);
    return coincideTipo && coincideBusqueda;
  });

  switch (orden) {
    case "nombre_asc":
      filteredBonsais.sort((a, b) => a.nombre.localeCompare(b.nombre));
      break;
    case "nombre_desc":
      filteredBonsais.sort((a, b) => b.nombre.localeCompare(a.nombre));
      break;
    case "edad_asc":
      filteredBonsais.sort((a, b) => a.edad - b.edad);
      break;
    case "edad_desc":
      filteredBonsais.sort((a, b) => b.edad - a.edad);
      break;
    case "precio_asc":
      filteredBonsais.sort((a, b) => (a.precio || 0) - (b.precio || 0));
      break;
    case "precio_desc":
      filteredBonsais.sort((a, b) => (b.precio || 0) - (a.precio || 0));
      break;
  }

  currentPage = 1;
  renderPage(currentPage);
  renderPagination();
}

// === Eventos ===
buscarInput.addEventListener("keyup", filtrarYOrdenar);
filtroTipo.addEventListener("change", filtrarYOrdenar);
ordenarSelect.addEventListener("change", filtrarYOrdenar);
