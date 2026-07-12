package com.blog.controller;

import com.blog.dto.TagRequestDTO;
import com.blog.dto.TagResponseDTO;
import com.blog.service.TagService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/tags")
public class TagController {

    private final TagService tagService;

    public TagController(TagService tagService) {
        this.tagService = tagService;
    }

    /** 公开：获取所有标签 */
    @GetMapping
    public ResponseEntity<?> listAll() {
        return ResponseEntity.ok(tagService.listAll());
    }

    /** Admin：创建标签 */
    @PostMapping
    public ResponseEntity<?> create(@Valid @RequestBody TagRequestDTO dto) {
        return ResponseEntity.ok(tagService.create(dto));
    }

    /** Admin：更新标签 */
    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Long id,
                                     @Valid @RequestBody TagRequestDTO dto) {
        return ResponseEntity.ok(tagService.update(id, dto));
    }

    /** Admin：删除标签 */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        tagService.delete(id);
        return ResponseEntity.ok(Map.of("message", "标签删除成功"));
    }
}
