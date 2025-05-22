package org.inventario.inventariolirio.backend.model;

public class Usuario {
    private String usuario;
    private String contrasena;
    private String rol;        // "ADMIN"  ó  "CLIENTE"

    public Usuario(String u, String p, String r) {
        this.usuario = u; this.contrasena = p; this.rol = r;
    }
    public String getUsuario() { return usuario; }
    public String getContrasena() { return contrasena; }
    public String getRol() { return rol; }
}
