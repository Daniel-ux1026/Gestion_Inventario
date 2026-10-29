package inventariobackend.repository;

import inventariobackend.entity.Pedido;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PedidoRepository extends JpaRepository<Pedido, Integer> {
    java.util.Optional<Pedido> findByIdempotencyKey(String key);
    @org.springframework.data.jpa.repository.Lock(jakarta.persistence.LockModeType.PESSIMISTIC_WRITE)
    @org.springframework.data.jpa.repository.Query("select p from Pedido p where p.id = :id")
    java.util.Optional<Pedido> lockById(@org.springframework.data.repository.query.Param("id") Integer id);
    List<Pedido> findByEstado(String estado);
    List<Pedido> findByClienteNombreContainingIgnoreCase(String nombre);
    List<Pedido> findByEstadoOrderByFechaCreacionDesc(String estado);
    List<Pedido> findByClienteNombre(String nombre);
    List<Pedido> findByClienteEmail(String email);
    List<Pedido> findByClienteEmailOrderByFechaCreacionDesc(String email);
}
