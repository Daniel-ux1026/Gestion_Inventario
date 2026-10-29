package inventariobackend.lirio;

import com.fasterxml.jackson.databind.ObjectMapper;
import inventariobackend.entity.*;
import inventariobackend.repository.*;
import inventariobackend.security.JwtUtil;
import jakarta.persistence.EntityManager;
import org.junit.jupiter.api.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.*;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import java.math.BigDecimal;
import java.util.*;
import static inventariobackend.lirio.LirioDtos.*;
import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.user;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest @AutoConfigureMockMvc @ActiveProfiles("test") @Transactional
class StoreIntegrationTests {
    @Autowired MockMvc mvc;
    @Autowired ObjectMapper json;
    @Autowired StoreService store;
    @Autowired UsuarioRepository users;
    @Autowired RolRepository roles;
    @Autowired CategoriaRepository categories;
    @Autowired MarcaRepository brands;
    @Autowired ProveedorRepository suppliers;
    @Autowired ProductoRepository products;
    @Autowired PedidoRepository orders;
    @Autowired KardexRepository movements;
    @Autowired PasswordEncoder encoder;
    @Autowired JwtUtil jwt;
    @Autowired EntityManager em;
    Producto product;
    Proveedor supplier;
    final String email="test-client@lirio.local";

    @BeforeEach void seed() {
        Usuario u=new Usuario();u.setNombre("Cliente");u.setApellido("Pruebas");u.setEmail(email);
        u.setPassword(encoder.encode("Pruebas2026!"));u.setTelefono("900000000");
        u.setRol(roles.findByNombreRol("CLIENTE").orElseThrow());users.save(u);
        Categoria c=new Categoria();c.setNombreCategoria("Pruebas");categories.save(c);
        Marca b=new Marca();b.setNombreMarca("Pruebas");brands.save(b);
        supplier=new Proveedor();supplier.setNombreProveedor("Proveedor prueba");supplier.setRuc("20000000002");suppliers.save(supplier);
        product=new Producto();product.setCodigoProducto("TEST-001");product.setNombreProducto("Arroz de prueba");
        product.setPrecioCompra(new BigDecimal("2.20"));product.setPrecioVenta(new BigDecimal("4.75"));
        product.setDescuentoPorcentaje(10);product.setStockActual(10);product.setStockMinimo(3);
        product.setCategoria(c);product.setMarca(b);product.setProveedor(supplier);products.saveAndFlush(product);
    }
    OrderInput order(int quantity,String key) {
        return new OrderInput("Cliente Pruebas","900000000","Recojo en tienda","EFECTIVO",
                List.of(new Item(product.getIdProducto(),quantity)),key,
                new BigDecimal("4.28").multiply(BigDecimal.valueOf(quantity)));
    }
    OrderView checkout(OrderInput data) { return store.checkout(data,email,null,false); }

    @Test void catalogUsesRoundedDiscountAndHidesCost() throws Exception {
        mvc.perform(get("/api/v1/catalog")).andExpect(status().isOk())
                .andExpect(jsonPath("$[0].precio").value(4.28)).andExpect(jsonPath("$[0].costo").isEmpty());
    }
    @Test void adminEndpointsRejectAnonymousAndCustomer() throws Exception {
        mvc.perform(get("/api/v1/admin/orders")).andExpect(status().isUnauthorized());
        mvc.perform(get("/api/v1/admin/orders").with(user(email).roles("CLIENTE"))).andExpect(status().isForbidden());
        mvc.perform(post("/api/pedidos/1/aprobar")).andExpect(status().isUnauthorized());
    }
    @Test void loginReturnsUsableJwtAndNeverPassword() throws Exception {
        MvcResult result=mvc.perform(post("/api/v1/auth/login").contentType(MediaType.APPLICATION_JSON)
                        .content(json.writeValueAsString(new Login(email,"Pruebas2026!"))))
                .andExpect(status().isOk()).andExpect(jsonPath("$.user.rol").value("CLIENTE"))
                .andExpect(jsonPath("$.user.password").doesNotExist()).andReturn();
        String token=json.readTree(result.getResponse().getContentAsString()).get("token").asText();
        mvc.perform(get("/api/v1/auth/me").header("Authorization","Bearer "+token))
                .andExpect(status().isOk()).andExpect(jsonPath("$.email").value(email));
        mvc.perform(get("/api/v1/admin/orders").header("Authorization","Bearer "+token)).andExpect(status().isForbidden());
    }
    @Test void publicRegistrationCannotChooseAdminOrExistingId() throws Exception {
        mvc.perform(post("/api/v1/auth/register").contentType(MediaType.APPLICATION_JSON)
                .content("{\"nombre\":\"Nuevo\",\"apellido\":\"Cliente\",\"email\":\"nuevo@lirio.local\",\"password\":\"Pruebas2026!\",\"telefono\":\"900000000\",\"rol\":\"ADMIN\",\"id\":1}"))
                .andExpect(status().isCreated()).andExpect(jsonPath("$.user.rol").value("CLIENTE"));
        assertEquals("CLIENTE",users.findByEmail("nuevo@lirio.local").orElseThrow().getRol().getNombreRol());
    }
    @Test void checkoutReservesStockOnceAndStoresTrustedPrices() {
        OrderInput data=order(3,"idempotency-key-001");
        OrderView first=checkout(data),retry=checkout(data);
        assertEquals(first.id(),retry.id());assertEquals(7,product.getStockActual());
        assertEquals(new BigDecimal("12.84"),first.total());
        assertEquals(1,orders.count());assertEquals(1,movements.count());
        assertNull(first.items().getFirst().costo());
    }
    @Test void sameKeyWithDifferentOrderIsRejected() {
        checkout(order(1,"idempotency-key-002"));
        ResponseStatusException e=assertThrows(ResponseStatusException.class,()->checkout(order(2,"idempotency-key-002")));
        assertEquals(409,e.getStatusCode().value());assertEquals(9,product.getStockActual());
    }
    @Test void staleClientTotalCannotChangeServerPrice() {
        OrderInput good=order(2,"idempotency-key-003");
        OrderInput wrong=new OrderInput(good.nombre(),good.telefono(),good.direccion(),good.metodoPago(),good.items(),good.clave(),new BigDecimal("0.02"));
        assertThrows(ResponseStatusException.class,()->checkout(wrong));
        assertEquals(10,product.getStockActual());assertEquals(0,orders.count());
    }
    @Test void insufficientStockLeavesNoPartialOrder() {
        assertThrows(ResponseStatusException.class,()->checkout(order(11,"idempotency-key-004")));
        assertEquals(10,product.getStockActual());assertEquals(0,orders.count());assertEquals(0,movements.count());
    }
    @Test void duplicateProductLinesAreAggregatedBeforeStockCheck() {
        OrderInput data=new OrderInput("Cliente","900000000","Recojo","EFECTIVO",
                List.of(new Item(product.getIdProducto(),7),new Item(product.getIdProducto(),7)),"idempotency-key-005",new BigDecimal("59.92"));
        assertThrows(ResponseStatusException.class,()->checkout(data));assertEquals(10,product.getStockActual());
    }
    @Test void rejectionReturnsStockExactlyOnce() {
        var o=checkout(order(2,"idempotency-key-006"));
        store.transition(o.id(),"RECHAZADO");store.transition(o.id(),"RECHAZADO");
        assertEquals(10,product.getStockActual());assertEquals(2,movements.count());
        assertThrows(ResponseStatusException.class,()->store.transition(o.id(),"APROBADO"));
    }
    @Test void approvalDoesNotSubtractStockAgainAndReportExcludesPending() {
        var a=checkout(order(2,"idempotency-key-007"));checkout(order(1,"idempotency-key-008"));
        assertEquals(BigDecimal.ZERO,store.summary(7).get("ventas"));
        store.transition(a.id(),"APROBADO");store.transition(a.id(),"APROBADO");
        assertEquals(7,product.getStockActual());assertEquals(new BigDecimal("8.56"),store.summary(7).get("ventas"));
        assertEquals(new BigDecimal("4.16"),store.summary(7).get("margenBruto"));
    }
    @Test void digitalOrderRequiresReceipt() {
        OrderInput cash=order(1,"idempotency-key-009");
        OrderInput digital=new OrderInput(cash.nombre(),cash.telefono(),cash.direccion(),"YAPE",cash.items(),cash.clave(),cash.totalEsperado());
        assertThrows(ResponseStatusException.class,()->checkout(digital));assertEquals(10,product.getStockActual());
    }
    @Test void receiptRejectsArbitraryFiles() {
        OrderInput cash=order(1,"idempotency-key-010");
        OrderInput digital=new OrderInput(cash.nombre(),cash.telefono(),cash.direccion(),"YAPE",cash.items(),cash.clave(),cash.totalEsperado());
        var file=new MockMultipartFile("receipt","../payload.svg","image/png","<svg>unsafe</svg>".getBytes());
        assertThrows(ResponseStatusException.class,()->store.checkout(digital,email,file,false));assertEquals(10,product.getStockActual());
    }
    @Test void purchaseOnlyAddsStockWhenReceivedAndOnlyOnce() {
        var p=store.createPurchase(new PurchaseInput(supplier.getIdProveedor(),
                List.of(new PurchaseLineInput(product.getIdProducto(),5,new BigDecimal("2.35"))),"Prueba"),email);
        assertEquals(10,product.getStockActual());
        store.receivePurchase((Integer)p.get("id"));store.receivePurchase((Integer)p.get("id"));
        assertEquals(15,product.getStockActual());assertEquals(1,movements.count());
        assertEquals(new BigDecimal("2.35"),product.getPrecioCompra());
        assertThrows(ResponseStatusException.class,()->store.cancelPurchase((Integer)p.get("id")));
    }
    @Test void adjustmentsCannotMakeStockNegativeAndKeepReason() {
        assertThrows(ResponseStatusException.class,()->store.adjust(product.getIdProducto(),new Adjustment(-11,"Conteo físico")));
        store.adjust(product.getIdProducto(),new Adjustment(-2,"Corrección de conteo físico verificado"));
        assertEquals(8,product.getStockActual());
        assertTrue(movements.findAll().getFirst().getTipoMovimiento().contains("verificado"));
    }
    @Test void userCannotReadAnotherCustomersReceipt() throws Exception {
        var o=checkout(order(1,"idempotency-key-011"));
        mvc.perform(get("/api/v1/orders/"+o.id()+"/receipt").with(user("otro@lirio.local").roles("CLIENTE")))
                .andExpect(status().isForbidden());
    }
    @Test void archivePreservesHistoryAndCanBeRestored() {
        var o=checkout(order(1,"idempotency-key-012"));
        store.archiveProduct(product.getIdProducto());assertTrue(store.catalog(false).isEmpty());
        assertEquals(1,store.orderList(email,false).size());
        store.restoreProduct(product.getIdProducto());assertEquals(1,store.catalog(false).size());
        assertEquals(o.id(),store.orderList(email,false).getFirst().id());
    }
    @Test void orderDatesUseLimaEvenWhenHostUsesUtc() {
        var o=checkout(order(1,"timezone-test-key-001"));
        assertEquals(java.time.LocalDate.now(java.time.ZoneId.of("America/Lima")),o.fecha().toLocalDate());
        store.transition(o.id(),"APROBADO");
        assertEquals(new BigDecimal("4.28"),store.summary(7).get("ventas"));
    }

}
