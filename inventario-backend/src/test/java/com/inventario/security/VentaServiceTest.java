package com.inventario.security;
import com.inventario.entity.Usuario;
import com.inventario.entity.Venta;
import com.inventario.repository.VentaRepository;
import com.inventario.service.VentaService;
import org.testng.annotations.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import java.math.BigDecimal;
import java.util.List;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class VentaServiceTest {

    @Mock
    private VentaRepository ventaRepository;

    @InjectMocks
    private VentaService ventaService;

    @Test
    void debeCalcularElTotalDeVentasPorCliente() {
        // 1. Arrange (Preparar)
        Integer clienteId = 1;
        Usuario cliente = new Usuario();
        cliente.setIdUsuario(clienteId);

        Venta venta1 = new Venta();
        venta1.setTotal(new BigDecimal("100.00"));
        venta1.setCliente(cliente);

        Venta venta2 = new Venta();
        venta2.setTotal(new BigDecimal("50.50"));
        venta2.setCliente(cliente);

        // Simular el comportamiento del repositorio
        when(ventaRepository.findByCliente_IdUsuario(clienteId)).thenReturn(List.of(venta1, venta2));

        // 2. Act (Actuar)
        // Este método aún no existe, por lo que el código no compilará (ROJO)
        BigDecimal totalVentas = ventaService.calcularTotalVentasPorCliente(clienteId);

        // 3. Assert (Verificar)
        assertEquals(new BigDecimal("150.50"), totalVentas);
    }
}