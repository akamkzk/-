package com.blog.service;

import com.blog.dto.CommentRequestDTO;
import com.blog.dto.CommentResponseDTO;
import com.blog.dto.PageResponse;
import com.blog.dto.TagRequestDTO;
import com.blog.dto.TagResponseDTO;
import java.util.List;

public interface TagService {
    List<TagResponseDTO> listAll();
    TagResponseDTO create(TagRequestDTO dto);
    TagResponseDTO update(Long id, TagRequestDTO dto);
    void delete(Long id);
}
