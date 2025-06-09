package com.abarrotes.repository;

import com.abarrotes.entity.Proveedor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProveedorRepository extends JpaRepository<Proveedor, Integer> {

    // Buscar proveedor por DNI
    Optional<Proveedor> findByDni(String dni);

    // Buscar proveedor por empresa
    Optional<Proveedor> findByEmpresa(String empresa);

    // Verificar si existe un DNI
    boolean existsByDni(String dni);

    // Verificar si existe una empresa
    boolean existsByEmpresa(String empresa);

    // Buscar proveedores activos
    List<Proveedor> findByEstadoTrue();

    // Buscar proveedores por nombre, apellido o empresa
    @Query("SELECT p FROM Proveedor p WHERE p.estado = true AND " +
            "(LOWER(p.nombre) LIKE LOWER(CONCAT('%', :termino, '%')) OR " +
            "LOWER(p.apellido) LIKE LOWER(CONCAT('%', :termino, '%')) OR " +
            "LOWER(p.empresa) LIKE LOWER(CONCAT('%', :termino, '%')))")
    List<Proveedor> findByNombreOrApellidoOrEmpresaContainingIgnoreCase(@Param("termino") String termino);
}