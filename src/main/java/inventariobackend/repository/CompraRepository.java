package inventariobackend.repository;
import inventariobackend.entity.Compra;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import jakarta.persistence.LockModeType;
import java.util.Optional;
public interface CompraRepository extends JpaRepository<Compra,Integer> {
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select c from Compra c where c.idCompra = :id")
    Optional<Compra> lockById(@Param("id") Integer id);
}
