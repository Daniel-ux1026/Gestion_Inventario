package com.inventario.dto;

import lombok.Data;
import java.math.BigDecimal;
import java.util.List;

@Data
public class DashboardDTO {
    private long totalProductos;
    private long totalClientes;
    private long ventasHoy;
    private BigDecimal ventasHoyMonto;
    private long productosStockBajo;
    private List<ProductoDTO> productosTopVentas;
    private List<VentaDTO> ultimasVentas;
}