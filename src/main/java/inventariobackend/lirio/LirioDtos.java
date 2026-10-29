package inventariobackend.lirio;

import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public final class LirioDtos {
    private LirioDtos() {}
    public record Login(@NotBlank @Email @Size(max=150) String email, @NotBlank @Size(max=72) String password) {}
    public record Register(@NotBlank @Size(max=100) String nombre, @NotBlank @Size(max=100) String apellido,
                           @NotBlank @Email @Size(max=150) String email,
                           @NotBlank @Size(min=8,max=72) String password,
                           @Pattern(regexp="^$|[0-9+ ()-]{7,20}") String telefono) {}
    public record UserView(Integer id, String nombre, String apellido, String email, String telefono, String direccion, String rol) {}
    public record Session(String token, UserView user) {}
    public record Ref(Integer id, String nombre) {}
    public record ProductView(Integer id, String codigo, String nombre, String descripcion, BigDecimal precio,
                              BigDecimal precioOriginal, BigDecimal costo, Integer descuento, Integer stock,
                              Integer stockMinimo, String imagen, Ref categoria, Ref marca, Ref proveedor, boolean activo) {}
    public record ProductInput(@NotBlank @Size(max=50) String codigo, @NotBlank @Size(max=200) String nombre,
                               @Size(max=2000) String descripcion,
                               @NotNull @DecimalMin("0.01") @Digits(integer=8,fraction=2) BigDecimal costo,
                               @NotNull @DecimalMin("0.01") @Digits(integer=8,fraction=2) BigDecimal precio,
                               @NotNull @Min(0) @Max(90) Integer descuento,
                               @NotNull @Min(0) @Max(1000000) Integer stock,
                               @NotNull @Min(0) @Max(1000000) Integer stockMinimo,
                               @Size(max=500) String imagen, @NotNull Integer categoriaId,
                               @NotNull Integer marcaId, Integer proveedorId) {}
    public record Item(@NotNull @Positive Integer productoId, @NotNull @Min(1) @Max(10000) Integer cantidad) {}
    public record OrderInput(@NotBlank @Size(max=200) String nombre,
                             @NotBlank @Pattern(regexp="[0-9+ ()-]{7,20}") String telefono,
                             @Size(max=300) String direccion,
                             @NotBlank @Pattern(regexp="EFECTIVO|YAPE|PLIN|TRANSFERENCIA") String metodoPago,
                             @NotEmpty @Size(max=100) List<@Valid Item> items,
                             @NotBlank @Pattern(regexp="[a-zA-Z0-9-]{16,64}") String clave,
                             @NotNull @DecimalMin("0.01") @Digits(integer=8,fraction=2) BigDecimal totalEsperado) {}
    public record OrderLine(Integer productoId, String nombre, String imagen, String categoria,
                            int cantidad, BigDecimal precio, BigDecimal costo, BigDecimal subtotal) {}
    public record OrderView(Integer id, String numero, String nombre, String email, String telefono,
                             String direccion, BigDecimal total, String metodoPago, String estado,
                             boolean tieneComprobante, LocalDateTime fecha, List<OrderLine> items) {}
    public record SupplierInput(@NotBlank @Size(max=150) String nombre,
                                @NotBlank @Pattern(regexp="[0-9]{11}") String ruc,
                                @NotBlank @Pattern(regexp="[0-9+ ()-]{7,20}") String telefono,
                                @Email @Size(max=150) String email, @Size(max=300) String direccion) {}
    public record SupplierView(Integer id, String nombre, String ruc, String telefono, String email, String direccion, boolean activo) {}
    public record PurchaseLineInput(@NotNull Integer productoId, @NotNull @Min(1) @Max(10000) Integer cantidad,
                                     @NotNull @DecimalMin("0.01") @Digits(integer=8,fraction=2) BigDecimal costo) {}
    public record PurchaseInput(@NotNull Integer proveedorId, @NotEmpty @Size(max=100) List<@Valid PurchaseLineInput> items,
                                 @Size(max=500) String observaciones) {}
    public record Adjustment(@NotNull @Min(-1000000) @Max(1000000) Integer cantidad, @NotBlank @Size(min=5,max=150) String motivo) {}
    public record BusinessInput(@NotBlank @Size(max=150) String nombre,
                                 @NotBlank @Pattern(regexp="[0-9+ ()-]{7,20}") String telefono,
                                 @Size(max=300) String direccion, @Size(max=200) String horario) {}
    public record ProfileInput(@NotBlank @Size(max=100) String nombre, @NotBlank @Size(max=100) String apellido,
                                @Pattern(regexp="^$|[0-9+ ()-]{7,20}") String telefono, @Size(max=300) String direccion) {}
    public record Recovery(@NotBlank @Email @Size(max=150) String email) {}
    public record Reset(@NotBlank @Size(max=100) String token, @NotBlank @Size(min=8,max=72) String password) {}
    public record NameInput(@NotBlank @Size(max=100) String nombre) {}
}
