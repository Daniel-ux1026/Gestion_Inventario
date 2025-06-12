package com.inventario.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class RolDTO {
    private Integer idRol;
    private String nombreRol;
    private String descripcion;
    private LocalDateTime fechaCreacion;
}