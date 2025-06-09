package com.abarrotes.repository;

import com.abarrotes.entity.Marca;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MarcaRepository extends JpaRepository<Marca, Integer> {

    // Buscar marca por nombre
    Optional<Marca> findByNombre(String nombre);

    // Verificar si existe un nombre de marca
    boolean existsByNombre(String nombre);

    // Buscar marcas activas
    List<Marca> findByEstadoTrue();

    // Buscar marcas por nombre (búsqueda)
    @Query("SELECT m FROM Marca m WHERE m.estado = true AND " +
            "LOWER(m.nombre) LIKE LOWER(CONCAT('%', :termino, '%'))")
    List<Marca> findByNombreContainingIgnoreCase(@Param("termino") String termino);
}