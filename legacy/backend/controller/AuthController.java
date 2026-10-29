package inventariobackend.controller;



import inventariobackend.dto.LoginRequest;
import inventariobackend.dto.LoginResponse;
import inventariobackend.dto.RolDTO;
import inventariobackend.dto.UsuarioDTO;
import inventariobackend.entity.Usuario;
import inventariobackend.repository.UsuarioRepository;
import inventariobackend.service.EmailService;
import inventariobackend.service.UsuarioService;
import inventariobackend.security.JwtUtil;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UsuarioService usuarioService;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final EmailService emailService;
    private final UsuarioRepository usuarioRepository;
    private static final Map<String, String> tokensRecuperacion = new ConcurrentHashMap<>();


    public static class LoginDTO {
        public String email;
        public String password;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        try {
            System.out.println("==== LOGIN ATTEMPT ====");
            System.out.println("Email recibido: " + loginRequest.getEmail());
            System.out.println("Password recibido: " + loginRequest.getPassword());

            UsuarioDTO usuario = usuarioService.findByEmail(loginRequest.getEmail());
            System.out.println("Usuario encontrado en BD: " + usuario);

            if (usuario == null) {
                System.out.println("Usuario no encontrado.");
                Map<String, String> error = new HashMap<>();
                error.put("message", "Usuario no encontrado");
                return ResponseEntity.status(401).body(error);
            }

            System.out.println("Password en BD: " + usuario.getPassword());
            boolean match = passwordEncoder.matches(loginRequest.getPassword(), usuario.getPassword());
            System.out.println("¿Password coincide?: " + match);

            if (!match) {
                System.out.println("Password incorrecto.");
                Map<String, String> error = new HashMap<>();
                error.put("message", "Contraseña incorrecta");
                return ResponseEntity.status(401).body(error);
            }

            String token = jwtUtil.generateToken(usuario.getEmail());
            LoginResponse response = new LoginResponse(token, "Bearer", usuario);
            System.out.println("Login exitoso, se retorna token.");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.out.println("Excepción en login: " + e.getMessage());
            Map<String, String> error = new HashMap<>();
            error.put("message", "Usuario o contraseña incorrectos");
            return ResponseEntity.status(401).body(error);
        }
    }


    @PostMapping("/usuarios/registro")
    public ResponseEntity<UsuarioDTO> registrarUsuario(@Valid @RequestBody UsuarioDTO usuario) {
        try {
            RolDTO rolCliente = new RolDTO();
            rolCliente.setIdRol(2); // O el id correcto de tu base de datos para CLIENTE
            rolCliente.setNombreRol("CLIENTE");
            usuario.setRol(rolCliente);

            UsuarioDTO nuevoUsuario = usuarioService.saveUsuario(usuario);
            return ResponseEntity.ok(nuevoUsuario);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().build();
        }
    }
    @PostMapping("/recuperar")
    public ResponseEntity<?> recuperarPassword(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        UsuarioDTO usuario = null;
        try {
            usuario = usuarioService.findByEmail(email);
        } catch (Exception e) {
            // No revelar si el usuario existe o no, por seguridad
        }
        if (usuario != null) {
            String token = UUID.randomUUID().toString();
            tokensRecuperacion.put(token, email);

            // ENVIAR EMAIL
            emailService.sendPasswordResetEmail(email, token);
        }
        // SIEMPRE responde igual, así no se revela información
        return ResponseEntity.ok(Map.of("message", "Si el correo existe, se envió el enlace de recuperación."));
    }


    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody Map<String, String> body) {
        String token = body.get("token");
        String password = body.get("password");
        String email = tokensRecuperacion.get(token);

        if (email == null) {
            return ResponseEntity.status(400).body(Map.of("message", "Token inválido o expirado"));
        }
        try {
            usuarioService.actualizarPasswordDemo(email, password);
            tokensRecuperacion.remove(token);
            // Verifica que el hash haya cambiado
            Usuario u = usuarioRepository.findByEmail(email).orElseThrow();
            System.out.println("Password en BD después: " + u.getPassword());
            return ResponseEntity.ok(Map.of("message", "Contraseña actualizada correctamente"));
        } catch (Exception e) {
            return ResponseEntity.status(400).body(Map.of("message", "No se pudo actualizar la contraseña"));
        }
    }

}
