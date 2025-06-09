package com.abarrotes.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Servir archivos estáticos desde /static/
        registry.addResourceHandler("/static/**")
                .addResourceLocations("classpath:/static/")
                .setCachePeriod(3600); // Cache por 1 hora

        registry.addResourceHandler("/css/**")
                .addResourceLocations("classpath:/static/css/");

        registry.addResourceHandler("/js/**")
                .addResourceLocations("classpath:/static/js/");

        registry.addResourceHandler("/images/**")
                .addResourceLocations("classpath:/static/images/");

        // Servir React desde la raíz
        registry.addResourceHandler("/**")
                .addResourceLocations("classpath:/static/")
                .setCachePeriod(0); // Sin cache para development
    }

    @Override
    public void addViewControllers(ViewControllerRegistry registry) {
        // Redirigir todas las rutas SPA a index.html
        registry.addViewController("/").setViewName("forward:/index.html");
        registry.addViewController("/dashboard").setViewName("forward:/index.html");
        registry.addViewController("/productos").setViewName("forward:/index.html");
        registry.addViewController("/usuarios").setViewName("forward:/index.html");
        registry.addViewController("/ventas").setViewName("forward:/index.html");
        registry.addViewController("/proveedores").setViewName("forward:/index.html");
    }
}