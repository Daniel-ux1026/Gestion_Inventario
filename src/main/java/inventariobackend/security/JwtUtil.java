package inventariobackend.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Date;
import java.util.Map;

@Component
public class JwtUtil {
    private final Key key;
    private final long expiration;
    public JwtUtil(@Value("${jwt.secret}") String secret, @Value("${jwt.expiration}") long expiration) {
        if (secret.length() < 32) throw new IllegalArgumentException("JWT_SECRET debe tener al menos 32 caracteres");
        this.key = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
        this.expiration = expiration;
    }
    public String generateToken(String email) { return generateTokenWithClaims(email, Map.of()); }
    public String generateTokenWithClaims(String email, Map<String, Object> claims) {
        return Jwts.builder().setClaims(claims).setSubject(email).setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + expiration)).signWith(key).compact();
    }
    public String extractEmail(String token) {
        try { return Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(token).getBody().getSubject(); }
        catch (JwtException | IllegalArgumentException e) { return null; }
    }
    public boolean validateToken(String token, String email) { return email != null && email.equals(extractEmail(token)); }
}
