// Copia y pega este contenido en frontend/app.js

const API_BASE_URL = 'http://localhost:8080/api/inventario';

// --- Funciones de Utilidad ---
function mostrarMensaje(id, mensaje, exito = true) {
    const el = document.getElementById(id);
    el.textContent = mensaje;
    el.className = exito ? 'message success' : 'message error';
}

// --- 1. Crear Proveedor ---
document.getElementById('formProveedor').addEventListener('submit', async (e) => {
    e.preventDefault();
    const nombre = document.getElementById('nombreProveedor').value;
    
    try {
        const response = await fetch(`${API_BASE_URL}/proveedores`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nombre: nombre })
        });

        if (!response.ok) throw new Error('Error al crear proveedor.');

        const proveedor = await response.json();
        mostrarMensaje('msgProveedor', `Proveedor '${proveedor.nombre}' (ID: ${proveedor.id}) creado con éxito.`, true);
        document.getElementById('formProveedor').reset();
    } catch (error) {
        mostrarMensaje('msgProveedor', 'Error: No se pudo conectar al backend o el proveedor ya existe.', false);
    }
});


// --- 2. Crear Producto ---
document.getElementById('formProducto').addEventListener('submit', async (e) => {
    e.preventDefault();
    const nombre = document.getElementById('nombreProducto').value;
    const ubicacionBodega = document.getElementById('ubicacionProducto').value;
    const proveedorId = document.getElementById('proveedorIdProducto').value;

    const data = {
        nombre: nombre,
        ubicacionBodega: ubicacionBodega,
        stock: 0, // Se inicializa en 0
        proveedor: { id: parseInt(proveedorId) }
    };

    try {
        const response = await fetch(`${API_BASE_URL}/productos`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        if (!response.ok) throw new Error('Error al crear producto.');

        const producto = await response.json();
        mostrarMensaje('msgProducto', `Producto '${producto.nombre}' (ID: ${producto.id}) creado.`, true);
        document.getElementById('formProducto').reset();
    } catch (error) {
        mostrarMensaje('msgProducto', 'Error: El ID de Proveedor no existe o faltan datos.', false);
    }
});


// --- 3. Cargar Inventario ---
async function cargarInventario() {
    const lista = document.getElementById('listaProductos');
    lista.innerHTML = '<li>Cargando...</li>';

    try {
        const response = await fetch(`${API_BASE_URL}/productos`);
        if (!response.ok) throw new Error('Error al obtener inventario.');

        const productos = await response.json();
        lista.innerHTML = ''; // Limpiar lista
        
        if (productos.length === 0) {
            lista.innerHTML = '<li>No hay productos registrados en el inventario.</li>';
            return;
        }

        productos.forEach(p => {
            const li = document.createElement('li');
            li.textContent = `[ID: ${p.id}] ${p.nombre} - Stock: ${p.stock || 0} - Bodega: ${p.ubicacionBodega} (Prov: ${p.proveedor.id})`;
            lista.appendChild(li);
        });

    } catch (error) {
        lista.innerHTML = '<li>ERROR: No se pudo conectar a la API REST de Spring Boot. Asegúrate de que está corriendo.</li>';
    }
}