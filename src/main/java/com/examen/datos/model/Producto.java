package com.examen.datos.model;
import lombok.Data;
import jakarta.persistence.*;
 @Data @Entity @Table(name = "producto")
public class Producto {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String nombre;
    private Integer stock;
    private String ubicacionBodega; // Qué productos están en bodega
    @ManyToOne @JoinColumn(name = "proveedor_id", nullable = false)
    private Proveedor proveedor;
}