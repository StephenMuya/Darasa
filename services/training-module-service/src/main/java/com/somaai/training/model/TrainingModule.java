package com.somaai.training.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * JPA entity representing a teacher training module.
 *
 * <p>Maps to the {@code training_modules} table in PostgreSQL. Each module
 * represents an online course or resource designed to support teacher
 * professional development within the CBC framework.</p>
 */
@Entity
@Table(name = "training_modules")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TrainingModule {

    /** Unique identifier for the training module. */
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(updatable = false, nullable = false)
    private UUID id;

    /** Title of the training module. */
    @NotBlank
    @Column(nullable = false, length = 255)
    private String title;

    /** Detailed description of the module's content and objectives. */
    @Column(columnDefinition = "TEXT")
    private String description;

    /** Subject area covered by this training module. */
    @NotBlank
    @Column(nullable = false, length = 100)
    private String subject;

    /** Target grade level for the training context. */
    @Column(length = 50)
    private String gradeLevel;

    /** Duration of the module in hours. */
    private Double durationHours;

    /** Difficulty level (e.g., BEGINNER, INTERMEDIATE, ADVANCED). */
    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    private DifficultyLevel difficultyLevel;

    /** URL to access or download the module materials. */
    @Column(length = 500)
    private String contentUrl;

    /** Whether the module is currently published and visible to teachers. */
    @Column(nullable = false)
    @Builder.Default
    private Boolean published = false;

    /** Timestamp when the module was created. */
    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;

    /** Timestamp when the module was last updated. */
    @UpdateTimestamp
    private LocalDateTime updatedAt;

    /**
     * Enumeration of supported difficulty levels for training modules.
     */
    public enum DifficultyLevel {
        BEGINNER, INTERMEDIATE, ADVANCED
    }
}
