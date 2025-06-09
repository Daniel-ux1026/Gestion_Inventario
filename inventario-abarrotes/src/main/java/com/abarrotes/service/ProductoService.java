package com.abarrotes.service;

import com.abarrotes.entity.Producto;
import com.abarrotes.repository.ProductoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class ProductoService {

    @Autowired
    private ProductoRepository productoRepository;

    // Crear producto
    public Producto crearProducto(Producto producto) {
        // Verificar que no exista el código
        if (productoRepository.existsByCodigo(producto.getCodigo())) {
            throw new RuntimeException("El código del producto ya existe");
        }

        return productoRepository.save(producto);
    }

    // Obtener todos los productos activos
    public List<Producto> obtenerTodosLosProductos() {
        return productoRepository.findByEstadoTrue();
    }

    // Obtener producto por ID
    public Optional<Producto> obtenerProductoPorId(Integer id) {
        return productoRepository.findById(id)
                .filter(Producto::getEstado);
    }

    // Obtener producto por código
    public Optional<Producto> obtenerProductoPorCodigo(String codigo) {
        return productoRepository.findByCodigo(codigo)
                .filter(Producto::getEstado);
    }

    // Actualizar producto
    public Producto actualizarProducto(Integer id, Producto productoActualizado) {
        Producto producto = productoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado"));

        // Verificar cambios en código
        if (!producto.getCodigo().equals(productoActualizado.getCodigo())) {
            if (productoRepository.existsByCodigo(productoActualizado.getCodigo())) {
                throw new RuntimeException("El código del producto ya existe");
            }
        }

        // Actualizar campos
        producto.setCodigo(productoActualizado.getCodigo());
        producto.setNombre(productoActualizado.getNombre());
        producto.setPresentacion(productoActualizado.getPresentacion());
        producto.setPrecioCompra(productoActualizado.getPrecioCompra());
        producto.setPrecioVenta(productoActualizado.getPrecioVenta());
        producto.setStock(productoActualizado.getStock());
        producto.setCategoria(productoActualizado.getCategoria());
        producto.setMarca(productoActualizado.getMarca());

        return productoRepository.save(producto);
    }

    // Eliminar producto (borrado lógico)
    public void eliminarProducto(Integer id) {
        Producto producto = productoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado"));

        producto.setEstado(false);
        productoRepository.save(producto);
    }

    // Buscar productos por código o nombre
    public List<Producto> buscarProductos(String termino) {
        return productoRepository.findByCodigoOrNombreContainingIgnoreCase(termino);
    }

    // Obtener productos por categoría
    public List<Producto> obtenerProductosPorCategoria(Integer categoriaId) {
        return productoRepository.findByCategoriaIdAndEstadoTrue(categoriaId);
    }

    // Obtener productos por marca
    public List<Producto> obtenerProductosPorMarca(Integer marcaId) {
        return productoRepository.findByMarcaIdAndEstadoTrue(marcaId);
    }

    // Obtener productos disponibles (con stock)
    public List<Producto> obtenerProductosDisponibles() {
        return productoRepository.findProductosDisponibles();
    }

    // Obtener productos con stock bajo
    public List<Producto> obtenerProductosConStockBajo(Integer minStock) {
        return productoRepository.findProductosConStockBajo(minStock);
    }

    // Obtener productos sin stock
    public List<Producto> obtenerProductosSinStock() {
        return productoRepository.findProductosSinStock();
    }

    // Actualizar stock
    public Producto actualizarStock(Integer id, Integer cantidad, String tipoMovimiento) {
        Producto producto = productoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado"));

        if ("ENTRADA".equals(tipoMovimiento)) {
            producto.setStock(producto.getStock() + cantidad);
        } else if ("SALIDA".equals(tipoMovimiento)) {
            if (producto.getStock() < cantidad) {
                throw new RuntimeException("Stock insuficiente");
            }
            producto.setStock(producto.getStock() - cantidad);
        } else {
            throw new RuntimeException("Tipo de movimiento inválido");
        }

        return productoRepository.save(producto);
    }

    // Cambiar estado del producto
    public Producto cambiarEstadoProducto(Integer id) {
        Producto producto = productoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado"));

        producto.setEstado(!producto.getEstado());
        return productoRepository.save(producto);
    }

    // Verificar si existe código
    public boolean existeCodigo(String codigo) {
        return productoRepository.existsByCodigo(codigo);
    }
}