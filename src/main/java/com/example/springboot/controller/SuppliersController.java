package com.example.springboot.controller;

import com.example.springboot.model.Employees;
import com.example.springboot.model.Suppliers;
import com.example.springboot.service.SuppliersService;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/suppliers")
public class SuppliersController {
    @Autowired
    private SuppliersService suppliersService;

    @GetMapping
    @PreAuthorize("hasAuthority('ADMIN')")
    public List<Suppliers> getAllSuppliers(){
        return suppliersService.getAllSuppliers();
    }

    @GetMapping("/limit")
    @PreAuthorize("hasAuthority('ADMIN')")
    public List<Suppliers> getAllSuppliersLimit(@RequestParam("numOfRow") int numOfRow){
        return suppliersService.findAllSuppliersLimit(numOfRow);
    }

    @PostMapping
    @PreAuthorize("hasAuthority('ADMIN')")
    public Suppliers addSuppliers(@RequestBody Suppliers suppliers){
        return suppliersService.addSuppliers(suppliers);
    }

    @GetMapping("/pdf")
    @PreAuthorize("hasAuthority('ADMIN')")
    public void generatePdf(HttpServletResponse response) throws IOException {
        suppliersService.generatePdf(response);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<Void> deleteSupplier(@PathVariable Long id){
        suppliersService.deleteSupplier(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("{id}/updateSupplier")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<Suppliers> updateSupplier(@PathVariable Long id, @RequestBody Suppliers updateSupplier){
        Suppliers supplier = suppliersService.updateSupplier(id, updateSupplier);
        return ResponseEntity.ok(supplier);
    }

    @GetMapping("/search")
    @PreAuthorize("hasAuthority('ADMIN')")
    public List<Suppliers> search(@RequestParam String searchTerm){
        return suppliersService.searchByTerm(searchTerm);
    }
}
