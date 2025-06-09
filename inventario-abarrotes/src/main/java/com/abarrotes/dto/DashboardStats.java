// DTO para estadísticas del dashboard
package com.abarrotes.dto;

import java.math.BigDecimal;

public class DashboardStats {
    private Long totalUsuarios;
    private Long totalProductos;
    private Long ventasDelDia;
    private BigDecimal totalVentasDelDia;
    private Long ventasDelMes;
    private BigDecimal totalVentasDelMes;
    private Long productosConStockBajo;
    private Long productosSinStock;

    public DashboardStats() {}

    // Getters y Setters
    public Long getTotalUsuarios() { return totalUsuarios; }
    public void setTotalUsuarios(Long totalUsuarios) { this.totalUsuarios = totalUsuarios; }

    public Long getTotalProductos() { return totalProductos; }
    public void setTotalProductos(Long totalProductos) { this.totalProductos = totalProductos; }

    public Long getVentasDelDia() { return ventasDelDia; }
    public void setVentasDelDia(Long ventasDelDia) { this.ventasDelDia = ventasDelDia; }

    public BigDecimal getTotalVentasDelDia() { return totalVentasDelDia; }
    public void setTotalVentasDelDia(BigDecimal totalVentasDelDia) { this.totalVentasDelDia = totalVentasDelDia; }

    public Long getVentasDelMes() { return ventasDelMes; }
    public void setVentasDelMes(Long ventasDelMes) { this.ventasDelMes = ventasDelMes; }

    public BigDecimal getTotalVentasDelMes() { return totalVentasDelMes; }
    public void setTotalVentasDelMes(BigDecimal totalVentasDelMes) { this.totalVentasDelMes = totalVentasDelMes; }

    public Long getProductosConStockBajo() { return productosConStockBajo; }
    public void setProductosConStockBajo(Long productosConStockBajo) { this.productosConStockBajo = productosConStockBajo; }

    public Long getProductosSinStock() { return productosSinStock; }
    public void setProductosSinStock(Long productosSinStock) { this.productosSinStock = productosSinStock; }
}