package com.inventario.service;

import com.inventario.dto.LoginRequest;
import com.inventario.dto.LoginResponse;
import com.inventario.dto.UsuarioDTO;
import com.inventario.entity.Usuario;
import com.inventario.repository.UsuarioRepository;
import com.inventario.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider jwtTokenProvider;
    private final UsuarioRepository usuarioRepository;
    private final ModelMapper modelMapper;

    public LoginResponse login(LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getEmail(),
                        loginRequest.getPassword()
                )
        );

        String token = jwtTokenProvider.generateToken(authentication);

        Usuario usuario = usuarioRepository.findByEmail(loginRequest.getEmail())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        UsuarioDTO usuarioDTO = modelMapper.map(usuario, UsuarioDTO.class);

        return new LoginResponse(token, "Bearer", usuarioDTO);
    }
}
