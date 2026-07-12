package com.blog.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@TableName("articles")
public class Article {

    @TableId(type = IdType.AUTO)
    private Long id;

    private String title;

    private String summary;

    private String content;

    private String coverImage;

    private Long userId;

    private Long categoryId;

    /** 状态: PENDING(待审核), APPROVED(已发布), REJECTED(已拒绝), DRAFT(草稿) */
    private String status;

    /** 拒绝原因 */
    private String rejectReason;

    private Integer viewCount;

    private Boolean isTop;

    private LocalDateTime publishedAt;

    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createdAt;

    @TableField(fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updatedAt;
}
