package com.inventario.repository;

import com.inventario.entity.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Integer> {
    Optional<Usuario> findByEmail(String email);

    List<Usuario> findByActivoTrue();

    @Query("SELECT u FROM Usuario u WHERE u.rol.nombreRol = :nombreRol AND u.activo = true")
    List<Usuario> findByRolAndActivoTrue(@Param("nombreRol") String nombreRol);

    @Query("SELECT u FROM Usuario u WHERE u.rol.nombreRol = 'CLIENTE' AND u.activo = true")
    List<Usuario> findClientes();

    boolean existsByEmail(String email);
}