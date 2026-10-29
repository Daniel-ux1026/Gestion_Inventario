package inventariobackend.service;

import com.google.common.base.Preconditions; // GOOGLE GUAVA
import inventariobackend.dto.ProductoDTO;
import inventariobackend.entity.Producto;
import inventariobackend.repository.ProductoRepository;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

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
        // CORRECCIÓN: Esta llamada ahora coincide con el método definido en el repositorio.
        return productoRepository.findByCategoria_IdCategoriaAndActivoTrue(categoriaId)
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
        // Uso Guava para validar que el DTO no sea nulo
        Preconditions.checkNotNull(productoDTO, "El DTO del producto no puede ser nulo");
        Preconditions.checkNotNull(productoDTO.getCodigoProducto(), "El código del producto no puede ser nulo.");
        if (productoDTO.getIdProducto() == null &&
                productoRepository.existsByCodigoProducto(productoDTO.getCodigoProducto())) {
            throw new RuntimeException("Ya existe un producto con ese código");
        }

        Producto producto = modelMapper.map(productoDTO, Producto.class);
        producto.setActivo(true);
        Producto productoGuardado = productoRepository.save(producto);

        if (productoDTO.getIdProducto() == null && productoGuardado.getStockActual() > 0) {
            kardexService.registrarEntrada(productoGuardado, productoGuardado.getStockActual(), "Stock Inicial");
        }

        return modelMapper.map(productoGuardado, ProductoDTO.class);
    }

    @Transactional
    public void eliminar(Integer id) {
        Producto producto = productoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado"));
        producto.setActivo(false);
        productoRepository.save(producto);
    }

    @Transactional
    public void actualizarStock(Integer productoId, int cantidad, String motivo) {
        Producto producto = productoRepository.findById(productoId)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado"));

        producto.setStockActual(producto.getStockActual() + cantidad);
        Producto productoActualizado = productoRepository.save(producto);

        if (cantidad > 0) {
            kardexService.registrarEntrada(productoActualizado, cantidad, motivo);
        } else if (cantidad < 0) {
            kardexService.registrarSalida(productoActualizado, Math.abs(cantidad), motivo);
        }
    }

    @Transactional
    public void ObtenerCategoria(Integer id) {}
}
