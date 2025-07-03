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

    // ==================== CONSULTAS BÁSICAS ====================

    /**
     * Busca un usuario por su email
     * @param email Email del usuario
     * @return Optional con el usuario encontrado
     */
    Optional<Usuario> findByEmail(String email);

    /**
     * Verifica si existe un usuario con el email dado
     * @param email Email a verificar
     * @return true si existe, false si no
     */
    boolean existsByEmail(String email);

    // ==================== CONSULTAS POR ESTADO ====================

    /**
     * Busca todos los usuarios activos
     * @return Lista de usuarios activos
     */
    List<Usuario> findByActivoTrue();

    /**
     * Busca todos los usuarios inactivos
     * @return Lista de usuarios inactivos
     */
    List<Usuario> findByActivoFalse();

    // ==================== CONSULTAS POR ROL ====================

    /**
     * Busca usuarios por nombre de rol
     * @param nombreRol Nombre del rol (ej: "CLIENTE", "ADMIN")
     * @return Lista de usuarios con ese rol
     */
    @Query("SELECT u FROM Usuario u WHERE u.rol.nombreRol = :nombreRol")
    List<Usuario> findByRolNombreRol(@Param("nombreRol") String nombreRol);

    /**
     * Busca usuarios por ID de rol
     * @param rolId ID del rol
     * @return Lista de usuarios con ese rol
     */
    @Query("SELECT u FROM Usuario u WHERE u.rol.idRol = :rolId")
    List<Usuario> findByRolIdRol(@Param("rolId") Integer rolId);

    /**
     * Busca usuarios por rol y que estén activos
     * @param nombreRol Nombre del rol
     * @return Lista de usuarios activos con ese rol
     */
    @Query("SELECT u FROM Usuario u WHERE u.rol.nombreRol = :nombreRol AND u.activo = true")
    List<Usuario> findByRolAndActivoTrue(@Param("nombreRol") String nombreRol);

    /**
     * Busca específicamente clientes activos
     * @return Lista de clientes activos
     */
    @Query("SELECT u FROM Usuario u WHERE u.rol.nombreRol = 'CLIENTE' AND u.activo = true")
    List<Usuario> findClientes();

    // ==================== BÚSQUEDAS POR TÉRMINO ====================

    /**
     * Busca usuarios por término en nombre, apellido o email (ignora mayúsculas/minúsculas)
     * @param nombre Término a buscar en nombre
     * @param apellido Término a buscar en apellido
     * @param email Término a buscar en email
     * @return Lista de usuarios que coinciden
     */
    List<Usuario> findByNombreContainingIgnoreCaseOrApellidoContainingIgnoreCaseOrEmailContainingIgnoreCase(
            String nombre, String apellido, String email);

    /**
     * Busca usuarios activos por término
     * @param termino Término a buscar
     * @return Lista de usuarios activos que coinciden
     */
    @Query("SELECT u FROM Usuario u WHERE u.activo = true AND " +
            "(LOWER(u.nombre) LIKE LOWER(CONCAT('%', :termino, '%')) OR " +
            "LOWER(u.apellido) LIKE LOWER(CONCAT('%', :termino, '%')) OR " +
            "LOWER(u.email) LIKE LOWER(CONCAT('%', :termino, '%')))")
    List<Usuario> buscarActivosPorTermino(@Param("termino") String termino);

    // ==================== CONTADORES ====================

    /**
     * Cuenta usuarios por nombre de rol usando @Query
     * @param nombreRol Nombre del rol
     * @return Cantidad de usuarios con ese rol
     */
    @Query("SELECT COUNT(u) FROM Usuario u WHERE u.rol.nombreRol = :nombreRol")
    long countByRol(@Param("nombreRol") String nombreRol);

    /**
     * Cuenta usuarios por nombre de rol usando método derivado
     * @param nombreRol Nombre del rol
     * @return Cantidad de usuarios con ese rol
     */
    long countByRolNombreRol(String nombreRol);

    /**
     * Cuenta usuarios activos
     * @return Cantidad de usuarios activos
     */
    long countByActivoTrue();

    /**
     * Cuenta usuarios inactivos
     * @return Cantidad de usuarios inactivos
     */
    long countByActivoFalse();

    /**
     * Cuenta usuarios activos por rol
     * @param nombreRol Nombre del rol
     * @return Cantidad de usuarios activos con ese rol
     */
    @Query("SELECT COUNT(u) FROM Usuario u WHERE u.rol.nombreRol = :nombreRol AND u.activo = true")
    long countByRolAndActivoTrue(@Param("nombreRol") String nombreRol);

    // ==================== CONSULTAS ESPECÍFICAS PARA DASHBOARD ====================

    /**
     * Obtiene los últimos usuarios registrados
     * @param limite Número máximo de usuarios a obtener
     * @return Lista de usuarios recientes
     */
    @Query("SELECT u FROM Usuario u ORDER BY u.fechaRegistro DESC")
    List<Usuario> findUsuariosRecientes(@Param("limite") int limite);

    /**
     * Busca usuarios registrados en un rango de fechas
     * @param fechaInicio Fecha de inicio
     * @param fechaFin Fecha de fin
     * @return Lista de usuarios registrados en ese período
     */
    @Query("SELECT u FROM Usuario u WHERE u.fechaRegistro BETWEEN :fechaInicio AND :fechaFin")
    List<Usuario> findByFechaRegistroBetween(
            @Param("fechaInicio") java.time.LocalDateTime fechaInicio,
            @Param("fechaFin") java.time.LocalDateTime fechaFin);

    // ==================== CONSULTAS PARA VALIDACIONES ====================

    /**
     * Verifica si existe un usuario con el email dado, excluyendo un ID específico
     * Útil para validar emails únicos al actualizar
     * @param email Email a verificar
     * @param id ID del usuario a excluir de la búsqueda
     * @return true si existe otro usuario con ese email
     */
    @Query("SELECT CASE WHEN COUNT(u) > 0 THEN true ELSE false END FROM Usuario u WHERE u.email = :email AND u.idUsuario != :id")
    boolean existsByEmailAndIdNot(@Param("email") String email, @Param("id") Integer id);

    /**
     * Busca usuarios por rol excluyendo ciertos IDs
     * @param nombreRol Nombre del rol
     * @param excluirIds Lista de IDs a excluir
     * @return Lista de usuarios con ese rol, excluyendo los IDs especificados
     */
    @Query("SELECT u FROM Usuario u WHERE u.rol.nombreRol = :nombreRol AND u.idUsuario NOT IN :excluirIds")
    List<Usuario> findByRolExcluyendoIds(@Param("nombreRol") String nombreRol, @Param("excluirIds") List<Integer> excluirIds);

    // ==================== CONSULTAS PARA REPORTES ====================

    /**
     * Obtiene estadísticas de usuarios agrupadas por rol
     * @return Lista de objetos con estadísticas por rol
     */
    @Query("SELECT u.rol.nombreRol as rol, COUNT(u) as cantidad FROM Usuario u GROUP BY u.rol.nombreRol")
    List<Object[]> obtenerEstadisticasPorRol();

    /**
     * Obtiene usuarios más activos (con más ventas como clientes)
     * @param limite Número máximo de usuarios a obtener
     * @return Lista de usuarios ordenados por cantidad de ventas
     */
    @Query("SELECT u, COUNT(v) as totalVentas FROM Usuario u LEFT JOIN Venta v ON u.idUsuario = v.cliente.idUsuario " +
            "WHERE u.rol.nombreRol = 'CLIENTE' GROUP BY u.idUsuario ORDER BY totalVentas DESC")
    List<Object[]> findClientesMasActivos(@Param("limite") int limite);
}