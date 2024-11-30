package com.example.springboot.controller;

import com.example.springboot.JwtUtil;
import com.example.springboot.model.Employees;
import com.example.springboot.service.EmployeesService;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/employees")
public class EmployeesController {
    @Autowired
    EmployeesService employeesService;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    JwtUtil jwtUtil;

    @GetMapping
    @PreAuthorize("hasAuthority('ADMIN')")
    public List<Employees> getAllEmployees(){
        return employeesService.getAllEmployees();
    }

    @GetMapping("/limit")
    @PreAuthorize("hasAuthority('ADMIN')")
    public List<Employees> getAllEmployeesLimit(@RequestParam("numOfRow") int numOfRow){
        return employeesService.findAllEmployeesLimit(numOfRow);
    }

    @PostMapping
    @PreAuthorize("hasAuthority('ADMIN')")
    public Employees addEmployees(@RequestParam("file") MultipartFile file, @RequestParam("employees") String employeesJson) {

        Employees employees;
        try {
            employees = objectMapper.readValue(employeesJson, Employees.class);

            if (file != null && !file.isEmpty()) {
                String photoPath = employeesService.saveImage(file);
                employees.setPhotoPath(photoPath);
            }
        } catch (IOException e) {
            throw new RuntimeException("Ошибка сохранения фото: " + e.getMessage());
        }

        String uniqueHash = UUID.randomUUID().toString();
        employees.setUniqueHash(uniqueHash);

        return employeesService.setEmployees(employees);
    }

    @GetMapping("/pdf")
    @PreAuthorize("hasAuthority('ADMIN')")
    public void generatePdf(HttpServletResponse response) throws IOException {
        employeesService.generatePdf(response);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<Void> deleteEmployee(@PathVariable Long id){
        employeesService.deleteEmployee(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("{id}/updateEmployee")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<Employees> updateEmployee(@PathVariable Long id, @RequestBody Employees updateEmployee){
        Employees employee = employeesService.updateEmployee(id, updateEmployee);
        return ResponseEntity.ok(employee);
    }

    @GetMapping("/getEmployee")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<Employees> getEmployee(@RequestHeader("Authorization") String token){
        String userName = jwtUtil.extractUsername(token.substring(7));
        Employees employee = employeesService.findEmployeeByUsername(userName);
        if (employee == null){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
        return ResponseEntity.ok(employee);
    }

    @GetMapping("/getPhoto")
    @PreAuthorize("hasAuthority('ADMIN') or hasAuthority('MANAGER')")
    public ResponseEntity<Resource> getPhoto(@RequestHeader("Authorization") String token){
        String username = jwtUtil.extractUsername(token.substring(7));

        Optional<String> photoPathOpt = employeesService.getPhotopathByUsername(username);

        if (photoPathOpt.isPresent()){

            String photopath = photoPathOpt.get();

            String directoryPath = "/home/ruslan/images/";

            File file = new File(directoryPath, photopath);

            if (file.exists()){

                Resource resource = new FileSystemResource(file);

                HttpHeaders headers = new HttpHeaders();

                headers.add(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + file.getName() + "\"");

                return new ResponseEntity<>(resource, headers, HttpStatus.OK);
            } else{
                return ResponseEntity.notFound().build();
            }

        }

        return ResponseEntity.notFound().build();
    }


    @GetMapping("/search")
    @PreAuthorize("hasAuthority('ADMIN')")
    public List<Employees> search(@RequestParam String searchTerm){
        return employeesService.searchByTerm(searchTerm);
    }


}
