package inventariobackend.dto;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import java.time.LocalDateTime;

@Data
public class MarcaDTO {
    private Integer idMarca;

    @NotBlank(message = "El nombre de la marca es obligatorio")
    private String nombreMarca;

    private String descripcion;
    private Boolean activo;
    private LocalDateTime fechaCreacion;
}