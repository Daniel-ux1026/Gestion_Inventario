package com.inventario.repository;

import com.inventario.entity.Compra;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface CompraRepository extends JpaRepository<Compra, Integer> {
    Optional<Compra> findByNumeroCompra(String numeroCompra);

    List<Compra> findByProveedor_IdProveedor(Integer proveedorId);

    @Query("SELECT c FROM Compra c WHERE c.fechaCompra BETWEEN :fechaInicio AND :fechaFin")
    List<Compra> findByFechaBetween(@Param("fechaInicio") LocalDate fechaInicio, @Param("fechaFin") LocalDate fechaFin);

    @Query("SELECT c FROM Compra c WHERE c.estado = :estado")
    List<Compra> findByEstado(@Param("estado") Compra.EstadoCompra estado);

    @Query("SELECT COUNT(c) FROM Compra c WHERE c.fechaCompra = :fecha")
    Long countComprasPorFecha(@Param("fecha") LocalDate fecha);
}