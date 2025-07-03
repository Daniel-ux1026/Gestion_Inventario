package com.inventario.controller;

import com.inventario.dto.ApiResponse;
import com.inventario.dto.UsuarioDTO;
import com.inventario.dto.ProductoDTO;
import com.inventario.dto.VentaDTO;
import com.inventario.dto.CambiarPasswordDTO;
import com.inventario.service.UsuarioService;
import com.inventario.service.ProductoService;
import com.inventario.service.VentaService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;
import java.util.Map;

/**
 * Controlador para funciones de cliente
 * Los usuarios con rol CLIENTE pueden acceder a estos endpoints
 * También incluye funciones que cualquier usuario autenticado puede usar
 */
@RestController
@RequestMapping("/cliente")    // Todas las rutas empiezan con /cliente
@RequiredArgsConstructor       // Lombok crea el constructor automáticamente
@CrossOrigin(origins = "*")    // Permite peticiones desde cualquier origen
public class ClienteController {

    // Servicios que vamos a usar
    private final UsuarioService usuarioService;
    private final ProductoService productoService;
    private final VentaService ventaService;

    // ==================== PERFIL DEL CLIENTE ====================


    /**
     * Actualiza el perfil del usuario logueado
     * PUT /cliente/perfil
     */


    /**
     * Cambia la contraseña del usuario actual
     * PUT /cliente/cambiar-password
     */


    // ==================== CATÁLOGO DE PRODUCTOS ====================

    /**
     * Lista todos los productos disponibles (catálogo público)
     * GET /cliente/productos
     * Los clientes pueden ver todos los productos para comprar
     */




    /**
     * Obtiene los detalles de un producto específico
     * GET /cliente/productos/{id}
     */
    @GetMapping("/productos/{id}")
    public ResponseEntity<ApiResponse<ProductoDTO>> verProducto(@PathVariable Integer id) {
        try {
            ProductoDTO producto = productoService.buscarPorId(id);
            return ResponseEntity.ok(
                    new ApiResponse<>(true, "Producto encontrado", producto)
            );
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse<>(false, e.getMessage(), null));
        }
    }

    /**
     * Busca productos por nombre o categoría
     * GET /cliente/productos/buscar?termino=ejemplo
     */


    // ==================== COMPRAS/VENTAS ====================

    /**
     * Crea una nueva compra (venta desde el punto de vista del sistema)
     * POST /cliente/comprar
     * Solo usuarios con rol CLIENTE pueden comprar
     */
    @PostMapping("/comprar")
    @PreAuthorize("hasRole('CLIENTE')") // Solo clientes pueden comprar
    public ResponseEntity<ApiResponse<VentaDTO>> realizarCompra(@Valid @RequestBody VentaDTO ventaDTO) {
        try {
            // El cliente realiza una compra, que se registra como venta en el sistema
            VentaDTO nuevaVenta = ventaService.crearVenta(ventaDTO);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(new ApiResponse<>(true, "Compra realizada exitosamente", nuevaVenta));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponse<>(false, e.getMessage(), null));
        }
    }

    /**
     * Obtiene el historial de compras del cliente actual
     * GET /cliente/mis-compras
     */





    /**
     * Obtiene una compra específica del cliente actual
     * GET /cliente/mis-compras/{id}
     */





    // ==================== FUNCIONES AUXILIARES ====================

    /**
     * Verifica la disponibilidad de un producto
     * GET /cliente/productos/{id}/disponibilidad
     */





    /**
     * Obtiene las categorías disponibles
     * GET /cliente/categorias
     */






    // ==================== INFORMACIÓN GENERAL ====================

    /**
     * Obtiene información básica para el cliente (sin autenticación requerida)
     * GET /cliente/info
     */
    @GetMapping("/info")
    public ResponseEntity<ApiResponse<Object>> obtenerInformacionGeneral() {
        try {
            // Información que cualquiera puede ver (nombre de la tienda, horarios, etc.)
            Object info = Map.of(
                    "nombreTienda", "El Lirio de los Valles",
                    "version", "1.0.0",
                    "mensaje", "Bienvenido a nuestro sistema de inventario"
            );
            return ResponseEntity.ok(
                    new ApiResponse<>(true, "Información obtenida", info)
            );
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>(false, "Error al obtener información: " + e.getMessage(), null));
        }
    }
}