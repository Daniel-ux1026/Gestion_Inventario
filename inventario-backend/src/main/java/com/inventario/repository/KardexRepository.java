package com.inventario.repository;

import com.inventario.entity.Kardex;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface KardexRepository extends JpaRepository<Kardex, Integer> {
    List<Kardex> findByProducto_IdProductoOrderByFechaMovimientoDesc(Integer productoId);

    @Query("SELECT k FROM Kardex k WHERE k.fechaMovimiento BETWEEN :fechaInicio AND :fechaFin ORDER BY k.fechaMovimiento DESC")
    List<Kardex> findByFechaBetween(@Param("fechaInicio") LocalDateTime fechaInicio, @Param("fechaFin") LocalDateTime fechaFin);

    @Query("SELECT k FROM Kardex k WHERE k.tipoMovimiento = :tipoMovimiento ORDER BY k.fechaMovimiento DESC")
    List<Kardex> findByTipoMovimiento(@Param("tipoMovimiento") Kardex.TipoMovimiento tipoMovimiento);
}