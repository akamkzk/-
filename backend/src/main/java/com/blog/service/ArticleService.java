package com.blog.service;

import com.blog.dto.ArticleRequestDTO;
import com.blog.dto.ArticleResponseDTO;
import com.blog.dto.PageResponse;
import java.util.List;

public interface ArticleService {
    ArticleResponseDTO createArticle(Long userId, ArticleRequestDTO dto);
    ArticleResponseDTO updateArticle(Long userId, Long articleId, ArticleRequestDTO dto);
    void deleteArticle(Long userId, Long articleId);
    ArticleResponseDTO getArticleById(Long articleId);
    PageResponse<ArticleResponseDTO> getArticles(int page, int size, String keyword, Long categoryId, List<Long> tagIds);
    List<ArticleResponseDTO> getLatestArticles(int limit);

    // 用户投稿相关
    PageResponse<ArticleResponseDTO> getUserArticles(Long userId, int page, int size);

    // 管理员审核相关
    ArticleResponseDTO reviewArticle(Long articleId, String status, String rejectReason);
    PageResponse<ArticleResponseDTO> getPendingArticles(int page, int size);
    PageResponse<ArticleResponseDTO> getAllArticles(int page, int size, String keyword);
}
