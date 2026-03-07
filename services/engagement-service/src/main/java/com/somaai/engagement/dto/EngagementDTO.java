package com.somaai.engagement.dto;

import com.somaai.engagement.model.Engagement.EngagementType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

/**
 * Data Transfer Object for creating and updating engagement activities.
 *
 * <p>Used as the request body in POST and PUT endpoints. Separates the
 * API contract from the internal JPA entity.</p>
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EngagementDTO {

    /** Title of the engagement activity. */
    @NotBlank(message = "Title must not be blank")
    private String title;

    /** Description of the activity and its learning goals. */
    private String description;

    /** Type of engagement activity. */
    @NotNull(message = "Engagement type must not be null")
    private EngagementType engagementType;

    /** Subject area the activity relates to. */
    @NotBlank(message = "Subject must not be blank")
    private String subject;

    /** Target grade level. */
    private String gradeLevel;

    /** Maximum number of participants. */
    private Integer maxParticipants;

    /** Whether the engagement is active. */
    private Boolean active;

    /** Creator or facilitator identifier. */
    private String createdBy;
}
