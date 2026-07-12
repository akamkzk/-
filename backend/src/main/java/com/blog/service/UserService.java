package com.blog.service;

import com.blog.dto.*;
import com.blog.entity.User;
import java.util.List;

/**
 * 用户服务接口
 */
public interface UserService {
    JwtResponse register(RegisterDTO registerDTO);
    JwtResponse login(LoginDTO loginDTO);
    User getCurrentUser(Long userId);
    void updateProfile(Long userId, UpdateProfileDTO dto);
    void changePassword(Long userId, ChangePasswordDTO dto);
    void forgotPassword(ForgotPasswordDTO dto);
    void resetPassword(ResetPasswordDTO dto);
    ProfileStatsDTO getUserStats(Long userId);
    String uploadAvatar(Long userId, org.springframework.web.multipart.MultipartFile file);
    List<CategoryResponseDTO> getAllCategories();
    List<TagResponseDTO> getAllTags();
}
