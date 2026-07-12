package com.blog.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.blog.dto.*;
import com.blog.entity.Article;
import com.blog.entity.Category;
import com.blog.entity.Tag;
import com.blog.entity.User;
import com.blog.mapper.ArticleMapper;
import com.blog.mapper.CategoryMapper;
import com.blog.mapper.TagMapper;
import com.blog.mapper.UserMapper;
import com.blog.service.UserService;
import com.blog.util.JwtUtil;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class UserServiceImpl implements UserService {

    private final UserMapper userMapper;
    private final ArticleMapper articleMapper;
    private final CategoryMapper categoryMapper;
    private final TagMapper tagMapper;
    private final JwtUtil jwtUtil;
    private final PasswordEncoder passwordEncoder;

    public UserServiceImpl(UserMapper userMapper, ArticleMapper articleMapper,
                           CategoryMapper categoryMapper, TagMapper tagMapper,
                           JwtUtil jwtUtil, PasswordEncoder passwordEncoder) {
        this.userMapper = userMapper;
        this.articleMapper = articleMapper;
        this.categoryMapper = categoryMapper;
        this.tagMapper = tagMapper;
        this.jwtUtil = jwtUtil;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public JwtResponse register(RegisterDTO registerDTO) {
        LambdaQueryWrapper<User> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(User::getUsername, registerDTO.getUsername());
        if (userMapper.selectCount(wrapper) > 0) {
            throw new RuntimeException("用户名已存在");
        }

        User user = new User();
        user.setUsername(registerDTO.getUsername());
        user.setPassword(passwordEncoder.encode(registerDTO.getPassword()));
        user.setEmail(registerDTO.getEmail() != null ? registerDTO.getEmail() : "");
        user.setNickname(registerDTO.getUsername());
        user.setRole("USER");

        userMapper.insert(user);

        String token = jwtUtil.generateToken(user.getId(), user.getUsername(), user.getRole());
        return new JwtResponse(token, user.getId(), user.getUsername(), user.getRole(), user.getEmail(), user.getAvatar());
    }

    @Override
    public JwtResponse login(LoginDTO loginDTO) {
        LambdaQueryWrapper<User> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(User::getUsername, loginDTO.getUsername());
        User user = userMapper.selectOne(wrapper);

        if (user == null || !passwordEncoder.matches(loginDTO.getPassword(), user.getPassword())) {
            throw new RuntimeException("用户名或密码错误");
        }

        String token = jwtUtil.generateToken(user.getId(), user.getUsername(), user.getRole());
        return new JwtResponse(token, user.getId(), user.getUsername(), user.getRole(), user.getEmail(), user.getAvatar());
    }

    @Override
    public User getCurrentUser(Long userId) {
        return userMapper.selectById(userId);
    }

    @Override
    public void updateProfile(Long userId, UpdateProfileDTO dto) {
        User user = userMapper.selectById(userId);
        if (user == null) {
            throw new RuntimeException("用户不存在");
        }
        if (dto.getNickname() != null) user.setNickname(dto.getNickname());
        if (dto.getAvatar() != null) user.setAvatar(dto.getAvatar());
        if (dto.getBio() != null) user.setBio(dto.getBio());
        userMapper.updateById(user);
    }

    @Override
    public void changePassword(Long userId, ChangePasswordDTO dto) {
        User user = userMapper.selectById(userId);
        if (user == null) {
            throw new RuntimeException("用户不存在");
        }
        if (!passwordEncoder.matches(dto.getOldPassword(), user.getPassword())) {
            throw new RuntimeException("旧密码不正确");
        }
        user.setPassword(passwordEncoder.encode(dto.getNewPassword()));
        userMapper.updateById(user);
    }

    @Override
    public void forgotPassword(ForgotPasswordDTO dto) {
        LambdaQueryWrapper<User> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(User::getUsername, dto.getUsername())
                .eq(User::getEmail, dto.getEmail());
        User user = userMapper.selectOne(wrapper);

        if (user == null) {
            throw new RuntimeException("用户名或邮箱不匹配");
        }
    }

    @Override
    public void resetPassword(ResetPasswordDTO dto) {
        LambdaQueryWrapper<User> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(User::getUsername, dto.getUsername())
                .eq(User::getEmail, dto.getEmail());
        User user = userMapper.selectOne(wrapper);

        if (user == null) {
            throw new RuntimeException("用户名或邮箱不匹配");
        }

        user.setPassword(passwordEncoder.encode(dto.getNewPassword()));
        userMapper.updateById(user);
    }

    @Override
    public List<CategoryResponseDTO> getAllCategories() {
        return categoryMapper.selectList(null).stream()
                .map(c -> {
                    CategoryResponseDTO dto = new CategoryResponseDTO();
                    dto.setId(c.getId());
                    dto.setName(c.getName());
                    dto.setDescription(c.getDescription());
                    dto.setSortOrder(c.getSortOrder());
                    dto.setCreatedAt(c.getCreatedAt());
                    return dto;
                })
                .collect(Collectors.toList());
    }

    @Override
    public List<TagResponseDTO> getAllTags() {
        return tagMapper.selectList(null).stream()
                .map(t -> {
                    TagResponseDTO dto = new TagResponseDTO();
                    dto.setId(t.getId());
                    dto.setName(t.getName());
                    dto.setCreatedAt(t.getCreatedAt());
                    return dto;
                })
                .collect(Collectors.toList());
    }

    /**
     * 获取用户统计信息
     */
    public ProfileStatsDTO getUserStats(Long userId) {
        ProfileStatsDTO stats = new ProfileStatsDTO();

        LambdaQueryWrapper<Article> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Article::getUserId, userId);

        // 总数
        stats.setTotalArticles(articleMapper.selectCount(wrapper));

        // 按状态统计
        wrapper.eq(Article::getStatus, "APPROVED");
        stats.setPublished(articleMapper.selectCount(wrapper));

        wrapper.eq(Article::getStatus, "PENDING");
        stats.setPending(articleMapper.selectCount(wrapper));

        wrapper.eq(Article::getStatus, "DRAFT");
        stats.setDrafts(articleMapper.selectCount(wrapper));

        wrapper.eq(Article::getStatus, "REJECTED");
        stats.setRejected(articleMapper.selectCount(wrapper));

        // 总浏览量
        wrapper.last(""); // 清除条件
        List<Article> articles = articleMapper.selectList(new LambdaQueryWrapper<Article>().eq(Article::getUserId, userId));
        long totalViews = articles.stream().mapToLong(Article::getViewCount).sum();
        stats.setTotalViews(totalViews);

        return stats;
    }

    /**
     * 上传头像文件
     */
    @Override
    public String uploadAvatar(Long userId, org.springframework.web.multipart.MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new RuntimeException("请选择要上传的图片");
        }

        // 校验文件格式
        String contentType = file.getContentType();
        if (contentType == null || !contentType.startsWith("image/")) {
            throw new RuntimeException("只能上传图片文件");
        }

        // 创建上传目录
        String uploadDir = System.getProperty("user.dir") + "/uploads/avatars/";
        File dir = new File(uploadDir);
        if (!dir.exists()) {
            dir.mkdirs();
        }

        // 生成唯一文件名
        String originalFilename = file.getOriginalFilename();
        String extension = originalFilename != null && originalFilename.contains(".")
                ? originalFilename.substring(originalFilename.lastIndexOf("."))
                : ".jpg";
        String fileName = UUID.randomUUID().toString() + extension;
        Path filePath = Paths.get(uploadDir + fileName);

        try {
            Files.write(filePath, file.getBytes());
        } catch (IOException e) {
            throw new RuntimeException("图片上传失败");
        }

        // 保存路径到数据库
        String avatarUrl = "/uploads/avatars/" + fileName;
        User user = userMapper.selectById(userId);
        if (user != null) {
            user.setAvatar(avatarUrl);
            userMapper.updateById(user);
        }

        return avatarUrl;
    }
}
