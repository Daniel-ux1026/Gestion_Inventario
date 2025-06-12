package com.inventario.service;

import com.inventario.dto.ProductoDTO;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.ByteArrayInputStream;
import java.util.List;
import java.io.IOException;

@Service
public class ExcelExportService {

    public ByteArrayInputStream exportarProductosExcel(List<ProductoDTO> productos) throws IOException {
        String [] COLUMNAS = {"ID", "Código", "Nombre", "Categoría", "Marca", "Stock", "Precio Venta"};

        try (Workbook workbook = new XSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream()){
            Sheet sheet = workbook.createSheet("Productos");

            // Header
            Row header = sheet.createRow(0);
            for (int col=0; col < COLUMNAS.length; col++) {
                Cell cell = header.createCell(col);
                cell.setCellValue(COLUMNAS[col]);
            }

            // Data
            int rowIdx = 1;
            for (ProductoDTO producto : productos) {
                Row row = sheet.createRow(rowIdx++);
                row.createCell(0).setCellValue(producto.getIdProducto());
                row.createCell(1).setCellValue(producto.getCodigoProducto());
                row.createCell(2).setCellValue(producto.getNombreProducto());
                row.createCell(3).setCellValue(producto.getCategoria().getNombreCategoria());
                row.createCell(4).setCellValue(producto.getMarca().getNombreMarca());
                row.createCell(5).setCellValue(producto.getStockActual());
                row.createCell(6).setCellValue(producto.getPrecioVenta().doubleValue());
            }

            workbook.write(out);
            return new ByteArrayInputStream(out.toByteArray());
        }

    }
}
