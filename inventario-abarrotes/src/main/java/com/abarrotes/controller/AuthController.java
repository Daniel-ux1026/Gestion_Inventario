package com.abarrotes.controller;

import com.abarrotes.dto.LoginRequest;
import com.abarrotes.dto.LoginResponse;
import com.abarrotes.entity.Usuario;
import com.abarrotes.security.JwtTokenProvider;
import com.abarrotes.service.UsuarioService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtTokenProvider tokenProvider;

    @Autowired
    private UsuarioService usuarioService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest loginRequest) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginRequest.getCorreo(),
                            loginRequest.getContrasenia()
                    )
            );

            String token = tokenProvider.generateToken(authentication);

            Optional<Usuario> usuarioOpt = usuarioService.obtenerUsuarioPorCorreo(loginRequest.getCorreo());
            if (usuarioOpt.isPresent()) {
                Usuario usuario = usuarioOpt.get();
                LoginResponse response = new LoginResponse(
                        token,
                        usuario.getIdUsuario(),
                        usuario.getCorreo(),
                        usuario.getNombreCompleto(),
                        usuario.getRol().getNombre()
                );
                return ResponseEntity.ok(response);
            }

            return ResponseEntity.badRequest().body("Error al obtener información del usuario");

        } catch (AuthenticationException e) {
            return ResponseEntity.badRequest().body("Credenciales inválidas");
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error interno del servidor");
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout() {
        // En JWT, el logout se maneja en el frontend eliminando el token
        return ResponseEntity.ok().body("Logout exitoso");
    }

    @GetMapping("/validate")
    public ResponseEntity<?> validateToken(@RequestHeader("Authorization") String token) {
        try {
            if (token.startsWith("Bearer ")) {
                token = token.substring(7);
            }

            if (tokenProvider.validateToken(token)) {
                String correo = tokenProvider.getUsernameFromToken(token);
                Optional<Usuario> usuarioOpt = usuarioService.obtenerUsuarioPorCorreo(correo);

                if (usuarioOpt.isPresent()) {
                    Usuario usuario = usuarioOpt.get();
                    LoginResponse response = new LoginResponse(
                            token,
                            usuario.getIdUsuario(),
                            usuario.getCorreo(),
                            usuario.getNombreCompleto(),
                            usuario.getRol().getNombre()
                    );
                    return ResponseEntity.ok(response);
                }
            }

            return ResponseEntity.badRequest().body("Token inválido");

        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Token inválido");
        }
    }
}