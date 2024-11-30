package com.example.springboot.service;

import com.example.springboot.model.Employees;
import com.example.springboot.repository.EmployeesRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AuthenticationService {
    @Autowired
    private EmployeesRepository employeesRepository;

    public Optional<Employees> authenticate(String username, String password){
        Optional<Employees> employee = employeesRepository.findByUsername(username);

        if (employee.isPresent() && employee.get().getPassword().equals(password)){
            return employee;
        }
        return Optional.empty();
    }

    public String getUserAccessrights(String username) {
        Optional<Employees> employees = employeesRepository.findByUsername(username);

        if (employees.isPresent()) {
            return employees.get().getAccessrights();
        }

        return null;
    }

    public String getName(String username) {
        Optional<Employees> employees = employeesRepository.findByUsername(username);

        if (employees.isPresent()) {
            return employees.get().getName();
        }

        return null;
    }

}
