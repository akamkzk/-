package com.blog.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CommentRequestDTO {

    @NotBlank(message = "评论内容不能为空")
    private String content;

    @NotNull(message = "文章ID不能为空")
    private Long articleId;

    /** 回复的评论ID，顶级评论传 null */
    private Long parentId;
}
