package com.inventario.controller;

import com.inventario.dto.ApiResponse;
import com.inventario.dto.CategoriaDTO;
import com.inventario.entity.Categoria;
import com.inventario.repository.CategoriaRepository;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/categorias")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class CategoriaController {

    private final CategoriaRepository categoriaRepository;
    private final ModelMapper modelMapper;

    @GetMapping("/listar")
    public ResponseEntity<ApiResponse<List<CategoriaDTO>>> listarCategorias() {
        List<CategoriaDTO> categorias = categoriaRepository.findByActivoTrue()
                .stream()
                .map(categoria -> modelMapper.map(categoria, CategoriaDTO.class))
                .collect(Collectors.toList());
        return ResponseEntity.ok(ApiResponse.success(categorias));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<CategoriaDTO>> guardarCategoria(@RequestBody CategoriaDTO categoriaDTO) {
        try {
            Categoria categoria = modelMapper.map(categoriaDTO, Categoria.class);
            categoria = categoriaRepository.save(categoria);
            CategoriaDTO resultado = modelMapper.map(categoria, CategoriaDTO.class);
            return ResponseEntity.ok(ApiResponse.success("Categoría guardada exitosamente", resultado));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Error al guardar categoría: " + e.getMessage()));
        }
    }
}