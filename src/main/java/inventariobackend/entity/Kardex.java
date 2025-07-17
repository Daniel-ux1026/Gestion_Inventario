package inventariobackend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "kardex")
@Data // Incluye @Getter, @Setter, @ToString, @EqualsAndHashCode
@NoArgsConstructor
@AllArgsConstructor
@Builder // <-- ¡ESTA ES LA ANOTACIÓN CLAVE QUE FALTABA!
public class Kardex {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idKardex;

    @ManyToOne
    @JoinColumn(name = "id_producto", nullable = false)
    private Producto producto;

    @Column(nullable = false)
    private LocalDateTime fecha;

    @Column(length = 50, nullable = false)
    private String tipoMovimiento; // Ej: "Compra", "Venta", "Ajuste"

    @Column(nullable = false)
    private int cantidad;

    @Column(nullable = false)
    private int stockResultante;
}
