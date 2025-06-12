package com.inventario.repository;

import com.inventario.entity.Chatbot;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ChatbotRepository extends JpaRepository<Chatbot, Integer> {
    List<Chatbot> findByActivoTrue();

    @Query("SELECT c FROM Chatbot c WHERE c.activo = true AND " +
            "(LOWER(c.pregunta) LIKE LOWER(CONCAT('%', :texto, '%')) OR " +
            "LOWER(c.palabrasClave) LIKE LOWER(CONCAT('%', :texto, '%')))")
    List<Chatbot> buscarRespuestas(@Param("texto") String texto);

    List<Chatbot> findByCategoriaConsultaAndActivoTrue(String categoriaConsulta);
}