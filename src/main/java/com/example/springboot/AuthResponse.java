package com.example.springboot;

public class AuthResponse {
    private String token;
    private String accessrights;
    private String name;

    public AuthResponse(String token, String accessrights, String name) {
        this.token = token;
        this.accessrights = accessrights;
        this.name = name;
    }

    public String getToken() {
        return token;
    }

    public String getAccessrights() {
        return accessrights;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

}
