/*package inventariobackend.testeo;

import jakarta.mail.MessagingException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;


@SpringBootApplication
public class EmailApplication {


    @Autowired
    private EmailSenderService senderService;

    public static void main(String[] args) {
        SpringApplication.run(EmailApplication.class, args);
    }

    @EventListener(ApplicationReadyEvent.class)
    public void Email() throws MessagingException{

        senderService.enviarmensaje("developerkodscm@gmail.com", "Bienvenido", "ESTO ES UNA PRUEBA");
    }

}

 */