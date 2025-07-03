package com.inventario;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.transaction.annotation.EnableTransactionManagement;

/**
 * Aplicación principal del Sistema de Inventario
 * El Lirio de los Valles S.A.C.
 *
 * @author El Lirio de los Valles
 * @version 1.0.0
 * @since 2025
 */
@SpringBootApplication
@EnableJpaAuditing
@EnableAsync
@EnableTransactionManagement
public class InventarioApplication {

    public static void main(String[] args) {
        System.out.println("🌸 Iniciando Sistema de Inventario - El Lirio de los Valles 🌸");
        SpringApplication.run(InventarioApplication.class, args);
        System.out.println("✅ Sistema de Inventario iniciado correctamente");
        System.out.println("📖 Link del servidor: http://localhost:8080/");
    }
}