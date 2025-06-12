package com.inventario.repository;

import com.inventario.entity.Venta;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface VentaRepository extends JpaRepository<Venta, Integer> {
    Optional<Venta> findByNumeroVenta(String numeroVenta);

    List<Venta> findByCliente_IdUsuario(Integer clienteId);

    @Query("SELECT v FROM Venta v WHERE v.fechaVenta BETWEEN :fechaInicio AND :fechaFin")
    List<Venta> findByFechaBetween(@Param("fechaInicio") LocalDate fechaInicio, @Param("fechaFin") LocalDate fechaFin);

    @Query("SELECT v FROM Venta v WHERE v.estado = :estado")
    List<Venta> findByEstado(@Param("estado") Venta.EstadoVenta estado);

    @Query("SELECT COUNT(v) FROM Venta v WHERE v.fechaVenta = :fecha")
    Long countVentasPorFecha(@Param("fecha") LocalDate fecha);
}