package inventariobackend;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.security.servlet.UserDetailsServiceAutoConfiguration;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import java.util.TimeZone;
@SpringBootApplication(exclude=UserDetailsServiceAutoConfiguration.class)
@EnableJpaAuditing
public class InventarioApplication {
    public static void main(String[] args) {
        TimeZone.setDefault(TimeZone.getTimeZone("America/Lima"));
        SpringApplication.run(InventarioApplication.class,args);
    }
}
