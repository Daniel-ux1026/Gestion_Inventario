// CÓDIGO COMPLETO Y CORREGIDO
package com.inventario.repository;

import com.inventario.entity.Venta;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface VentaRepository extends JpaRepository<Venta, Integer> {

    List<Venta> findByClienteIdUsuario(Integer clienteId);

    // CORREGIR: usar fechaRegistro en lugar de fechaCreacion
    List<Venta> findByFechaRegistroBetween(LocalDateTime inicio, LocalDateTime fin);

    List<Venta> findTop5ByOrderByFechaRegistroDesc();
}