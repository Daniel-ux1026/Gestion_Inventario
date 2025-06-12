package com.inventario.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ChatRequest {
    @NotBlank(message = "El mensaje es obligatorio")
    private String mensaje;

    private String sesionId;
    private Integer usuarioId;
}