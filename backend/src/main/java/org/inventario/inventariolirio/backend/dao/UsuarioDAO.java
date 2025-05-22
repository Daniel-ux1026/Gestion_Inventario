package org.inventario.inventariolirio.backend.dao;

import org.inventario.inventariolirio.backend.model.Usuario;
import org.inventario.inventariolirio.backend.util.DatabaseConnection;
import org.mindrot.jbcrypt.BCrypt;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;

public class UsuarioDAO {
    // simulamos base de datos
    private static final List<Usuario> lista = List.of(
            new Usuario("admin",   "1234", "ADMIN"),
            new Usuario("cliente", "abcd", "CLIENTE")
    );

    public Usuario autenticar(String user, String pass) {
        return lista.stream()
                .filter(u -> u.getUsuario().equals(user) && u.getContrasena().equals(pass))
                .findFirst().orElse(null);
    }
}
