package com.abarrotes.repository;

import com.abarrotes.entity.Producto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProductoRepository extends JpaRepository<Producto, Integer> {

    // Buscar producto por código
    Optional<Producto> findByCodigo(String codigo);

    // Verificar si existe un código
    boolean existsByCodigo(String codigo);

    // Buscar productos activos
    List<Producto> findByEstadoTrue();

    // Buscar productos por categoría
    @Query("SELECT p FROM Producto p WHERE p.categoria.idCategoria = :categoriaId AND p.estado = true")
    List<Producto> findByCategoriaIdAndEstadoTrue(@Param("categoriaId") Integer categoriaId);

    // Buscar productos por marca
    @Query("SELECT p FROM Producto p WHERE p.marca.idMarca = :marcaId AND p.estado = true")
    List<Producto> findByMarcaIdAndEstadoTrue(@Param("marcaId") Integer marcaId);

    // Buscar productos por nombre
    @Query("SELECT p FROM Producto p WHERE p.estado = true AND " +
            "LOWER(p.nombre) LIKE LOWER(CONCAT('%', :termino, '%'))")
    List<Producto> findByNombreContainingIgnoreCase(@Param("termino") String termino);

    // Buscar productos con stock bajo
    @Query("SELECT p FROM Producto p WHERE p.estado = true AND p.stock <= :minStock")
    List<Producto> findProductosConStockBajo(@Param("minStock") Integer minStock);

    // Buscar productos sin stock
    @Query("SELECT p FROM Producto p WHERE p.estado = true AND p.stock = 0")
    List<Producto> findProductosSinStock();

    // Buscar productos disponibles (con stock)
    @Query("SELECT p FROM Producto p WHERE p.estado = true AND p.stock > 0")
    List<Producto> findProductosDisponibles();

    // Buscar productos por código o nombre
    @Query("SELECT p FROM Producto p WHERE p.estado = true AND " +
            "(LOWER(p.codigo) LIKE LOWER(CONCAT('%', :termino, '%')) OR " +
            "LOWER(p.nombre) LIKE LOWER(CONCAT('%', :termino, '%')))")
    List<Producto> findByCodigoOrNombreContainingIgnoreCase(@Param("termino") String termino);

    // Contar productos por categoría
    @Query("SELECT COUNT(p) FROM Producto p WHERE p.categoria.idCategoria = :categoriaId AND p.estado = true")
    Long countByCategoriaIdAndEstadoTrue(@Param("categoriaId") Integer categoriaId);

    // Contar productos por marca
    @Query("SELECT COUNT(p) FROM Producto p WHERE p.marca.idMarca = :marcaId AND p.estado = true")
    Long countByMarcaIdAndEstadoTrue(@Param("marcaId") Integer marcaId);
}