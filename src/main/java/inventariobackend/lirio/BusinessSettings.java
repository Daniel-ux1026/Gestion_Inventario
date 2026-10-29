package inventariobackend.lirio;
import jakarta.persistence.*;
import lombok.Data;
@Data @Entity @Table(name="lirio_configuracion")
public class BusinessSettings {
    @Id private Integer id = 1;
    @Column(nullable=false,length=150) private String nombre = "El Lirio de los Valles";
    @Column(nullable=false,length=20) private String telefono = "948656772";
    @Column(length=300) private String direccion = "";
    @Column(length=200) private String horario = "Consulta nuestros horarios por teléfono";
}
