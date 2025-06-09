package com.abarrotes.service;

import com.abarrotes.entity.Usuario;
import com.abarrotes.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collection;
import java.util.Collections;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Override
    @Transactional
    public UserDetails loadUserByUsername(String correo) throws UsernameNotFoundException {
        Usuario usuario = usuarioRepository.findByCorreo(correo)
                .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado con correo: " + correo));

        return User.builder()
                .username(usuario.getCorreo())
                .password(usuario.getContrasenia())
                .authorities(mapRolesToAuthorities(usuario.getRol().getNombre()))
                .accountExpired(false)
                .accountLocked(!usuario.getEstado())
                .credentialsExpired(false)
                .disabled(!usuario.getEstado())
                .build();
    }

    private Collection<? extends GrantedAuthority> mapRolesToAuthorities(String rol) {
        return Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + rol));
    }
}