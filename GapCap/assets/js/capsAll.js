let caps = [];
let capsFiltradas = [];

// Cargar caps desde Supabase
async function cargarCaps() {
    const contenedor = document.getElementById('cap-container');
    
    // Mostrar loading
    contenedor.innerHTML = '<div class="col-12 text-center py-5"><div class="spinner-border text-primary"></div><p class="mt-3">Cargando gorras...</p></div>';
    
    try {
        // Cargar desde Supabase
        caps = await obtenerGorras();
        capsFiltradas = [...caps];
        renderizarCaps();
    } catch (error) {
        console.error('Error al cargar gorras:', error);
        contenedor.innerHTML = `
            <div class="col-12 text-center py-5">
                <i class="bi bi-exclamation-triangle text-danger" style="font-size: 4rem;"></i>
                <p class="text-muted mt-3">Error al cargar las gorras. Por favor recarga la página.</p>
            </div>`;
    }
}

// Toggle filtros colapsables
function toggleFiltros() {
    const filterContent = document.getElementById('filterContent');
    const toggleIcon = document.getElementById('toggleIcon');
    
    if (filterContent.style.display === 'none') {
        filterContent.style.display = 'block';
        toggleIcon.classList.add('rotate');
    } else {
        filterContent.style.display = 'none';
        toggleIcon.classList.remove('rotate');
    }
}

// Buscar por nombre
function buscarPorNombre(texto) {
    const busqueda = texto.toLowerCase().trim();
    const btnLimpiar = document.getElementById('btnLimpiarBusqueda');
    
    if (busqueda === '') {
        btnLimpiar.style.display = 'none';
        aplicarFiltros();
        return;
    }
    
    btnLimpiar.style.display = 'block';
    
    // Aplicar búsqueda sobre los resultados ya filtrados
    const categoria = document.getElementById("filtroCategoria").value;
    const estilo = document.getElementById("filtroEstilo").value;
    const orden = document.getElementById("ordenar").value;

    // Filtrar por categoría
    if (categoria === "todos") {
        capsFiltradas = [...caps];
    } else {
        capsFiltradas = caps.filter(cap => cap.categoria === categoria);
    }

    // Filtrar por estilo
    if (estilo !== "todos") {
        capsFiltradas = capsFiltradas.filter(cap => cap.estilo === estilo);
    }

    // Filtrar por búsqueda de nombre
    capsFiltradas = capsFiltradas.filter(cap => 
        cap.nombre.toLowerCase().includes(busqueda)
    );

    // Ordenar
    if (orden === "nombre") {
        capsFiltradas.sort((a, b) => a.nombre.localeCompare(b.nombre));
    } else if (orden === "precioAsc") {
        capsFiltradas.sort((a, b) => a.precio - b.precio);
    } else if (orden === "precioDesc") {
        capsFiltradas.sort((a, b) => b.precio - a.precio);
    }

    renderizarCaps();
}

// Aplicar filtros y ordenamiento
function aplicarFiltros() {
    const categoria = document.getElementById("filtroCategoria").value;
    const estilo = document.getElementById("filtroEstilo").value;
    const orden = document.getElementById("ordenar").value;
    const busqueda = document.getElementById("buscarGorra").value.toLowerCase().trim();

    // Filtrar por categoría
    if (categoria === "todos") {
        capsFiltradas = [...caps];
    } else {
        capsFiltradas = caps.filter(cap => cap.categoria === categoria);
    }

    // Filtrar por estilo
    if (estilo !== "todos") {
        capsFiltradas = capsFiltradas.filter(cap => cap.estilo === estilo);
    }

    // Filtrar por búsqueda si hay texto
    if (busqueda !== '') {
        capsFiltradas = capsFiltradas.filter(cap => 
            cap.nombre.toLowerCase().includes(busqueda)
        );
    }

    // Ordenar
    if (orden === "nombre") {
        capsFiltradas.sort((a, b) => a.nombre.localeCompare(b.nombre));
    } else if (orden === "precioAsc") {
        capsFiltradas.sort((a, b) => a.precio - b.precio);
    } else if (orden === "precioDesc") {
        capsFiltradas.sort((a, b) => b.precio - a.precio);
    }

    renderizarCaps();
    actualizarBadgeFiltros();
}

// Actualizar badge de filtros activos
function actualizarBadgeFiltros() {
    const categoria = document.getElementById("filtroCategoria").value;
    const estilo = document.getElementById("filtroEstilo").value;
    const busqueda = document.getElementById("buscarGorra").value.trim();
    
    let count = 0;
    if (categoria !== "todos") count++;
    if (estilo !== "todos") count++;
    if (busqueda !== "") count++;
    
    const badge = document.getElementById("filtrosActivos");
    if (count > 0) {
        badge.textContent = count;
        badge.style.display = 'inline-block';
    } else {
        badge.style.display = 'none';
    }
}

// Renderizar caps en la sección #cap-container
function renderizarCaps() {
    const contenedor = document.getElementById("cap-container");
    
    if (capsFiltradas.length === 0) {
        contenedor.innerHTML = `
            <div class="col-12 text-center py-5">
                <i class="bi bi-search text-muted" style="font-size: 4rem;"></i>
                <p class="text-muted mt-3 fs-5">No se encontraron gorras con estos filtros</p>
                <button class="btn btn-primary" onclick="limpiarTodo()">Ver todas las gorras</button>
            </div>`;
        return;
    }

    contenedor.innerHTML = "";

    capsFiltradas.forEach(function(cap) {
        const item = `
        <div class="col-6 col-sm-6 col-md-6 col-lg-4 col-xl-3 mb-4">
            <div class="product-item border rounded p-2 h-100 shadow-sm">
                <div class="product-image text-center mb-2">
                    <img src="${cap.imagen}" alt="${cap.nombre}" class="img-fluid rounded" onerror="this.src='assets/img/gorraTest.jpg'">
                </div>
                <div class="product-body">
                    <h5 class="text-primary fw-semibold">
                        <a href="#" onclick="verDetalle(${cap.id}); return false;" class="text-decoration-none text-primary">
                            ${cap.nombre}
                        </a>
                    </h5>
                    <p class="small text-muted mb-1">${cap.estilo}</p>
                    <span class="price text-success fw-bold">¢${cap.precio.toLocaleString("es-CR")}</span>
                </div>
                <div class="product-footer d-flex justify-content-between align-items-center mt-2">
                    <button class="btn btn-sm btn-success" onclick="agregarCap(${cap.id})">
                        <i class="bi bi-cart-plus me-1"></i>Agregar
                    </button>
                </div>
            </div>
        </div>`;
        
        contenedor.innerHTML += item;
    });

    // Actualizar contador de resultados
    actualizarContador();
}

// Actualizar contador de resultados
function actualizarContador() {
    const contador = document.getElementById("resultadosContador");
    if (contador) {
        const total = caps.length;
        const mostrados = capsFiltradas.length;
        contador.textContent = `Mostrando ${mostrados} de ${total} gorras`;
    }
}

// Limpiar filtros
function limpiarFiltros() {
    document.getElementById("filtroCategoria").value = "todos";
    document.getElementById("filtroEstilo").value = "todos";
    document.getElementById("ordenar").value = "nombre";
    aplicarFiltros();
}

// Limpiar búsqueda
function limpiarBusqueda() {
    document.getElementById("buscarGorra").value = "";
    document.getElementById("btnLimpiarBusqueda").style.display = "none";
    aplicarFiltros();
}

// Limpiar todo (búsqueda y filtros)
function limpiarTodo() {
    document.getElementById("buscarGorra").value = "";
    document.getElementById("btnLimpiarBusqueda").style.display = "none";
    limpiarFiltros();
}

// Agregar cap al carrito
function agregarCap(id) {
    const cap = caps.find(c => c.id === id);
    if (cap) {
        agregarAlCarrito(cap);
    }
}

// Mostrar modal de detalle de cap
function verDetalle(id) {
    const cap = caps.find(c => c.id === id);
    if (!cap) return;

    const modalHTML = `
    <div class="modal fade" id="detalleModal" tabindex="-1">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header bg-primary text-white">
                    <h5 class="modal-title text-white">${cap.nombre}</h5>
                    <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body">
                    <img src="${cap.imagen}" alt="${cap.nombre}" class="img-fluid mb-3 rounded" onerror="this.src='assets/img/gorraTest.jpg'">
                    <p><strong>Categoría:</strong> ${cap.categoria.charAt(0).toUpperCase() + cap.categoria.slice(1)}</p>
                    <p><strong>Estilo:</strong> ${cap.estilo.charAt(0).toUpperCase() + cap.estilo.slice(1)}</p>
                    <h4 class="text-success">¢${cap.precio.toLocaleString("es-CR")}</h4>
                    <p><strong>Stock:</strong> ${cap.stock} unidades</p>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                    <button type="button" class="btn btn-success" onclick="agregarCap(${cap.id}); bootstrap.Modal.getInstance(document.getElementById('detalleModal')).hide();">
                        <i class="bi bi-cart-plus"></i> Agregar al carrito
                    </button>
                </div>
            </div>
        </div>
    </div>`;

    const oldModal = document.getElementById('detalleModal');
    if (oldModal) oldModal.remove();

    document.body.insertAdjacentHTML('beforeend', modalHTML);
    const modal = new bootstrap.Modal(document.getElementById('detalleModal'));
    modal.show();

    document.getElementById('detalleModal').addEventListener('hidden.bs.modal', function() {
        this.remove();
    });
}

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
    // Cargar caps
    cargarCaps();

    // Listener para búsqueda
    const inputBuscar = document.getElementById("buscarGorra");
    if (inputBuscar) {
        inputBuscar.addEventListener("input", function(e) {
            buscarPorNombre(e.target.value);
            actualizarBadgeFiltros();
        });
    }

    // Listener para botón de limpiar búsqueda
    const btnLimpiar = document.getElementById("btnLimpiarBusqueda");
    if (btnLimpiar) {
        btnLimpiar.addEventListener("click", limpiarBusqueda);
    }

    // Listeners para filtros
    const filtroCategoria = document.getElementById("filtroCategoria");
    const filtroEstilo = document.getElementById("filtroEstilo");
    const ordenar = document.getElementById("ordenar");

    if (filtroCategoria) filtroCategoria.addEventListener("change", aplicarFiltros);
    if (filtroEstilo) filtroEstilo.addEventListener("change", aplicarFiltros);
    if (ordenar) ordenar.addEventListener("change", aplicarFiltros);
});