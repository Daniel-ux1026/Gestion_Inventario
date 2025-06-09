package com.abarrotes.controller;

import com.abarrotes.dto.CrearVentaRequest;
import com.abarrotes.dto.DashboardStats;
import com.abarrotes.entity.Venta;
import com.abarrotes.service.VentaService;
import com.abarrotes.service.UsuarioService;
import com.abarrotes.service.ProductoService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/ventas")
@CrossOrigin(origins = "*")
public class VentaController {

    @Autowired
    private VentaService ventaService;

    @Autowired
    private UsuarioService usuarioService;

    @Autowired
    private ProductoService productoService;

    @GetMapping
    public ResponseEntity<List<Venta>> obtenerTodasLasVentas() {
        try {
            List<Venta> ventas = ventaService.obtenerTodasLasVentas();
            return ResponseEntity.ok(ventas);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Venta> obtenerVentaPorId(@PathVariable Integer id) {
        try {
            Optional<Venta> venta = ventaService.obtenerVentaPorId(id);
            if (venta.isPresent()) {
                return ResponseEntity.ok(venta.get());
            }
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @PostMapping
    public ResponseEntity<?> crearVenta(@Valid @RequestBody CrearVentaRequest request) {
        try {
            // Obtener el usuario autenticado (simplificado, en producción usar SecurityContext)
            Integer usuarioId = obtenerUsuarioAutenticado();

            Venta nuevaVenta = ventaService.crearVenta(usuarioId, request);
            return ResponseEntity.status(HttpStatus.CREATED).body(nuevaVenta);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error al crear la venta");
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> anularVenta(@PathVariable Integer id) {
        try {
            ventaService.anularVenta(id);
            return ResponseEntity.ok().body("Venta anulada correctamente");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error al anular la venta");
        }
    }

    @GetMapping("/usuario/{usuarioId}")
    public ResponseEntity<List<Venta>> obtenerVentasPorUsuario(@PathVariable Integer usuarioId) {
        try {
            List<Venta> ventas = ventaService.obtenerVentasPorUsuario(usuarioId);
            return ResponseEntity.ok(ventas);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/cliente/{clienteId}")
    public ResponseEntity<List<Venta>> obtenerVentasPorCliente(@PathVariable Integer clienteId) {
        try {
            List<Venta> ventas = ventaService.obtenerVentasPorCliente(clienteId);
            return ResponseEntity.ok(ventas);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/hoy")
    public ResponseEntity<List<Venta>> obtenerVentasDelDia() {
        try {
            List<Venta> ventas = ventaService.obtenerVentasDelDia();
            return ResponseEntity.ok(ventas);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/mes")
    public ResponseEntity<List<Venta>> obtenerVentasDelMes() {
        try {
            List<Venta> ventas = ventaService.obtenerVentasDelMes();
            return ResponseEntity.ok(ventas);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/rango")
    public ResponseEntity<List<Venta>> obtenerVentasPorRangoFechas(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime fechaInicio,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime fechaFin) {
        try {
            List<Venta> ventas = ventaService.obtenerVentasPorRangoFechas(fechaInicio, fechaFin);
            return ResponseEntity.ok(ventas);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/estadisticas")
    public ResponseEntity<DashboardStats> obtenerEstadisticas() {
        try {
            DashboardStats stats = new DashboardStats();

            // Estadísticas de ventas
            stats.setVentasDelDia(ventaService.contarVentasDelDia());
            stats.setTotalVentasDelDia(ventaService.calcularTotalVentasDelDia());
            stats.setVentasDelMes(ventaService.contarVentasDelMes());
            stats.setTotalVentasDelMes(ventaService.calcularTotalVentasDelMes());

            // Estadísticas de productos
            stats.setProductosConStockBajo((long) productoService.obtenerProductosConStockBajo(5).size());
            stats.setProductosSinStock((long) productoService.obtenerProductosSinStock().size());
            stats.setTotalProductos((long) productoService.obtenerTodosLosProductos().size());

            // Estadísticas de usuarios
            stats.setTotalUsuarios((long) usuarioService.obtenerTodosLosUsuarios().size());

            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/top-clientes")
    public ResponseEntity<List<Object[]>> obtenerTopClientes() {
        try {
            List<Object[]> topClientes = ventaService.obtenerTopClientesPorVentas();
            return ResponseEntity.ok(topClientes);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    // Método auxiliar para obtener usuario autenticado
    private Integer obtenerUsuarioAutenticado() {
        // Simplificado para el ejemplo - en producción usar SecurityContext
        return 1; // Usuario por defecto
    }
}