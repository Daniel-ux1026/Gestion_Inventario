package com.inventario.controller;

import com.inventario.dto.ApiResponse;
import com.inventario.dto.ProductoDTO;
import com.inventario.service.ProductoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/productos")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ProductoController {

    private final ProductoService productoService;

    @GetMapping("/listar")
    public ResponseEntity<ApiResponse<List<ProductoDTO>>> listarProductos() {
        List<ProductoDTO> productos = productoService.listarProductosActivos();
        return ResponseEntity.ok(ApiResponse.success(productos));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ProductoDTO>> buscarPorId(@PathVariable Integer id) {
        try {
            ProductoDTO producto = productoService.buscarPorId(id);
            return ResponseEntity.ok(ApiResponse.success(producto));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Producto no encontrado: " + e.getMessage()));
        }
    }

    @GetMapping("/buscar/{search}")
    public ResponseEntity<ApiResponse<List<ProductoDTO>>> buscarProductos(@PathVariable String search) {
        List<ProductoDTO> productos = productoService.buscarProductos(search);
        return ResponseEntity.ok(ApiResponse.success(productos));
    }

    @GetMapping("/categoria/{categoriaId}")
    public ResponseEntity<ApiResponse<List<ProductoDTO>>> buscarPorCategoria(@PathVariable Integer categoriaId) {
        List<ProductoDTO> productos = productoService.buscarPorCategoria(categoriaId);
        return ResponseEntity.ok(ApiResponse.success(productos));
    }

    @GetMapping("/stock-bajo")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<ProductoDTO>>> listarProductosStockBajo() {
        List<ProductoDTO> productos = productoService.listarProductosStockBajo();
        return ResponseEntity.ok(ApiResponse.success(productos));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<ProductoDTO>> guardarProducto(@Valid @RequestBody ProductoDTO productoDTO) {
        try {
            ProductoDTO producto = productoService.guardar(productoDTO);
            return ResponseEntity.ok(ApiResponse.success("Producto guardado exitosamente", producto));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Error al guardar producto: " + e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<ProductoDTO>> actualizarProducto(
            @PathVariable Integer id, @Valid @RequestBody ProductoDTO productoDTO) {
        try {
            productoDTO.setIdProducto(id);
            ProductoDTO producto = productoService.guardar(productoDTO);
            return ResponseEntity.ok(ApiResponse.success("Producto actualizado exitosamente", producto));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Error al actualizar producto: " + e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> eliminarProducto(@PathVariable Integer id) {
        try {
            productoService.eliminar(id);
            return ResponseEntity.ok(ApiResponse.success("Producto eliminado exitosamente", null));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Error al eliminar producto: " + e.getMessage()));
        }
    }
}
