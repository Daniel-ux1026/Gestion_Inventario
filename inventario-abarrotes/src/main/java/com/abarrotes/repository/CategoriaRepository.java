package com.abarrotes.repository;

import com.abarrotes.entity.Categoria;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CategoriaRepository extends JpaRepository<Categoria, Integer> {

    // Buscar categoria por nombre
    Optional<Categoria> findByNombre(String nombre);

    // Verificar si existe un nombre de categoria
    boolean existsByNombre(String nombre);

    // Buscar categorias activas
    List<Categoria> findByEstadoTrue();

    // Buscar categorias por nombre (búsqueda)
    @Query("SELECT c FROM Categoria c WHERE c.estado = true AND " +
            "LOWER(c.nombre) LIKE LOWER(CONCAT('%', :termino, '%'))")
    List<Categoria> findByNombreContainingIgnoreCase(@Param("termino") String termino);
}