
package com.inventario.service;

import com.inventario.dto.DetalleVentaDTO;
import com.inventario.dto.VentaDTO;
import com.inventario.entity.DetalleVenta;
import com.inventario.entity.Producto;
import com.inventario.entity.Venta;
import com.inventario.repository.ProductoRepository;
import com.inventario.repository.VentaRepository;
import jakarta.transaction.Transactional;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class VentaService {

    @Autowired
    private VentaRepository ventaRepository;

    @Autowired
    private ProductoRepository productoRepository;

    @Autowired
    private KardexService kardexService;

    @Autowired
    private ModelMapper modelMapper;

    @Transactional
    public VentaDTO crearVenta(VentaDTO ventaDTO) {
        Venta venta = modelMapper.map(ventaDTO, Venta.class);

        // CORRECCIÓN: Usar el tipo Enum en lugar de String
        venta.setEstado(Venta.EstadoVenta.PENDIENTE);

        BigDecimal totalVenta = BigDecimal.ZERO;

        for (DetalleVentaDTO detalleDTO : ventaDTO.getDetalles()) {
            Producto producto = productoRepository.findById(detalleDTO.getProducto().getIdProducto())
                    .orElseThrow(() -> new RuntimeException("Producto no encontrado"));

            if (producto.getStockActual() < detalleDTO.getCantidad()) {
                throw new RuntimeException("Stock insuficiente para el producto: " + producto.getNombreProducto());
            }

            producto.setStockActual(producto.getStockActual() - detalleDTO.getCantidad());
            productoRepository.save(producto);

            kardexService.registrarSalida(producto, detalleDTO.getCantidad(), "Venta");

            DetalleVenta detalleVenta = modelMapper.map(detalleDTO, DetalleVenta.class);
            detalleVenta.setVenta(venta);
            detalleVenta.setProducto(producto);
            detalleVenta.setPrecioUnitario(producto.getPrecioVenta());

            BigDecimal subtotal = producto.getPrecioVenta().multiply(new BigDecimal(detalleDTO.getCantidad()));
            detalleVenta.setSubtotal(subtotal);

            totalVenta = totalVenta.add(subtotal);
        }

        venta.setTotal(totalVenta);
        Venta ventaGuardada = ventaRepository.save(venta);
        return modelMapper.map(ventaGuardada, VentaDTO.class);
    }

    public List<VentaDTO> listarVentas() {
        return ventaRepository.findAll()
                .stream()
                .map(venta -> modelMapper.map(venta, VentaDTO.class))
                .collect(Collectors.toList());
    }

    public VentaDTO buscarPorId(Integer id) {
        Venta venta = ventaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Venta no encontrada con ID: " + id));
        return modelMapper.map(venta, VentaDTO.class);
    }

    public List<VentaDTO> buscarVentasPorCliente(Integer clienteId) {
        return ventaRepository.findByClienteIdUsuario(clienteId)
                .stream()
                .map(venta -> modelMapper.map(venta, VentaDTO.class))
                .collect(Collectors.toList());
    }

    public List<VentaDTO> buscarVentasPorFecha(LocalDate fecha) {
        LocalDateTime inicioDelDia = fecha.atStartOfDay();
        LocalDateTime finDelDia = fecha.atTime(LocalTime.MAX);

        // CORREGIR: usar fechaRegistro
        return ventaRepository.findByFechaRegistroBetween(inicioDelDia, finDelDia)
                .stream()
                .map(venta -> modelMapper.map(venta, VentaDTO.class))
                .collect(Collectors.toList());
    }

    @Transactional
    public VentaDTO completarVenta(Integer id) {
        Venta venta = ventaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Venta no encontrada con ID: " + id));

        // CORRECCIÓN: Comparar directamente con el miembro del Enum
        if (venta.getEstado() != Venta.EstadoVenta.PENDIENTE) {
            throw new RuntimeException("La venta ya no está en estado PENDIENTE.");
        }

        // CORRECCIÓN: Usar el tipo Enum en lugar de String
        venta.setEstado(Venta.EstadoVenta.COMPLETADA);

        Venta ventaActualizada = ventaRepository.save(venta);
        return modelMapper.map(ventaActualizada, VentaDTO.class);
    }
    // Agregar este método a VentaService
    public BigDecimal calcularTotalVentasPorCliente(Integer clienteId) {
        List<Venta> ventas = ventaRepository.findByClienteIdUsuario(clienteId);
        return ventas.stream()
                .map(Venta::getTotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }
}