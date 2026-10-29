package inventariobackend.lirio;

import inventariobackend.repository.*;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest(properties={
    "spring.datasource.url=jdbc:h2:mem:preview-tests;MODE=MySQL;DB_CLOSE_DELAY=-1",
    "lirio.sample-catalog=true",
    "lirio.bootstrap-email=preview-test@ejemplo.local",
    "lirio.bootstrap-password=PreviewTestPassword2026!"
})
@ActiveProfiles({"test","preview"})
class PreviewCatalogTests {
    @Autowired ProductoRepository products;
    @Autowired UsuarioRepository users;
    @Autowired PedidoRepository orders;
    @Autowired StoreApi api;

    @Test void publicPreviewSeedsOnlyCatalogAndConfiguredAdministrator() {
        assertEquals(24,products.count());
        assertEquals(1,users.count());
        assertTrue(users.existsByEmail("preview-test@ejemplo.local"));
        assertFalse(users.existsByEmail("admin@lirio.local"));
        assertFalse(users.existsByEmail("cliente@lirio.local"));
        assertEquals(0,orders.count());
        assertEquals(true,api.health().get("demo"));
        assertEquals(false,api.health().get("demoAccounts"));
    }
}
