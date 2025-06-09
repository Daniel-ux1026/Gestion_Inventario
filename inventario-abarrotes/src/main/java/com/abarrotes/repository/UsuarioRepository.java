package com.abarrotes.repository;

import com.abarrotes.entity.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Integer> {

    // Buscar usuario por correo para autenticación
    Optional<Usuario> findByCorreo(String correo);

    // Buscar usuario por DNI
    Optional<Usuario> findByDni(String dni);

    // Verificar si existe un correo
    boolean existsByCorreo(String correo);

    // Verificar si existe un DNI
    boolean existsByDni(String dni);

    // Buscar usuarios activos
    List<Usuario> findByEstadoTrue();

    // Buscar usuarios por rol
    @Query("SELECT u FROM Usuario u WHERE u.rol.idRol = :rolId AND u.estado = true")
    List<Usuario> findByRolIdAndEstadoTrue(@Param("rolId") Integer rolId);

    // Buscar usuarios por nombre o apellido
    @Query("SELECT u FROM Usuario u WHERE u.estado = true AND " +
            "(LOWER(u.nombre) LIKE LOWER(CONCAT('%', :termino, '%')) OR " +
            "LOWER(u.apellido) LIKE LOWER(CONCAT('%', :termino, '%')))")
    List<Usuario> findByNombreOrApellidoContainingIgnoreCase(@Param("termino") String termino);

    // Contar usuarios activos por rol
    @Query("SELECT COUNT(u) FROM Usuario u WHERE u.rol.idRol = :rolId AND u.estado = true")
    Long countByRolIdAndEstadoTrue(@Param("rolId") Integer rolId);

    // Buscar clientes (usuarios con rol de cliente)
    @Query("SELECT u FROM Usuario u WHERE u.rol.nombre = 'CLIENTE' AND u.estado = true")
    List<Usuario> findClientes();

    // Buscar empleados (usuarios que no son clientes)
    @Query("SELECT u FROM Usuario u WHERE u.rol.nombre != 'CLIENTE' AND u.estado = true")
    List<Usuario> findEmpleados();
}