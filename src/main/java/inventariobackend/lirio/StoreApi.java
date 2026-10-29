package inventariobackend.lirio;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.core.env.Environment;
import org.springframework.core.io.Resource;
import org.springframework.http.*;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.util.*;
import static inventariobackend.lirio.LirioDtos.*;

@RestController @RequestMapping("/api/v1") @RequiredArgsConstructor
public class StoreApi {
    private final StoreService store;
    private final ReceiptStorage receipts;
    private final Environment environment;
    boolean admin(Authentication a) { return a.getAuthorities().stream().anyMatch(g -> "ROLE_ADMIN".equals(g.getAuthority())); }
    @GetMapping("/health") public Map<String,Object> health() {
        return Map.of("status","ok","demo",Arrays.asList(environment.getActiveProfiles()).contains("demo") || (environment.getActiveProfiles().length==0 && Arrays.asList(environment.getDefaultProfiles()).contains("demo")));
    }
    @GetMapping("/business") public BusinessSettings business() { return store.business(); }
    @GetMapping("/catalog") public List<ProductView> catalog() { return store.catalog(false); }
    @GetMapping("/catalog/{id}") public ProductView detail(@PathVariable Integer id) { return store.detail(id); }
    @GetMapping("/orders") public List<OrderView> orders(Authentication a) { return store.orderList(a.getName(),false); }
    @PostMapping(value="/orders",consumes=MediaType.MULTIPART_FORM_DATA_VALUE)
    @ResponseStatus(HttpStatus.CREATED)
    public OrderView checkout(@Valid @RequestPart("data") OrderInput data,@RequestPart(value="receipt",required=false) MultipartFile receipt,Authentication a) {
        return store.checkout(data,a.getName(),receipt,false);
    }
    @GetMapping("/orders/{id}/receipt") public ResponseEntity<Resource> receipt(@PathVariable Integer id,Authentication a) {
        var p=store.ownedOrder(id,a.getName(),admin(a));
        return ResponseEntity.ok().contentType(MediaType.IMAGE_PNG).cacheControl(CacheControl.noStore())
                .header("X-Content-Type-Options","nosniff").body(receipts.read(p.getComprobanteUrl()));
    }
    @GetMapping("/admin/products") public List<ProductView> products() { return store.catalog(true); }
    @GetMapping("/admin/references") public Map<String,Object> references() { return store.references(); }
    @PostMapping("/admin/products") @ResponseStatus(HttpStatus.CREATED)
    public ProductView createProduct(@Valid @RequestBody ProductInput data) { return store.saveProduct(null,data); }
    @PutMapping("/admin/products/{id}") public ProductView updateProduct(@PathVariable Integer id,@Valid @RequestBody ProductInput data) { return store.saveProduct(id,data); }
    @DeleteMapping("/admin/products/{id}") @ResponseStatus(HttpStatus.NO_CONTENT)
    public void archive(@PathVariable Integer id) { store.archiveProduct(id); }
    @PostMapping("/admin/products/{id}/adjust") public ProductView adjust(@PathVariable Integer id,@Valid @RequestBody Adjustment data) { return store.adjust(id,data); }
    @PostMapping("/admin/products/{id}/restore") @ResponseStatus(HttpStatus.NO_CONTENT)
    public void restore(@PathVariable Integer id) { store.restoreProduct(id); }
    @PostMapping("/admin/categories") @ResponseStatus(HttpStatus.CREATED)
    public Ref category(@Valid @RequestBody NameInput data) { return store.category(data); }
    @PostMapping("/admin/brands") @ResponseStatus(HttpStatus.CREATED)
    public Ref brand(@Valid @RequestBody NameInput data) { return store.brand(data); }
    @GetMapping("/admin/orders") public List<OrderView> allOrders(Authentication a) { return store.orderList(a.getName(),true); }
    @PostMapping("/admin/orders/{id}/approve") public OrderView approve(@PathVariable Integer id) { return store.transition(id,"APROBADO"); }
    @PostMapping("/admin/orders/{id}/reject") public OrderView reject(@PathVariable Integer id) { return store.transition(id,"RECHAZADO"); }
    @PostMapping("/admin/sales") @ResponseStatus(HttpStatus.CREATED)
    public OrderView pos(@Valid @RequestBody OrderInput data,Authentication a) { return store.checkout(data,a.getName(),null,true); }
    @GetMapping("/admin/suppliers") public List<SupplierView> suppliers() { return store.supplierList(); }
    @PostMapping("/admin/suppliers") @ResponseStatus(HttpStatus.CREATED)
    public SupplierView supplier(@Valid @RequestBody SupplierInput data) { return store.saveSupplier(null,data); }
    @PutMapping("/admin/suppliers/{id}") public SupplierView supplier(@PathVariable Integer id,@Valid @RequestBody SupplierInput data) { return store.saveSupplier(id,data); }
    @GetMapping("/admin/purchases") public List<Map<String,Object>> purchases() { return store.purchaseList(); }
    @PostMapping("/admin/purchases") @ResponseStatus(HttpStatus.CREATED)
    public Map<String,Object> purchase(@Valid @RequestBody PurchaseInput data,Authentication a) { return store.createPurchase(data,a.getName()); }
    @PostMapping("/admin/purchases/{id}/receive") public Map<String,Object> receive(@PathVariable Integer id) { return store.receivePurchase(id); }
    @PostMapping("/admin/purchases/{id}/cancel") public Map<String,Object> cancel(@PathVariable Integer id) { return store.cancelPurchase(id); }
    @GetMapping("/admin/customers") public List<Map<String,Object>> customers() { return store.customerList(); }
    @GetMapping("/admin/kardex") public List<Map<String,Object>> kardex() { return store.kardex(); }
    @GetMapping("/admin/summary") public Map<String,Object> summary(@RequestParam(defaultValue="7") int days) { return store.summary(days); }
    @PutMapping("/admin/business") public BusinessSettings saveBusiness(@Valid @RequestBody BusinessInput data) { return store.saveBusiness(data); }
}
