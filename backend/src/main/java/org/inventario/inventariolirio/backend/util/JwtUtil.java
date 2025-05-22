package org.inventario.inventariolirio.backend.util;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

import java.security.Key;
import java.util.Date;

// Creamos una utilidad para generar tokens JWT

public class JwtUtil {
    private static final Key key = Keys.secretKeyFor(SignatureAlgorithm.HS256);
    private static final long EXP_MS = 1000 * 60 * 60; // 1 h

    public static String generateToken(String user, String rol) {
        return Jwts.builder()
                .setSubject(user)
                .claim("rol", rol)
                .setExpiration(new Date(System.currentTimeMillis() + EXP_MS))
                .signWith(key)
                .compact();
    }
}
