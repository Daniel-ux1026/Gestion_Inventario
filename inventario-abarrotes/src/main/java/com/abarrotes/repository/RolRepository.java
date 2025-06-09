package com.abarrotes.repository;

import com.abarrotes.entity.Rol;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RolRepository extends JpaRepository<Rol, Integer> {

    // Buscar rol por nombre
    Optional<Rol> findByNombre(String nombre);

    // Verificar si existe un nombre de rol
    boolean existsByNombre(String nombre);
}