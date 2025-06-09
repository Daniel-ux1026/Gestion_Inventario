// DTO para respuesta de login
package com.abarrotes.dto;

public class LoginResponse {
    private String token;
    private String tipo = "Bearer";
    private Integer id;
    private String correo;
    private String nombreCompleto;
    private String rol;

    public LoginResponse() {}

    public LoginResponse(String token, Integer id, String correo, String nombreCompleto, String rol) {
        this.token = token;
        this.id = id;
        this.correo = correo;
        this.nombreCompleto = nombreCompleto;
        this.rol = rol;
    }

    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }

    public String getTipo() { return tipo; }
    public void setTipo(String tipo) { this.tipo = tipo; }

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public String getCorreo() { return correo; }
    public void setCorreo(String correo) { this.correo = correo; }

    public String getNombreCompleto() { return nombreCompleto; }
    public void setNombreCompleto(String nombreCompleto) { this.nombreCompleto = nombreCompleto; }

    public String getRol() { return rol; }
    public void setRol(String rol) { this.rol = rol; }
}