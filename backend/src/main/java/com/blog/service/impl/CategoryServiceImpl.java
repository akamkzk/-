package com.blog.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.blog.dto.*;
import com.blog.entity.Category;
import com.blog.entity.Comment;
import com.blog.entity.User;
import com.blog.mapper.CategoryMapper;
import com.blog.mapper.CommentMapper;
import com.blog.mapper.UserMapper;
import com.blog.service.CommentService;
import com.blog.service.CategoryService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CategoryServiceImpl implements CategoryService {

    private final CategoryMapper categoryMapper;

    public CategoryServiceImpl(CategoryMapper categoryMapper) {
        this.categoryMapper = categoryMapper;
    }

    @Override
    public List<CategoryResponseDTO> listAll() {
        return categoryMapper.selectList(null).stream().map(c -> toDTO(c)).collect(Collectors.toList());
    }

    @Override
    @Transactional
    public CategoryResponseDTO create(CategoryRequestDTO dto) {
        Category category = new Category();
        category.setName(dto.getName());
        category.setDescription(dto.getDescription() != null ? dto.getDescription() : "");
        category.setSortOrder(dto.getSortOrder() != null ? dto.getSortOrder() : 0);
        categoryMapper.insert(category);
        return toDTO(category);
    }

    @Override
    @Transactional
    public CategoryResponseDTO update(Long id, CategoryRequestDTO dto) {
        Category category = categoryMapper.selectById(id);
        if (category == null) throw new RuntimeException("分类不存在");
        category.setName(dto.getName());
        category.setDescription(dto.getDescription());
        category.setSortOrder(dto.getSortOrder());
        categoryMapper.updateById(category);
        return toDTO(category);
    }

    @Override
    @Transactional
    public void delete(Long id) {
        categoryMapper.deleteById(id);
    }

    private CategoryResponseDTO toDTO(Category c) {
        CategoryResponseDTO dto = new CategoryResponseDTO();
        dto.setId(c.getId());
        dto.setName(c.getName());
        dto.setDescription(c.getDescription());
        dto.setSortOrder(c.getSortOrder());
        dto.setCreatedAt(c.getCreatedAt());
        return dto;
    }
}
