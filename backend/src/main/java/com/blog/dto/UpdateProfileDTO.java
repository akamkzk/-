package com.blog.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class UpdateProfileDTO {

    @Size(max = 50)
    private String nickname;

    @Size(max = 500)
    private String avatar;

    @Size(max = 500)
    private String bio;
}
