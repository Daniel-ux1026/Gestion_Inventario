package com.abarrotes.service;

import com.abarrotes.dto.CrearVentaRequest;
import com.abarrotes.dto.DetalleVentaRequest;
import com.abarrotes.entity.*;
import com.abarrotes.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class VentaService {

    @Autowired
    private VentaRepository ventaRepository;

    @Autowired
    private DetalleVentaRepository detalleVentaRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private ProductoRepository productoRepository;

    @Autowired
    private ProductoService productoService;

    // Crear venta
    public Venta crearVenta(Integer usuarioId, CrearVentaRequest request) {
        // Obtener usuario vendedor
        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        // Obtener cliente
        Usuario cliente = usuarioRepository.findById(request.getClienteId())
                .orElseThrow(() -> new RuntimeException("Cliente no encontrado"));

        // Crear venta
        Venta venta = new Venta(usuario, cliente);
        venta = ventaRepository.save(venta);

        BigDecimal total = BigDecimal.ZERO;

        // Crear detalles de venta
        for (DetalleVentaRequest detalleRequest : request.getDetalles()) {
            Producto producto = productoRepository.findById(detalleRequest.getProductoId())
                    .orElseThrow(() -> new RuntimeException("Producto no encontrado"));

            // Verificar stock disponible
            if (producto.getStock() < detalleRequest.getCantidad()) {
                throw new RuntimeException("Stock insuficiente para el producto: " + producto.getNombre());
            }

            // Crear detalle
            DetalleVenta detalle = new DetalleVenta(
                    venta,
                    producto,
                    detalleRequest.getCantidad(),
                    detalleRequest.getPrecioUnitario()
            );

            detalleVentaRepository.save(detalle);

            // Actualizar stock del producto
            productoService.actualizarStock(
                    producto.getIdProducto(),
                    detalleRequest.getCantidad(),
                    "SALIDA"
            );

            // Acumular total
            total = total.add(detalle.calcularSubtotal());
        }

        // Actualizar total de la venta
        venta.setTotal(total);
        return ventaRepository.save(venta);
    }

    // Obtener todas las ventas activas
    public List<Venta> obtenerTodasLasVentas() {
        return ventaRepository.findByEstadoTrue();
    }

    // Obtener venta por ID
    public Optional<Venta> obtenerVentaPorId(Integer id) {
        return ventaRepository.findById(id)
                .filter(Venta::getEstado);
    }

    // Obtener ventas por usuario (vendedor)
    public List<Venta> obtenerVentasPorUsuario(Integer usuarioId) {
        return ventaRepository.findByUsuarioIdAndEstadoTrue(usuarioId);
    }

    // Obtener ventas por cliente
    public List<Venta> obtenerVentasPorCliente(Integer clienteId) {
        return ventaRepository.findByClienteIdAndEstadoTrue(clienteId);
    }

    // Obtener ventas del día
    public List<Venta> obtenerVentasDelDia() {
        return ventaRepository.findVentasDelDia();
    }

    // Obtener ventas del mes
    public List<Venta> obtenerVentasDelMes() {
        return ventaRepository.findVentasDelMes();
    }

    // Calcular total de ventas del día
    public BigDecimal calcularTotalVentasDelDia() {
        BigDecimal total = ventaRepository.calcularTotalVentasDelDia();
        return total != null ? total : BigDecimal.ZERO;
    }

    // Calcular total de ventas del mes
    public BigDecimal calcularTotalVentasDelMes() {
        BigDecimal total = ventaRepository.calcularTotalVentasDelMes();
        return total != null ? total : BigDecimal.ZERO;
    }

    // Contar ventas del día
    public Long contarVentasDelDia() {
        return ventaRepository.contarVentasDelDia();
    }

    // Contar ventas del mes
    public Long contarVentasDelMes() {
        return ventaRepository.contarVentasDelMes();
    }

    // Obtener ventas por rango de fechas
    public List<Venta> obtenerVentasPorRangoFechas(LocalDateTime fechaInicio, LocalDateTime fechaFin) {
        return ventaRepository.findByFechaBetweenAndEstadoTrue(fechaInicio, fechaFin);
    }

    // Anular venta
    public void anularVenta(Integer id) {
        Venta venta = ventaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Venta no encontrada"));

        if (!venta.getEstado()) {
            throw new RuntimeException("La venta ya está anulada");
        }

        // Restaurar stock de los productos
        for (DetalleVenta detalle : venta.getDetalles()) {
            productoService.actualizarStock(
                    detalle.getProducto().getIdProducto(),
                    detalle.getCantidad(),
                    "ENTRADA"
            );
        }

        // Anular venta
        venta.setEstado(false);
        ventaRepository.save(venta);
    }

    // Obtener top clientes por ventas
    public List<Object[]> obtenerTopClientesPorVentas() {
        return ventaRepository.findTopClientesPorVentas();
    }
}