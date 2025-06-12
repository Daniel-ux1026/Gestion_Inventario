package com.inventario.service;

import com.inventario.entity.Kardex;
import com.inventario.entity.Producto;
import com.inventario.repository.KardexRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class KardexService {

    private final KardexRepository kardexRepository;

    public void registrarEntrada(Producto producto, int cantidad, String tipoMovimiento) {
        Kardex kardex = Kardex.builder()
                .producto(producto)
                .fecha(LocalDateTime.now())
                .tipoMovimiento(tipoMovimiento)
                .cantidad(cantidad)
                .stockResultante(producto.getStockActual())
                .build();
        kardexRepository.save(kardex);
    }

    public void registrarSalida(Producto producto, int cantidad, String tipoMovimiento) {
        Kardex kardex = Kardex.builder()
                .producto(producto)
                .fecha(LocalDateTime.now())
                .tipoMovimiento(tipoMovimiento)
                .cantidad(cantidad)
                .stockResultante(producto.getStockActual())
                .build();
        kardexRepository.save(kardex);
    }
}
