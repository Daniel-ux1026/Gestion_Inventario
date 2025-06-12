package com.inventario.service;

import com.inventario.dto.VentaDTO;
import com.inventario.entity.DetalleVenta;
import com.inventario.entity.Venta;
import com.inventario.repository.VentaRepository;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class VentaService {

    private final VentaRepository ventaRepository;
    private final ModelMapper modelMapper;
    private final ProductoService productoService;

    @Transactional(readOnly = true)
    public List<VentaDTO> listarVentas() {
        return ventaRepository.findAll()
                .stream()
                .map(venta -> modelMapper.map(venta, VentaDTO.class))
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public VentaDTO buscarPorId(Integer id) {
        Venta venta = ventaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Venta no encontrada"));
        return modelMapper.map(venta, VentaDTO.class);
    }

    @Transactional(readOnly = true)
    public List<VentaDTO> buscarVentasPorCliente(Integer clienteId) {
        return ventaRepository.findByCliente_IdUsuario(clienteId)
                .stream()
                .map(venta -> modelMapper.map(venta, VentaDTO.class))
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<VentaDTO> buscarVentasPorFecha(LocalDate fechaInicio, LocalDate fechaFin) {
        return ventaRepository.findByFechaBetween(fechaInicio, fechaFin)
                .stream()
                .map(venta -> modelMapper.map(venta, VentaDTO.class))
                .collect(Collectors.toList());
    }

    @Transactional
    public VentaDTO crearVenta(VentaDTO ventaDTO) {
        // Generar número de venta
        String numeroVenta = generarNumeroVenta();
        ventaDTO.setNumeroVenta(numeroVenta);

        // Calcular totales
        BigDecimal subtotal = ventaDTO.getDetalles().stream()
                .map(detalle -> detalle.getPrecioUnitario().multiply(new BigDecimal(detalle.getCantidad())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal igv = subtotal.multiply(new BigDecimal("0.18"));
        BigDecimal total = subtotal.add(igv);

        ventaDTO.setSubtotal(subtotal);
        ventaDTO.setIgv(igv);
        ventaDTO.setTotal(total);
        ventaDTO.setEstado("PENDIENTE");

        Venta venta = modelMapper.map(ventaDTO, Venta.class);

        // Calcular subtotales de detalles
        for (DetalleVenta detalle : venta.getDetalles()) {
            detalle.setSubtotal(
                    detalle.getPrecioUnitario().multiply(new BigDecimal(detalle.getCantidad()))
            );
            detalle.setVenta(venta);
        }

        venta = ventaRepository.save(venta);

        // Actualizar stock de productos
        for (DetalleVenta detalle : venta.getDetalles()) {
            productoService.actualizarStock(
                    detalle.getProducto().getIdProducto(),
                    -detalle.getCantidad(),
                    "Venta #" + numeroVenta,
                    venta.getUsuario().getIdUsuario()
            );
        }

        return modelMapper.map(venta, VentaDTO.class);
    }

    @Transactional
    public VentaDTO completarVenta(Integer ventaId) {
        Venta venta = ventaRepository.findById(ventaId)
                .orElseThrow(() -> new RuntimeException("Venta no encontrada"));

        venta.setEstado(Venta.EstadoVenta.COMPLETADA);
        venta = ventaRepository.save(venta);

        return modelMapper.map(venta, VentaDTO.class);
    }

    private String generarNumeroVenta() {
        Long count = ventaRepository.countVentasPorFecha(LocalDate.now());
        return String.format("V%s%04d",
                LocalDate.now().toString().replace("-", ""),
                count + 1);
    }

    @Transactional(readOnly = true)
    public BigDecimal calcularTotalVentasPorCliente(Integer clienteId) {
        return ventaRepository.findByCliente_IdUsuario(clienteId)
                .stream()
                .map(Venta::getTotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }
}