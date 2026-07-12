package com.blog.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;
import java.util.List;

@Data
public class ArticleRequestDTO {

    @NotBlank(message = "文章标题不能为空")
    @Size(max = 200, message = "标题长度不能超过200")
    private String title;

    @Size(max = 500, message = "摘要长度不能超过500")
    private String summary;

    @NotBlank(message = "文章内容不能为空")
    private String content;

    private String coverImage;

    private Long categoryId;

    /** PENDING(待审核), DRAFT(草稿) — 普通用户提交默认为 PENDING */
    private String status;

    private List<Long> tagIds;
}
