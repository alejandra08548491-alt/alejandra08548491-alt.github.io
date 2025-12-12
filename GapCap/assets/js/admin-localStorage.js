// Contraseña del administrador (puedes cambiarla)
const ADMIN_PASSWORD = 'admin123';

// Verificar si ya está autenticado
function checkAuth() {
    const isAuthenticated = sessionStorage.getItem('adminAuth');
    if (isAuthenticated === 'true') {
        showAdminPanel();
    }
}

// Login
function login() {
    const password = document.getElementById('passwordInput').value;
    const errorMsg = document.getElementById('errorMsg');
    
    if (password === ADMIN_PASSWORD) {
        sessionStorage.setItem('adminAuth', 'true');
        errorMsg.style.display = 'none';
        showAdminPanel();
    } else {
        errorMsg.style.display = 'block';
        document.getElementById('passwordInput').value = '';
    }
}

// Logout
function logout() {
    if (confirm('¿Estás seguro de cerrar sesión?')) {
        sessionStorage.removeItem('adminAuth');
        location.reload();
    }
}

// Mostrar panel de administración
function showAdminPanel() {
    document.getElementById('loginContainer').style.display = 'none';
    document.getElementById('adminPanel').style.display = 'flex';
    loadCaps();
    updateStats();
}

// Cargar gorras desde localStorage
function loadCaps() {
    const caps = getCapsFromStorage();
    const capsList = document.getElementById('capsList');
    
    if (caps.length === 0) {
        capsList.innerHTML = `
            <div class="text-center py-5 text-muted">
                <i class="bi bi-inbox" style="font-size: 3rem;"></i>
                <p class="mt-3">No hay gorras registradas</p>
            </div>`;
        return;
    }
    
    capsList.innerHTML = '';
    caps.forEach(cap => {
        const capCard = `
        <div class="cap-card">
            <div class="row align-items-center">
                <div class="col-md-1">
                    <img src="${cap.imagen}" alt="${cap.nombre}" class="img-fluid">
                </div>
                <div class="col-md-3">
                    <h6 class="mb-1 text-primary fw-semibold">${cap.nombre}</h6>
                    <small class="text-muted">${cap.categoria} - ${cap.estilo}</small>
                </div>
                <div class="col-md-2">
                    <small class="text-muted">Precio</small>
                    <div class="fw-bold text-success">¢${cap.precio.toLocaleString('es-CR')}</div>
                </div>
                <div class="col-md-2">
                    <small class="text-muted">Stock</small>
                    <div class="fw-bold ${cap.stock < 5 ? 'text-danger' : 'text-success'}">
                        ${cap.stock} unidades
                    </div>
                </div>
                <div class="col-md-2">
                    <span class="badge ${cap.stock > 0 ? 'bg-success' : 'bg-danger'}">
                        ${cap.stock > 0 ? 'Disponible' : 'Agotado'}
                    </span>
                </div>
                <div class="col-md-2 text-end">
                    <button class="btn btn-sm btn-outline-primary me-1" onclick="editCap(${cap.id})" title="Editar">
                        <i class="bi bi-pencil"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-danger" onclick="deleteCap(${cap.id})" title="Eliminar">
                        <i class="bi bi-trash"></i>
                    </button>
                </div>
            </div>
        </div>`;
        
        capsList.innerHTML += capCard;
    });
}

// Obtener gorras desde localStorage
function getCapsFromStorage() {
    const caps = localStorage.getItem('caps');
    if (caps) {
        return JSON.parse(caps);
    }
    // Si no hay gorras guardadas, usar las del JSON por defecto
    return [];
}

// Guardar gorras en localStorage
function saveCapsToStorage(caps) {
    localStorage.setItem('caps', JSON.stringify(caps));
}

// Actualizar estadísticas
function updateStats() {
    const caps = getCapsFromStorage();
    document.getElementById('totalCaps').textContent = caps.length;
    document.getElementById('inStock').textContent = caps.filter(c => c.stock > 0).length;
    document.getElementById('lowStock').textContent = caps.filter(c => c.stock > 0 && c.stock < 5).length;
}

// Mostrar modal para agregar gorra
function showAddCapModal() {
    document.getElementById('modalTitle').innerHTML = '<i class="bi bi-plus-circle me-2"></i>Nueva Gorra';
    document.getElementById('capForm').reset();
    document.getElementById('capId').value = '';
    
    const modal = new bootstrap.Modal(document.getElementById('capModal'));
    modal.show();
}

// Editar gorra
function editCap(id) {
    const caps = getCapsFromStorage();
    const cap = caps.find(c => c.id === id);
    
    if (!cap) return;
    
    document.getElementById('modalTitle').innerHTML = '<i class="bi bi-pencil me-2"></i>Editar Gorra';
    document.getElementById('capId').value = cap.id;
    document.getElementById('capNombre').value = cap.nombre;
    document.getElementById('capPrecio').value = cap.precio;
    document.getElementById('capCategoria').value = cap.categoria;
    document.getElementById('capEstilo').value = cap.estilo;
    document.getElementById('capStock').value = cap.stock;
    document.getElementById('capImagen').value = cap.imagen;
    
    const modal = new bootstrap.Modal(document.getElementById('capModal'));
    modal.show();
}

// Guardar gorra (crear o actualizar)
function saveCap() {
    const id = document.getElementById('capId').value;
    const nombre = document.getElementById('capNombre').value.trim();
    const precio = parseInt(document.getElementById('capPrecio').value);
    const categoria = document.getElementById('capCategoria').value;
    const estilo = document.getElementById('capEstilo').value;
    const stock = parseInt(document.getElementById('capStock').value);
    const imagen = document.getElementById('capImagen').value.trim();
    
    // Validación
    if (!nombre || !precio || !categoria || !estilo || stock < 0 || !imagen) {
        alert('Por favor completa todos los campos correctamente');
        return;
    }
    
    const caps = getCapsFromStorage();
    
    if (id) {
        // Actualizar gorra existente
        const index = caps.findIndex(c => c.id === parseInt(id));
        if (index !== -1) {
            caps[index] = {
                id: parseInt(id),
                nombre,
                precio,
                categoria,
                estilo,
                stock,
                imagen
            };
        }
    } else {
        // Crear nueva gorra
        const newId = caps.length > 0 ? Math.max(...caps.map(c => c.id)) + 1 : 1;
        caps.push({
            id: newId,
            nombre,
            precio,
            categoria,
            estilo,
            stock,
            imagen
        });
    }
    
    saveCapsToStorage(caps);
    loadCaps();
    updateStats();
    
    // Cerrar modal
    const modal = bootstrap.Modal.getInstance(document.getElementById('capModal'));
    modal.hide();
    
    // Mostrar notificación
    showNotification(id ? 'Gorra actualizada correctamente' : 'Gorra agregada correctamente');
}

// Eliminar gorra
function deleteCap(id) {
    if (!confirm('¿Estás seguro de eliminar esta gorra?')) return;
    
    let caps = getCapsFromStorage();
    caps = caps.filter(c => c.id !== id);
    saveCapsToStorage(caps);
    loadCaps();
    updateStats();
    
    showNotification('Gorra eliminada correctamente');
}

// Mostrar notificación
function showNotification(mensaje) {
    const notif = document.createElement('div');
    notif.className = 'alert alert-success position-fixed top-0 start-50 translate-middle-x mt-5';
    notif.style.zIndex = '9999';
    notif.innerHTML = `<i class="bi bi-check-circle me-2"></i>${mensaje}`;
    
    document.body.appendChild(notif);
    
    setTimeout(() => notif.remove(), 2000);
}

// Inicializar al cargar la página
document.addEventListener('DOMContentLoaded', function() {
    checkAuth();
});