package inventariobackend.controller;

import inventariobackend.dto.ApiResponse;
import inventariobackend.dto.VentaDTO;
import inventariobackend.service.VentaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/ventas") // Se recomienda prefijar con /api
public class VentaController {

    @Autowired
    private VentaService ventaService;

    // ENDPOINT EXISTENTE (AHORA /api/ventas)
    @PostMapping
    public ResponseEntity<ApiResponse<VentaDTO>> crearVenta(@RequestBody VentaDTO ventaDTO) {
        try {
            VentaDTO nuevaVenta = ventaService.crearVenta(ventaDTO);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(new ApiResponse<>(true, "Venta creada exitosamente", nuevaVenta));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponse<>(false, e.getMessage(), null));
        }
    }

    // NUEVO: Endpoint para listar todas las ventas
    @GetMapping("/listar")
    public ResponseEntity<ApiResponse<List<VentaDTO>>> listarVentas() {
        List<VentaDTO> ventas = ventaService.listarVentas();
        return ResponseEntity.ok(new ApiResponse<>(true, "Listado de ventas obtenido", ventas));
    }

    // NUEVO: Endpoint para buscar una venta por su ID
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<VentaDTO>> buscarPorId(@PathVariable Integer id) {
        try {
            VentaDTO venta = ventaService.buscarPorId(id);
            return ResponseEntity.ok(new ApiResponse<>(true, "Venta encontrada", venta));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse<>(false, e.getMessage(), null));
        }
    }

    // NUEVO: Endpoint para buscar ventas por cliente
    @GetMapping("/cliente/{clienteId}")
    public ResponseEntity<ApiResponse<List<VentaDTO>>> buscarVentasPorCliente(@PathVariable Integer clienteId) {
        List<VentaDTO> ventas = ventaService.buscarVentasPorCliente(clienteId);
        return ResponseEntity.ok(new ApiResponse<>(true, "Ventas encontradas para el cliente", ventas));
    }

    // NUEVO: Endpoint para buscar ventas por fecha
    @GetMapping("/fecha/{fecha}")
    public ResponseEntity<ApiResponse<List<VentaDTO>>> buscarVentasPorFecha(
            @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fecha) {
        List<VentaDTO> ventas = ventaService.buscarVentasPorFecha(fecha);
        return ResponseEntity.ok(new ApiResponse<>(true, "Ventas encontradas para la fecha", ventas));
    }

    // NUEVO: Endpoint para marcar una venta como completada
    @PutMapping("/{id}/completar")
    public ResponseEntity<ApiResponse<VentaDTO>> completarVenta(@PathVariable Integer id) {
        try {
            VentaDTO ventaCompletada = ventaService.completarVenta(id);
            return ResponseEntity.ok(new ApiResponse<>(true, "Venta completada exitosamente", ventaCompletada));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponse<>(false, e.getMessage(), null));
        }
    }
}

