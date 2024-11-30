package com.example.springboot.model;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
public class Employees {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String username;
    private String password;
    private String accessrights;
    private String surname;
    private String name;
    private String patronymic;
    private String address;
    private String uniquehash;
    private String amount;
    private String telephone;
    private String comment;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", timezone = "UTC")
    private LocalDateTime time;

    private String photopath;

    public Employees(){
    }

    public Employees(String username, String password, String surname, String name, String patronymic, String address, String accessrights, String uniquehash, String amount, String telephone, String comment, LocalDateTime time, String photopath){
        this.username = username;
        this.password = password;
        this.accessrights = accessrights;
        this.surname = surname;
        this.name = name;
        this.patronymic = patronymic;
        this.address = address;
        this.uniquehash = uniquehash;
        this.amount = amount;
        this.telephone = telephone;
        this.comment = comment;
        this.time = time;
        this.photopath = photopath;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getAccessrights() {
        return accessrights;
    }

    public void setAccessrights(String accessrights) {
        this.accessrights = accessrights;
    }

    public String getSurname() {
        return surname;
    }

    public void setSurname(String surname) {
        this.surname = surname;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getPatronymic() {
        return patronymic;
    }

    public void setPatronymic(String patronymic) {
        this.patronymic = patronymic;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getUniqueHash() {
        return uniquehash;
    }

    public void setUniqueHash(String uniquehash) {
        this.uniquehash = uniquehash;
    }

    public String getAmount() {
        return amount;
    }

    public void setAmount(String amount) {
        this.amount = amount;
    }

    public String getTelephone() {
        return telephone;
    }

    public void setTelephone(String telephone) {
        this.telephone = telephone;
    }

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }

    public LocalDateTime getTime() {
        return time;
    }

    public void setTime(LocalDateTime time) {
        this.time = time;
    }


    public String getPhotoPath() {
        return photopath;
    }

    public void setPhotoPath(String photopath) {
        this.photopath = photopath;
    }
}
