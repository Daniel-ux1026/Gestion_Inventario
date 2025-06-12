package com.inventario.controller;

import com.inventario.dto.ApiResponse;
import com.inventario.dto.DashboardDTO;
import com.inventario.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/dashboard")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<DashboardDTO>> obtenerDatosDashboard() {
        DashboardDTO dashboard = dashboardService.obtenerDatosDashboard();
        return ResponseEntity.ok(ApiResponse.success(dashboard));
    }
}