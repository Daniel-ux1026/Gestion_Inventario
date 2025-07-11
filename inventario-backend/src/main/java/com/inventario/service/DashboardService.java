package com.inventario.service;

import com.inventario.dto.DashboardDTO;

import com.inventario.entity.Venta;
import com.inventario.repository.ProductoRepository;
import com.inventario.repository.UsuarioRepository;
import com.inventario.repository.VentaRepository;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;


@Service
@RequiredArgsConstructor
public class DashboardService {

    private final ProductoRepository productoRepository;
    private final UsuarioRepository usuarioRepository;
    private final VentaRepository ventaRepository;
    private final ModelMapper modelMapper;

    public DashboardDTO obtenerDatosDashboard() {
        DashboardDTO dashboard = new DashboardDTO();
        LocalDate hoy = LocalDate.now();

        // Totales básicos
        dashboard.setTotalProductos(productoRepository.count());

        // CORREGIR: usar el nombre exacto del rol en tu BD
        dashboard.setTotalClientes(usuarioRepository.countByRol("CLIENTE"));
        // O si usas el método derivado:
        // dashboard.setTotalClientes(usuarioRepository.countByRolNombreRol("CLIENTE"));

        // CORREGIR: usar fechaRegistro
        List<Venta> ventasHoy = ventaRepository.findByFechaRegistroBetween(
                hoy.atStartOfDay(),
                hoy.atTime(LocalTime.MAX)
        );

        dashboard.setVentasHoy(ventasHoy.size());
        dashboard.setVentasHoyMonto(
                ventasHoy.stream()
                        .map(Venta::getTotal)
                        .reduce(BigDecimal.ZERO, BigDecimal::add)
        );

        // Resto del código...
        return dashboard;
    }}