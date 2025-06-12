package com.inventario.service;

import com.inventario.dto.VentaDTO;
import com.inventario.entity.DetalleVenta;
import com.inventario.entity.Producto;
import com.inventario.entity.Usuario;
import com.inventario.entity.Venta;
import com.inventario.repository.ProductoRepository;
import com.inventario.repository.UsuarioRepository;
import com.inventario.repository.VentaRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class VentaService {

    private final VentaRepository ventaRepository;
    private final ProductoRepository productoRepository;
    private final UsuarioRepository usuarioRepository;
    private final KardexService kardexService;
    private final ModelMapper modelMapper;

    @Transactional
    public VentaDTO registrarVenta(VentaDTO ventaDTO) {
        Venta venta = modelMapper.map(ventaDTO, Venta.class);
        venta.setFechaVenta(LocalDate.now());

        // Asignar el cliente a la venta
        Usuario cliente = usuarioRepository.findById(ventaDTO.getCliente().getIdUsuario())
                .orElseThrow(() -> new RuntimeException("Cliente no encontrado"));
        venta.setCliente(cliente);

        // El método correcto es getDetalles(), no getDetalleVentas().
        for (DetalleVenta detalle : venta.getDetalles()) {
            Producto producto = productoRepository.findById(detalle.getProducto().getIdProducto())
                    .orElseThrow(() -> new RuntimeException("Producto no encontrado"));

            if (producto.getStockActual() < detalle.getCantidad()) {
                throw new RuntimeException("Stock insuficiente para el producto: " + producto.getNombreProducto());
            }

            producto.setStockActual(producto.getStockActual() - detalle.getCantidad());
            productoRepository.save(producto);

            kardexService.registrarSalida(producto, detalle.getCantidad(), "Venta");

            detalle.setVenta(venta);
        }

        Venta ventaGuardada = ventaRepository.save(venta);
        return modelMapper.map(ventaGuardada, VentaDTO.class);
    }

    public List<VentaDTO> listarTodasLasVentas() {
        return ventaRepository.findAll().stream()
                .map(venta -> modelMapper.map(venta, VentaDTO.class))
                .collect(Collectors.toList());
    }
}