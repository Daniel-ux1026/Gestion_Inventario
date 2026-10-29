package inventariobackend.service;

import inventariobackend.dto.UsuarioDTO;
import inventariobackend.entity.Rol;
import inventariobackend.entity.Usuario;
import inventariobackend.repository.RolRepository;
import inventariobackend.repository.UsuarioRepository;
import inventariobackend.dto.CambiarPasswordDTO;


import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Random;
import java.util.stream.Collectors;

/**
 * Servicio para gestionar usuarios
 * Contiene toda la lógica de negocio relacionada con usuarios
 **/
@Service
@RequiredArgsConstructor    // Lombok crea constructor con campos final
@Transactional(readOnly = true)  // Por defecto las operaciones son de solo lectura
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final RolRepository rolRepository;
    private final PasswordEncoder passwordEncoder;
    private final ModelMapper modelMapper;

    /**
     * Obtener todos los usuarios
     */
    public List<UsuarioDTO> getAllUsuarios() {
        List<Usuario> usuarios = usuarioRepository.findAll();
        return usuarios.stream()
                .map(usuario -> modelMapper.map(usuario, UsuarioDTO.class))
                .collect(Collectors.toList());
    }

    /**
     * Obtener usuario por ID
     */
    public UsuarioDTO getUsuarioById(Integer id) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado con ID: " + id));
        return modelMapper.map(usuario, UsuarioDTO.class);
    }

    @Transactional
    public void actualizarPasswordDemo(String email, String newPassword) {
        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        usuario.setPassword(passwordEncoder.encode(newPassword));
        usuarioRepository.save(usuario);
        System.out.println("Contraseña cambiada en BD para " + email);
    }



    /**
     * Crear nuevo usuario
     */
    @Transactional
    public UsuarioDTO saveUsuario(UsuarioDTO usuarioDTO) {
        // Si es un usuario nuevo (sin ID)
        if (usuarioDTO.getIdUsuario() == null) {
            return crearUsuario(usuarioDTO);
        } else {
            return actualizarUsuario(usuarioDTO);
        }
    }

    /**
     * Crear usuario nuevo
     */
    @Transactional
    public UsuarioDTO crearUsuario(UsuarioDTO usuarioDTO) {
        // Verificar si email existe
        if(usuarioRepository.existsByEmail(usuarioDTO.getEmail())) {
            throw new RuntimeException("El correo ya está registrado");
        }

        // Mapear DTO a entidad
        Usuario usuario = modelMapper.map(usuarioDTO, Usuario.class);

        // Hashear contraseña
        usuario.setPassword(passwordEncoder.encode(usuarioDTO.getPassword()));

        // Establecer fecha de registro
        usuario.setFechaRegistro(LocalDateTime.now());

        // Establecer como activo por defecto
        if (usuario.getActivo() == null) {
            usuario.setActivo(true);
        }

        // Asignar rol (si no viene en el DTO, usar CLIENTE por defecto)
        if (usuarioDTO.getRol() == null || usuarioDTO.getRol().getIdRol() == null) {
            Rol rolCliente = rolRepository.findByNombreRol("CLIENTE")
                    .orElseThrow(() -> new RuntimeException("Rol CLIENTE no encontrado"));
            usuario.setRol(rolCliente);
        } else {
            Rol rol = rolRepository.findById(usuarioDTO.getRol().getIdRol())
                    .orElseThrow(() -> new RuntimeException("Rol no encontrado"));
            usuario.setRol(rol);
        }

        // Guardar usuario
        Usuario usuarioGuardado = usuarioRepository.save(usuario);
        return modelMapper.map(usuarioGuardado, UsuarioDTO.class);
    }

    /**
     * Actualizar usuario existente
     */
    @Transactional
    public UsuarioDTO actualizarUsuario(UsuarioDTO usuarioDTO) {
        Usuario usuarioExistente = usuarioRepository.findById(usuarioDTO.getIdUsuario())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        // Verificar si el email cambió y si ya existe
        if (!usuarioExistente.getEmail().equals(usuarioDTO.getEmail()) &&
                usuarioRepository.existsByEmail(usuarioDTO.getEmail())) {
            throw new RuntimeException("El correo ya está registrado");
        }

        // Actualizar campos (excepto password si viene vacío)
        usuarioExistente.setNombre(usuarioDTO.getNombre());
        usuarioExistente.setApellido(usuarioDTO.getApellido());
        usuarioExistente.setEmail(usuarioDTO.getEmail());
        usuarioExistente.setTelefono(usuarioDTO.getTelefono());
        usuarioExistente.setDireccion(usuarioDTO.getDireccion());

        if (usuarioDTO.getActivo() != null) {
            usuarioExistente.setActivo(usuarioDTO.getActivo());
        }

        // Solo actualizar contraseña si viene nueva
        if (usuarioDTO.getPassword() != null && !usuarioDTO.getPassword().trim().isEmpty()) {
            usuarioExistente.setPassword(passwordEncoder.encode(usuarioDTO.getPassword()));
        }

        // Actualizar rol si viene
        if (usuarioDTO.getRol() != null && usuarioDTO.getRol().getIdRol() != null) {
            Rol rol = rolRepository.findById(usuarioDTO.getRol().getIdRol())
                    .orElseThrow(() -> new RuntimeException("Rol no encontrado"));
            usuarioExistente.setRol(rol);
        }

        Usuario usuarioActualizado = usuarioRepository.save(usuarioExistente);
        return modelMapper.map(usuarioActualizado, UsuarioDTO.class);
    }

    /**
     * Eliminar usuario por ID
     */
    @Transactional
    public void deleteUsuario(Integer id) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado con ID: " + id));
        usuarioRepository.delete(usuario);
    }

    /**
     * Buscar usuario por email
     */
    public UsuarioDTO findByEmail(String email) {
        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado con email: " + email));
        return modelMapper.map(usuario, UsuarioDTO.class);
    }

    /**
     * Verificar si existe usuario por email
     */
    public boolean existsByEmail(String email) {
        return usuarioRepository.existsByEmail(email);
    }

    /**
     * Obtener usuarios paginados
     */
    public Page<UsuarioDTO> getUsuariosPaginados(Pageable pageable) {
        Page<Usuario> usuariosPage = usuarioRepository.findAll(pageable);
        return usuariosPage.map(usuario -> modelMapper.map(usuario, UsuarioDTO.class));
    }

    /**
     * Cambiar estado activo/inactivo
     */
    @Transactional
    public void cambiarEstado(Integer id, boolean activo) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        usuario.setActivo(activo);
        usuarioRepository.save(usuario);
    }
}