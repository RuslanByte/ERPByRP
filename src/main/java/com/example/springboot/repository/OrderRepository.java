package com.example.springboot.repository;

import com.example.springboot.model.Orders;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Orders, Long> {
    @Query("SELECT o FROM Orders o ORDER BY o.id DESC")
    List<Orders> findAllOrderByIdDesc();

    @Query("SELECT o FROM Orders o ORDER BY o.id DESC")
    List<Orders> findAllOrderByIdDescLimit(Pageable pageable);


    @Query("SELECT o FROM Orders o WHERE o.status NOT IN (:excludedStatuses)")
    List<Orders> findAllExcludedStatus(@Param("excludedStatuses") List<String> excludedStatuses);

    @Query("SELECT o FROM Orders o WHERE o.status NOT IN (:excludedStatuses) AND o.master = :name")
    List<Orders> findAllExcludedStatusAndName(@Param("excludedStatuses") List<String> excludedStatuses, @Param("name") String name);

    List<Orders> findByAddOrderTimeBetween(LocalDateTime startDate, LocalDateTime endDate);

    @Query("SELECT o FROM Orders o WHERE o.master = :master AND o.addOrderTime BETWEEN :startDate AND :endDate")
    List<Orders> findByAddOrderTimeBetweenAndName(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate, @Param("master") String master);

    long countByStatus(String status);

    @Query("SELECT o FROM Orders o WHERE "
            + "lower(o.city) LIKE lower(concat('%', :searchTerm, '%')) OR "
            + "lower(o.district) LIKE lower(concat('%', :searchTerm, '%')) OR "
            + "lower(o.street) LIKE lower(concat('%', :searchTerm, '%')) OR "
            + "lower(o.telephone) LIKE lower(concat('%', :searchTerm, '%')) OR "
            + "lower(o.comment) LIKE lower(concat('%', :searchTerm, '%')) OR "
            + "lower(o.master) LIKE lower(concat('%', :searchTerm, '%')) OR "
            + "lower(o.formofpayment) LIKE lower(concat('%', :searchTerm, '%')) OR "
            + "lower(o.status) LIKE lower(concat('%', :searchTerm, '%'))")
    List<Orders> searchByTerm(@Param("searchTerm") String searchTerm);

    @Query("SELECT o FROM Orders o WHERE o.status = :status")
    List<Orders> findAllStatusWithOneValue(@Param("status") String status);

    @Query("SELECT o FROM Orders o WHERE o.status = :status AND o.master = :name")
    List<Orders> findAllStatusWithOneValueAndName(@Param("status") String status, @Param("name") String name);
}
