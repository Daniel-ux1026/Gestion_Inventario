package com.inventario.controller;

import com.inventario.dto.LoginRequest;
import com.inventario.dto.LoginResponse;
import com.inventario.dto.RolDTO;
import com.inventario.dto.UsuarioDTO;
import com.inventario.entity.Usuario;
import com.inventario.repository.UsuarioRepository;
import com.inventario.service.UsuarioService;
import com.inventario.security.JwtUtil;
import lombok.RequiredArgsConstructor;
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
    private final UsuarioRepository usuarioRepository;
    private static final Map<String, String> tokensRecuperacion = new ConcurrentHashMap<>();
    // DTO para login (puedes crear este archivo aparte)
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


    @PostMapping("/recuperar")
    public ResponseEntity<?> recuperarPassword(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        UsuarioDTO usuario = usuarioService.findByEmail(email);
        if (usuario == null) {
            return ResponseEntity.status(404).body(Map.of("message", "No existe una cuenta con ese email"));
        }
        String token = UUID.randomUUID().toString();
        // Guarda el token asociado al email (solo para DEMO, no persiste tras reinicio)
        tokensRecuperacion.put(token, email);

        return ResponseEntity.ok(Map.of("message", "Enlace generado", "token", token));
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
