package com.blog.dto;

import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

@Data
public class UploadAvatarRequest {
    private MultipartFile file;
}
