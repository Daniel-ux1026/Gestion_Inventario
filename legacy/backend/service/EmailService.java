package inventariobackend.service;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private final JavaMailSender mailSender;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendPasswordResetEmail(String to, String token) {
        String url = "http://localhost:5173/reset-password?token=" + token;
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject("Restablece tu contraseña");
        message.setText("Hola,\n\nPara restablecer tu contraseña, haz clic aquí:\n" + url +
                "\n\nSi no solicitaste esto, puedes ignorar este mensaje.\n\n¡Gracias!");
        mailSender.send(message);
    }

}
