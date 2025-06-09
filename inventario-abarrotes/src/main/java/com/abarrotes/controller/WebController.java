package com.abarrotes.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class WebController {

    /**
     * Servir la aplicación React para rutas SPA
     */
    @GetMapping({
            "/",
            "/dashboard",
            "/productos",
            "/usuarios",
            "/ventas",
            "/proveedores",
            "/reportes"
    })
    public String spa() {
        return "forward:/index.html";
    }

    /**
     * Manejar rutas no encontradas del frontend
     */
    @GetMapping("/app/**")
    public String appRoutes() {
        return "forward:/index.html";
    }
}