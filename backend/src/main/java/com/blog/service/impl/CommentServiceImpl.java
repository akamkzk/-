package com.blog.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.blog.dto.*;
import com.blog.entity.Comment;
import com.blog.entity.User;
import com.blog.mapper.CommentMapper;
import com.blog.mapper.UserMapper;
import com.blog.service.CommentService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CommentServiceImpl implements CommentService {

    private final CommentMapper commentMapper;
    private final UserMapper userMapper;

    public CommentServiceImpl(CommentMapper commentMapper, UserMapper userMapper) {
        this.commentMapper = commentMapper;
        this.userMapper = userMapper;
    }

    @Override
    @Transactional
    public CommentResponseDTO createComment(Long userId, CommentRequestDTO dto) {
        Comment comment = new Comment();
        comment.setContent(dto.getContent());
        comment.setArticleId(dto.getArticleId());
        comment.setUserId(userId);
        comment.setParentId(dto.getParentId());
        comment.setStatus("APPROVED"); // 普通用户评论直接通过
        commentMapper.insert(comment);
        return toDTO(comment);
    }

    @Override
    @Transactional
    public CommentResponseDTO updateComment(Long adminId, Long commentId, String status) {
        Comment comment = commentMapper.selectById(commentId);
        if (comment == null) throw new RuntimeException("评论不存在");
        comment.setStatus(status);
        commentMapper.updateById(comment);
        return toDTO(comment);
    }

    @Override
    @Transactional
    public void deleteComment(Long adminId, Long commentId) {
        commentMapper.deleteById(commentId);
    }

    @Override
    public PageResponse<CommentResponseDTO> getArticleComments(Long articleId, int page, int size) {
        LambdaQueryWrapper<Comment> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Comment::getArticleId, articleId)
                .orderByAsc(Comment::getCreatedAt);
        Page<Comment> result = commentMapper.selectPage(new Page<>(page, size), wrapper);
        List<CommentResponseDTO> dtos = result.getRecords().stream().map(this::toDTO).collect(Collectors.toList());
        return PageResponse.of(dtos, result.getTotal(), page, size);
    }

    @Override
    public PageResponse<CommentResponseDTO> getPendingComments(int page, int size) {
        LambdaQueryWrapper<Comment> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Comment::getStatus, "PENDING")
                .orderByAsc(Comment::getCreatedAt);
        Page<Comment> result = commentMapper.selectPage(new Page<>(page, size), wrapper);
        List<CommentResponseDTO> dtos = result.getRecords().stream().map(this::toDTO).collect(Collectors.toList());
        return PageResponse.of(dtos, result.getTotal(), page, size);
    }

    @Override
    public List<CommentResponseDTO> getApprovedComments(Long articleId) {
        LambdaQueryWrapper<Comment> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Comment::getArticleId, articleId)
                .eq(Comment::getStatus, "APPROVED")
                .orderByAsc(Comment::getCreatedAt);
        return commentMapper.selectList(wrapper).stream().map(this::toDTO).collect(Collectors.toList());
    }

    private CommentResponseDTO toDTO(Comment c) {
        CommentResponseDTO dto = new CommentResponseDTO();
        dto.setId(c.getId());
        dto.setContent(c.getContent());
        dto.setArticleId(c.getArticleId());
        dto.setUserId(c.getUserId());
        dto.setParentId(c.getParentId());
        dto.setStatus(c.getStatus());
        dto.setCreatedAt(c.getCreatedAt());
        dto.setUpdatedAt(c.getUpdatedAt());

        User user = userMapper.selectById(c.getUserId());
        if (user != null) {
            dto.setUsername(user.getUsername());
            dto.setAvatar(user.getAvatar());
        }
        return dto;
    }
}
