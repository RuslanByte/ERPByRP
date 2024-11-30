package com.example.springboot.service;

import com.example.springboot.model.Employees;
import com.example.springboot.repository.EmployeesRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collection;
import java.util.Collections;
import java.util.Optional;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    private EmployeesRepository employeesRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Optional<Employees> employeeOpt = employeesRepository.findByUsername(username);
        if (!employeeOpt.isPresent()) {
            throw new UsernameNotFoundException("Пользователь не найден с логином: " + username);
        }
        Employees employee = employeeOpt.get();
        return new org.springframework.security.core.userdetails.User(employee.getUsername(),
                employee.getPassword(), getAuthorities(employee));
    }

    private Collection<? extends GrantedAuthority> getAuthorities(Employees employee) {
        String accessRight = employee.getAccessrights();
        SimpleGrantedAuthority authority = new SimpleGrantedAuthority(accessRight);
        return Collections.singletonList(authority);
    }
}