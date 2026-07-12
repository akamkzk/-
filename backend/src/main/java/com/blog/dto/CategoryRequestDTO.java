package com.blog.dto;

import lombok.Data;

/**
 * 分类请求 DTO
 */
@Data
public class CategoryRequestDTO {

    private String name;
    private String description;
    private Integer sortOrder;
}
