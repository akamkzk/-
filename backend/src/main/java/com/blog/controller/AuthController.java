package com.blog.controller;

import com.blog.dto.*;
import com.blog.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserService userService;

    public AuthController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterDTO dto) {
        try {
            JwtResponse response = userService.register(dto);
            if (response.getAvatar() != null && response.getAvatar().contains("/uploads/uploads")) {
                response.setAvatar(response.getAvatar().replace("/uploads/uploads", "/uploads"));
            }
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginDTO dto) {
        try {
            JwtResponse response = userService.login(dto);
            if (response.getAvatar() != null && response.getAvatar().contains("/uploads/uploads")) {
                response.setAvatar(response.getAvatar().replace("/uploads/uploads", "/uploads"));
            }
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@Valid @RequestBody ForgotPasswordDTO dto) {
        try {
            userService.forgotPassword(dto);
            return ResponseEntity.ok(Map.of("message", "验证成功，请设置新密码"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@Valid @RequestBody ResetPasswordDTO dto) {
        try {
            userService.resetPassword(dto);
            return ResponseEntity.ok(Map.of("message", "密码重置成功，请使用新密码登录"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(Authentication authentication) {
        Long userId = Long.parseLong(authentication.getName());
        var user = userService.getCurrentUser(userId);
        String avatar = user.getAvatar();
        if (avatar != null && avatar.contains("/uploads/uploads")) {
            avatar = avatar.replace("/uploads/uploads", "/uploads");
        }
        return ResponseEntity.ok(Map.of(
                "id", user.getId(),
                "username", user.getUsername(),
                "nickname", user.getNickname(),
                "email", user.getEmail(),
                "avatar", avatar,
                "bio", user.getBio(),
                "role", user.getRole(),
                "createdAt", user.getCreatedAt()
        ));
    }

    @PutMapping("/profile")
    public ResponseEntity<?> updateProfile(Authentication authentication,
                                           @Valid @RequestBody UpdateProfileDTO dto) {
        Long userId = Long.parseLong(authentication.getName());
        userService.updateProfile(userId, dto);
        // 同步返回更新后的用户信息
        var user = userService.getCurrentUser(userId);
        String avatar = user.getAvatar();
        if (avatar != null && avatar.contains("/uploads/uploads")) {
            avatar = avatar.replace("/uploads/uploads", "/uploads");
        }
        return ResponseEntity.ok(Map.of(
                "message", "个人资料更新成功",
                "avatar", avatar
        ));
    }

    @PutMapping("/password")
    public ResponseEntity<?> changePassword(Authentication authentication,
                                            @Valid @RequestBody ChangePasswordDTO dto) {
        Long userId = Long.parseLong(authentication.getName());
        userService.changePassword(userId, dto);
        return ResponseEntity.ok(Map.of("message", "密码修改成功"));
    }

    @GetMapping("/stats")
    public ResponseEntity<?> getStats(Authentication authentication) {
        Long userId = Long.parseLong(authentication.getName());
        return ResponseEntity.ok(userService.getUserStats(userId));
    }

    /** 上传头像 */
    @PostMapping("/upload-avatar")
    public ResponseEntity<?> uploadAvatar(Authentication authentication,
                                          @RequestParam("file") org.springframework.web.multipart.MultipartFile file) {
        try {
            Long userId = Long.parseLong(authentication.getName());
            String avatarUrl = userService.uploadAvatar(userId, file);
            return ResponseEntity.ok(Map.of("avatar", avatarUrl));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }
}
