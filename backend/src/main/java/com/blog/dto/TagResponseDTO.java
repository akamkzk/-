package com.blog.dto;

import lombok.Data;
import java.time.LocalDateTime;

/**
 * 标签响应 DTO
 */
@Data
public class TagResponseDTO {

    private Long id;
    private String name;
    private LocalDateTime createdAt;
}
