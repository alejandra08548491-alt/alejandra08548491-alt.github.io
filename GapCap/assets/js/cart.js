let carrito = [];

// Cargar carrito desde sessionStorage
function cargarCarrito() {
    const carritoGuardado = sessionStorage.getItem('carrito');
    if (carritoGuardado) {
        carrito = JSON.parse(carritoGuardado);
        actualizarContadorCarrito();
    }
}

// Guardar carrito en sessionStorage
function guardarCarrito() {
    sessionStorage.setItem('carrito', JSON.stringify(carrito));
    actualizarContadorCarrito();
}

// Agregar cap al carrito
function agregarAlCarrito(cap) {
    const existe = carrito.find(item => item.id === cap.id);

    if (existe) {
        existe.cantidad++;
    } else {
        carrito.push({ ...cap, cantidad: 1 });
    }

    guardarCarrito();
    mostrarNotificacion(`${cap.nombre} agregado al carrito`);
    actualizarVistaCarrito();
}

// Eliminar cap del carrito
function eliminarDelCarrito(id) {
    carrito = carrito.filter(item => item.id !== id);
    guardarCarrito();
    actualizarVistaCarrito();
}

// Actualizar cantidad de un item
function actualizarCantidad(id, cantidad) {
    const cap = carrito.find(item => item.id === id);
    if (cap) {
        cap.cantidad = parseInt(cantidad);
        if (cap.cantidad <= 0) {
            eliminarDelCarrito(id);
        } else {
            guardarCarrito();
            actualizarVistaCarrito();
        }
    }
}

// Contador en el navbar
function actualizarContadorCarrito() {
    const totalItems = carrito.reduce((sum, item) => sum + item.cantidad, 0);
    const contador = document.getElementById('cart-count');
    if (contador) {
        contador.textContent = totalItems;
        contador.style.display = totalItems > 0 ? 'inline-block' : 'none';
    }
}

// Calcular total del carrito
function calcularTotal() {
    return carrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
}

// Renderizar carrito en el modal
function actualizarVistaCarrito() {
    const carritoItems = document.getElementById('cart-items');
    const carritoTotal = document.getElementById('cart-total');
    const carritoVacio = document.getElementById('cart-empty');
    const carritoContenido = document.getElementById('cart-content');

    if (!carritoItems) return;

    if (carrito.length === 0) {
        if (carritoVacio) carritoVacio.style.display = 'block';
        if (carritoContenido) carritoContenido.style.display = 'none';
        if (carritoTotal) carritoTotal.innerHTML = '¢0';
        return;
    }

    if (carritoVacio) carritoVacio.style.display = 'none';
    if (carritoContenido) carritoContenido.style.display = 'block';

    carritoItems.innerHTML = '';

    carrito.forEach(item => {
        const itemHTML = `
        <div class="cart-item mb-3 border-bottom pb-2">
            <div class="row align-items-center">
                <div class="col-3">
                    <img src="${item.imagen}" alt="${item.nombre}" class="img-fluid rounded">
                </div>
                <div class="col-5">
                    <h6 class="text-primary">${item.nombre}</h6>
                    <small class="text-muted">${item.presentacion ? item.presentacion : item.estilo}</small>
                    <p class="mb-0 fw-bold text-success">¢${item.precio.toLocaleString("es-CR")}</p>
                </div>
                <div class="col-4">
                    <div class="input-group input-group-sm mb-2">
                        <button class="btn btn-outline-secondary" onclick="actualizarCantidad(${item.id}, ${item.cantidad - 1})">-</button>
                        <input type="number" class="form-control text-center" value="${item.cantidad}" 
                               onchange="actualizarCantidad(${item.id}, this.value)" min="1">
                        <button class="btn btn-outline-secondary" onclick="actualizarCantidad(${item.id}, ${item.cantidad + 1})">+</button>
                    </div>
                    <button class="btn btn-danger w-100" onclick="eliminarDelCarrito(${item.id})">
                        <i class="bi bi-trash"></i> Eliminar
                    </button>
                </div>
            </div>
        </div>`;
        carritoItems.innerHTML += itemHTML;
    });

    if (carritoTotal) {
        carritoTotal.innerHTML = '¢' + calcularTotal().toLocaleString("es-CR");
    }
}

// Enviar pedido por WhatsApp
function enviarAWhatsApp() {
    if (carrito.length === 0) {
        alert('El carrito está vacío');
        return;
    }

    let mensaje = '¡Hola! Me gustaría hacer el siguiente pedido:\n\n';

    carrito.forEach(item => {
        mensaje += '• ' + item.nombre + ' (' + (item.presentacion ? item.presentacion : item.estilo) + ')\n';
        mensaje += '  Cantidad: ' + item.cantidad + '\n';
        mensaje += '  Precio: ¢' + item.precio.toLocaleString("es-CR") + '\n';
    });

    mensaje += '\n*TOTAL: ¢' + calcularTotal().toLocaleString("es-CR") + '*\n\n';
    mensaje += '¿Podrían confirmar disponibilidad?';

    const numeroWhatsApp = '50687777762';
    const url = 'https://wa.me/' + numeroWhatsApp + '?text=' + encodeURIComponent(mensaje);

    window.open(url, '_blank');
}

// Vaciar carrito con modal de confirmación elegante
function vaciarCart() {
    // Crear modal de confirmación personalizado
    const modalHTML = `
    <div class="modal fade" id="confirmarVaciarModal" tabindex="-1">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content border-0 shadow-lg">
                <div class="modal-body text-center p-4">
                    <div class="mb-3">
                        <i class="bi bi-exclamation-triangle-fill text-warning" style="font-size: 4rem;"></i>
                    </div>
                    <h4 class="fw-bold mb-3">¿Vaciar el carrito?</h4>
                    <p class="text-muted mb-4">Se eliminarán todos las las gorras seleccionadas. Esta acción no se puede deshacer.</p>
                    <div class="d-flex gap-3 justify-content-center">
                        <button class="btn btn-outline-secondary px-4" data-bs-dismiss="modal">
                            Cancelar
                        </button>
                        <button class="btn btn-danger px-4" onclick="confirmarVaciarCarrito()">
                            <i class="bi bi-trash me-2"></i>Sí, vaciar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>`;

    // Eliminar modal anterior si existe
    const oldModal = document.getElementById('confirmarVaciarModal');
    if (oldModal) oldModal.remove();

    // Insertar y mostrar nuevo modal
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    const modal = new bootstrap.Modal(document.getElementById('confirmarVaciarModal'));
    modal.show();

    // Limpiar modal del DOM cuando se cierre
    document.getElementById('confirmarVaciarModal').addEventListener('hidden.bs.modal', function() {
        this.remove();
    });
}

// Confirmar vaciado del carrito
function confirmarVaciarCarrito() {
    carrito = [];
    guardarCarrito();
    actualizarVistaCarrito();
    
    // Cerrar modal de confirmación
    const modalConfirmar = bootstrap.Modal.getInstance(document.getElementById('confirmarVaciarModal'));
    if (modalConfirmar) modalConfirmar.hide();
    
    // Cerrar modal del carrito
    const modalCarrito = bootstrap.Modal.getInstance(document.getElementById('cartModal'));
    if (modalCarrito) {
        setTimeout(() => modalCarrito.hide(), 300); // Pequeño delay para que se vea la transición
    }
    
    // Mostrar notificación de éxito
    mostrarNotificacion('🗑️ Carrito vaciado correctamente');
}

// Mostrar notificación temporal
function mostrarNotificacion(mensaje) {
    // Verificar si ya existe una notificación y eliminarla
    const notifExistente = document.querySelector('.notification-toast');
    if (notifExistente) {
        notifExistente.remove();
    }

    const notif = document.createElement('div');
    notif.className = 'alert alert-success position-fixed top-0 start-50 translate-middle-x mt-5 notification-toast';
    notif.style.zIndex = '9999';
    notif.style.animation = 'slideDown 0.3s ease-out';
    notif.innerHTML = '<i class="bi bi-check-circle me-2"></i>' + mensaje;

    document.body.appendChild(notif);

    setTimeout(() => {
        notif.style.animation = 'slideUp 0.3s ease-out';
        setTimeout(() => notif.remove(), 300);
    }, 1500);
}

// Abrir modal del carrito (nombre corregido para coincidir con HTML)
function toggleCart() {
    const modal = new bootstrap.Modal(document.getElementById('cartModal'));
    actualizarVistaCarrito();
    modal.show();
}

// Inicialización
document.addEventListener('DOMContentLoaded', function () {
    cargarCarrito();
    actualizarVistaCarrito();
});