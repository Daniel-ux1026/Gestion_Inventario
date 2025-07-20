package inventariobackend.controller;

import inventariobackend.entity.Pedido;
import inventariobackend.repository.PedidoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.math.BigDecimal;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/pedidos")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class PedidoController {

    @Autowired
    private PedidoRepository pedidoRepository;

    @PostMapping
    public ResponseEntity<?> crearPedido(
            @RequestParam("clienteNombre") String clienteNombre,
            @RequestParam("clienteEmail") String clienteEmail,
            @RequestParam("total") BigDecimal total,
            @RequestParam("metodoPago") String metodoPago,
            @RequestParam("comprobante") MultipartFile comprobante,
            @RequestParam(value = "productos", required = false) String productosJson
    ) throws IOException {

        System.out.println("=== CREANDO PEDIDO ===");
        System.out.println("Cliente: " + clienteNombre);
        System.out.println("Email: " + clienteEmail);
        System.out.println("Total: " + total);

        // Validaciones
        if (comprobante.isEmpty()) {
            return ResponseEntity.badRequest().body("Comprobante es requerido");
        }
        if (total.compareTo(BigDecimal.ZERO) <= 0) {
            return ResponseEntity.badRequest().body("Total debe ser mayor a 0");
        }
        if (clienteNombre == null || clienteNombre.trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Nombre del cliente es requerido");
        }
        if (clienteEmail == null || clienteEmail.trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Email del cliente es requerido");
        }

        // Guardar archivo
        String uploadsDir = "uploads/comprobantes/";
        String realPath = new File(uploadsDir).getAbsolutePath();
        File uploadFolder = new File(realPath);
        if (!uploadFolder.exists()) uploadFolder.mkdirs();

        String filename = System.currentTimeMillis() + "_" + comprobante.getOriginalFilename();
        Path path = Paths.get(realPath, filename);
        Files.copy(comprobante.getInputStream(), path, StandardCopyOption.REPLACE_EXISTING);

        // Crear pedido
        Pedido pedido = new Pedido();
        pedido.setClienteNombre(clienteNombre);
        pedido.setClienteEmail(clienteEmail);
        pedido.setTotal(total);
        pedido.setMetodoPago(metodoPago);
        pedido.setComprobanteUrl("/api/pedidos/comprobante/" + filename);
        pedido.setEstado("PENDIENTE_VALIDACION");
        pedido.setProductos(productosJson);
        pedido.setFechaCreacion(LocalDateTime.now());

        Pedido pedidoGuardado = pedidoRepository.save(pedido);

        System.out.println("Pedido guardado con ID: " + pedidoGuardado.getId());
        System.out.println("Email guardado: " + pedidoGuardado.getClienteEmail());

        return ResponseEntity.ok().body("Pedido registrado. Pendiente de validación.");
    }

    @GetMapping("/comprobante/{filename}")
    public ResponseEntity<Resource> verComprobante(@PathVariable String filename) throws IOException {
        Path file = Paths.get("uploads/comprobantes/" + filename);
        UrlResource resource = new UrlResource(file.toUri());

        if (resource.exists() && resource.isReadable()) {
            return ResponseEntity.ok().body(resource);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/pendientes")
    public List<Pedido> pendientes() {
        return pedidoRepository.findByEstado("PENDIENTE_VALIDACION");
    }

    @GetMapping
    public List<Pedido> listarTodos() {
        return pedidoRepository.findAll();
    }

    @GetMapping("/cliente/email/{email}")
    public ResponseEntity<List<Pedido>> pedidosPorClienteEmail(@PathVariable String email) {
        System.out.println("=== BUSCANDO PEDIDOS ===");
        System.out.println("Email recibido: '" + email + "'");

        List<Pedido> pedidos = pedidoRepository.findByClienteEmail(email);

        System.out.println("Pedidos encontrados: " + pedidos.size());

        // Debug: mostrar todos los emails en la BD
        List<Pedido> todosPedidos = pedidoRepository.findAll();
        System.out.println("=== TODOS LOS EMAILS EN BD ===");
        for (Pedido p : todosPedidos) {
            System.out.println("ID: " + p.getId() + " | Email: '" + p.getClienteEmail() + "'");
        }

        return ResponseEntity.ok(pedidos);
    }

    @PutMapping("/{id}/aprobar")
    public ResponseEntity<?> aprobar(@PathVariable Integer id) {
        try {
            Pedido pedido = pedidoRepository.findById(id).orElseThrow();
            pedido.setEstado("APROBADO");
            pedidoRepository.save(pedido);
            return ResponseEntity.ok().body("Pedido aprobado exitosamente");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error al aprobar pedido: " + e.getMessage());
        }
    }

    @PutMapping("/{id}/rechazar")
    public ResponseEntity<?> rechazar(@PathVariable Integer id) {
        try {
            Pedido pedido = pedidoRepository.findById(id).orElseThrow();
            pedido.setEstado("RECHAZADO");
            pedidoRepository.save(pedido);
            return ResponseEntity.ok().body("Error al rechazar pedido");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error al rechazar pedido: " + e.getMessage());
        }
    }
}