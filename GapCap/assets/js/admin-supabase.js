// Verificar autenticación al cargar
document.addEventListener('DOMContentLoaded', function() {
    if (estaAutenticado()) {
        showAdminPanel();
    }
});

// Login
async function login() {
    const password = document.getElementById('passwordInput').value;
    const errorMsg = document.getElementById('errorMsg');
    const btnLogin = document.querySelector('button[onclick="login()"]');
    
    if (!password) {
        errorMsg.style.display = 'block';
        errorMsg.innerHTML = '<i class="bi bi-exclamation-triangle me-2"></i>Por favor ingresa la contraseña';
        return;
    }
    
    // Deshabilitar botón mientras carga
    btnLogin.disabled = true;
    btnLogin.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Ingresando...';
    
    const result = await loginAdmin(password);
    
    if (result.success) {
        errorMsg.style.display = 'none';
        showAdminPanel();
    } else {
        errorMsg.style.display = 'block';
        errorMsg.innerHTML = '<i class="bi bi-exclamation-triangle me-2"></i>Contraseña incorrecta';
        document.getElementById('passwordInput').value = '';
        btnLogin.disabled = false;
        btnLogin.innerHTML = '<i class="bi bi-box-arrow-in-right me-2"></i>Ingresar';
    }
}

// Logout
function logout() {
    if (confirm('¿Estás seguro de cerrar sesión?')) {
        cerrarSesion();
        location.reload();
    }
}

// Mostrar panel de administración
async function showAdminPanel() {
    document.getElementById('loginContainer').style.display = 'none';
    document.getElementById('adminPanel').style.display = 'flex';
    await loadCaps();
    updateStats();
}

// Cargar gorras desde Supabase
async function loadCaps() {
    const capsList = document.getElementById('capsList');
    capsList.innerHTML = '<div class="text-center py-5"><div class="spinner-border text-primary"></div><p class="mt-3">Cargando gorras...</p></div>';
    
    const caps = await obtenerGorras();
    
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
                    <img src="${cap.imagen}" alt="${cap.nombre}" class="img-fluid" onerror="this.src='assets/img/gorraTest.jpg'">
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

// Actualizar estadísticas
async function updateStats() {
    const caps = await obtenerGorras();
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
async function editCap(id) {
    const caps = await obtenerGorras();
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
async function saveCap() {
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
    
    const gorraData = {
        nombre,
        precio,
        categoria,
        estilo,
        stock,
        imagen
    };
    
    // Deshabilitar botón mientras guarda
    const btnSave = document.querySelector('button[onclick="saveCap()"]');
    const originalText = btnSave.innerHTML;
    btnSave.disabled = true;
    btnSave.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Guardando...';
    
    let result;
    if (id) {
        // Actualizar
        result = await actualizarGorra(parseInt(id), gorraData);
    } else {
        // Crear
        result = await agregarGorra(gorraData);
    }
    
    btnSave.disabled = false;
    btnSave.innerHTML = originalText;
    
    if (result.success) {
        await loadCaps();
        updateStats();
        
        // Cerrar modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('capModal'));
        modal.hide();
        
        showNotification(id ? 'Gorra actualizada correctamente' : 'Gorra agregada correctamente');
    } else {
        alert('Error al guardar: ' + result.error);
    }
}

// Eliminar gorra
async function deleteCap(id) {
    if (!confirm('¿Estás seguro de eliminar esta gorra?')) return;
    
    const result = await eliminarGorra(id);
    
    if (result.success) {
        await loadCaps();
        updateStats();
        showNotification('Gorra eliminada correctamente');
    } else {
        alert('Error al eliminar: ' + result.error);
    }
}

// Mostrar notificación
function showNotification(mensaje) {
    const notif = document.createElement('div');
    notif.className = 'alert alert-success position-fixed top-0 start-50 translate-middle-x mt-5 notification-toast';
    notif.style.zIndex = '9999';
    notif.style.animation = 'slideDown 0.3s ease-out';
    notif.innerHTML = `<i class="bi bi-check-circle me-2"></i>${mensaje}`;
    
    document.body.appendChild(notif);
    
    setTimeout(() => {
        notif.style.animation = 'slideUp 0.3s ease-out';
        setTimeout(() => notif.remove(), 300);
    }, 2000);
}