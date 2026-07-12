package com.blog.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 通用分页响应
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PageResponse<T> {

    private java.util.List<T> data;
    private long total;
    private int page;
    private int size;
    private int totalPages;

    public static <T> PageResponse<T> of(java.util.List<T> data, long total, int page, int size) {
        int totalPages = (int) Math.ceil((double) total / size);
        return new PageResponse<>(data, total, page, size, totalPages);
    }
}
