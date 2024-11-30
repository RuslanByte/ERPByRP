package com.example.springboot.repository;

import com.example.springboot.model.Employees;
import com.example.springboot.model.Orders;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EmployeesRepository extends JpaRepository<Employees, Long> {

    Optional<Employees> findByUsername(String username);

    @Query("SELECT e.photopath FROM Employees e WHERE e.username = :username")
    Optional<String> findPhotopathByUsername(@Param("username") String username);

    @Query("SELECT e FROM Employees e")
    List<Employees> findAllEmployeesLimit(Pageable pageable);


    @Query("SELECT e FROM Employees e WHERE "
            + "lower(e.username) LIKE lower(concat('%', :searchTerm, '%')) OR "
            + "lower(e.password) LIKE lower(concat('%', :searchTerm, '%')) OR "
            + "lower(e.accessrights) LIKE lower(concat('%', :searchTerm, '%')) OR "
            + "lower(e.surname) LIKE lower(concat('%', :searchTerm, '%')) OR "
            + "lower(e.name) LIKE lower(concat('%', :searchTerm, '%')) OR "
            + "lower(e.patronymic) LIKE lower(concat('%', :searchTerm, '%')) OR "
            + "lower(e.address) LIKE lower(concat('%', :searchTerm, '%')) OR "
            + "lower(e.uniquehash) LIKE lower(concat('%', :searchTerm, '%')) OR "
            + "lower(e.amount) LIKE lower(concat('%', :searchTerm, '%')) OR "
            + "lower(e.telephone) LIKE lower(concat('%', :searchTerm, '%')) OR "
            + "lower(e.comment) LIKE lower(concat('%', :searchTerm, '%'))")
    List<Employees> searchByTerm(@Param("searchTerm") String searchTerm);

}
