package com.ohotech.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "ai_usage")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AIUsage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long userId;

    @Column(nullable = false, length = 64)
    private String feature;

    @Column(nullable = false, length = 64)
    private String model;

    private Integer promptTokens;
    private Integer candidateTokens;
    private Integer totalTokens;

    private LocalDateTime timestamp;

    @PrePersist
    protected void onCreate() {
        timestamp = LocalDateTime.now();
    }
}
