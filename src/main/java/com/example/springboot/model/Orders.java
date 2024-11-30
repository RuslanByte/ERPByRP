package com.example.springboot.model;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

import java.time.LocalDateTime;

@Entity
public class Orders {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String city;
    private String district;
    private String street;
    private String house;
    private String entrance;
    private String floor;
    private String apartment;
    private String coldcounter;
    private String hotcounter;
    private String pricecoldhotcounter;
    private String heatmeter;
    private String priceheatmeter;
    private String amount;
    private String telephone;
    private String comment;
    private String lat;
    private String lon;
    private String master;
    private String formofpayment;
    private String status;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", timezone = "UTC")
    private LocalDateTime addOrderTime;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", timezone = "UTC")
    private LocalDateTime completeOrderTime;

    public Orders() {
    }

    public Orders(String city, String street, String house, String entrance, String floor, String apartment, String coldcounter, String hotcounter, String pricecoldhotcounter, String heatmeter, String priceheatmeter, String amount, String telephone, String comment, String lat, String lon, String district, String master, String formofpayment, String status, LocalDateTime addOrderTime, LocalDateTime completeOrderTime) {
        this.city = city;
        this.street = street;
        this.house = house;
        this.entrance = entrance;
        this.floor = floor;
        this.apartment = apartment;
        this.coldcounter = coldcounter;
        this.hotcounter = hotcounter;
        this.pricecoldhotcounter = pricecoldhotcounter;
        this.heatmeter = heatmeter;
        this.priceheatmeter = priceheatmeter;
        this.amount = amount;
        this.telephone = telephone;
        this.comment = comment;
        this.lat = lat;
        this.lon = lon;
        this.district = district;
        this.master = master;
        this.formofpayment = formofpayment;
        this.status = status;
        this.addOrderTime = addOrderTime;
        this.completeOrderTime = completeOrderTime;
    }


    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getDistrict() {
        return district;
    }

    public void setDistrict(String district) {
        this.district = district;
    }

    public String getStreet() {
        return street;
    }

    public void setStreet(String street) {
        this.street = street;
    }

    public String getHouse() {
        return house;
    }

    public void setHouse(String house) {
        this.house = house;
    }

    public String getEntrance() {
        return entrance;
    }

    public void setEntrance(String entrance) {
        this.entrance = entrance;
    }

    public String getFloor() {
        return floor;
    }

    public void setFloor(String floor) {
        this.floor = floor;
    }

    public String getApartment() {
        return apartment;
    }

    public void setApartment(String apartment) {
        this.apartment = apartment;
    }

    public String getColdcounter() {
        return coldcounter;
    }

    public void setColdcounter(String coldcounter) {
        this.coldcounter = coldcounter;
    }

    public String getHotcounter() {
        return hotcounter;
    }

    public void setHotcounter(String hotcounter) {
        this.hotcounter = hotcounter;
    }

    public String getPricecoldhotcounter() {
        return pricecoldhotcounter;
    }

    public void setPricecoldhotcounter(String pricecoldhotcounter) {
        this.pricecoldhotcounter = pricecoldhotcounter;
    }

    public String getHeatmeter() {
        return heatmeter;
    }

    public void setHeatmeter(String heatmeter) {
        this.heatmeter = heatmeter;
    }

    public String getPriceheatmeter() {
        return priceheatmeter;
    }

    public void setPriceheatmeter(String priceheatmeter) {
        this.priceheatmeter = priceheatmeter;
    }

    public String getAmount() {
        return amount;
    }

    public void setamount(String amount) {
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

    public String getLat() {
        return lat;
    }

    public void setLat(String lat) {
        this.lat = lat;
    }

    public String getLon() {
        return lon;
    }

    public void setLon(String lon) {
        this.lon = lon;
    }

    public String getMaster() {
        return master;
    }

    public void setMaster(String master) {
        this.master = master;
    }

    public String getFormofpayment() {
        return formofpayment;
    }

    public void setFormofpayment(String formofpayment) {
        this.formofpayment = formofpayment;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public LocalDateTime getAddOrderTime() {
        return addOrderTime;
    }

    public void setAddOrderTime(LocalDateTime addOrderTime) {
        this.addOrderTime = addOrderTime;
    }

    public LocalDateTime getCompleteOrderTime() {
        return completeOrderTime;
    }

    public void setCompleteOrderTime() {
        this.completeOrderTime = LocalDateTime.now();
    }
}
