package com.abarrotes.service;

import com.abarrotes.entity.Usuario;
import com.abarrotes.repository.UsuarioRepository;
import com.abarrotes.repository.RolRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private RolRepository rolRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // Crear usuario
    public Usuario crearUsuario(Usuario usuario) {
        // Verificar que no exista el correo
        if (usuarioRepository.existsByCorreo(usuario.getCorreo())) {
            throw new RuntimeException("El correo ya está registrado");
        }

        // Verificar que no exista el DNI
        if (usuarioRepository.existsByDni(usuario.getDni())) {
            throw new RuntimeException("El DNI ya está registrado");
        }

        // Encriptar contraseña
        usuario.setContrasenia(passwordEncoder.encode(usuario.getContrasenia()));

        return usuarioRepository.save(usuario);
    }

    // Obtener todos los usuarios activos
    public List<Usuario> obtenerTodosLosUsuarios() {
        return usuarioRepository.findByEstadoTrue();
    }

    // Obtener usuario por ID
    public Optional<Usuario> obtenerUsuarioPorId(Integer id) {
        return usuarioRepository.findById(id)
                .filter(Usuario::getEstado);
    }

    // Obtener usuario por correo
    public Optional<Usuario> obtenerUsuarioPorCorreo(String correo) {
        return usuarioRepository.findByCorreo(correo)
                .filter(Usuario::getEstado);
    }

    // Obtener usuario por DNI
    public Optional<Usuario> obtenerUsuarioPorDni(String dni) {
        return usuarioRepository.findByDni(dni)
                .filter(Usuario::getEstado);
    }

    // Actualizar usuario
    public Usuario actualizarUsuario(Integer id, Usuario usuarioActualizado) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        // Verificar cambios en correo
        if (!usuario.getCorreo().equals(usuarioActualizado.getCorreo())) {
            if (usuarioRepository.existsByCorreo(usuarioActualizado.getCorreo())) {
                throw new RuntimeException("El correo ya está registrado");
            }
        }

        // Verificar cambios en DNI
        if (!usuario.getDni().equals(usuarioActualizado.getDni())) {
            if (usuarioRepository.existsByDni(usuarioActualizado.getDni())) {
                throw new RuntimeException("El DNI ya está registrado");
            }
        }

        // Actualizar campos
        usuario.setNombre(usuarioActualizado.getNombre());
        usuario.setApellido(usuarioActualizado.getApellido());
        usuario.setDni(usuarioActualizado.getDni());
        usuario.setTelefono(usuarioActualizado.getTelefono());
        usuario.setCorreo(usuarioActualizado.getCorreo());
        usuario.setRol(usuarioActualizado.getRol());

        // Solo actualizar contraseña si se proporciona una nueva
        if (usuarioActualizado.getContrasenia() != null &&
                !usuarioActualizado.getContrasenia().isEmpty()) {
            usuario.setContrasenia(passwordEncoder.encode(usuarioActualizado.getContrasenia()));
        }

        return usuarioRepository.save(usuario);
    }

    // Eliminar usuario (borrado lógico)
    public void eliminarUsuario(Integer id) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        usuario.setEstado(false);
        usuarioRepository.save(usuario);
    }

    // Buscar usuarios por nombre o apellido
    public List<Usuario> buscarUsuarios(String termino) {
        return usuarioRepository.findByNombreOrApellidoContainingIgnoreCase(termino);
    }

    // Obtener clientes
    public List<Usuario> obtenerClientes() {
        return usuarioRepository.findClientes();
    }

    // Obtener empleados
    public List<Usuario> obtenerEmpleados() {
        return usuarioRepository.findEmpleados();
    }

    // Obtener usuarios por rol
    public List<Usuario> obtenerUsuariosPorRol(Integer rolId) {
        return usuarioRepository.findByRolIdAndEstadoTrue(rolId);
    }

    // Cambiar contraseña
    public void cambiarContrasenia(Integer id, String contraseniaActual, String nuevaContrasenia) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        // Verificar contraseña actual
        if (!passwordEncoder.matches(contraseniaActual, usuario.getContrasenia())) {
            throw new RuntimeException("La contraseña actual no es correcta");
        }

        // Actualizar contraseña
        usuario.setContrasenia(passwordEncoder.encode(nuevaContrasenia));
        usuarioRepository.save(usuario);
    }

    // Activar/Desactivar usuario
    public Usuario cambiarEstadoUsuario(Integer id) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        usuario.setEstado(!usuario.getEstado());
        return usuarioRepository.save(usuario);
    }

    // Verificar si existe correo
    public boolean existeCorreo(String correo) {
        return usuarioRepository.existsByCorreo(correo);
    }

    // Verificar si existe DNI
    public boolean existeDni(String dni) {
        return usuarioRepository.existsByDni(dni);
    }
}