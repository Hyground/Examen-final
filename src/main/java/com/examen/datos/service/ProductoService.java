package com.examen.datos.service;

import com.examen.datos.model.Producto;
import com.examen.datos.repository.ProductoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProductoService {

    @Autowired
    private ProductoRepository productoRepository;

    public List<Producto> findAll() { return productoRepository.findAll(); }

    public Producto save(Producto p) { return productoRepository.save(p); }

    public Optional<Producto> findById(Long id) { return productoRepository.findById(id); }

    public Producto registrarMovimiento(Long id, String tipo, int cantidad) {
        Producto p = productoRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Producto no encontrado"));
        
        if (tipo.equalsIgnoreCase("ENTRADA")) {
            p.setStock(p.getStock() + cantidad);
        } else if (tipo.equalsIgnoreCase("SALIDA")) {
            if (p.getStock() < cantidad) {
                throw new IllegalArgumentException("Stock insuficiente para salida.");
            }
            p.setStock(p.getStock() - cantidad);
        }
        return productoRepository.save(p);
    }
}