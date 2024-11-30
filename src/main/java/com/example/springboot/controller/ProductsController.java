package com.example.springboot.controller;


import com.example.springboot.model.Products;
import com.example.springboot.service.ProductsService;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/products")
public class ProductsController {
    @Autowired
    private ProductsService productsService;


    @GetMapping
    @PreAuthorize("hasAuthority('ADMIN') or hasAuthority('MANAGER')")
    public List<Products> getAllProducts(){
        return productsService.getAllProdustc();
    }

    @GetMapping("/limit")
    @PreAuthorize("hasAuthority('ADMIN') or hasAuthority('MANAGER')")
    public List<Products> getAllProductLimit(@RequestParam("numOfRow") int numOfRow){
        return productsService.findAllProductLimit(numOfRow);
    }


    @PostMapping
    @PreAuthorize("hasAuthority('ADMIN') or hasAuthority('MANAGER')")
    public Products addProducts(@RequestBody Products products){
        return productsService.addProducts(products);
    }

    @GetMapping("/pdf")
    @PreAuthorize("hasAuthority('ADMIN') or hasAuthority('MANAGER')")
    public void generatePdf(HttpServletResponse response) throws IOException {
        productsService.generatePdf(response);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN') or hasAuthority('MANAGER')")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id){
        productsService.deleteProduct(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("{id}/updateProduct")
    @PreAuthorize("hasAuthority('ADMIN') or hasAuthority('MANAGER')")
    public ResponseEntity<Products> updateProduct(@PathVariable Long id, @RequestBody Products updateProduct){
        Products product = productsService.updateProduct(id, updateProduct);
        return ResponseEntity.ok(product);
    }

    @GetMapping("/search")
    @PreAuthorize("hasAuthority('ADMIN') or hasAuthority('MANAGER')")
    public List<Products> search(@RequestParam String searchTerm){
        return productsService.searchByTerm(searchTerm);
    }
}
