package com.abarrotes.repository;

import com.abarrotes.entity.Venta;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface VentaRepository extends JpaRepository<Venta, Integer> {

    // Buscar ventas activas
    List<Venta> findByEstadoTrue();

    // Buscar ventas por usuario (vendedor)
    @Query("SELECT v FROM Venta v WHERE v.usuario.idUsuario = :usuarioId AND v.estado = true")
    List<Venta> findByUsuarioIdAndEstadoTrue(@Param("usuarioId") Integer usuarioId);

    // Buscar ventas por cliente
    @Query("SELECT v FROM Venta v WHERE v.cliente.idUsuario = :clienteId AND v.estado = true")
    List<Venta> findByClienteIdAndEstadoTrue(@Param("clienteId") Integer clienteId);

    // Buscar ventas por rango de fechas
    @Query("SELECT v FROM Venta v WHERE v.estado = true AND v.fecha BETWEEN :fechaInicio AND :fechaFin")
    List<Venta> findByFechaBetweenAndEstadoTrue(@Param("fechaInicio") LocalDateTime fechaInicio,
                                                @Param("fechaFin") LocalDateTime fechaFin);

    // Buscar ventas del día actual
    @Query("SELECT v FROM Venta v WHERE v.estado = true AND DATE(v.fecha) = CURRENT_DATE")
    List<Venta> findVentasDelDia();

    // Buscar ventas del mes actual
    @Query("SELECT v FROM Venta v WHERE v.estado = true AND " +
            "YEAR(v.fecha) = YEAR(CURRENT_DATE) AND MONTH(v.fecha) = MONTH(CURRENT_DATE)")
    List<Venta> findVentasDelMes();

    // Calcular total de ventas del día
    @Query("SELECT COALESCE(SUM(v.total), 0) FROM Venta v WHERE v.estado = true AND DATE(v.fecha) = CURRENT_DATE")
    BigDecimal calcularTotalVentasDelDia();

    // Calcular total de ventas del mes
    @Query("SELECT COALESCE(SUM(v.total), 0) FROM Venta v WHERE v.estado = true AND " +
            "YEAR(v.fecha) = YEAR(CURRENT_DATE) AND MONTH(v.fecha) = MONTH(CURRENT_DATE)")
    BigDecimal calcularTotalVentasDelMes();

    // Contar ventas del día
    @Query("SELECT COUNT(v) FROM Venta v WHERE v.estado = true AND DATE(v.fecha) = CURRENT_DATE")
    Long contarVentasDelDia();

    // Contar ventas del mes
    @Query("SELECT COUNT(v) FROM Venta v WHERE v.estado = true AND " +
            "YEAR(v.fecha) = YEAR(CURRENT_DATE) AND MONTH(v.fecha) = MONTH(CURRENT_DATE)")
    Long contarVentasDelMes();

    // Buscar ventas por rango de total
    @Query("SELECT v FROM Venta v WHERE v.estado = true AND v.total BETWEEN :minTotal AND :maxTotal")
    List<Venta> findByTotalBetweenAndEstadoTrue(@Param("minTotal") BigDecimal minTotal,
                                                @Param("maxTotal") BigDecimal maxTotal);

    // Top clientes por ventas
    @Query("SELECT v.cliente, COUNT(v), SUM(v.total) FROM Venta v WHERE v.estado = true " +
            "GROUP BY v.cliente ORDER BY SUM(v.total) DESC")
    List<Object[]> findTopClientesPorVentas();
}