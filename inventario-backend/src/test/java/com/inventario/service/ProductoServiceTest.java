package com.inventario.service;

import com.inventario.dto.ProductoDTO;
import com.inventario.entity.Producto;
import com.inventario.repository.ProductoRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.modelmapper.ModelMapper;

import java.util.Arrays;
import java.util.List;

import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(MockitoExtension.class)
class ProductoServiceTest {

    @Mock
    private ProductoRepository productoRepository;

    @Mock
    private ModelMapper modelMapper;

    @Mock
    private KardexService kardexService;

    @InjectMocks
    private ProductoService productoService;

    private Producto productoActivo;
    private ProductoDTO productoActivoDTO;

    @BeforeEach
    void setUp() {
        // Preparamos datos de prueba para usarlos en los tests
        productoActivo = new Producto();
        productoActivo.setIdProducto(1);
        productoActivo.setNombreProducto("Producto Activo");
        productoActivo.setActivo(true);

        productoActivoDTO = new ProductoDTO();
        productoActivoDTO.setIdProducto(1);
        productoActivoDTO.setNombreProducto("Producto Activo");
        productoActivoDTO.setActivo(true);
    }

    /**
     * Test 1 (El que ya tienes): Prueba para el Aspecto de Usuario #3
     */
    @Test
    void alGuardarNuevoProductoConStock_deberiaInvocarKardexService() {
        // Arrange
        ProductoDTO nuevoProductoDTO = new ProductoDTO();
        nuevoProductoDTO.setCodigoProducto("NUEVO-001");
        nuevoProductoDTO.setNombreProducto("Producto con Kardex");
        nuevoProductoDTO.setStockActual(50);

        Producto productoAGuardar = new Producto();
        productoAGuardar.setCodigoProducto("NUEVO-001");
        productoAGuardar.setNombreProducto("Producto con Kardex");

        Producto productoGuardado = new Producto();
        productoGuardado.setIdProducto(100);
        productoGuardado.setCodigoProducto("NUEVO-001");
        productoGuardado.setNombreProducto("Producto con Kardex");
        productoGuardado.setStockActual(50);

        when(productoRepository.existsByCodigoProducto("NUEVO-001")).thenReturn(false);
        when(modelMapper.map(nuevoProductoDTO, Producto.class)).thenReturn(productoAGuardar);
        when(productoRepository.save(productoAGuardar)).thenReturn(productoGuardado);
        doNothing().when(kardexService).registrarEntrada(any(Producto.class), anyInt(), anyString());

        // Act
        productoService.guardar(nuevoProductoDTO);

        // Assert
        verify(productoRepository, times(1)).save(productoAGuardar);
        verify(kardexService, times(1)).registrarEntrada(productoGuardado, 50, "Stock Inicial");
    }

    /**
     * Test 2 (Nuevo): Prueba para el Aspecto de Usuario #4
     * Objetivo: Verificar que el método listarProductosActivos solo devuelve productos activos.
     */
    @Test
    void alListarProductosActivos_deberiaRetornarSoloActivos() {
        // 1. Arrange
        // Creamos una lista de productos que el repositorio "devolverá"
        List<Producto> listaDelRepo = Arrays.asList(productoActivo);

        // Cuando se llame al método findByActivoTrue() del repositorio, devolverá nuestra lista.
        when(productoRepository.findByActivoTrue()).thenReturn(listaDelRepo);

        // Cuando el modelMapper convierta la entidad activa, devolverá el DTO activo.
        when(modelMapper.map(productoActivo, ProductoDTO.class)).thenReturn(productoActivoDTO);

        // 2. Act
        // Llamamos al método que queremos probar
        List<ProductoDTO> resultado = productoService.listarProductosActivos();

        // 3. Assert
        assertNotNull(resultado);
        assertEquals(1, resultado.size());
        assertTrue(resultado.get(0).getActivo());
        assertEquals("Producto Activo", resultado.get(0).getNombreProducto());

        // Verificamos que el método del repositorio se llamó exactamente 1 vez
        verify(productoRepository, times(1)).findByActivoTrue();
    }
}