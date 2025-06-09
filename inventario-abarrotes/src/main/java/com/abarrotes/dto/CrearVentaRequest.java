// DTO para crear venta
package com.abarrotes.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import java.util.List;

public class CrearVentaRequest {
    @NotNull(message = "El ID del cliente es obligatorio")
    private Integer clienteId;

    @NotEmpty(message = "Debe incluir al menos un detalle de venta")
    @Valid
    private List<DetalleVentaRequest> detalles;

    public CrearVentaRequest() {}

    public Integer getClienteId() { return clienteId; }
    public void setClienteId(Integer clienteId) { this.clienteId = clienteId; }

    public List<DetalleVentaRequest> getDetalles() { return detalles; }
    public void setDetalles(List<DetalleVentaRequest> detalles) { this.detalles = detalles; }
}