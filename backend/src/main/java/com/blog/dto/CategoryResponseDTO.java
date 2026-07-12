package com.blog.dto;

import lombok.Data;
import java.time.LocalDateTime;

/**
 * 分类响应 DTO
 */
@Data
public class CategoryResponseDTO {

    private Long id;
    private String name;
    private String description;
    private Integer sortOrder;
    private LocalDateTime createdAt;
}
