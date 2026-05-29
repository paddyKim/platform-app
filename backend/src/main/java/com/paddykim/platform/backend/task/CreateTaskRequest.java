package com.paddykim.platform.backend.task;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CreateTaskRequest(
        @NotBlank
        @Size(max = 120)
        String title
) {
}
