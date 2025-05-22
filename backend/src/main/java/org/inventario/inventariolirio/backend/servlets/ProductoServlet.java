package org.inventario.inventariolirio.backend.servlets;

import com.google.gson.Gson;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.*;

import java.io.IOException;
import java.io.PrintWriter;

@WebServlet("/api/productos")
public class ProductoServlet extends HttpServlet {

    class Producto {
        int id;
        String nombre;
        int cantidad;

        Producto(int id, String nombre, int cantidad) {
            this.id = id;
            this.nombre = nombre;
            this.cantidad = cantidad;
        }
    }

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

        Producto[] productos = {
                new Producto(1, "Arroz", 100),
                new Producto(2, "Azúcar", 50),
                new Producto(3, "Aceite", 30)
        };

        String json = new Gson().toJson(productos);

        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        PrintWriter out = response.getWriter();
        out.print(json);
        out.flush();
    }
}

