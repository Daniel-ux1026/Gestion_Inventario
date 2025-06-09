package com.abarrotes.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "venta")
public class Venta {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_venta")
    private Integer idVenta;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "usuario_id", nullable = false)
    @NotNull(message = "El usuario es obligatorio")
    private Usuario usuario;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "cliente_id", nullable = false)
    @NotNull(message = "El cliente es obligatorio")
    private Usuario cliente;

    @Column(name = "fecha", nullable = false)
    private LocalDateTime fecha;

    @DecimalMin(value = "0.01", message = "El total debe ser mayor a 0")
    @Column(name = "total", precision = 18, scale = 2)
    private BigDecimal total;

    @Column(name = "estado", nullable = false)
    private Boolean estado = true;

    @OneToMany(mappedBy = "venta", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<DetalleVenta> detalles = new ArrayList<>();

    // Constructores
    public Venta() {
        this.fecha = LocalDateTime.now();
    }

    public Venta(Usuario usuario, Usuario cliente) {
        this();
        this.usuario = usuario;
        this.cliente = cliente;
        this.estado = true;
    }

    // Getters y Setters
    public Integer getIdVenta() { return idVenta; }
    public void setIdVenta(Integer idVenta) { this.idVenta = idVenta; }

    public Usuario getUsuario() { return usuario; }
    public void setUsuario(Usuario usuario) { this.usuario = usuario; }

    public Usuario getCliente() { return cliente; }
    public void setCliente(Usuario cliente) { this.cliente = cliente; }

    public LocalDateTime getFecha() { return fecha; }
    public void setFecha(LocalDateTime fecha) { this.fecha = fecha; }

    public BigDecimal getTotal() { return total; }
    public void setTotal(BigDecimal total) { this.total = total; }

    public Boolean getEstado() { return estado; }
    public void setEstado(Boolean estado) { this.estado = estado; }

    public List<DetalleVenta> getDetalles() { return detalles; }
    public void setDetalles(List<DetalleVenta> detalles) { this.detalles = detalles; }

    // Métodos de utilidad
    public void calcularTotal() {
        this.total = detalles.stream()
                .map(DetalleVenta::getSubtotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    public int getCantidadItems() {
        return detalles.stream()
                .mapToInt(DetalleVenta::getCantidad)
                .sum();
    }

    @PrePersist
    protected void onCreate() {
        if (fecha == null) {
            fecha = LocalDateTime.now();
        }
    }
}