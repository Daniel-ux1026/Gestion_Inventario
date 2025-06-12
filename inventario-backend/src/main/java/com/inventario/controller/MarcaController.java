package com.inventario.controller;

import com.inventario.dto.ApiResponse;
import com.inventario.dto.MarcaDTO;
import com.inventario.entity.Marca;
import com.inventario.repository.MarcaRepository;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/marcas")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class MarcaController {

    private final MarcaRepository marcaRepository;
    private final ModelMapper modelMapper;

    @GetMapping("/listar")
    public ResponseEntity<ApiResponse<List<MarcaDTO>>> listarMarcas() {
        List<MarcaDTO> marcas = marcaRepository.findByActivoTrue()
                .stream()
                .map(marca -> modelMapper.map(marca, MarcaDTO.class))
                .collect(Collectors.toList());
        return ResponseEntity.ok(ApiResponse.success(marcas));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<MarcaDTO>> guardarMarca(@RequestBody MarcaDTO marcaDTO) {
        try {
            Marca marca = modelMapper.map(marcaDTO, Marca.class);
            marca = marcaRepository.save(marca);
            MarcaDTO resultado = modelMapper.map(marca, MarcaDTO.class);
            return ResponseEntity.ok(ApiResponse.success("Marca guardada exitosamente", resultado));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Error al guardar marca: " + e.getMessage()));
        }
    }
}