package inventariobackend.repository;

import inventariobackend.entity.Pedido;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PedidoRepository extends JpaRepository<Pedido, Integer> {
    List<Pedido> findByEstado(String estado);
    List<Pedido> findByClienteNombreContainingIgnoreCase(String nombre);
    List<Pedido> findByEstadoOrderByFechaCreacionDesc(String estado);
    List<Pedido> findByClienteNombre(String nombre);
    List<Pedido> findByClienteEmail(String email);
    List<Pedido> findByClienteEmailOrderByFechaCreacionDesc(String email);
}
