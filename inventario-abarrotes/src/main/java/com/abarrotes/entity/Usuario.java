package com.abarrotes.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "usuario")
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_usuario")
    private Integer idUsuario;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "rol_id", nullable = false)
    private Rol rol;

    @NotBlank(message = "El nombre es obligatorio")
    @Size(max = 30, message = "El nombre no puede exceder 30 caracteres")
    @Column(name = "nombre", nullable = false, length = 30)
    private String nombre;

    @NotBlank(message = "El apellido es obligatorio")
    @Size(max = 50, message = "El apellido no puede exceder 50 caracteres")
    @Column(name = "apellido", nullable = false, length = 50)
    private String apellido;

    @NotBlank(message = "El DNI es obligatorio")
    @Pattern(regexp = "^[0-9]{8}$", message = "El DNI debe tener exactamente 8 dígitos")
    @Column(name = "dni", unique = true, nullable = false, length = 8)
    private String dni;

    @NotBlank(message = "El teléfono es obligatorio")
    @Pattern(regexp = "^[0-9]{9}$", message = "El teléfono debe tener exactamente 9 dígitos")
    @Column(name = "telefono", nullable = false, length = 9)
    private String telefono;

    @NotBlank(message = "El correo es obligatorio")
    @Email(message = "El formato del correo no es válido")
    @Column(name = "correo", unique = true, nullable = false, length = 100)
    private String correo;

    @NotBlank(message = "La contraseña es obligatoria")
    @JsonIgnore
    @Column(name = "contrasenia", nullable = false, length = 255)
    private String contrasenia;

    @Column(name = "estado", nullable = false)
    private Boolean estado = true;

    // Constructores
    public Usuario() {}

    public Usuario(String nombre, String apellido, String dni, String telefono,
                   String correo, String contrasenia, Rol rol) {
        this.nombre = nombre;
        this.apellido = apellido;
        this.dni = dni;
        this.telefono = telefono;
        this.correo = correo;
        this.contrasenia = contrasenia;
        this.rol = rol;
        this.estado = true;
    }

    // Getters y Setters
    public Integer getIdUsuario() { return idUsuario; }
    public void setIdUsuario(Integer idUsuario) { this.idUsuario = idUsuario; }

    public Rol getRol() { return rol; }
    public void setRol(Rol rol) { this.rol = rol; }

    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }

    public String getApellido() { return apellido; }
    public void setApellido(String apellido) { this.apellido = apellido; }

    public String getDni() { return dni; }
    public void setDni(String dni) { this.dni = dni; }

    public String getTelefono() { return telefono; }
    public void setTelefono(String telefono) { this.telefono = telefono; }

    public String getCorreo() { return correo; }
    public void setCorreo(String correo) { this.correo = correo; }

    public String getContrasenia() { return contrasenia; }
    public void setContrasenia(String contrasenia) { this.contrasenia = contrasenia; }

    public Boolean getEstado() { return estado; }
    public void setEstado(Boolean estado) { this.estado = estado; }

    public String getNombreCompleto() {
        return nombre + " " + apellido;
    }
}