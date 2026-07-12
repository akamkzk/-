package com.blog.controller;

import com.blog.dto.CommentRequestDTO;
import com.blog.dto.CommentResponseDTO;
import com.blog.dto.PageResponse;
import com.blog.service.CommentService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/comments")
public class CommentController {

    private final CommentService commentService;

    public CommentController(CommentService commentService) {
        this.commentService = commentService;
    }

    /** 公开：获取某文章的已审核评论 */
    @GetMapping("/public/{articleId}")
    public ResponseEntity<?> getPublicComments(@PathVariable Long articleId) {
        return ResponseEntity.ok(commentService.getApprovedComments(articleId));
    }

    /** 私有：发表评论 */
    @PostMapping
    public ResponseEntity<?> create(Authentication authentication,
                                     @Valid @RequestBody CommentRequestDTO dto) {
        Long userId = Long.parseLong(authentication.getName());
        return ResponseEntity.ok(commentService.createComment(userId, dto));
    }

    /** Admin：待审核评论列表 */
    @GetMapping("/pending")
    public ResponseEntity<?> getPending(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(commentService.getPendingComments(page, size));
    }

    /** Admin：审核/拒绝评论 */
    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(@PathVariable Long id,
                                          @RequestParam String status) {
        return ResponseEntity.ok(commentService.updateComment(1L, id, status));
    }

    /** Admin：删除评论 */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        commentService.deleteComment(1L, id);
        return ResponseEntity.ok(Map.of("message", "评论删除成功"));
    }
}
