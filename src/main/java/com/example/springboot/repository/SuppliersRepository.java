package com.example.springboot.repository;

import com.example.springboot.model.Products;
import com.example.springboot.model.Suppliers;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SuppliersRepository extends JpaRepository<Suppliers, Long> {
    @Query("SELECT s FROM Suppliers s")
    List<Suppliers> findAllSuppliersLimit(Pageable pageable);

    @Query("SELECT s FROM Suppliers s WHERE "
            + "lower(s.name) LIKE lower(concat('%', :searchTerm, '%')) OR "
            + "lower(s.type) LIKE lower(concat('%', :searchTerm, '%')) OR "
            + "lower(s.count) LIKE lower(concat('%', :searchTerm, '%')) OR "
            + "lower(s.telephone) LIKE lower(concat('%', :searchTerm, '%')) OR "
            + "lower(s.comment) LIKE lower(concat('%', :searchTerm, '%'))")
    List<Suppliers> searchByTerm(@Param("searchTerm") String searchTerm);
}
