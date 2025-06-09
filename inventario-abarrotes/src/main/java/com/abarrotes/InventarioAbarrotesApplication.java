package com.abarrotes;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class InventarioAbarrotesApplication {

	public static void main(String[] args) {
		SpringApplication.run(InventarioAbarrotesApplication.class, args);
		System.out.println("Servidor levantado correctamente");
		
	}

}
