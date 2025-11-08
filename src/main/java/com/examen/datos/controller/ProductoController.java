package com.examen.datos.controller;

import com.examen.datos.model.Producto;
import com.examen.datos.model.Proveedor;
import com.examen.datos.repository.ProveedorRepository;
import com.examen.datos.service.ProductoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/inventario")
public class ProductoController {
    @Autowired private ProductoService productoService;
    @Autowired private ProveedorRepository proveedorRepository;

    @GetMapping("/productos")
    public List<Producto> listarProductos() {
        return productoService.findAll();
    }
    
    @PostMapping("/proveedores")
    public ResponseEntity<Proveedor> crearProveedor(@RequestBody Proveedor p) {
        return new ResponseEntity<>(proveedorRepository.save(p), HttpStatus.CREATED);
    }
    
    @PostMapping("/productos")
    public ResponseEntity<Producto> crearProducto(@RequestBody Producto p) {
        if (p.getProveedor() == null || p.getProveedor().getId() == null) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        // Asegura que el proveedor existe antes de guardar el producto
        proveedorRepository.findById(p.getProveedor().getId())
            .orElseThrow(() -> new RuntimeException("Proveedor no encontrado"));
        
        p.setStock(p.getStock() != null ? p.getStock() : 0);
        return new ResponseEntity<>(productoService.save(p), HttpStatus.CREATED);
    }
    
    // Endpoint de Movimiento de Inventario (Entrada/Salida)
    @PostMapping("/movimiento/{productoId}")
    public ResponseEntity<?> registrarMovimiento(@PathVariable Long productoId, @RequestParam String tipo, @RequestParam int cantidad) {
        try {
            Producto p = productoService.registrarMovimiento(productoId, tipo, cantidad);
            // Esto simula el movimiento; en un sistema real, guardarías un registro de Movimiento (historial) aquí.
            return new ResponseEntity<>(p, HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        } catch (RuntimeException e) {
             return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        }
    }
}
