package com.blog.service;

import com.blog.dto.CommentRequestDTO;
import com.blog.dto.CommentResponseDTO;
import com.blog.dto.PageResponse;
import com.blog.dto.CategoryRequestDTO;
import com.blog.dto.CategoryResponseDTO;
import com.blog.dto.TagRequestDTO;
import com.blog.dto.TagResponseDTO;
import java.util.List;

public interface CategoryService {
    List<CategoryResponseDTO> listAll();
    CategoryResponseDTO create(CategoryRequestDTO dto);
    CategoryResponseDTO update(Long id, CategoryRequestDTO dto);
    void delete(Long id);
}
