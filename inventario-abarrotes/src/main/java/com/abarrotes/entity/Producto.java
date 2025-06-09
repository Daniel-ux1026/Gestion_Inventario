package com.abarrotes.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "producto")
public class Producto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_producto")
    private Integer idProducto;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "categoria_id", nullable = false)
    @NotNull(message = "La categoría es obligatoria")
    private Categoria categoria;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "marca_id", nullable = false)
    @NotNull(message = "La marca es obligatoria")
    private Marca marca;

    @NotBlank(message = "El código es obligatorio")
    @Size(max = 50, message = "El código no puede exceder 50 caracteres")
    @Column(name = "codigo", unique = true, nullable = false, length = 50)
    private String codigo;

    @NotBlank(message = "El nombre es obligatorio")
    @Size(max = 70, message = "El nombre no puede exceder 70 caracteres")
    @Column(name = "nombre", nullable = false, length = 70)
    private String nombre;

    @NotBlank(message = "La presentación es obligatoria")
    @Size(max = 90, message = "La presentación no puede exceder 90 caracteres")
    @Column(name = "presentacion", nullable = false, length = 90)
    private String presentacion;

    @NotNull(message = "El precio de compra es obligatorio")
    @DecimalMin(value = "0.01", message = "El precio de compra debe ser mayor a 0")
    @Column(name = "precio_compra", nullable = false, precision = 18, scale = 2)
    private BigDecimal precioCompra;

    @NotNull(message = "El precio de venta es obligatorio")
    @DecimalMin(value = "0.01", message = "El precio de venta debe ser mayor a 0")
    @Column(name = "precio_venta", nullable = false, precision = 18, scale = 2)
    private BigDecimal precioVenta;

    @NotNull(message = "El stock es obligatorio")
    @Min(value = 0, message = "El stock no puede ser negativo")
    @Column(name = "stock", nullable = false)
    private Integer stock;

    @Column(name = "fecha_inicio")
    private LocalDateTime fechaInicio;

    @Column(name = "fecha_fin")
    private LocalDateTime fechaFin;

    @Column(name = "estado", nullable = false)
    private Boolean estado = true;

    // Constructores
    public Producto() {}

    public Producto(Categoria categoria, Marca marca, String codigo, String nombre,
                    String presentacion, BigDecimal precioCompra, BigDecimal precioVenta,
                    Integer stock) {
        this.categoria = categoria;
        this.marca = marca;
        this.codigo = codigo;
        this.nombre = nombre;
        this.presentacion = presentacion;
        this.precioCompra = precioCompra;
        this.precioVenta = precioVenta;
        this.stock = stock;
        this.estado = true;
    }

    // Getters y Setters
    public Integer getIdProducto() { return idProducto; }
    public void setIdProducto(Integer idProducto) { this.idProducto = idProducto; }

    public Categoria getCategoria() { return categoria; }
    public void setCategoria(Categoria categoria) { this.categoria = categoria; }

    public Marca getMarca() { return marca; }
    public void setMarca(Marca marca) { this.marca = marca; }

    public String getCodigo() { return codigo; }
    public void setCodigo(String codigo) { this.codigo = codigo; }

    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }

    public String getPresentacion() { return presentacion; }
    public void setPresentacion(String presentacion) { this.presentacion = presentacion; }

    public BigDecimal getPrecioCompra() { return precioCompra; }
    public void setPrecioCompra(BigDecimal precioCompra) { this.precioCompra = precioCompra; }

    public BigDecimal getPrecioVenta() { return precioVenta; }
    public void setPrecioVenta(BigDecimal precioVenta) { this.precioVenta = precioVenta; }

    public Integer getStock() { return stock; }
    public void setStock(Integer stock) { this.stock = stock; }

    public LocalDateTime getFechaInicio() { return fechaInicio; }
    public void setFechaInicio(LocalDateTime fechaInicio) { this.fechaInicio = fechaInicio; }

    public LocalDateTime getFechaFin() { return fechaFin; }
    public void setFechaFin(LocalDateTime fechaFin) { this.fechaFin = fechaFin; }

    public Boolean getEstado() { return estado; }
    public void setEstado(Boolean estado) { this.estado = estado; }

    // Métodos de utilidad
    public boolean isDisponible() {
        return estado && stock > 0;
    }

    public BigDecimal getMargenGanancia() {
        if (precioCompra != null && precioVenta != null && precioCompra.compareTo(BigDecimal.ZERO) > 0) {
            return precioVenta.subtract(precioCompra);
        }
        return BigDecimal.ZERO;
    }

    public BigDecimal getPorcentajeGanancia() {
        if (precioCompra != null && precioVenta != null && precioCompra.compareTo(BigDecimal.ZERO) > 0) {
            return getMargenGanancia().divide(precioCompra, 4, BigDecimal.ROUND_HALF_UP)
                    .multiply(new BigDecimal("100"));
        }
        return BigDecimal.ZERO;
    }
}