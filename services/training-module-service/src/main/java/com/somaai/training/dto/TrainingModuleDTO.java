package com.somaai.training.dto;

import com.somaai.training.model.TrainingModule.DifficultyLevel;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

/**
 * Data Transfer Object for creating and updating training modules.
 *
 * <p>Used as the request body in POST and PUT endpoints. Separates the
 * API contract from the internal JPA entity.</p>
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TrainingModuleDTO {

    /** Title of the training module. */
    @NotBlank(message = "Title must not be blank")
    private String title;

    /** Description of the module's content and objectives. */
    private String description;

    /** Subject area the module covers. */
    @NotBlank(message = "Subject must not be blank")
    private String subject;

    /** Target grade level for the training context. */
    private String gradeLevel;

    /** Estimated duration in hours. */
    private Double durationHours;

    /** Difficulty level for the module. */
    private DifficultyLevel difficultyLevel;

    /** URL to access the module content. */
    private String contentUrl;

    /** Whether the module should be published immediately. */
    private Boolean published;
}
