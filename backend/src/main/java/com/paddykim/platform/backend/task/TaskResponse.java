package com.paddykim.platform.backend.task;

import java.time.Instant;

public record TaskResponse(
        Long id,
        String title,
        boolean completed,
        Instant createdAt
) {
    public static TaskResponse from(Task task) {
        return new TaskResponse(
                task.getId(),
                task.getTitle(),
                task.isCompleted(),
                task.getCreatedAt()
        );
    }
}
