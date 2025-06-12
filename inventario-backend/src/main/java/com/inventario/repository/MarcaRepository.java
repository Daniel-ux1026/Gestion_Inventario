package com.inventario.repository;

import com.inventario.entity.Marca;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface MarcaRepository extends JpaRepository<Marca, Integer> {
    List<Marca> findByActivoTrue();

    Optional<Marca> findByNombreMarca(String nombreMarca);

    boolean existsByNombreMarca(String nombreMarca);
}
