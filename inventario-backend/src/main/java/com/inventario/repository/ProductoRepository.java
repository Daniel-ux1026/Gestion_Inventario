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
    List<Producto> findByActivoTrue();

    Optional<Producto> findByCodigoProducto(String codigoProducto);

    @Query("SELECT p FROM Producto p WHERE p.activo = true AND " +
            "(LOWER(p.nombreProducto) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
            "LOWER(p.codigoProducto) LIKE LOWER(CONCAT('%', :search, '%')))")
    List<Producto> buscarProductos(@Param("search") String search);

    @Query("SELECT p FROM Producto p WHERE p.categoria.idCategoria = :categoriaId AND p.activo = true")
    List<Producto> findByCategoria(@Param("categoriaId") Integer categoriaId);

    @Query("SELECT p FROM Producto p WHERE p.marca.idMarca = :marcaId AND p.activo = true")
    List<Producto> findByMarca(@Param("marcaId") Integer marcaId);

    @Query("SELECT p FROM Producto p WHERE p.stockActual <= p.stockMinimo AND p.activo = true")
    List<Producto> findProductosConStockBajo();

    boolean existsByCodigoProducto(String codigoProducto);
}