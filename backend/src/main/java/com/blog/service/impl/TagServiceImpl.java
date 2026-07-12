package com.blog.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.blog.dto.*;
import com.blog.entity.Tag;
import com.blog.mapper.TagMapper;
import com.blog.service.TagService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class TagServiceImpl implements TagService {

    private final TagMapper tagMapper;

    public TagServiceImpl(TagMapper tagMapper) {
        this.tagMapper = tagMapper;
    }

    @Override
    public List<TagResponseDTO> listAll() {
        return tagMapper.selectList(null).stream().map(this::toDTO).collect(Collectors.toList());
    }

    @Override
    @Transactional
    public TagResponseDTO create(TagRequestDTO dto) {
        Tag tag = new Tag();
        tag.setName(dto.getName());
        tagMapper.insert(tag);
        return toDTO(tag);
    }

    @Override
    @Transactional
    public TagResponseDTO update(Long id, TagRequestDTO dto) {
        Tag tag = tagMapper.selectById(id);
        if (tag == null) throw new RuntimeException("标签不存在");
        tag.setName(dto.getName());
        tagMapper.updateById(tag);
        return toDTO(tag);
    }

    @Override
    @Transactional
    public void delete(Long id) {
        tagMapper.deleteById(id);
    }

    private TagResponseDTO toDTO(Tag t) {
        TagResponseDTO dto = new TagResponseDTO();
        dto.setId(t.getId());
        dto.setName(t.getName());
        dto.setCreatedAt(t.getCreatedAt());
        return dto;
    }
}
