package com.blog.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.blog.dto.*;
import com.blog.entity.*;
import com.blog.mapper.*;
import com.blog.service.ArticleService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ArticleServiceImpl implements ArticleService {

    private final ArticleMapper articleMapper;
    private final UserMapper userMapper;
    private final CategoryMapper categoryMapper;
    private final TagMapper tagMapper;
    private final ArticleTagMapper articleTagMapper;

    public ArticleServiceImpl(ArticleMapper articleMapper, UserMapper userMapper,
                              CategoryMapper categoryMapper, TagMapper tagMapper,
                              ArticleTagMapper articleTagMapper) {
        this.articleMapper = articleMapper;
        this.userMapper = userMapper;
        this.categoryMapper = categoryMapper;
        this.tagMapper = tagMapper;
        this.articleTagMapper = articleTagMapper;
    }

    @Override
    @Transactional
    public ArticleResponseDTO createArticle(Long userId, ArticleRequestDTO dto) {
        Article article = new Article();
        article.setTitle(dto.getTitle());
        article.setSummary(dto.getSummary() != null ? dto.getSummary() : "");
        article.setContent(dto.getContent());
        article.setCoverImage(dto.getCoverImage() != null ? dto.getCoverImage() : "");
        article.setUserId(userId);
        article.setCategoryId(dto.getCategoryId());
        // 普通用户提交默认为 PENDING（待审核）
        article.setStatus(dto.getStatus() != null ? dto.getStatus() : "PENDING");
        article.setViewCount(0);
        article.setIsTop(false);

        if ("APPROVED".equals(article.getStatus())) {
            article.setPublishedAt(java.time.LocalDateTime.now());
        }

        articleMapper.insert(article);
        bindTags(article.getId(), dto.getTagIds());
        return getArticleResponse(article);
    }

    @Override
    @Transactional
    public ArticleResponseDTO updateArticle(Long userId, Long articleId, ArticleRequestDTO dto) {
        Article article = articleMapper.selectById(articleId);
        if (article == null) {
            throw new RuntimeException("文章不存在");
        }
        if (!article.getUserId().equals(userId)) {
            throw new RuntimeException("无权编辑该文章");
        }

        article.setTitle(dto.getTitle());
        article.setSummary(dto.getSummary() != null ? dto.getSummary() : "");
        article.setContent(dto.getContent());
        article.setCoverImage(dto.getCoverImage() != null ? dto.getCoverImage() : "");
        article.setCategoryId(dto.getCategoryId());

        // 如果修改了内容或标题，需要重新审核
        if (!"DRAFT".equals(article.getStatus())) {
            article.setStatus("PENDING");
            article.setRejectReason(null);
        }
        if (dto.getStatus() != null) {
            article.setStatus(dto.getStatus());
        }

        if ("APPROVED".equals(article.getStatus()) && article.getPublishedAt() == null) {
            article.setPublishedAt(java.time.LocalDateTime.now());
        }

        articleMapper.updateById(article);
        if (dto.getTagIds() != null) {
            bindTags(articleId, dto.getTagIds());
        }
        return getArticleResponse(article);
    }

    @Override
    @Transactional
    public void deleteArticle(Long userId, Long articleId) {
        Article article = articleMapper.selectById(articleId);
        if (article == null) {
            throw new RuntimeException("文章不存在");
        }
        if (!article.getUserId().equals(userId)) {
            throw new RuntimeException("无权删除该文章");
        }
        articleMapper.deleteById(articleId);
    }

    @Override
    public ArticleResponseDTO getArticleById(Long articleId) {
        Article article = articleMapper.selectById(articleId);
        if (article == null) {
            throw new RuntimeException("文章不存在");
        }
        // 增加浏览量
        article.setViewCount(article.getViewCount() + 1);
        articleMapper.updateById(article);
        return getArticleResponse(article);
    }

    @Override
    public PageResponse<ArticleResponseDTO> getArticles(int page, int size, String keyword, Long categoryId, List<Long> tagIds) {
        LambdaQueryWrapper<Article> wrapper = new LambdaQueryWrapper<>();
        // 首页只展示已发布的文章
        wrapper.eq(Article::getStatus, "APPROVED")
                .orderByDesc(Article::getIsTop)
                .orderByDesc(Article::getPublishedAt);

        if (StringUtils.hasText(keyword)) {
            wrapper.and(w -> w.like(Article::getTitle, keyword).or().like(Article::getSummary, keyword));
        }
        if (categoryId != null) {
            wrapper.eq(Article::getCategoryId, categoryId);
        }
        if (tagIds != null && !tagIds.isEmpty()) {
            wrapper.in(Article::getId,
                    articleTagMapper.selectList(new LambdaQueryWrapper<ArticleTag>().in(ArticleTag::getTagId, tagIds))
                            .stream().map(ArticleTag::getArticleId).collect(Collectors.toList()));
        }

        Page<Article> pageParam = new Page<>(page, size);
        Page<Article> result = articleMapper.selectPage(pageParam, wrapper);

        List<ArticleResponseDTO> dtos = result.getRecords().stream()
                .map(this::getArticleResponse)
                .collect(Collectors.toList());

        return PageResponse.of(dtos, result.getTotal(), page, size);
    }

    @Override
    public List<ArticleResponseDTO> getLatestArticles(int limit) {
        LambdaQueryWrapper<Article> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Article::getStatus, "APPROVED")
                .orderByDesc(Article::getPublishedAt)
                .last("LIMIT " + limit);
        return articleMapper.selectList(wrapper).stream()
                .map(this::getArticleResponse)
                .collect(Collectors.toList());
    }

    /**
     * 获取某用户的所有投稿（含审核状态）
     */
    public PageResponse<ArticleResponseDTO> getUserArticles(Long userId, int page, int size) {
        LambdaQueryWrapper<Article> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Article::getUserId, userId)
                .orderByDesc(Article::getCreatedAt);

        Page<Article> pageParam = new Page<>(page, size);
        Page<Article> result = articleMapper.selectPage(pageParam, wrapper);

        List<ArticleResponseDTO> dtos = result.getRecords().stream()
                .map(this::getArticleResponse)
                .collect(Collectors.toList());

        return PageResponse.of(dtos, result.getTotal(), page, size);
    }

    /**
     * 管理员审核文章
     */
    @Transactional
    public ArticleResponseDTO reviewArticle(Long articleId, String status, String rejectReason) {
        Article article = articleMapper.selectById(articleId);
        if (article == null) {
            throw new RuntimeException("文章不存在");
        }
        article.setStatus(status);
        article.setRejectReason(rejectReason);

        if ("APPROVED".equals(status)) {
            article.setPublishedAt(java.time.LocalDateTime.now());
            article.setIsTop(false);
        }

        articleMapper.updateById(article);
        return getArticleResponse(article);
    }

    /**
     * 管理员获取待审核文章列表
     */
    public PageResponse<ArticleResponseDTO> getPendingArticles(int page, int size) {
        LambdaQueryWrapper<Article> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Article::getStatus, "PENDING")
                .orderByDesc(Article::getCreatedAt);

        Page<Article> pageParam = new Page<>(page, size);
        Page<Article> result = articleMapper.selectPage(pageParam, wrapper);

        List<ArticleResponseDTO> dtos = result.getRecords().stream()
                .map(this::getArticleResponse)
                .collect(Collectors.toList());

        return PageResponse.of(dtos, result.getTotal(), page, size);
    }

    /**
     * 管理员获取所有文章列表（含待审核/已拒绝）
     */
    public PageResponse<ArticleResponseDTO> getAllArticles(int page, int size, String keyword) {
        LambdaQueryWrapper<Article> wrapper = new LambdaQueryWrapper<>();
        wrapper.orderByDesc(Article::getCreatedAt);

        if (StringUtils.hasText(keyword)) {
            wrapper.and(w -> w.like(Article::getTitle, keyword).or().like(Article::getSummary, keyword));
        }

        Page<Article> pageParam = new Page<>(page, size);
        Page<Article> result = articleMapper.selectPage(pageParam, wrapper);

        List<ArticleResponseDTO> dtos = result.getRecords().stream()
                .map(this::getArticleResponse)
                .collect(Collectors.toList());

        return PageResponse.of(dtos, result.getTotal(), page, size);
    }

    private ArticleResponseDTO getArticleResponse(Article article) {
        ArticleResponseDTO dto = new ArticleResponseDTO();
        dto.setId(article.getId());
        dto.setTitle(article.getTitle());
        dto.setSummary(article.getSummary());
        dto.setContent(article.getContent());
        dto.setCoverImage(article.getCoverImage());
        dto.setUserId(article.getUserId());
        dto.setCategoryId(article.getCategoryId());
        dto.setStatus(article.getStatus());
        dto.setRejectReason(article.getRejectReason());
        dto.setViewCount(article.getViewCount());
        dto.setIsTop(article.getIsTop());
        dto.setPublishedAt(article.getPublishedAt());
        dto.setCreatedAt(article.getCreatedAt());
        dto.setUpdatedAt(article.getUpdatedAt());

        // 作者名
        User user = userMapper.selectById(article.getUserId());
        if (user != null) dto.setAuthorName(user.getUsername());

        // 分类名
        if (article.getCategoryId() != null) {
            Category category = categoryMapper.selectById(article.getCategoryId());
            if (category != null) dto.setCategoryName(category.getName());
        }

        // 标签列表
        List<ArticleTag> articleTags = articleTagMapper.selectList(
                new LambdaQueryWrapper<ArticleTag>().eq(ArticleTag::getArticleId, article.getId()));
        List<ArticleResponseDTO.TagDTO> tags = new ArrayList<>();
        for (ArticleTag at : articleTags) {
            Tag tag = tagMapper.selectById(at.getTagId());
            if (tag != null) {
                ArticleResponseDTO.TagDTO t = new ArticleResponseDTO.TagDTO();
                t.setId(tag.getId());
                t.setName(tag.getName());
                tags.add(t);
            }
        }
        dto.setTags(tags);

        return dto;
    }

    private void bindTags(Long articleId, List<Long> tagIds) {
        articleTagMapper.delete(new LambdaQueryWrapper<ArticleTag>().eq(ArticleTag::getArticleId, articleId));
        if (tagIds != null) {
            for (Long tagId : tagIds) {
                ArticleTag articleTag = new ArticleTag();
                articleTag.setArticleId(articleId);
                articleTag.setTagId(tagId);
                articleTagMapper.insert(articleTag);
            }
        }
    }
}
