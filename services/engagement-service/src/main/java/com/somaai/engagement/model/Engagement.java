package com.somaai.engagement.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * JPA entity representing an engagement activity or interactive tool.
 *
 * <p>Maps to the {@code engagements} table in PostgreSQL. Each record
 * represents an interactive learning activity, quiz, poll, or discussion
 * designed to foster student participation in the CBC framework.</p>
 */
@Entity
@Table(name = "engagements")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Engagement {

    /** Unique identifier for the engagement activity. */
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(updatable = false, nullable = false)
    private UUID id;

    /** Title of the engagement activity. */
    @NotBlank
    @Column(nullable = false, length = 255)
    private String title;

    /** Description of the engagement activity and its learning goals. */
    @Column(columnDefinition = "TEXT")
    private String description;

    /** Type of engagement activity. */
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private EngagementType engagementType;

    /** Subject area this engagement activity relates to. */
    @NotBlank
    @Column(nullable = false, length = 100)
    private String subject;

    /** Target grade level for the activity. */
    @Column(length = 50)
    private String gradeLevel;

    /** Maximum number of participants allowed. */
    private Integer maxParticipants;

    /** Whether the engagement is currently active. */
    @Column(nullable = false)
    @Builder.Default
    private Boolean active = true;

    /** Creator or facilitator of the engagement. */
    @Column(length = 255)
    private String createdBy;

    /** Timestamp when the engagement was created. */
    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;

    /** Timestamp when the engagement was last updated. */
    @UpdateTimestamp
    private LocalDateTime updatedAt;

    /**
     * Enumeration of supported engagement activity types.
     */
    public enum EngagementType {
        QUIZ, POLL, DISCUSSION, GROUP_ACTIVITY, GAME, PROJECT
    }
}
