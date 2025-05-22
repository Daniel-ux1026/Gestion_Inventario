package org.inventario.inventariolirio.backend.servlets;


import com.google.gson.Gson;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.*;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@WebServlet("/api/login")
public class LoginServlet extends HttpServlet {

    // Simulamos base de datos
    private static final Map<String, String[]> users = new HashMap<>();
    static {
        users.put("admin", new String[]{"admin123", "ADMIN"});
        users.put("cliente", new String[]{"cliente123", "CLIENTE"});
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        String usuario = request.getParameter("username");
        String contrasena = request.getParameter("password");

        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        Map<String, Object> resp = new HashMap<>();

        if (usuario == null || contrasena == null || !users.containsKey(usuario) || !users.get(usuario)[0].equals(contrasena)) {
            resp.put("success", false);
            resp.put("message", "Usuario o contraseña incorrectos");
        } else {
            String rol = users.get(usuario)[1];
            // Aquí deberías generar token JWT real, aquí uno falso para ejemplo
            String tokenFake = "token-de-ejemplo-para-" + usuario;

            resp.put("success", true);
            resp.put("token", tokenFake);
            resp.put("rol", rol);
        }

        response.getWriter().write(new Gson().toJson(resp));
    }
}