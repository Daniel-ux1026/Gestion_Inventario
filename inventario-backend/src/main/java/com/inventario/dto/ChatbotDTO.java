package com.inventario.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import java.time.LocalDateTime;

@Data
public class ChatbotDTO {
    private Integer idChatbot;

    @NotBlank(message = "La pregunta es obligatoria")
    private String pregunta;

    @NotBlank(message = "La respuesta es obligatoria")
    private String respuesta;

    private String palabrasClave;
    private String categoriaConsulta;
    private Boolean activo;
    private LocalDateTime fechaCreacion;
}