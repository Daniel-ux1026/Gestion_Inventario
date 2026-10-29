package inventariobackend.lirio;
import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;
@Data @Entity @Table(name="lirio_password_reset")
public class PasswordReset {
    @Id @Column(length=64) private String hash;
    @Column(nullable=false,length=150) private String email;
    @Column(nullable=false) private LocalDateTime expires;
}
