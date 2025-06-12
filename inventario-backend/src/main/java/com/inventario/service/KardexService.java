package com.inventario.service;

import com.inventario.entity.Kardex;
import com.inventario.entity.Producto;
import com.inventario.entity.Usuario;
import com.inventario.repository.KardexRepository;
import com.inventario.repository.ProductoRepository;
import com.inventario.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
public class KardexService {

    private final KardexRepository kardexRepository;
    private final ProductoRepository productoRepository;
    private final UsuarioRepository usuarioRepository;

    @Transactional(readOnly = true)
    public List<Kardex> listarMovimientosPorProducto(Integer productoId) {
        return kardexRepository.findByProducto_IdProductoOrderByFechaMovimientoDesc(productoId);
    }

    @Transactional
    public void registrarMovimiento(Integer productoId, String tipoMovimiento, String motivo,
                                    Integer cantidad, Integer stockAnterior, Integer stockActual,
                                    BigDecimal precioUnitario, Integer usuarioId,
                                    Integer compraId, Integer ventaId) {

        Producto producto = productoRepository.findById(productoId)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado"));

        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        Kardex kardex = new Kardex();
        kardex.setProducto(producto);
        kardex.setTipoMovimiento(Kardex.TipoMovimiento.valueOf(tipoMovimiento));
        kardex.setMotivo(motivo);
        kardex.setCantidad(cantidad);
        kardex.setStockAnterior(stockAnterior);
        kardex.setStockActual(stockActual);
        kardex.setPrecioUnitario(precioUnitario);
        kardex.setUsuario(usuario);

        kardexRepository.save(kardex);
    }
}