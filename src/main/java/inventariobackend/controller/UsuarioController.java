package inventariobackend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import inventariobackend.dto.UsuarioDTO;
import inventariobackend.dto.RolDTO;
import inventariobackend.service.UsuarioService;
import jakarta.validation.Valid;



import java.util.List;
import org.springframework.security.access.prepost.PreAuthorize;

@RestController
@RequestMapping("/api")
// ELIMINA esta línea de @CrossOrigin ya que lo tienes en SecurityConfig
public class UsuarioController {

    @Autowired
    private UsuarioService usuarioService;

    // =============================================================
    // ENDPOINTS PÚBLICOS (para registro de usuarios)
    // =============================================================

    /**
     * Registro público de usuarios - NO requiere autenticación
     * Los usuarios se registran aquí y automáticamente obtienen ROL_CLIENTE
     */
    @PostMapping("/usuarios/registro")
    public ResponseEntity<UsuarioDTO> registrarUsuario(@Valid @RequestBody UsuarioDTO usuario) {
        try {
            // Forzar rol CLIENTE para registros públicos
            RolDTO rolCliente = new RolDTO();
            rolCliente.setIdRol(2); // Asegúrate que este ID es el correcto para CLIENTE en tu BD
            rolCliente.setNombreRol("CLIENTE");
            usuario.setRol(rolCliente);

            UsuarioDTO nuevoUsuario = usuarioService.saveUsuario(usuario);
            return ResponseEntity.ok(nuevoUsuario);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().build();
        }
    }

    // =============================================================
    // ENDPOINTS SOLO PARA ADMIN
    // =============================================================

    /**
     * Solo ADMIN puede listar todos los usuarios
     */
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/admin/usuarios")
    public ResponseEntity<List<UsuarioDTO>> getAllUsuarios() {
        try {
            List<UsuarioDTO> usuarios = usuarioService.getAllUsuarios();
            return ResponseEntity.ok(usuarios);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Solo ADMIN puede obtener un usuario por ID
     */
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/admin/usuarios/{id}")
    public ResponseEntity<UsuarioDTO> getUsuarioById(@PathVariable Integer id) {
        try {
            UsuarioDTO usuario = usuarioService.getUsuarioById(id);
            if (usuario != null) {
                return ResponseEntity.ok(usuario);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Solo ADMIN puede crear usuarios con cualquier rol
     */
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/admin/usuarios")
    public ResponseEntity<UsuarioDTO> createUsuario(@Valid @RequestBody UsuarioDTO usuario) {
        try {
            UsuarioDTO nuevoUsuario = usuarioService.saveUsuario(usuario);
            return ResponseEntity.ok(nuevoUsuario);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Solo ADMIN puede actualizar usuarios
     */
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/admin/usuarios/{id}")
    public ResponseEntity<UsuarioDTO> updateUsuario(@PathVariable Integer id, @Valid @RequestBody UsuarioDTO usuario) {
        try {
            usuario.setIdUsuario(id);
            UsuarioDTO usuarioActualizado = usuarioService.saveUsuario(usuario);
            return ResponseEntity.ok(usuarioActualizado);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Solo ADMIN puede eliminar usuarios
     */
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/admin/usuarios/{id}")
    public ResponseEntity<Void> deleteUsuario(@PathVariable Integer id) {
        try {
            usuarioService.deleteUsuario(id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // =============================================================
    // ENDPOINTS PARA CLIENTES AUTENTICADOS
    // =============================================================

    /**
     * Cliente puede ver su propio perfil
     */
    @PreAuthorize("hasRole('CLIENTE')")
    @GetMapping("/cliente/perfil")
    public ResponseEntity<UsuarioDTO> getPerfilCliente() {
        try {
            // Aquí necesitarías obtener el usuario actual del contexto de seguridad
            // Por ahora, es un placeholder
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Cliente puede actualizar su propio perfil
     */
    @PreAuthorize("hasRole('CLIENTE')")
    @PutMapping("/cliente/perfil")
    public ResponseEntity<UsuarioDTO> updatePerfilCliente(@Valid @RequestBody UsuarioDTO usuario) {
        try {
            // Aquí necesitarías validar que el usuario solo actualice su propio perfil
            // Por ahora, es un placeholder
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
}