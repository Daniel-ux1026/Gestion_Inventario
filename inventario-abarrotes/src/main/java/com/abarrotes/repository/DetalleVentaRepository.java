package com.abarrotes.repository;

import com.abarrotes.entity.DetalleVenta;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DetalleVentaRepository extends JpaRepository<DetalleVenta, Integer> {

    // Buscar detalles por venta
    @Query("SELECT dv FROM DetalleVenta dv WHERE dv.venta.idVenta = :ventaId")
    List<DetalleVenta> findByVentaId(@Param("ventaId") Integer ventaId);

    // Buscar detalles por producto
    @Query("SELECT dv FROM DetalleVenta dv WHERE dv.producto.idProducto = :productoId")
    List<DetalleVenta> findByProductoId(@Param("productoId") Integer productoId);

    // Productos más vendidos
    @Query("SELECT dv.producto, SUM(dv.cantidad) as totalVendido FROM DetalleVenta dv " +
            "WHERE dv.venta.estado = true " +
            "GROUP BY dv.producto ORDER BY totalVendido DESC")
    List<Object[]> findProductosMasVendidos();

    // Productos más vendidos en un período
    @Query("SELECT dv.producto, SUM(dv.cantidad) as totalVendido FROM DetalleVenta dv " +
            "WHERE dv.venta.estado = true AND DATE(dv.venta.fecha) = CURRENT_DATE " +
            "GROUP BY dv.producto ORDER BY totalVendido DESC")
    List<Object[]> findProductosMasVendidosDelDia();
}