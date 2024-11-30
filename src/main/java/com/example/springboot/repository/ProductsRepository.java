package com.example.springboot.repository;

import com.example.springboot.model.Products;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductsRepository extends JpaRepository<Products, Long> {
    @Query("SELECT p FROM Products p")
    List<Products> findAllProductsLimit(Pageable pageable);

    @Query("SELECT p FROM Products p WHERE "
            + "lower(p.name) LIKE lower(concat('%', :searchTerm, '%')) OR "
            + "lower(p.type) LIKE lower(concat('%', :searchTerm, '%')) OR "
            + "lower(p.count) LIKE lower(concat('%', :searchTerm, '%')) OR "
            + "lower(p.comment) LIKE lower(concat('%', :searchTerm, '%'))")
    List<Products> searchByTerm(@Param("searchTerm") String searchTerm);
}
