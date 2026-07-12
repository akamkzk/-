package com.blog.dto;

import lombok.Data;

/**
 * JWT 令牌响应
 */
@Data
public class JwtResponse {

    private String token;
    private String type = "Bearer";
    private Long id;
    private String username;
    private String role;
    private String email;
    private String avatar;

    public JwtResponse(String token, Long id, String username, String role, String email, String avatar) {
        this.token = token;
        this.id = id;
        this.username = username;
        this.role = role;
        this.email = email;
        this.avatar = avatar;
    }
}
