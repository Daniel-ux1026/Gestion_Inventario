package com.inventario.security;

import com.inventario.entity.Usuario;
import lombok.AllArgsConstructor;
import lombok.Data;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import java.util.Collection;
import java.util.Collections;

@Data
@AllArgsConstructor
public class CustomUserPrincipal implements UserDetails {

    private Integer id;
    private String email;
    private String password;
    private String rol;
    private boolean activo;

    public static CustomUserPrincipal create(Usuario usuario) {
        return new CustomUserPrincipal(
                usuario.getIdUsuario(),
                usuario.getEmail(),
                usuario.getPassword(),
                usuario.getRol().getNombreRol(),
                usuario.getActivo()
        );
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + rol));
    }

    @Override
    public String getUsername() {
        return email;
    }

    @Override
    public boolean isEnabled() {
        return activo;
    }
}