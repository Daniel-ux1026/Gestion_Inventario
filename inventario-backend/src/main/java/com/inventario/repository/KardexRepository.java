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

    // CORRECCIÓN: Se cambió '...OrderByFechaMovimientoDesc' a '...OrderByFechaDesc'.
    List<Kardex> findByProducto_IdProductoOrderByFechaDesc(Integer productoId);

    // CORRECCIÓN: Se cambió 'k.fechaMovimiento' a 'k.fecha' en la consulta JPQL.
    @Query("SELECT k FROM Kardex k WHERE k.fecha BETWEEN :fechaInicio AND :fechaFin ORDER BY k.fecha DESC")
    List<Kardex> findByFechaBetween(@Param("fechaInicio") LocalDateTime fechaInicio, @Param("fechaFin") LocalDateTime fechaFin);

    // CORRECCIÓN: Se cambió el tipo del parámetro a 'String' y 'k.fechaMovimiento' a 'k.fecha'.
    @Query("SELECT k FROM Kardex k WHERE k.tipoMovimiento = :tipoMovimiento ORDER BY k.fecha DESC")
    List<Kardex> findByTipoMovimiento(@Param("tipoMovimiento") String tipoMovimiento);
}
