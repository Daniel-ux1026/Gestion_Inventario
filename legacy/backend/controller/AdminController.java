package inventariobackend.controller;

import inventariobackend.dto.ApiResponse;
import inventariobackend.dto.UsuarioDTO;
import inventariobackend.dto.ProductoDTO;
import inventariobackend.dto.VentaDTO;
import inventariobackend.dto.DashboardDTO;
import inventariobackend.service.UsuarioService;
import inventariobackend.service.ProductoService;
import inventariobackend.service.VentaService;
import inventariobackend.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;

/**
 * Controlador para funciones administrativas
 * Solo los usuarios con rol ADMIN pueden acceder a estos endpoints
 */
@RestController
@RequestMapping("/admin")  // Todas las rutas empiezan con /admin
@RequiredArgsConstructor   // Lombok crea el constructor automáticamente
@CrossOrigin(origins = "*") // Permite peticiones desde cualquier origen (para desarrollo)
@PreAuthorize("hasRole('ADMIN')") // Solo administradores pueden usar este controlador
public class AdminController {


    // Inyección de dependencias - Spring las crea automáticamente

    private final ProductoService productoService;
    private final VentaService ventaService;
    private final DashboardService dashboardService;

    // ==================== DASHBOARD ====================

    /**
     * Obtiene los datos principales del dashboard
     * GET /admin/dashboard
     */
    @GetMapping("/dashboard")
    public ResponseEntity<ApiResponse<DashboardDTO>> obtenerDashboard() {
        try {
            DashboardDTO dashboard = dashboardService.obtenerDatosDashboard();
            // ResponseEntity.ok() es lo mismo que ResponseEntity.status(200)
            return ResponseEntity.ok(
                    new ApiResponse<>(true, "Dashboard obtenido correctamente", dashboard)
            );
        } catch (Exception e) {
            // Si algo sale mal, devolvemos error 500
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>(false, "Error al obtener dashboard: " + e.getMessage(), null));
        }
    }

    // ==================== GESTIÓN DE USUARIOS ====================

    /**
     * Lista todos los usuarios del sistema
     * GET /admin/usuarios
     */


    /**
     * Crea un nuevo usuario
     * POST /admin/usuarios
     */




    /**
     * Actualiza un usuario existente
     * PUT /admin/usuarios/{id}
     */





    /**
     * Elimina un usuario (lo desactiva realmente)
     * DELETE /admin/usuarios/{id}
     */




    // ==================== GESTIÓN DE PRODUCTOS ====================

    /**
     * Lista todos los productos
     * GET /admin/productos
     */




    /**
     * Obtiene productos con stock bajo
     * GET /admin/productos/stock-bajo
     */


    // ==================== GESTIÓN DE VENTAS ====================

    /**
     * Lista todas las ventas
     * GET /admin/ventas
     */
    @GetMapping("/ventas")
    public ResponseEntity<ApiResponse<List<VentaDTO>>> listarVentas() {
        try {
            List<VentaDTO> ventas = ventaService.listarVentas();
            return ResponseEntity.ok(
                    new ApiResponse<>(true, "Lista de ventas obtenida", ventas)
            );
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>(false, "Error al obtener ventas: " + e.getMessage(), null));
        }
    }

    /**
     * Aprueba una venta pendiente
     * PUT /admin/ventas/{id}/aprobar
     */
    @PutMapping("/ventas/{id}/aprobar")
    public ResponseEntity<ApiResponse<VentaDTO>> aprobarVenta(@PathVariable Integer id) {
        try {
            VentaDTO ventaAprobada = ventaService.completarVenta(id);
            return ResponseEntity.ok(
                    new ApiResponse<>(true, "Venta aprobada exitosamente", ventaAprobada)
            );
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponse<>(false, e.getMessage(), null));
        }
    }

    // ==================== REPORTES BÁSICOS ====================

    /**
     * Obtiene estadísticas generales
     * GET /admin/estadisticas
     */


    /**
     * Obtiene el conteo total de usuarios
     * GET /admin/usuarios/count
     */

}