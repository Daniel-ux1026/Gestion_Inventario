package com.inventario.service;

import com.inventario.dto.ProductoDTO;
import com.inventario.entity.Producto;
import com.inventario.repository.ProductoRepository;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;
import com.google.common.base.Preconditions; // Google guava

@Service
@RequiredArgsConstructor
public class ProductoService {

    private final ProductoRepository productoRepository;
    private final ModelMapper modelMapper;
    private final KardexService kardexService;

    @Transactional(readOnly = true)
    public List<ProductoDTO> listarProductosActivos() {
        return productoRepository.findByActivoTrue()
                .stream()
                .map(producto -> modelMapper.map(producto, ProductoDTO.class))
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public ProductoDTO buscarPorId(Integer id) {
        Producto producto = productoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado"));
        return modelMapper.map(producto, ProductoDTO.class);
    }

    @Transactional(readOnly = true)
    public List<ProductoDTO> buscarProductos(String search) {
        return productoRepository.buscarProductos(search)
                .stream()
                .map(producto -> modelMapper.map(producto, ProductoDTO.class))
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ProductoDTO> buscarPorCategoria(Integer categoriaId) {
        return productoRepository.findByCategoria(categoriaId)
                .stream()
                .map(producto -> modelMapper.map(producto, ProductoDTO.class))
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ProductoDTO> listarProductosStockBajo() {
        return productoRepository.findProductosConStockBajo()
                .stream()
                .map(producto -> modelMapper.map(producto, ProductoDTO.class))
                .collect(Collectors.toList());
    }

    @Transactional
    public ProductoDTO guardar(ProductoDTO productoDTO) {
        // Usa Guava para validar que el DTO no sea nulo
        Preconditions.checkNotNull(productoDTO, "El DTO del producto no puede ser nulo");
        Preconditions.checkNotNull(productoDTO.getCodigoProducto(), "El código del producto no puede ser nulo.");
        if (productoDTO.getIdProducto() == null &&
                productoRepository.existsByCodigoProducto(productoDTO.getCodigoProducto())) {
            throw new RuntimeException("Ya existe un producto con ese código");
        }

        Producto producto = modelMapper.map(productoDTO, Producto.class);
        producto = productoRepository.save(producto);
        return modelMapper.map(producto, ProductoDTO.class);
    }

    @Transactional
    public void eliminar(Integer id) {
        Producto producto = productoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado"));
        producto.setActivo(false);
        productoRepository.save(producto);
    }

    @Transactional
    public void actualizarStock(Integer productoId, Integer cantidad, String motivo, Integer usuarioId) {
        Producto producto = productoRepository.findById(productoId)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado"));

        Integer stockAnterior = producto.getStockActual();
        producto.setStockActual(stockAnterior + cantidad);
        productoRepository.save(producto);

        // Registrar en kardex
        kardexService.registrarMovimiento(
                productoId,
                cantidad > 0 ? "ENTRADA" : "SALIDA",
                motivo,
                Math.abs(cantidad),
                stockAnterior,
                producto.getStockActual(),
                producto.getPrecioCompra(),
                usuarioId,
                null,
                null
        );
    }
}