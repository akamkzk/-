package com.blog.service;

import com.blog.dto.CommentRequestDTO;
import com.blog.dto.CommentResponseDTO;
import com.blog.dto.PageResponse;
import java.util.List;

public interface CommentService {
    CommentResponseDTO createComment(Long userId, CommentRequestDTO dto);
    CommentResponseDTO updateComment(Long adminId, Long commentId, String status);
    void deleteComment(Long adminId, Long commentId);
    PageResponse<CommentResponseDTO> getArticleComments(Long articleId, int page, int size);
    PageResponse<CommentResponseDTO> getPendingComments(int page, int size);
    List<CommentResponseDTO> getApprovedComments(Long articleId);
}
