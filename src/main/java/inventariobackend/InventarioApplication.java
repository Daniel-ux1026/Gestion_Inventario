package inventariobackend;

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
        System.out.println();
        System.out.println("════════════════════════════════════════════════════════════════════════════════");
        System.out.println("                                                                                ");
        System.out.println("                        🏢 EL LIRIO DE LOS VALLES S.A.C. 🏢                        ");
        System.out.println("                           📦 SISTEMA DE INVENTARIO 📦                             ");
        System.out.println("                                                                                    ");
        System.out.println("════════════════════════════════════════════════════════════════════════════════");
        System.out.println();
        System.out.println("🚀 Iniciando aplicación Spring Boot...");
        System.out.println("⚙️  Configurando base de datos...");
        System.out.println("📋 Cargando configuración JPA...");
        System.out.println("🔄 Habilitando transacciones...");
        System.out.println("⏰ Configurando tareas asíncronas...");
        System.out.println();
        System.out.println();
        System.out.println("✅ ¡Sistema de Inventario iniciado exitosamente!");
        System.out.println("🌐 Servidor disponible en: http://localhost:8080/");
        System.out.println("📊 Panel administrativo: http://localhost:8080/admin");
        System.out.println("🔧 API REST: http://localhost:8080/api/v1/");
        System.out.println("📖 Documentación: http://localhost:8080/swagger-ui.html");
        System.out.println();
        System.out.println("💡 Para detener el servidor: Ctrl+C");
        System.out.println("🌸 El Lirio de los Valles - ¡Listo para gestionar tu inventario! 🌸");
        System.out.println();
        System.out.println("════════════════════════════════════════════════════════════════════════════════");
        SpringApplication.run(InventarioApplication.class, args);
    }
}