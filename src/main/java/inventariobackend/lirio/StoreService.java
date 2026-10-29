package inventariobackend.lirio;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import inventariobackend.entity.*;
import inventariobackend.repository.*;
import jakarta.persistence.EntityManager;
import jakarta.persistence.LockModeType;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.multipart.MultipartFile;
import java.math.*;
import java.time.*;
import java.util.*;
import java.util.stream.Collectors;
import static inventariobackend.lirio.LirioDtos.*;

@Service @RequiredArgsConstructor @Transactional(readOnly=true)
public class StoreService {
    private final ProductoRepository products;
    private final PedidoRepository orders;
    private final UsuarioRepository users;
    private final CategoriaRepository categories;
    private final MarcaRepository brands;
    private final ProveedorRepository suppliers;
    private final CompraRepository purchases;
    private final KardexRepository movements;
    private final SettingsRepository settings;
    private final ReceiptStorage receipts;
    private final ObjectMapper json;
    private final EntityManager em;

    static ResponseStatusException invalid(String message) { return new ResponseStatusException(HttpStatus.BAD_REQUEST, message); }
    static ResponseStatusException missing() { return new ResponseStatusException(HttpStatus.NOT_FOUND, "Registro no encontrado"); }
    static BigDecimal money(BigDecimal n) { return n.setScale(2, RoundingMode.HALF_UP); }
    public static BigDecimal price(Producto p) {
        int discount = p.getDescuentoPorcentaje() == null ? 0 : p.getDescuentoPorcentaje();
        return money(p.getPrecioVenta().multiply(BigDecimal.valueOf(100-discount)).divide(BigDecimal.valueOf(100)));
    }
    Ref ref(Categoria c) { return new Ref(c.getIdCategoria(), c.getNombreCategoria()); }
    Ref ref(Marca m) { return new Ref(m.getIdMarca(), m.getNombreMarca()); }
    Ref ref(Proveedor p) { return p == null ? null : new Ref(p.getIdProveedor(), p.getNombreProveedor()); }
    ProductView product(Producto p, boolean admin) {
        return new ProductView(p.getIdProducto(),p.getCodigoProducto(),p.getNombreProducto(),p.getDescripcion(),
                price(p),p.getPrecioVenta(),admin?p.getPrecioCompra():null,
                p.getDescuentoPorcentaje()==null?0:p.getDescuentoPorcentaje(),p.getStockActual(),p.getStockMinimo(),
                p.getUrlImagen(),ref(p.getCategoria()),ref(p.getMarca()),admin?ref(p.getProveedor()):null,Boolean.TRUE.equals(p.getActivo()));
    }
    public List<ProductView> catalog(boolean admin) {
        return (admin ? products.findAll() : products.findByActivoTrue()).stream().sorted(Comparator.comparing(Producto::getIdProducto))
                .map(p -> product(p, admin)).toList();
    }
    public ProductView detail(Integer id) {
        Producto p = products.findById(id).filter(v -> Boolean.TRUE.equals(v.getActivo())).orElseThrow(StoreService::missing);
        return product(p, false);
    }
    public Map<String,Object> references() {
        return Map.of("categorias",categories.findAll().stream().map(this::ref).toList(),
                "marcas",brands.findAll().stream().map(this::ref).toList(),
                "proveedores",suppliers.findAll().stream().filter(p -> Boolean.TRUE.equals(p.getActivo())).map(this::ref).toList());
    }
    @Transactional public ProductView saveProduct(Integer id, ProductInput data) {
        Producto p = id == null ? new Producto() : products.lockById(id).orElseThrow(StoreService::missing);
        if (id == null && products.existsByCodigoProducto(data.codigo().trim())) throw invalid("Ya existe un producto con ese código");
        if (id != null && !Objects.equals(p.getStockActual(),data.stock())) throw invalid("Usa Ajustar stock para registrar un cambio con su motivo");
        if (data.imagen()!=null && !data.imagen().isBlank() && !data.imagen().matches("^/uploads/productos/[a-zA-Z0-9_.-]+\\.(jpg|jpeg|png|webp)$"))
            throw invalid("Selecciona una imagen de la biblioteca de productos");
        p.setCodigoProducto(data.codigo().trim()); p.setNombreProducto(data.nombre().trim()); p.setDescripcion(data.descripcion());
        p.setPrecioCompra(data.costo()); p.setPrecioVenta(data.precio()); p.setDescuentoPorcentaje(data.descuento());
        p.setStockMinimo(data.stockMinimo()); p.setUrlImagen(data.imagen());
        p.setCategoria(categories.findById(data.categoriaId()).orElseThrow(StoreService::missing));
        p.setMarca(brands.findById(data.marcaId()).orElseThrow(StoreService::missing));
        p.setProveedor(data.proveedorId()==null?null:suppliers.findById(data.proveedorId()).orElseThrow(StoreService::missing));
        if (id==null) { p.setActivo(true); p.setStockActual(data.stock()); }
        products.saveAndFlush(p);
        if (id==null && data.stock()>0) movement(p,data.stock(),"Saldo inicial");
        return product(p,true);
    }
    @Transactional public void archiveProduct(Integer id) {
        Producto p = products.lockById(id).orElseThrow(StoreService::missing);
        p.setActivo(false); products.save(p);
    }
    @Transactional public void restoreProduct(Integer id) {
        Producto p=products.lockById(id).orElseThrow(StoreService::missing);
        p.setActivo(true); products.save(p);
    }
    @Transactional public Ref category(NameInput data) {
        Categoria c=new Categoria(); c.setNombreCategoria(data.nombre().trim());
        return ref(categories.saveAndFlush(c));
    }
    @Transactional public Ref brand(NameInput data) {
        Marca m=new Marca(); m.setNombreMarca(data.nombre().trim());
        return ref(brands.saveAndFlush(m));
    }
    @Transactional public ProductView adjust(Integer id, Adjustment data) {
        Producto p = products.lockById(id).orElseThrow(StoreService::missing);
        if (data.cantidad()==0 || (long)p.getStockActual()+data.cantidad()<0 || (long)p.getStockActual()+data.cantidad()>1000000)
            throw invalid("El ajuste debe ser distinto de cero y el stock final debe estar entre 0 y 1 000 000");
        p.setStockActual(p.getStockActual()+data.cantidad()); products.save(p);
        movement(p,data.cantidad(),"Ajuste: "+data.motivo());
        return product(p,true);
    }
    void movement(Producto p,int qty,String reason) {
        movements.save(Kardex.builder().producto(p).cantidad(qty).stockResultante(p.getStockActual())
                .fecha(LocalDateTime.now()).tipoMovimiento(reason.substring(0,Math.min(200,reason.length()))).build());
    }
    List<OrderLine> lines(Pedido p) {
        if (p.getProductos()==null) return List.of();
        try { return json.readValue(p.getProductos(),new TypeReference<List<OrderLine>>(){}); }
        catch (Exception e) { throw new IllegalStateException("El pedido no tiene un detalle compatible: "+p.getId(),e); }
    }
    public OrderView order(Pedido p,boolean admin) {
        List<OrderLine> items=lines(p).stream().map(l -> new OrderLine(l.productoId(),l.nombre(),l.imagen(),l.categoria(),
                l.cantidad(),l.precio(),admin?l.costo():null,l.subtotal())).toList();
        return new OrderView(p.getId(),"LIR-"+String.format("%05d",p.getId()),p.getClienteNombre(),p.getClienteEmail(),p.getTelefono(),
                p.getDireccion(),p.getTotal(),p.getMetodoPago(),p.getEstado(),p.getComprobanteUrl()!=null,p.getFechaCreacion(),items);
    }
    public List<OrderView> orderList(String email,boolean admin) {
        return (admin?orders.findAll():orders.findByClienteEmailOrderByFechaCreacionDesc(email)).stream()
                .sorted(Comparator.comparing(Pedido::getFechaCreacion).reversed()).map(p -> order(p,admin)).toList();
    }
    public Pedido ownedOrder(Integer id,String email,boolean admin) {
        Pedido p=orders.findById(id).orElseThrow(StoreService::missing);
        if (!admin && !p.getClienteEmail().equals(email)) throw new ResponseStatusException(HttpStatus.FORBIDDEN,"Este pedido pertenece a otra cuenta");
        return p;
    }
    @Transactional public OrderView checkout(OrderInput data,String email,MultipartFile receipt,boolean pos) {
        Usuario user=users.findByEmail(email).orElseThrow(StoreService::missing);
        // Serialize retries from the same account before checking its idempotency key.
        em.lock(user,LockModeType.PESSIMISTIC_WRITE);
        String key=user.getIdUsuario()+":"+data.clave();
        Optional<Pedido> existing=orders.findByIdempotencyKey(key);
        String fingerprint;
        try { fingerprint=AuthApi.digest(json.writeValueAsString(data)); } catch(Exception e) { throw new IllegalStateException(e); }
        if (existing.isPresent()) {
            if(!Objects.equals(fingerprint,existing.get().getRequestHash()))
                throw new ResponseStatusException(HttpStatus.CONFLICT,"La clave del pedido ya se usó con otros datos. Actualiza la página.");
            return order(existing.get(),pos);
        }
        if (!pos && !"EFECTIVO".equals(data.metodoPago()) && (receipt==null || receipt.isEmpty()))
            throw invalid("Adjunta el comprobante del pago para que lo revise el administrador");
        TreeMap<Integer,Integer> quantities=new TreeMap<>();
        for (Item item:data.items()) quantities.merge(item.productoId(),item.cantidad(),Integer::sum);
        List<OrderLine> details=new ArrayList<>(); BigDecimal total=BigDecimal.ZERO;
        for (var item:quantities.entrySet()) {
            Producto p=products.lockById(item.getKey()).filter(v -> Boolean.TRUE.equals(v.getActivo())).orElseThrow(StoreService::missing);
            if (item.getValue()>10000 || p.getStockActual()<item.getValue()) throw invalid("Stock insuficiente para "+p.getNombreProducto());
            BigDecimal unit=price(p), sub=money(unit.multiply(BigDecimal.valueOf(item.getValue())));
            details.add(new OrderLine(p.getIdProducto(),p.getNombreProducto(),p.getUrlImagen(),p.getCategoria().getNombreCategoria(),item.getValue(),unit,p.getPrecioCompra(),sub));
            total=total.add(sub);
        }
        if (total.compareTo(new BigDecimal("99999999.99"))>0) throw invalid("El importe supera el máximo permitido");
        if (total.compareTo(data.totalEsperado())!=0)
            throw new ResponseStatusException(HttpStatus.CONFLICT,"Los precios han cambiado. Actualiza tu bolsa y revisa el nuevo total antes de confirmar.");
        Pedido p=new Pedido(); p.setIdempotencyKey(key); p.setRequestHash(fingerprint); p.setClienteEmail(email); p.setClienteNombre(data.nombre().trim());
        p.setTelefono(data.telefono()); p.setDireccion(data.direccion()); p.setMetodoPago(data.metodoPago());
        p.setTotal(money(total)); p.setEstado(pos?"APROBADO":"PENDIENTE_VALIDACION");
        try { p.setProductos(json.writeValueAsString(details)); } catch (Exception e) { throw new IllegalStateException(e); }
        if (receipt!=null && !receipt.isEmpty()) p.setComprobanteUrl(receipts.store(receipt));
        orders.saveAndFlush(p);
        for (OrderLine l:details) {
            Producto product=products.findById(l.productoId()).orElseThrow();
            product.setStockActual(product.getStockActual()-l.cantidad()); products.save(product);
            movement(product,-l.cantidad(),(pos?"Venta ":"Reserva ")+"LIR-"+p.getId());
        }
        return order(p,pos);
    }
    @Transactional public OrderView transition(Integer id,String target) {
        Pedido p=orders.lockById(id).orElseThrow(StoreService::missing);
        if (target.equals(p.getEstado())) return order(p,true);
        if (!"PENDIENTE_VALIDACION".equals(p.getEstado()))
            throw new ResponseStatusException(HttpStatus.CONFLICT,"Solo se pueden aprobar o rechazar pedidos pendientes");
        if (!Set.of("APROBADO","RECHAZADO").contains(target)) throw invalid("Estado inválido");
        if ("RECHAZADO".equals(target)) {
            for (OrderLine l:lines(p).stream().sorted(Comparator.comparing(OrderLine::productoId)).toList()) {
                Producto product=products.lockById(l.productoId()).orElseThrow(StoreService::missing);
                product.setStockActual(product.getStockActual()+l.cantidad()); products.save(product);
                movement(product,l.cantidad(),"Reversión LIR-"+id);
            }
        }
        p.setEstado(target); orders.save(p);
        return order(p,true);
    }
    SupplierView supplier(Proveedor p) { return new SupplierView(p.getIdProveedor(),p.getNombreProveedor(),p.getRuc(),p.getTelefono(),p.getEmail(),p.getDireccion(),Boolean.TRUE.equals(p.getActivo())); }
    public List<SupplierView> supplierList() { return suppliers.findAll().stream().map(this::supplier).toList(); }
    @Transactional public SupplierView saveSupplier(Integer id,SupplierInput data) {
        Proveedor p=id==null?new Proveedor():suppliers.findById(id).orElseThrow(StoreService::missing);
        p.setNombreProveedor(data.nombre().trim()); p.setRuc(data.ruc()); p.setTelefono(data.telefono()); p.setEmail(data.email());
        p.setDireccion(data.direccion()); p.setActivo(true);
        return supplier(suppliers.save(p));
    }
    public Map<String,Object> purchase(Compra c) {
        return Map.of("id",c.getIdCompra(),"numero",c.getNumeroCompra(),"proveedor",ref(c.getProveedor()),
                "fecha",c.getFechaCompra(),"total",c.getTotal(),"estado",c.getEstado().name(),
                "observaciones",c.getObservaciones()==null?"":c.getObservaciones(),
                "items",c.getDetalles().stream().map(d -> Map.of("productoId",d.getProducto().getIdProducto(),
                        "nombre",d.getProducto().getNombreProducto(),"cantidad",d.getCantidad(),"costo",d.getPrecioUnitario(),"subtotal",d.getSubtotal())).toList());
    }
    public List<Map<String,Object>> purchaseList() { return purchases.findAll().stream().sorted(Comparator.comparing(Compra::getIdCompra).reversed()).map(this::purchase).toList(); }
    @Transactional public Map<String,Object> createPurchase(PurchaseInput data,String email) {
        Compra c=new Compra(); c.setProveedor(suppliers.findById(data.proveedorId()).filter(p -> Boolean.TRUE.equals(p.getActivo())).orElseThrow(StoreService::missing));
        c.setUsuario(users.findByEmail(email).orElseThrow()); c.setFechaCompra(LocalDate.now());
        c.setNumeroCompra("OC-"+UUID.randomUUID().toString().substring(0,12).toUpperCase(Locale.ROOT)); c.setObservaciones(data.observaciones());
        List<DetalleCompra> details=new ArrayList<>(); BigDecimal total=BigDecimal.ZERO;
        Set<Integer> seen=new HashSet<>();
        for (PurchaseLineInput l:data.items()) {
            if (!seen.add(l.productoId())) throw invalid("Agrega cada producto una sola vez");
            Producto p=products.findById(l.productoId()).orElseThrow(StoreService::missing);
            DetalleCompra d=new DetalleCompra(); d.setCompra(c); d.setProducto(p); d.setCantidad(l.cantidad());
            d.setPrecioUnitario(l.costo()); d.setSubtotal(money(l.costo().multiply(BigDecimal.valueOf(l.cantidad()))));
            total=total.add(d.getSubtotal()); details.add(d);
        }
        if (total.compareTo(new BigDecimal("99999999.99"))>0) throw invalid("El importe supera el máximo permitido");
        c.setDetalles(details); c.setSubtotal(total); c.setIgv(BigDecimal.ZERO); c.setTotal(total);
        return purchase(purchases.save(c));
    }
    @Transactional public Map<String,Object> receivePurchase(Integer id) {
        Compra c=purchases.lockById(id).orElseThrow(StoreService::missing);
        if (c.getEstado()==Compra.EstadoCompra.RECIBIDA) return purchase(c);
        if (c.getEstado()!=Compra.EstadoCompra.PENDIENTE) throw invalid("La compra ya no está pendiente");
        for (DetalleCompra d:c.getDetalles().stream().sorted(Comparator.comparing(l -> l.getProducto().getIdProducto())).toList()) {
            Producto p=products.lockById(d.getProducto().getIdProducto()).orElseThrow();
            if ((long)p.getStockActual()+d.getCantidad()>1000000) throw invalid("El stock final supera el máximo permitido");
            p.setStockActual(p.getStockActual()+d.getCantidad()); p.setPrecioCompra(d.getPrecioUnitario()); products.save(p);
            movement(p,d.getCantidad(),"Compra "+c.getNumeroCompra());
        }
        c.setEstado(Compra.EstadoCompra.RECIBIDA); purchases.save(c); return purchase(c);
    }
    @Transactional public Map<String,Object> cancelPurchase(Integer id) {
        Compra c=purchases.lockById(id).orElseThrow(StoreService::missing);
        if(c.getEstado()==Compra.EstadoCompra.RECIBIDA) throw invalid("No se puede cancelar una compra recibida");
        c.setEstado(Compra.EstadoCompra.CANCELADA); return purchase(purchases.save(c));
    }
    public List<Map<String,Object>> customerList() {
        List<Pedido> all=orders.findAll();
        return users.findByRolNombreRol("CLIENTE").stream().map(u -> {
            List<Pedido> approved=all.stream().filter(p -> u.getEmail().equals(p.getClienteEmail()) && "APROBADO".equals(p.getEstado())).toList();
            Map<String,Object> data=new LinkedHashMap<>(); data.put("user",AuthApi.view(u)); data.put("pedidos",approved.size());
            data.put("compras",approved.stream().map(Pedido::getTotal).reduce(BigDecimal.ZERO,BigDecimal::add)); return data;
        }).toList();
    }
    public List<Map<String,Object>> kardex() {
        return movements.findAll().stream().sorted(Comparator.comparing(Kardex::getFecha).reversed()).limit(500)
                .map(k -> Map.<String,Object>of("id",k.getIdKardex(),"producto",k.getProducto().getNombreProducto(),
                        "cantidad",k.getCantidad(),"stock",k.getStockResultante(),"motivo",k.getTipoMovimiento(),"fecha",k.getFecha())).toList();
    }
    public BusinessSettings business() { return settings.findById(1).orElseGet(BusinessSettings::new); }
    @Transactional public BusinessSettings saveBusiness(BusinessInput data) {
        BusinessSettings b=business(); b.setNombre(data.nombre()); b.setTelefono(data.telefono()); b.setDireccion(data.direccion()); b.setHorario(data.horario());
        return settings.save(b);
    }
    public Map<String,Object> summary(int days) {
        if (!Set.of(7,30,90).contains(days)) throw invalid("El período debe ser de 7, 30 o 90 días");
        LocalDate today=LocalDate.now(ZoneId.of("America/Lima")), start=today.minusDays(days-1);
        List<Pedido> all=orders.findAll();
        List<Pedido> selected=all.stream().filter(p -> !p.getFechaCreacion().toLocalDate().isBefore(start) && !p.getFechaCreacion().toLocalDate().isAfter(today)).toList();
        List<Pedido> approved=selected.stream().filter(p -> "APROBADO".equals(p.getEstado())).toList();
        BigDecimal revenue=approved.stream().map(Pedido::getTotal).reduce(BigDecimal.ZERO,BigDecimal::add);
        BigDecimal cost=approved.stream().flatMap(p -> lines(p).stream()).map(l -> l.costo().multiply(BigDecimal.valueOf(l.cantidad()))).reduce(BigDecimal.ZERO,BigDecimal::add);
        List<Producto> active=products.findByActivoTrue();
        BigDecimal value=active.stream().map(p -> p.getPrecioCompra().multiply(BigDecimal.valueOf(p.getStockActual()))).reduce(BigDecimal.ZERO,BigDecimal::add);
        List<Map<String,Object>> chart=new ArrayList<>();
        for(int i=0;i<days;i++) {
            LocalDate d=start.plusDays(i);
            BigDecimal sum=approved.stream().filter(p -> p.getFechaCreacion().toLocalDate().equals(d)).map(Pedido::getTotal).reduce(BigDecimal.ZERO,BigDecimal::add);
            chart.add(Map.of("fecha",d,"total",sum));
        }
        Map<String,BigDecimal> categoryTotals=new LinkedHashMap<>();
        Map<Integer,Integer> counts=new HashMap<>();
        for(Pedido p:approved) for(OrderLine l:lines(p)) {
            categoryTotals.merge(l.categoria(),l.subtotal(),BigDecimal::add);
            counts.merge(l.productoId(),l.cantidad(),Integer::sum);
        }
        List<Map<String,Object>> top=counts.entrySet().stream().sorted(Map.Entry.<Integer,Integer>comparingByValue().reversed()).limit(4)
                .map(e -> { Producto p=products.findById(e.getKey()).orElseThrow(); return Map.<String,Object>of("producto",product(p,true),"unidades",e.getValue()); }).toList();
        Map<String,Object> result=new LinkedHashMap<>();
        result.put("desde",start); result.put("hasta",today); result.put("ventas",revenue); result.put("margenBruto",money(revenue.subtract(cost)));
        result.put("pedidosAprobados",approved.size()); result.put("pedidosPendientes",all.stream().filter(p -> "PENDIENTE_VALIDACION".equals(p.getEstado())).count());
        result.put("productos",active.size()); result.put("stockBajo",active.stream().filter(p -> p.getStockActual()<=p.getStockMinimo()).map(p -> product(p,true)).toList());
        result.put("valorInventario",value); result.put("clientes",users.countByRolNombreRol("CLIENTE"));
        result.put("ticketPromedio",approved.isEmpty()?BigDecimal.ZERO:revenue.divide(BigDecimal.valueOf(approved.size()),2,RoundingMode.HALF_UP));
        result.put("grafico",chart); result.put("categorias",categoryTotals); result.put("destacados",top);
        result.put("recientes",selected.stream().sorted(Comparator.comparing(Pedido::getFechaCreacion).reversed()).limit(5).map(p -> order(p,true)).toList());
        return result;
    }
}
