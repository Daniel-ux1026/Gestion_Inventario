package com.inventario.service;

import com.inventario.dto.DashboardDTO;
import com.inventario.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final ProductoRepository productoRepository;
    private final UsuarioRepository usuarioRepository;
    private final VentaRepository ventaRepository;

    public DashboardDTO obtenerDatosDashboard() {
        DashboardDTO dashboard = new DashboardDTO();

        // Contadores básicos
        dashboard.setTotalProductos(productoRepository.count());
        dashboard.setTotalClientes(usuarioRepository.findClientes().size());
        dashboard.setVentasHoy(ventaRepository.countVentasPorFecha(LocalDate.now()));
        dashboard.setProductosStockBajo(productoRepository.findProductosConStockBajo().size());

        // Monto de ventas de hoy
        BigDecimal ventasHoyMonto = ventaRepository.findByFechaBetween(LocalDate.now(), LocalDate.now())
                .stream()
                .map(venta -> venta.getTotal())
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        dashboard.setVentasHoyMonto(ventasHoyMonto);

        // Listas vacías por ahora (se pueden implementar después)
        dashboard.setProductosTopVentas(new ArrayList<>());
        dashboard.setUltimasVentas(new ArrayList<>());

        return dashboard;
    }
}