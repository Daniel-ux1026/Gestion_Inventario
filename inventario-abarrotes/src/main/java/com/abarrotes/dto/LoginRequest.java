package com.abarrotes.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

// DTO para solicitud de login
public class LoginRequest {
    @NotBlank(message = "El correo es obligatorio")
    @Email(message = "El formato del correo no es válido")
    private String correo;

    @NotBlank(message = "La contraseña es obligatoria")
    private String contrasenia;

    public LoginRequest() {}

    public LoginRequest(String correo, String contrasenia) {
        this.correo = correo;
        this.contrasenia = contrasenia;
    }

    public String getCorreo() { return correo; }
    public void setCorreo(String correo) { this.correo = correo; }

    public String getContrasenia() { return contrasenia; }
    public void setContrasenia(String contrasenia) { this.contrasenia = contrasenia; }
}