package inventariobackend.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class
ProductoDTO {
    private Integer idProducto;

    @NotBlank(message = "El código del producto es obligatorio")
    private String codigoProducto;

    @NotBlank(message = "El nombre del producto es obligatorio")
    private String nombreProducto;

    private String descripcion;

    @NotNull(message = "El precio de compra es obligatorio")
    @DecimalMin(value = "0.0", inclusive = false, message = "El precio de compra debe ser mayor a 0")
    private BigDecimal precioCompra;

    @NotNull(message = "El precio de venta es obligatorio")
    @DecimalMin(value = "0.0", inclusive = false, message = "El precio de venta debe ser mayor a 0")
    private BigDecimal precioVenta;

    private Integer stockActual;
    private Integer stockMinimo;
    private String urlImagen;
    private Boolean activo;
    private LocalDateTime fechaCreacion;

    @NotNull(message = "La categoría es obligatoria")
    private CategoriaDTO categoria;

    @NotNull(message = "La marca es obligatoria")
    private MarcaDTO marca;

    private ProveedorDTO proveedor;
}