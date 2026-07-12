package com.blog.controller;

import com.blog.dto.ArticleResponseDTO;
import com.blog.dto.PageResponse;
import com.blog.service.ArticleService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * 管理后台控制器（Admin 权限）
 */
@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final ArticleService articleService;

    public AdminController(ArticleService articleService) {
        this.articleService = articleService;
    }

    /** 管理后台：文章列表（含待审核/已拒绝） */
    @GetMapping("/articles")
    public ResponseEntity<?> articles(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String keyword) {
        PageResponse<ArticleResponseDTO> result = articleService.getAllArticles(page, size, keyword);
        return ResponseEntity.ok(result);
    }

    /** 管理后台：待审核文章列表 */
    @GetMapping("/articles/pending")
    public ResponseEntity<?> pendingArticles(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(articleService.getPendingArticles(page, size));
    }

    /** 管理后台：审核文章 */
    @PutMapping("/articles/{id}/review")
    public ResponseEntity<?> reviewArticle(@PathVariable Long id,
                                            @RequestParam String status,
                                            @RequestParam(required = false) String rejectReason) {
        if (!"APPROVED".equals(status) && !"REJECTED".equals(status)) {
            return ResponseEntity.badRequest().body(Map.of("message", "审核状态只能是 APPROVED 或 REJECTED"));
        }
        return ResponseEntity.ok(articleService.reviewArticle(id, status, rejectReason));
    }
}
