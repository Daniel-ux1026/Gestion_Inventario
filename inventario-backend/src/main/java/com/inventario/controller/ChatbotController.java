package com.inventario.controller;

import com.inventario.dto.ApiResponse;
import com.inventario.dto.ChatRequest;
import com.inventario.dto.ChatResponse;
import com.inventario.entity.Chatbot;
import com.inventario.service.ChatbotService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/chatbot")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ChatbotController {

    private final ChatbotService chatbotService;

    @PostMapping("/consultar")
    public ResponseEntity<ApiResponse<ChatResponse>> procesarConsulta(@Valid @RequestBody ChatRequest request) {
        ChatResponse response = chatbotService.procesarConsulta(request);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/respuestas")
    public ResponseEntity<ApiResponse<List<Chatbot>>> listarRespuestas() {
        List<Chatbot> respuestas = chatbotService.listarRespuestasActivas();
        return ResponseEntity.ok(ApiResponse.success(respuestas));
    }
}