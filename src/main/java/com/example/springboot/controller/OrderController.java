package com.example.springboot.controller;

import com.example.springboot.JwtUtil;
import com.example.springboot.model.Employees;
import com.example.springboot.model.Orders;
import com.example.springboot.service.EmployeesService;
import com.example.springboot.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/orders")
public class OrderController {  
    @Autowired
    private OrderService orderService;

    @Autowired
    EmployeesService employeesService;

    @Autowired
    JwtUtil jwtUtil;

    @Autowired
    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @GetMapping
    @PreAuthorize("hasAuthority('ADMIN') or hasAuthority('MANAGER') or hasAuthority('EMPLOYEE')")
    public List<Orders> getAllOrders(){
        return orderService.getAllPostsOrderedByIdDesc();
    }

    @GetMapping("/limit")
    @PreAuthorize("hasAuthority('ADMIN') or hasAuthority('MANAGER') or hasAuthority('EMPLOYEE')")
    public List<Orders> getAllOrdersLimit(@RequestParam("numOfRow") int numOfRow){
        return orderService.getAllPostsOrderedByIdDescLimit(numOfRow);
    }

    @GetMapping("/pdf")
    @PreAuthorize("hasAuthority('ADMIN') or hasAuthority('MANAGER')")
    public void generatePdf(HttpServletResponse response) throws IOException{
        orderService.generatePdf(response);
    }

    @PostMapping
    @PreAuthorize("hasAuthority('ADMIN') or hasAuthority('MANAGER')")
    public Orders addOrder(@RequestBody Orders orders){
        return orderService.addOrder(orders);
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasAuthority('ADMIN') or hasAuthority('MANAGER') or hasAuthority('EMPLOYEE')")
    public ResponseEntity<Orders> updateOrderStatus(@PathVariable Long id, @RequestBody Map<String, String> statusUpdate){
        String newStatus = statusUpdate.get("status");
        Orders updatedOrder = orderService.updateOrderStatus(id, newStatus);
        if (updatedOrder != null){
            return ResponseEntity.ok(updatedOrder);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/filteredStatus")
    @PreAuthorize("hasAuthority('ADMIN') or hasAuthority('MANAGER') or hasAuthority('EMPLOYEE')")
    public List<Orders> getFilteredStatus(@RequestHeader("Authorization") String token){
        String username = jwtUtil.extractUsername(token.substring(7));
        Employees employee = employeesService.findEmployeeByUsername(username);
        if (employee.getAccessrights().equals("EMPLOYEE")){
            return orderService.findAllExcludedStatusAndName(employee.getName());
        } else {
            return orderService.getFilteredOrdersStatus();
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN') or hasAuthority('MANAGER')")
    public ResponseEntity<Void> deleteOrder(@PathVariable Long id){
        orderService.deleteOrders(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("{id}/updateOrder")
    @PreAuthorize("hasAuthority('ADMIN') or hasAuthority('MANAGER')")
    public ResponseEntity<Orders> updateOrder(@PathVariable Long id, @RequestBody Orders updatedOrders){
        Orders orders = orderService.updateOrders(id, updatedOrders);
        return ResponseEntity.ok(orders);
    }

    @GetMapping("/getOrdersDate")
    @PreAuthorize("hasAuthority('ADMIN')")
    public Map<String, Long> getOrdersByDateRange(@RequestParam("startDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate, @RequestParam("endDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate, @RequestParam("master") String master) {

        if(master.equals("Все")){
            return orderService.getOrdersBetweenDates(startDate, endDate);
        } else {
            return orderService.findByAddOrderTimeBetweenAndName(startDate, endDate, master);
        }
    }

    @GetMapping("/getIncomesDate")
    @PreAuthorize("hasAuthority('ADMIN')")
    public Map<String, Integer> getIncomesByDateRange(@RequestParam("startDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate, @RequestParam("endDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate, @RequestParam("master") String master) {

        if(master.equals("Все")){
            return orderService.calculateIncomeByPaymentType(orderService.getOrdersBetweenDatesForIncomeCalculate(startDate, endDate));
        } else {
            return orderService.calculateIncomeByPaymentType(orderService.findByAddOrderTimeBetweenAndNameForIncomeCalculate(startDate, endDate, master));
        }
    }


    @GetMapping("/countByStatus")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<Map<String, Long>> getOrderCountByStatus() {
        Map<String, Long> orderCounts = new HashMap<>();

        orderCounts.put("New", orderService.countByStatus("Новый"));
        orderCounts.put("Complete", orderService.countByStatus("выполнено"));
        orderCounts.put("InWork", orderService.countByStatus("в работе"));
        orderCounts.put("Transferred", orderService.countByStatus("перенесен"));
        orderCounts.put("Refusal", orderService.countByStatus("отказ"));

        return ResponseEntity.ok(orderCounts);
    }

    @GetMapping("/search")
    @PreAuthorize("hasAuthority('ADMIN') or hasAuthority('MANAGER')")
    public List<Orders> search(@RequestParam String searchTerm){
        return orderService.searchByTerm(searchTerm);
    }

    @GetMapping("/StatusWithOneValue")
    @PreAuthorize("hasAuthority('ADMIN') or hasAuthority('MANAGER') or hasAuthority('EMPLOYEE')")
    public ResponseEntity<List<Orders>> getStatusWithOneValue(@RequestParam String status, @RequestHeader("Authorization") String token) {
        String username = jwtUtil.extractUsername(token.substring(7));
        Employees employee = employeesService.findEmployeeByUsername(username);

        if (employee.getAccessrights().equals("EMPLOYEE")) {
            List<Orders> orders = orderService.findAllStatusWithOneValueAndName(status, employee.getName());
            if (orders.isEmpty()) {
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.ok(orders);
        } else {
            List<Orders> orders = orderService.findAllStatusWithOneValue(status);
            if (orders.isEmpty()) {
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.ok(orders);
        }
    }

}
