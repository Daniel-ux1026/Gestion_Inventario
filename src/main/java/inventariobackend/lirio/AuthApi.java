package inventariobackend.lirio;

import inventariobackend.entity.*;
import inventariobackend.repository.*;
import inventariobackend.security.JwtUtil;
import jakarta.validation.Valid;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import java.nio.charset.StandardCharsets;
import java.security.*;
import java.time.LocalDateTime;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import static inventariobackend.lirio.LirioDtos.*;

@RestController @RequestMapping("/api/v1/auth") @RequiredArgsConstructor
public class AuthApi {
    private final UsuarioRepository users;
    private final RolRepository roles;
    private final PasswordEncoder encoder;
    private final JwtUtil jwt;
    private final PasswordResetRepository resets;
    private final JavaMailSender mail;
    @Value("${spring.mail.username:}") private String mailUser;
    @Value("${lirio.frontend-url}") private String frontend;
    private final Map<String,Attempt> attempts = new ConcurrentHashMap<>();
    private record Attempt(int count, long until) {}
    private synchronized void limit(String key) {
        long now = System.currentTimeMillis();
        attempts.entrySet().removeIf(e -> e.getValue().until() < now);
        Attempt a = attempts.getOrDefault(key, new Attempt(0, now + 60000));
        if (a.count() >= 10) throw new ResponseStatusException(HttpStatus.TOO_MANY_REQUESTS, "Demasiados intentos. Espera un minuto.");
        if (attempts.size() > 10000) throw new ResponseStatusException(HttpStatus.TOO_MANY_REQUESTS, "Inténtalo en un minuto");
        attempts.put(key, new Attempt(a.count()+1, a.until()));
    }
    public static UserView view(Usuario u) {
        return new UserView(u.getIdUsuario(), u.getNombre(), u.getApellido(), u.getEmail(), u.getTelefono(), u.getDireccion(), u.getRol().getNombreRol());
    }
    @PostMapping("/login") @Transactional(readOnly=true)
    public Session login(@Valid @RequestBody Login data, HttpServletRequest req) {
        limit("login:" + req.getRemoteAddr());
        Usuario u = users.findByEmail(data.email().trim().toLowerCase(Locale.ROOT)).orElse(null);
        // A dummy bcrypt comparison keeps missing-user and wrong-password timings similar.
        String hash = u == null ? "$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy" : u.getPassword();
        boolean matches = encoder.matches(data.password(), hash);
        if (u == null || !Boolean.TRUE.equals(u.getActivo()) || !matches)
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Correo o contraseña incorrectos");
        return new Session(jwt.generateToken(u.getEmail()), view(u));
    }
    @PostMapping("/register") @ResponseStatus(HttpStatus.CREATED) @Transactional
    public Session register(@Valid @RequestBody Register data, HttpServletRequest req) {
        limit("register:" + req.getRemoteAddr());
        String email = data.email().trim().toLowerCase(Locale.ROOT);
        if (users.existsByEmail(email)) throw new ResponseStatusException(HttpStatus.CONFLICT, "Este correo ya tiene una cuenta");
        Usuario u = new Usuario();
        u.setNombre(data.nombre().trim()); u.setApellido(data.apellido().trim()); u.setEmail(email);
        u.setPassword(encoder.encode(data.password())); u.setTelefono(data.telefono()); u.setActivo(true);
        u.setRol(roles.findByNombreRol("CLIENTE").orElseThrow());
        users.save(u);
        return new Session(jwt.generateToken(email), view(u));
    }
    @GetMapping("/me") @Transactional(readOnly=true)
    public UserView me(Authentication a) { return view(users.findByEmail(a.getName()).orElseThrow()); }
    @PutMapping("/me") @Transactional
    public UserView update(Authentication a, @Valid @RequestBody ProfileInput data) {
        Usuario u = users.findByEmail(a.getName()).orElseThrow();
        u.setNombre(data.nombre().trim()); u.setApellido(data.apellido().trim());
        u.setTelefono(data.telefono()); u.setDireccion(data.direccion());
        return view(users.save(u));
    }
    static String digest(String token) {
        try { return HexFormat.of().formatHex(MessageDigest.getInstance("SHA-256").digest(token.getBytes(StandardCharsets.UTF_8))); }
        catch (NoSuchAlgorithmException e) { throw new IllegalStateException(e); }
    }
    @PostMapping("/recover") @Transactional
    public Map<String,String> recover(@Valid @RequestBody Recovery data, HttpServletRequest req) {
        limit("recover:" + req.getRemoteAddr());
        if (mailUser.isBlank()) throw new ResponseStatusException(HttpStatus.SERVICE_UNAVAILABLE, "La recuperación por correo aún no está configurada. Contacta al 948656772.");
        users.findByEmail(data.email().trim().toLowerCase(Locale.ROOT)).ifPresent(u -> {
            String token = UUID.randomUUID().toString() + UUID.randomUUID();
            PasswordReset reset = new PasswordReset();
            reset.setHash(digest(token)); reset.setEmail(u.getEmail()); reset.setExpires(LocalDateTime.now().plusMinutes(20)); resets.save(reset);
            SimpleMailMessage msg = new SimpleMailMessage(); msg.setFrom(mailUser); msg.setTo(u.getEmail());
            msg.setSubject("El Lirio · Restablece tu contraseña");
            msg.setText("Abre este enlace (válido durante 20 minutos): " + frontend + "/reset-password?token=" + token);
            try { mail.send(msg); }
            catch (org.springframework.mail.MailException e) { throw new ResponseStatusException(HttpStatus.SERVICE_UNAVAILABLE, "No se pudo enviar el correo. Inténtalo más tarde."); }
        });
        return Map.of("message","Si el correo está registrado, recibirás un enlace de recuperación.");
    }
    @PostMapping("/reset") @Transactional
    public Map<String,String> reset(@Valid @RequestBody Reset data, HttpServletRequest req) {
        limit("reset:" + req.getRemoteAddr());
        PasswordReset r = resets.findById(digest(data.token())).filter(p -> p.getExpires().isAfter(LocalDateTime.now()))
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST,"Enlace inválido o vencido"));
        Usuario u = users.findByEmail(r.getEmail()).orElseThrow();
        u.setPassword(encoder.encode(data.password())); users.save(u); resets.delete(r);
        return Map.of("message","Contraseña actualizada. Ya puedes iniciar sesión.");
    }
}
