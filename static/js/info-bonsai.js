// === Fotos y modal ===
const fotosGrid = document.getElementById("fotosGrid");
const photoModal = document.getElementById("photoModal");
const fotoGrande = document.getElementById("fotoGrande");
const cerrarFoto = document.getElementById("cerrarFoto");

// Función para renderizar fotos
function renderFotos(fotos) {
  if (!fotosGrid) return;
  fotosGrid.innerHTML = "";

  if (!fotos || fotos.length === 0) {
    const img = document.createElement("img");
    img.src = "/static/img/default-bonsai.jpg";
    img.alt = "Foto del bonsái";
    fotosGrid.appendChild(img);
    return;
  }

  fotos.forEach(f => {
    const img = document.createElement("img");
    img.src = f;
    img.alt = "Foto del bonsái";
    img.className = "foto-mini";

    img.addEventListener("click", () => {
      fotoGrande.src = f;
      photoModal.style.display = "flex";
    });

    fotosGrid.appendChild(img);
  });
}

// Cerrar modal
if (cerrarFoto) {
  cerrarFoto.addEventListener("click", () => {
    photoModal.style.display = "none";
  });
}

// === Botón volver al catálogo ===
const btnPortada = document.getElementById("btnPortada");
if (btnPortada) btnPortada.onclick = () => location.href = "/";

// === Comentarios y paginación ===
let comentarios = [];
let paginaActual = 1;
const comentariosPorPagina = 5;

function renderComentarios() {
  const cont = document.getElementById("comentariosList");
  if (!cont) return;
  cont.innerHTML = "";

  const start = (paginaActual - 1) * comentariosPorPagina;
  const end = start + comentariosPorPagina;
  const comentariosPagina = comentarios.slice(start, end);

  if (comentarios.length === 0) {
    cont.innerHTML = "<p>Aún no se han añadido comentarios. ¡Sé el primero!</p>";
  } else {
    comentariosPagina.forEach(c => {
      const div = document.createElement("div");
      div.className = "comentario";

      const strong = document.createElement("strong");
      strong.textContent = c.nombre;

      const fechaSpan = document.createElement("span");
      fechaSpan.textContent = ` (${c.fecha}):`;

      const textoDiv = document.createElement("div");
      textoDiv.textContent = c.texto;

      div.append(strong, fechaSpan, document.createElement("br"), textoDiv);
      cont.appendChild(div);
    });
  }

  const totalPaginas = Math.ceil(comentarios.length / comentariosPorPagina);
  const info = document.getElementById("infoPagina");
  if (info) info.textContent = `Página ${paginaActual} de ${totalPaginas || 1}`;

  const btnPrev = document.getElementById("prevPagina");
  const btnNext = document.getElementById("nextPagina");
  if (btnPrev) btnPrev.disabled = paginaActual === 1;
  if (btnNext) btnNext.disabled = paginaActual === totalPaginas || totalPaginas === 0;
}

function cargarComentarios() {
  if (typeof bonsaiId === "undefined") return;
  fetch(`/comentarios/${bonsaiId}`)
    .then(resp => resp.json())
    .then(data => {
      comentarios = data;
      paginaActual = 1;
      renderComentarios();
    })
    .catch(err => console.error("Error al cargar comentarios:", err));
}

// Paginación botones
document.addEventListener("DOMContentLoaded", () => {
  const btnPrev = document.getElementById("prevPagina");
  const btnNext = document.getElementById("nextPagina");

  if (btnPrev && btnNext) {
    btnPrev.addEventListener("click", () => {
      if (paginaActual > 1) { paginaActual--; renderComentarios(); }
    });

    btnNext.addEventListener("click", () => {
      const totalPaginas = Math.ceil(comentarios.length / comentariosPorPagina);
      if (paginaActual < totalPaginas) { paginaActual++; renderComentarios(); }
    });
  }
});

// Envío de nuevo comentario
const formComentario = document.getElementById("formComentario");
if (formComentario) {
  formComentario.addEventListener("submit", function(e) {
    e.preventDefault();

    const nombre = document.getElementById("nombre").value.trim();
    const texto = document.getElementById("texto").value.trim();
    const erroresDiv = document.getElementById("comentariosErrores");
    erroresDiv.innerHTML = "";

    const errores = [];
    if (!nombre) errores.push("El nombre es obligatorio.");
    else if (nombre.length < 3) errores.push("El nombre debe tener al menos 3 caracteres.");
    else if (nombre.length > 80) errores.push("El nombre puede tener máximo 80 caracteres.");

    if (!texto) errores.push("El comentario no puede estar vacío.");
    else if (texto.length < 5) errores.push("El comentario debe tener al menos 5 caracteres.");

    if (errores.length > 0) {
      erroresDiv.innerHTML = errores.join("<br>");
      return;
    }

    // --- Creamos fecha en JS y la mandamos al backend ---
    const fecha = new Date();
    const fechaFormateada = String(fecha.getDate()).padStart(2, '0') + "-" +
                            String(fecha.getMonth() + 1).padStart(2, '0') + "-" +
                            fecha.getFullYear() + " " +
                            String(fecha.getHours()).padStart(2, '0') + ":" +
                            String(fecha.getMinutes()).padStart(2, '0');

    fetch(`/comentario/${bonsaiId}`, {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({ nombre, texto, fecha: fechaFormateada })
    })
    .then(resp => { 
      if (!resp.ok) return resp.json().then(data => { throw data; }); 
      return resp.json(); 
    })
    .then(data => {
      formComentario.reset();
      comentarios.unshift(data.comentario);
      paginaActual = 1;
      renderComentarios();
    })
    .catch(err => {
      if (err.errores) erroresDiv.innerHTML = err.errores.join("<br>");
      else console.error(err);
    });
  });
}

// Inicializar
document.addEventListener("DOMContentLoaded", () => {
  if (typeof bonsaiFotos !== "undefined") renderFotos(bonsaiFotos);
  cargarComentarios();
});
