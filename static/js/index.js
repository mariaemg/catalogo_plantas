// === Referencias a elementos del DOM ===
const grid = document.getElementById("bonsai-grid");
const pagination = document.getElementById("pagination");
const buscarInput = document.getElementById("buscarInput");
const filtroTipo = document.getElementById("filtroTipo");
const ordenarSelect = document.getElementById("ordenar");

const itemsPerPage = 8;
let bonsais = [];
let filteredBonsais = [];
let currentPage = 1;

// === Cargar bonsáis desde la API ===
fetch("/api/bonsais")
  .then(response => response.json())
  .then(data => {
    bonsais = data;
    filteredBonsais = bonsais;
    filtrarYOrdenar(); // render inicial con filtrado y orden
  })
  .catch(err => console.error("Error cargando bonsáis:", err));

// === Función para renderizar las tarjetas de bonsáis ===
function renderPage(page) {
  grid.innerHTML = "";
  const start = (page - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  const pageItems = filteredBonsais.slice(start, end);

  if (pageItems.length === 0) {
    grid.innerHTML = `<p class="no-resultados">No se encontraron bonsáis :(</p>`;
    return;
  }

  const fotoSeleccion = {
    1: 3,
    2: 0,
    3: 5,
    4: 3,
    5: 5,
    6: 4,
    7: 0,

    8: 2,   // muestra la foto 3
    9: 4,   // muestra la 5
    10: 4,  // muestra la 5
    11: 0,  // muestra la 1
    12: 4,  // muestra la 5
    13: 3   // muestra la 4
  };

  pageItems.forEach(bonsai => {
    const div = document.createElement("div");
    div.className = "bonsai-card";

    const index = fotoSeleccion[bonsai.id] ?? 0;

    const imagen = bonsai.fotos && bonsai.fotos.length > index
      ? bonsai.fotos[index]
      : "/static/img/default-bonsai.jpg";


    div.innerHTML = `
      <img src="${imagen}" alt="${bonsai.nombre}">
      <h3>${bonsai.nombre}</h3>
      <p>${bonsai.tipo} • ${bonsai.edad} años</p>
      <p class="dificultad">Dificultad de Cuidado: ${bonsai.dificultad_cuidado || "N/A"}</p>
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
      window.scrollTo({ top: 0, behavior: "smooth" }); // subir al inicio
    });
    pagination.appendChild(btn);
  }
}

// === Función para filtrar y ordenar bonsáis ===
function filtrarYOrdenar() {
  const tipo = filtroTipo.value.toLowerCase();
  const orden = ordenarSelect.value;
  const busqueda = buscarInput.value.toLowerCase();

  // Filtrar
  filteredBonsais = bonsais.filter(b => {
    const coincideTipo = !tipo || (b.dificultad_cuidado || "").toLowerCase() === tipo;
    const coincideBusqueda =
      b.nombre.toLowerCase().includes(busqueda) ||
      b.tipo.toLowerCase().includes(busqueda);
    return coincideTipo && coincideBusqueda;
  });

  // Ordenar
  filteredBonsais.sort((a, b) => {
    switch (orden) {
      case "nombre_asc": return a.nombre.localeCompare(b.nombre);
      case "nombre_desc": return b.nombre.localeCompare(a.nombre);
      case "edad_asc": return a.edad - b.edad;
      case "edad_desc": return b.edad - a.edad;
      case "precio_asc": return (a.precio || 0) - (b.precio || 0);
      case "precio_desc": return (b.precio || 0) - (a.precio || 0);
      default: return 0;
    }
  });

  currentPage = 1;
  renderPage(currentPage);
  renderPagination();
}

// === Eventos ===
if (buscarInput) buscarInput.addEventListener("input", filtrarYOrdenar);
if (filtroTipo) filtroTipo.addEventListener("change", filtrarYOrdenar);
if (ordenarSelect) ordenarSelect.addEventListener("change", filtrarYOrdenar);
