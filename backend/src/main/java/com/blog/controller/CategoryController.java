package com.blog.controller;

import com.blog.dto.CategoryRequestDTO;
import com.blog.dto.CategoryResponseDTO;
import com.blog.dto.TagRequestDTO;
import com.blog.dto.TagResponseDTO;
import com.blog.service.CategoryService;
import com.blog.service.TagService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/categories")
public class CategoryController {

    private final CategoryService categoryService;

    public CategoryController(CategoryService categoryService) {
        this.categoryService = categoryService;
    }

    /** 公开：获取所有分类 */
    @GetMapping
    public ResponseEntity<?> listAll() {
        return ResponseEntity.ok(categoryService.listAll());
    }

    /** Admin：创建分类 */
    @PostMapping
    public ResponseEntity<?> create(@Valid @RequestBody CategoryRequestDTO dto) {
        return ResponseEntity.ok(categoryService.create(dto));
    }

    /** Admin：更新分类 */
    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Long id,
                                     @Valid @RequestBody CategoryRequestDTO dto) {
        return ResponseEntity.ok(categoryService.update(id, dto));
    }

    /** Admin：删除分类 */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        categoryService.delete(id);
        return ResponseEntity.ok(Map.of("message", "分类删除成功"));
    }
}
