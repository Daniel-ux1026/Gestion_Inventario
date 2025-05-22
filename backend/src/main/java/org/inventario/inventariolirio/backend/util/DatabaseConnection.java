package org.inventario.inventariolirio.backend.util;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

//Se maneja la conexion a la bae de datos

public class DatabaseConnection {
    private static final String URL = "jdbc:mysql://localhost:3306/inventario_db?useSSL=false";
    private static final String USER = "root"; //cambia segun la configuracion del mysql
    private static final String PASSWORD = "123456"; //cambia segun la configuracion del mysql

    public static Connection getConnection() throws SQLException {
        return DriverManager.getConnection(URL, USER, PASSWORD);
    }
}
