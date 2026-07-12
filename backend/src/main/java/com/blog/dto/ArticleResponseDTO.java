package com.blog.dto;

import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

/**
 * 文章详情响应 DTO（含作者名、分类名、标签列表）
 */
@Data
public class ArticleResponseDTO {

    private Long id;
    private String title;
    private String summary;
    private String content;
    private String coverImage;
    private Long userId;
    private String authorName;
    private Long categoryId;
    private String categoryName;
    private String status;
    private String rejectReason;
    private Integer viewCount;
    private Boolean isTop;
    private LocalDateTime publishedAt;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private List<TagDTO> tags;

    @Data
    public static class TagDTO {
        private Long id;
        private String name;
    }
}
