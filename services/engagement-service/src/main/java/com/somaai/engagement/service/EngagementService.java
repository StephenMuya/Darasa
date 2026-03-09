package com.somaai.engagement.service;

import com.somaai.engagement.dto.EngagementDTO;
import com.somaai.engagement.model.Engagement;
import com.somaai.engagement.repository.EngagementRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * Service layer for engagement activity business logic.
 *
 * <p>Encapsulates all business operations for managing engagement activities,
 * including CRUD operations and filtering by subject or status.</p>
 */
@Service
@RequiredArgsConstructor
@Transactional
public class EngagementService {

    private final EngagementRepository repository;

    /**
     * Retrieve all engagement activities.
     *
     * @return list of all engagements
     */
    @Transactional(readOnly = true)
    public List<Engagement> findAll() {
        return repository.findAll();
    }

    /**
     * Find an engagement by its unique identifier.
     *
     * @param id the engagement UUID
     * @return an Optional containing the engagement if found
     */
    @Transactional(readOnly = true)
    public Optional<Engagement> findById(UUID id) {
        return repository.findById(id);
    }

    /**
     * Create a new engagement activity from the provided DTO.
     *
     * @param dto the data transfer object containing engagement details
     * @return the persisted engagement entity
     */
    public Engagement create(EngagementDTO dto) {
        Engagement engagement = Engagement.builder()
                .title(dto.getTitle())
                .description(dto.getDescription())
                .engagementType(dto.getEngagementType())
                .subject(dto.getSubject())
                .gradeLevel(dto.getGradeLevel())
                .maxParticipants(dto.getMaxParticipants())
                .active(dto.getActive() != null ? dto.getActive() : true)
                .createdBy(dto.getCreatedBy())
                .build();
        return repository.save(engagement);
    }

    /**
     * Update an existing engagement with new values from the DTO.
     *
     * @param id  the UUID of the engagement to update
     * @param dto the data transfer object containing updated fields
     * @return an Optional containing the updated engagement, or empty if not found
     */
    public Optional<Engagement> update(UUID id, EngagementDTO dto) {
        return repository.findById(id).map(existing -> {
            if (dto.getTitle() != null) existing.setTitle(dto.getTitle());
            if (dto.getDescription() != null) existing.setDescription(dto.getDescription());
            if (dto.getEngagementType() != null) existing.setEngagementType(dto.getEngagementType());
            if (dto.getSubject() != null) existing.setSubject(dto.getSubject());
            if (dto.getGradeLevel() != null) existing.setGradeLevel(dto.getGradeLevel());
            if (dto.getMaxParticipants() != null) existing.setMaxParticipants(dto.getMaxParticipants());
            if (dto.getActive() != null) existing.setActive(dto.getActive());
            if (dto.getCreatedBy() != null) existing.setCreatedBy(dto.getCreatedBy());
            return repository.save(existing);
        });
    }

    /**
     * Delete an engagement by its unique identifier.
     *
     * @param id the UUID of the engagement to delete
     * @return {@code true} if the engagement was deleted, {@code false} if not found
     */
    public boolean delete(UUID id) {
        if (repository.existsById(id)) {
            repository.deleteById(id);
            return true;
        }
        return false;
    }
}
