package com.inventario.controller;

import com.inventario.dto.ApiResponse;
import com.inventario.dto.ProductoDTO;
import com.inventario.service.ExcelExportService; // Asegúrate de importar el servicio
import com.inventario.service.ProductoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/productos")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ProductoController {

    private final ProductoService productoService;
    private final ExcelExportService excelService;

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

    @GetMapping("/exportar/excel")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<InputStreamResource> exportarProductos() {
        try {
            List<ProductoDTO> productos = productoService.listarProductosActivos();

            // CORRECCIÓN: Se cambió el nombre del método para que coincida con el del servicio.
            ByteArrayInputStream in = excelService.exportarProductosExcel(productos);

            HttpHeaders headers = new HttpHeaders();
            headers.add("Content-Disposition", "attachment; filename=productos.xlsx");

            return ResponseEntity
                    .ok()
                    .headers(headers)
                    .contentType(MediaType.APPLICATION_OCTET_STREAM)
                    .body(new InputStreamResource(in));
        } catch (IOException e) {
            // Se recomienda registrar el error para futura depuración.
            // log.error("Error al exportar productos a Excel", e);
            return ResponseEntity.status(500).build();
        }
    }
}

