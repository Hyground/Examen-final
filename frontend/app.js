// Contenido completo para frontend/app.js

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
        stock: 0,
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
        cargarInventario(); // Recargar la lista tras crear
    } catch (error) {
        mostrarMensaje('msgProducto', 'Error: El ID de Proveedor no existe o faltan datos.', false);
    }
});


// --- 3. Registrar Movimiento (ENTRADA / SALIDA) ---
document.getElementById('formMovimiento').addEventListener('submit', async (e) => {
    e.preventDefault();
    const productoId = document.getElementById('movimientoProductoId').value;
    const tipo = document.getElementById('movimientoTipo').value;
    const cantidad = document.getElementById('movimientoCantidad').value;
    
    const url = `${API_BASE_URL}/movimiento/${productoId}?tipo=${tipo}&cantidad=${cantidad}`;

    try {
        const response = await fetch(url, { method: 'POST' });

        if (!response.ok) {
             const errorText = await response.text();
             throw new Error(errorText || 'Error desconocido al registrar movimiento.');
        }

        const productoActualizado = await response.json();
        mostrarMensaje('msgMovimiento', 
            `${tipo.toUpperCase()} exitosa. Stock de ${productoActualizado.nombre} ahora es ${productoActualizado.stock}.`, true);
        
        document.getElementById('formMovimiento').reset();
        cargarInventario(); // Recargar la lista tras movimiento

    } catch (error) {
        mostrarMensaje('msgMovimiento', `Error: ${error.message}`, false);
    }
});


// --- 4. Cargar Inventario ---
async function cargarInventario() {
    const lista = document.getElementById('listaProductos');
    lista.innerHTML = '<li>Cargando...</li>';

    try {
        // En este punto, sabemos que el problema de serialización ha sido corregido en el backend.
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
            // Usamos || 0 por si el campo stock viene nulo por algún error de inserción inicial.
            li.textContent = `[ID: ${p.id}] ${p.nombre} - Stock: ${p.stock || 0} - Bodega: ${p.ubicacionBodega} (Prov: ${p.proveedor.id})`;
            lista.appendChild(li);
        });

    } catch (error) {
        lista.innerHTML = '<li>ERROR: No se pudo conectar a la API REST de Spring Boot. Asegúrate de que está corriendo.</li>';
    }
}