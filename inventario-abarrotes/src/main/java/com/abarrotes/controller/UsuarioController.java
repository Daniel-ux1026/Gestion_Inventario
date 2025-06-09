package com.abarrotes.controller;

import com.abarrotes.entity.Usuario;
import com.abarrotes.service.UsuarioService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/usuarios")
@CrossOrigin(origins = "*")
public class UsuarioController {

    @Autowired
    private UsuarioService usuarioService;

    @GetMapping
    public ResponseEntity<List<Usuario>> obtenerTodosLosUsuarios() {
        try {
            List<Usuario> usuarios = usuarioService.obtenerTodosLosUsuarios();
            return ResponseEntity.ok(usuarios);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Usuario> obtenerUsuarioPorId(@PathVariable Integer id) {
        try {
            Optional<Usuario> usuario = usuarioService.obtenerUsuarioPorId(id);
            if (usuario.isPresent()) {
                return ResponseEntity.ok(usuario.get());
            }
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @PostMapping
    public ResponseEntity<?> crearUsuario(@Valid @RequestBody Usuario usuario) {
        try {
            Usuario nuevoUsuario = usuarioService.crearUsuario(usuario);
            return ResponseEntity.status(HttpStatus.CREATED).body(nuevoUsuario);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error al crear el usuario");
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> actualizarUsuario(@PathVariable Integer id, @Valid @RequestBody Usuario usuario) {
        try {
            Usuario usuarioActualizado = usuarioService.actualizarUsuario(id, usuario);
            return ResponseEntity.ok(usuarioActualizado);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error al actualizar el usuario");
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminarUsuario(@PathVariable Integer id) {
        try {
            usuarioService.eliminarUsuario(id);
            return ResponseEntity.ok().body("Usuario eliminado correctamente");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error al eliminar el usuario");
        }
    }

    @GetMapping("/buscar")
    public ResponseEntity<List<Usuario>> buscarUsuarios(@RequestParam String termino) {
        try {
            List<Usuario> usuarios = usuarioService.buscarUsuarios(termino);
            return ResponseEntity.ok(usuarios);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/clientes")
    public ResponseEntity<List<Usuario>> obtenerClientes() {
        try {
            List<Usuario> clientes = usuarioService.obtenerClientes();
            return ResponseEntity.ok(clientes);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/empleados")
    public ResponseEntity<List<Usuario>> obtenerEmpleados() {
        try {
            List<Usuario> empleados = usuarioService.obtenerEmpleados();
            return ResponseEntity.ok(empleados);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/rol/{rolId}")
    public ResponseEntity<List<Usuario>> obtenerUsuariosPorRol(@PathVariable Integer rolId) {
        try {
            List<Usuario> usuarios = usuarioService.obtenerUsuariosPorRol(rolId);
            return ResponseEntity.ok(usuarios);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @PutMapping("/{id}/cambiar-estado")
    public ResponseEntity<?> cambiarEstadoUsuario(@PathVariable Integer id) {
        try {
            Usuario usuario = usuarioService.cambiarEstadoUsuario(id);
            return ResponseEntity.ok(usuario);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error al cambiar el estado del usuario");
        }
    }

    @PostMapping("/{id}/cambiar-contrasenia")
    public ResponseEntity<?> cambiarContrasenia(@PathVariable Integer id,
                                                @RequestBody ChangePasswordRequest request) {
        try {
            usuarioService.cambiarContrasenia(id, request.getContraseniaActual(), request.getNuevaContrasenia());
            return ResponseEntity.ok().body("Contraseña cambiada correctamente");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error al cambiar la contraseña");
        }
    }

    @GetMapping("/verificar-correo")
    public ResponseEntity<Boolean> verificarCorreo(@RequestParam String correo) {
        try {
            boolean existe = usuarioService.existeCorreo(correo);
            return ResponseEntity.ok(existe);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/verificar-dni")
    public ResponseEntity<Boolean> verificarDni(@RequestParam String dni) {
        try {
            boolean existe = usuarioService.existeDni(dni);
            return ResponseEntity.ok(existe);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
}

// Clase interna para cambio de contraseña
class ChangePasswordRequest {
    private String contraseniaActual;
    private String nuevaContrasenia;

    public String getContraseniaActual() { return contraseniaActual; }
    public void setContraseniaActual(String contraseniaActual) { this.contraseniaActual = contraseniaActual; }

    public String getNuevaContrasenia() { return nuevaContrasenia; }
    public void setNuevaContrasenia(String nuevaContrasenia) { this.nuevaContrasenia = nuevaContrasenia; }
}