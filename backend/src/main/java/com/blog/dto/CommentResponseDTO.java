package com.blog.dto;

import lombok.Data;
import java.time.LocalDateTime;

/**
 * 评论响应 DTO（含用户名、头像）
 */
@Data
public class CommentResponseDTO {

    private Long id;
    private String content;
    private Long articleId;
    private Long userId;
    private String username;
    private String avatar;
    private Long parentId;
    private String status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
