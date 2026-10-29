package inventariobackend.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class VentaDTO {
    private Integer idVenta;
    private String numeroVenta;

    @NotNull(message = "La fecha de venta es obligatoria")
    private LocalDate fechaVenta;

    private BigDecimal subtotal;
    private BigDecimal igv;
    private BigDecimal total;

    @NotNull(message = "El método de pago es obligatorio")
    private String metodoPago;

    private String estado;
    private String observaciones;
    private LocalDateTime fechaRegistro;

    @NotNull(message = "El cliente es obligatorio")
    private UsuarioDTO cliente;

    private UsuarioDTO usuario;

    @NotNull(message = "Los detalles de venta son obligatorios")
    private List<DetalleVentaDTO> detalles;
}