package com.inventario.controller;

import com.inventario.dto.ApiResponse;
import com.inventario.dto.VentaDTO;
import com.inventario.service.VentaService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/ventas")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class VentaController {

    private final VentaService ventaService;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<VentaDTO>>> listarVentas() {
        List<VentaDTO> ventas = ventaService.listarVentas();
        return ResponseEntity.ok(ApiResponse.success(ventas));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('CLIENTE')")
    public ResponseEntity<ApiResponse<VentaDTO>> buscarPorId(@PathVariable Integer id) {
        try {
            VentaDTO venta = ventaService.buscarPorId(id);
            return ResponseEntity.ok(ApiResponse.success(venta));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Venta no encontrada: " + e.getMessage()));
        }
    }

    @GetMapping("/cliente/{clienteId}")
    @PreAuthorize("hasRole('ADMIN') or (hasRole('CLIENTE') and #clienteId == authentication.principal.id)")
    public ResponseEntity<ApiResponse<List<VentaDTO>>> buscarVentasPorCliente(@PathVariable Integer clienteId) {
        List<VentaDTO> ventas = ventaService.buscarVentasPorCliente(clienteId);
        return ResponseEntity.ok(ApiResponse.success(ventas));
    }

    @GetMapping("/fecha")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<VentaDTO>>> buscarVentasPorFecha(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fechaInicio,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fechaFin) {
        List<VentaDTO> ventas = ventaService.buscarVentasPorFecha(fechaInicio, fechaFin);
        return ResponseEntity.ok(ApiResponse.success(ventas));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('CLIENTE')")
    public ResponseEntity<ApiResponse<VentaDTO>> crearVenta(@Valid @RequestBody VentaDTO ventaDTO) {
        try {
            VentaDTO venta = ventaService.crearVenta(ventaDTO);
            return ResponseEntity.ok(ApiResponse.success("Venta creada exitosamente", venta));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Error al crear venta: " + e.getMessage()));
        }
    }

    @PutMapping("/{id}/completar")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<VentaDTO>> completarVenta(@PathVariable Integer id) {
        try {
            VentaDTO venta = ventaService.completarVenta(id);
            return ResponseEntity.ok(ApiResponse.success("Venta completada exitosamente", venta));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Error al completar venta: " + e.getMessage()));
        }
    }
}