package com.inventario.repository;

import com.inventario.entity.Producto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProductoRepository extends JpaRepository<Producto, Integer> {

    // Encuentra productos activos
    List<Producto> findByActivoTrue();

    // Encuentra productos por ID de categoría que estén activos
    // CORRECCIÓN: Este es el método que faltaba.
    List<Producto> findByCategoria_IdCategoriaAndActivoTrue(Integer categoriaId);

    // Busca productos por nombre o código
    @Query("SELECT p FROM Producto p WHERE (LOWER(p.nombreProducto) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(p.codigoProducto) LIKE LOWER(CONCAT('%', :search, '%'))) AND p.activo = true")
    List<Producto> buscarProductos(@Param("search") String search);

    // Encuentra productos con stock por debajo del mínimo
    @Query("SELECT p FROM Producto p WHERE p.stockActual <= p.stockMinimo AND p.activo = true")
    List<Producto> findProductosConStockBajo();

    // Verifica si un producto existe por su código
    boolean existsByCodigoProducto(String codigoProducto);

    long countByStockActualLessThan(Integer stock);

    @Query("SELECT p FROM Producto p JOIN DetalleVenta dv ON p.idProducto = dv.producto.idProducto " +
            "GROUP BY p.idProducto ORDER BY SUM(dv.cantidad) DESC")
    List<Producto> findTop5ProductosMasVendidos();
}
