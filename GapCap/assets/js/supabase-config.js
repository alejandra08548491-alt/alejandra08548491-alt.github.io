// ============================================
// CONFIGURACIÓN DE SUPABASE
// ============================================
// ⚠️ IMPORTANTE: Reemplaza estos valores con los tuyos
// Los obtuviste en Settings → API

const SUPABASE_URL = 'https://pzrevnjmfnpaljojtooh.supabase.co';  // ← CAMBIA ESTO
const SUPABASE_KEY = 'sb_publishable_KYWjLYOP14irU6Va_Osx_Q_X72SqHQQ';  // ← CAMBIA ESTO

// Inicializar cliente de Supabase
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// ============================================
// FUNCIONES PARA GORRAS
// ============================================

// Obtener todas las gorras
async function obtenerGorras() {
    try {
        const { data, error } = await supabase
            .from('gorras')
            .select('*')
            .order('id', { ascending: true });
        
        if (error) throw error;
        return data || [];
    } catch (error) {
        console.error('Error al obtener gorras:', error);
        return [];
    }
}

// Agregar nueva gorra
async function agregarGorra(gorra) {
    try {
        const { data, error } = await supabase
            .from('gorras')
            .insert([{
                nombre: gorra.nombre,
                categoria: gorra.categoria,
                estilo: gorra.estilo,
                precio: gorra.precio,
                imagen: gorra.imagen,
                stock: gorra.stock
            }])
            .select();
        
        if (error) throw error;
        return { success: true, data };
    } catch (error) {
        console.error('Error al agregar gorra:', error);
        return { success: false, error: error.message };
    }
}

// Actualizar gorra
async function actualizarGorra(id, gorra) {
    try {
        const { data, error } = await supabase
            .from('gorras')
            .update({
                nombre: gorra.nombre,
                categoria: gorra.categoria,
                estilo: gorra.estilo,
                precio: gorra.precio,
                imagen: gorra.imagen,
                stock: gorra.stock
            })
            .eq('id', id)
            .select();
        
        if (error) throw error;
        return { success: true, data };
    } catch (error) {
        console.error('Error al actualizar gorra:', error);
        return { success: false, error: error.message };
    }
}

// Eliminar gorra
async function eliminarGorra(id) {
    try {
        const { error } = await supabase
            .from('gorras')
            .delete()
            .eq('id', id);
        
        if (error) throw error;
        return { success: true };
    } catch (error) {
        console.error('Error al eliminar gorra:', error);
        return { success: false, error: error.message };
    }
}

// ============================================
// AUTENTICACIÓN DE ADMIN
// ============================================

// Login de admin
async function loginAdmin(password) {
    try {
        const { data, error } = await supabase
            .from('admin_users')
            .select('*')
            .eq('password', password)
            .single();
        
        if (error) throw error;
        
        // Guardar sesión
        sessionStorage.setItem('adminAuth', 'true');
        sessionStorage.setItem('adminUser', data.username);
        
        return { success: true };
    } catch (error) {
        console.error('Error en login:', error);
        return { success: false };
    }
}

// Verificar autenticación
function estaAutenticado() {
    return sessionStorage.getItem('adminAuth') === 'true';
}

// Cerrar sesión
function cerrarSesion() {
    sessionStorage.removeItem('adminAuth');
    sessionStorage.removeItem('adminUser');
}