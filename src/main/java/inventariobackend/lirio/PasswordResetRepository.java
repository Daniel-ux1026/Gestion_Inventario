package inventariobackend.lirio;
import org.springframework.data.jpa.repository.JpaRepository;
public interface PasswordResetRepository extends JpaRepository<PasswordReset,String> {}
