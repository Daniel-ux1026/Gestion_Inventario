package inventariobackend.lirio;

import inventariobackend.entity.*;
import inventariobackend.repository.*;
import jakarta.persistence.EntityManager;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.core.env.Environment;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.math.BigDecimal;
import java.time.*;
import java.util.*;
import static inventariobackend.lirio.LirioDtos.*;

@Component @RequiredArgsConstructor
public class BootstrapData implements ApplicationRunner {
    private final RolRepository roles;
    private final UsuarioRepository users;
    private final CategoriaRepository categories;
    private final MarcaRepository brands;
    private final ProveedorRepository suppliers;
    private final ProductoRepository products;
    private final PedidoRepository orders;
    private final SettingsRepository settings;
    private final PasswordEncoder encoder;
    private final Environment env;
    private final ObjectMapper json;
    @Value("${lirio.bootstrap-email:}") private String adminEmail;
    @Value("${lirio.bootstrap-password:}") private String adminPassword;

    @Override @Transactional public void run(ApplicationArguments args) throws Exception {
        for(String name:List.of("ADMIN","CLIENTE")) if(roles.findByNombreRol(name).isEmpty()) {
            Rol r=new Rol(); r.setNombreRol(name); roles.save(r);
        }
        if(!settings.existsById(1)) settings.save(new BusinessSettings());
        if(!adminEmail.isBlank() && users.findByEmail(adminEmail.toLowerCase(Locale.ROOT)).isEmpty()) {
            if(adminPassword.length()<12) throw new IllegalArgumentException("ADMIN_PASSWORD necesita al menos 12 caracteres");
            user("Daniel","Administrador",adminEmail.toLowerCase(Locale.ROOT),adminPassword,"ADMIN");
        }
        boolean demo=env.matchesProfiles("demo");
        boolean sampleCatalog=env.getProperty("lirio.sample-catalog",Boolean.class,false);
        if((!demo && !sampleCatalog) || products.count()>0) return;
        if(demo && !users.existsByEmail("cliente@lirio.local")) user("María","Cliente","cliente@lirio.local","ClienteDemo2026!","CLIENTE");
        String[] names={"Abarrotes","Conservas","Café y desayuno","Limpieza"};
        List<Categoria> cats=new ArrayList<>();
        for(String name:names) { Categoria c=new Categoria(); c.setNombreCategoria(name); cats.add(categories.save(c)); }
        Marca brand=new Marca(); brand.setNombreMarca("Selección El Lirio"); brand=brands.save(brand);
        Proveedor supplier=new Proveedor(); supplier.setNombreProveedor("Distribuidora de muestra");
        supplier.setRuc("20000000001"); supplier.setTelefono("900000000"); supplier.setEmail("proveedor@ejemplo.local"); supplier=suppliers.save(supplier);
        String[][] data={
            {"Arroz Costeño","Arroz superior · bolsa 1 kg","4.80","3.60","arroz-costeno.jpg","0","12","80"},
            {"Aceite Primor","Aceite vegetal · botella 500 ml","10.90","8.20","aceite.jpg","0","0","45"},
            {"Filete de atún Florida","En aceite vegetal · lata 170 g","6.90","5.00","atun_florida.jpg","1","15","62"},
            {"Linguini Don Vittorio","Pasta de trigo · paquete 500 g","4.50","3.10","linguini-donvittorio.jpg","0","10","54"},
            {"Café Altomayo","Café instantáneo · frasco 50 g","12.90","9.00","cafe_altomayo.jpg","2","0","32"},
            {"Detergente Bolívar","Color Protect · bolsa 2.4 kg","4.20","2.90","bolivar.jpg","3","0","7"},
            {"Arroz Faraón","Arroz extra · bolsa 1 kg","5.20","3.80","arroz_faraon.jpg","0","0","46"},
            {"Aceite Deleite","Aceite vegetal · botella 1 L","8.90","6.40","aceite-deleite.jpg","0","10","38"},
            {"Atún Campomar","Trozos de atún · lata 170 g","6.50","4.50","atun-campomar.jpg","1","0","41"},
            {"Fideos Nicolini","Pasta clásica · paquete 500 g","3.50","2.20","fideo-nicolini.jpg","0","0","75"},
            {"Café Villa Rica","Café peruano · bolsa 250 g","18.90","13.50","cafe_villa_rica.jpg","2","15","24"},
            {"Limpiador Sapolio","Limpieza para tu hogar","7.90","5.30","sapolio.jpg","3","0","6"},
            {"Aceite de oliva Olivar","Sabor para tus ensaladas","19.90","14.90","aceite-olivar.jpg","0","0","26"},
            {"Arroz Bells integral","Arroz integral · bolsa 5 kg","4.50","3.20","arroz_bells.jpg","0","0","56"},
            {"Atún Gloria","Trozos en aceite · lata 170 g","6.20","4.40","atun_gloria.jpg","1","10","35"},
            {"Café Artidoro","Café de origen peruano","21.90","16.00","cafe_artidoro.jpg","2","0","18"},
            {"Detergente Opal","Cuidado para tu ropa","3.90","2.50","opal.jpg","3","0","48"},
            {"Atún Real","Atún seleccionado · lata 170 g","6.80","4.90","atun_real.jpg","1","0","40"},
            {"Fideo Macarrón","Pasta corta · paquete 500 g","3.90","2.60","fideo-macarron.jpg","0","0","43"},
            {"Aceite La Patrona","Aceite vegetal · botella 5 L","3.50","2.20","patrona.jpg","0","0","9"},
            {"Arroz Paisana","Arroz de grano largo · 1 kg","4.90","3.60","arroz-paisana.jpg","0","10","55"},
            {"Atún San Jorge","Trozos de atún · lata 170 g","5.90","4.20","atun-sanjorge.jpg","1","0","37"},
            {"Atún Marinero","Atún al natural · lata 170 g","5.50","3.90","atun-marinero.jpg","1","0","33"},
            {"Aceite Cocinero","Para tus recetas de cada día","8.20","6.10","aceite-primor.jpg","0","0","42"}
        };
        List<Producto> saved=new ArrayList<>();
        for(int i=0;i<data.length;i++) {
            String[] row=data[i]; Producto p=new Producto(); p.setCodigoProducto(String.format("LIR-%03d",i+1)); p.setNombreProducto(row[0]); p.setDescripcion(row[1]);
            p.setPrecioVenta(new BigDecimal(row[2])); p.setPrecioCompra(new BigDecimal(row[3])); p.setUrlImagen("/uploads/productos/"+row[4]);
            p.setCategoria(cats.get(Integer.parseInt(row[5]))); p.setDescuentoPorcentaje(Integer.parseInt(row[6]));
            p.setStockActual(Integer.parseInt(row[7])); p.setStockMinimo(10); p.setMarca(brand); p.setProveedor(supplier); saved.add(products.save(p));
        }
        // Sample historical orders are explicit demo fixtures, never loaded into a production profile.
        if(!demo) return;
        for(int day=6;day>=0;day--) {
            int count=new int[]{3,2,4,3,5,3,4}[6-day];
            for(int j=0;j<count;j++) {
                Producto a=saved.get((day+j)%5), b=saved.get((day+j+2)%5); int qty=j+2;
                List<OrderLine> lines=List.of(new OrderLine(a.getIdProducto(),a.getNombreProducto(),a.getUrlImagen(),a.getCategoria().getNombreCategoria(),qty,StoreService.price(a),a.getPrecioCompra(),StoreService.price(a).multiply(BigDecimal.valueOf(qty))),
                        new OrderLine(b.getIdProducto(),b.getNombreProducto(),b.getUrlImagen(),b.getCategoria().getNombreCategoria(),2,StoreService.price(b),b.getPrecioCompra(),StoreService.price(b).multiply(BigDecimal.valueOf(2))));
                Pedido p=new Pedido(); p.setClienteNombre(j%2==0?"María Cliente":"Cliente de muestra"); p.setClienteEmail("cliente@lirio.local");
                p.setTelefono("900000000"); p.setDireccion("Recojo en tienda"); p.setTotal(lines.stream().map(OrderLine::subtotal).reduce(BigDecimal.ZERO,BigDecimal::add));
                p.setMetodoPago(j%2==0?"EFECTIVO":"YAPE"); p.setEstado(day==0 && j==0?"PENDIENTE_VALIDACION":"APROBADO");
                p.setProductos(json.writeValueAsString(lines)); orders.saveAndFlush(p);
                p.setFechaCreacion(LocalDate.now(ZoneId.of("America/Lima")).minusDays(day).atTime(9+j*2,15)); orders.save(p);
            }
        }
    }
    private void user(String name,String surname,String email,String password,String role) {
        Usuario u=new Usuario(); u.setNombre(name); u.setApellido(surname); u.setEmail(email); u.setPassword(encoder.encode(password));
        u.setTelefono("900000000"); u.setRol(roles.findByNombreRol(role).orElseThrow()); users.save(u);
    }
}
