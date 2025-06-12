package com.inventario.repository;

import com.inventario.entity.Categoria;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface CategoriaRepository extends JpaRepository<Categoria, Integer> {
    List<Categoria> findByActivoTrue();

    Optional<Categoria> findByNombreCategoria(String nombreCategoria);

    boolean existsByNombreCategoria(String nombreCategoria);
}
