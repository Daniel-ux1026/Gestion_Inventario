package com.inventario.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import java.time.LocalDateTime;

@Data
public class ProveedorDTO {
    private Integer idProveedor;

    @NotBlank(message = "El nombre del proveedor es obligatorio")
    private String nombreProveedor;

    private String ruc;
    private String telefono;
    private String email;
    private String direccion;
    private Boolean activo;
    private LocalDateTime fechaRegistro;
}