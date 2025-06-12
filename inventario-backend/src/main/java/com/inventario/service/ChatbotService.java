package com.inventario.service;

import com.inventario.dto.ChatRequest;
import com.inventario.dto.ChatResponse;
import com.inventario.entity.Chatbot;
import com.inventario.repository.ChatbotRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ChatbotService {

    private final ChatbotRepository chatbotRepository;
    private static final String WHATSAPP_NUMBER = "+51987654321";

    public ChatResponse procesarConsulta(ChatRequest request) {
        String mensaje = request.getMensaje().toLowerCase().trim();

        // Buscar respuesta en la base de datos
        List<Chatbot> respuestas = chatbotRepository.buscarRespuestas(mensaje);

        if (!respuestas.isEmpty()) {
            Chatbot chatbot = respuestas.get(0);

            // Verificar si es una solicitud de contacto
            if ("CONTACTO".equals(chatbot.getCategoriaConsulta())) {
                return new ChatResponse(
                        chatbot.getRespuesta(),
                        chatbot.getCategoriaConsulta(),
                        true,
                        WHATSAPP_NUMBER
                );
            }

            return new ChatResponse(
                    chatbot.getRespuesta(),
                    chatbot.getCategoriaConsulta(),
                    false,
                    null
            );
        }

        // Respuesta por defecto
        return new ChatResponse(
                "Lo siento, no puedo entender tu consulta. ¿Podrías reformular tu pregunta? " +
                        "O si prefieres, puedes contactar con un asesor humano escribiendo 'contactar asesor'.",
                "DEFAULT",
                false,
                null
        );
    }

    public List<Chatbot> listarRespuestasActivas() {
        return chatbotRepository.findByActivoTrue();
    }
}