package com.somaai.training.service;

import com.somaai.training.dto.TrainingModuleDTO;
import com.somaai.training.model.TrainingModule;
import com.somaai.training.repository.TrainingModuleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * Service layer for training module business logic.
 *
 * <p>Encapsulates all business operations for managing training modules,
 * including CRUD operations and domain-specific queries.</p>
 */
@Service
@RequiredArgsConstructor
@Transactional
public class TrainingModuleService {

    private final TrainingModuleRepository repository;

    /**
     * Retrieve all training modules.
     *
     * @return list of all training modules
     */
    @Transactional(readOnly = true)
    public List<TrainingModule> findAll() {
        return repository.findAll();
    }

    /**
     * Find a training module by its unique identifier.
     *
     * @param id the module UUID
     * @return an Optional containing the module if found
     */
    @Transactional(readOnly = true)
    public Optional<TrainingModule> findById(UUID id) {
        return repository.findById(id);
    }

    /**
     * Create a new training module from the provided DTO.
     *
     * @param dto the data transfer object containing module details
     * @return the persisted training module entity
     */
    public TrainingModule create(TrainingModuleDTO dto) {
        TrainingModule module = TrainingModule.builder()
                .title(dto.getTitle())
                .description(dto.getDescription())
                .subject(dto.getSubject())
                .gradeLevel(dto.getGradeLevel())
                .durationHours(dto.getDurationHours())
                .difficultyLevel(dto.getDifficultyLevel())
                .contentUrl(dto.getContentUrl())
                .published(dto.getPublished() != null ? dto.getPublished() : false)
                .build();
        return repository.save(module);
    }

    /**
     * Update an existing training module with new values from the DTO.
     *
     * @param id  the UUID of the module to update
     * @param dto the data transfer object containing updated fields
     * @return an Optional containing the updated module, or empty if not found
     */
    public Optional<TrainingModule> update(UUID id, TrainingModuleDTO dto) {
        return repository.findById(id).map(existing -> {
            if (dto.getTitle() != null) existing.setTitle(dto.getTitle());
            if (dto.getDescription() != null) existing.setDescription(dto.getDescription());
            if (dto.getSubject() != null) existing.setSubject(dto.getSubject());
            if (dto.getGradeLevel() != null) existing.setGradeLevel(dto.getGradeLevel());
            if (dto.getDurationHours() != null) existing.setDurationHours(dto.getDurationHours());
            if (dto.getDifficultyLevel() != null) existing.setDifficultyLevel(dto.getDifficultyLevel());
            if (dto.getContentUrl() != null) existing.setContentUrl(dto.getContentUrl());
            if (dto.getPublished() != null) existing.setPublished(dto.getPublished());
            return repository.save(existing);
        });
    }

    /**
     * Delete a training module by its unique identifier.
     *
     * @param id the UUID of the module to delete
     * @return {@code true} if the module was deleted, {@code false} if not found
     */
    public boolean delete(UUID id) {
        if (repository.existsById(id)) {
            repository.deleteById(id);
            return true;
        }
        return false;
    }
}
