package inventariobackend.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import java.time.LocalDateTime;

@Data
public class CategoriaDTO {
    private Integer idCategoria;

    @NotBlank(message = "El nombre de la categoría es obligatorio")
    private String nombreCategoria;

    private String descripcion;
    private Boolean activo;
    private LocalDateTime fechaCreacion;
}
