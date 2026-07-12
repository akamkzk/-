package com.blog.controller;

import com.blog.dto.ArticleRequestDTO;
import com.blog.dto.ArticleResponseDTO;
import com.blog.dto.PageResponse;
import com.blog.service.ArticleService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/articles")
public class ArticleController {

    private final ArticleService articleService;

    public ArticleController(ArticleService articleService) {
        this.articleService = articleService;
    }

    /** 公开：获取已发布文章列表（分页+筛选） */
    @GetMapping
    public ResponseEntity<?> list(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) List<Long> tagIds) {
        PageResponse<ArticleResponseDTO> result = articleService.getArticles(page, size, keyword, categoryId, tagIds);
        return ResponseEntity.ok(result);
    }

    /** 公开：获取最新文章 */
    @GetMapping("/latest")
    public ResponseEntity<?> latest(@RequestParam(defaultValue = "6") int limit) {
        return ResponseEntity.ok(articleService.getLatestArticles(limit));
    }

    /** 公开：文章详情 */
    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable Long id) {
        return ResponseEntity.ok(articleService.getArticleById(id));
    }

    /** 私有：创建文章（普通用户默认为待审核） */
    @PostMapping
    public ResponseEntity<?> create(Authentication authentication,
                                     @Valid @RequestBody ArticleRequestDTO dto) {
        Long userId = Long.parseLong(authentication.getName());
        return ResponseEntity.ok(articleService.createArticle(userId, dto));
    }

    /** 私有：更新文章 */
    @PutMapping("/{id}")
    public ResponseEntity<?> update(Authentication authentication,
                                     @PathVariable Long id,
                                     @Valid @RequestBody ArticleRequestDTO dto) {
        Long userId = Long.parseLong(authentication.getName());
        return ResponseEntity.ok(articleService.updateArticle(userId, id, dto));
    }

    /** 私有：删除文章 */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(Authentication authentication,
                                     @PathVariable Long id) {
        Long userId = Long.parseLong(authentication.getName());
        articleService.deleteArticle(userId, id);
        return ResponseEntity.ok(Map.of("message", "文章删除成功"));
    }

    /** 私有：我的投稿（按用户查询） */
    @GetMapping("/my")
    public ResponseEntity<?> myArticles(Authentication authentication,
                                         @RequestParam(defaultValue = "1") int page,
                                         @RequestParam(defaultValue = "10") int size) {
        Long userId = Long.parseLong(authentication.getName());
        return ResponseEntity.ok(articleService.getUserArticles(userId, page, size));
    }
}
