package com.blog.dto;

import lombok.Data;

/**
 * 个人中心统计信息
 */
@Data
public class ProfileStatsDTO {
    private long totalArticles;
    private long published;
    private long pending;
    private long drafts;
    private long rejected;
    private long totalViews;
}
