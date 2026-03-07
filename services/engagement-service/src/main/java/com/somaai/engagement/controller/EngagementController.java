package com.somaai.engagement.controller;

import com.somaai.engagement.dto.EngagementDTO;
import com.somaai.engagement.model.Engagement;
import com.somaai.engagement.service.EngagementService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

/**
 * REST controller for managing engagement activities.
 *
 * <p>Exposes CRUD endpoints under {@code /api/v1/engagements} for creating,
 * reading, updating, and deleting interactive learning activities in the
 * SomaAI CBC platform.</p>
 */
@RestController
@RequestMapping("/api/v1/engagements")
@RequiredArgsConstructor
public class EngagementController {

    private final EngagementService service;

    /**
     * Retrieve all engagement activities.
     *
     * @return list of all engagements with HTTP 200
     */
    @GetMapping
    public ResponseEntity<List<Engagement>> getAll() {
        return ResponseEntity.ok(service.findAll());
    }

    /**
     * Retrieve a single engagement by its ID.
     *
     * @param id the UUID of the engagement activity
     * @return the engagement with HTTP 200, or HTTP 404 if not found
     */
    @GetMapping("/{id}")
    public ResponseEntity<Engagement> getById(@PathVariable UUID id) {
        return service.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Create a new engagement activity.
     *
     * @param dto the engagement data
     * @return the created engagement with HTTP 201
     */
    @PostMapping
    public ResponseEntity<Engagement> create(@Valid @RequestBody EngagementDTO dto) {
        Engagement created = service.create(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    /**
     * Update an existing engagement activity.
     *
     * @param id  the UUID of the engagement to update
     * @param dto the updated engagement data
     * @return the updated engagement with HTTP 200, or HTTP 404 if not found
     */
    @PutMapping("/{id}")
    public ResponseEntity<Engagement> update(
            @PathVariable UUID id,
            @Valid @RequestBody EngagementDTO dto) {
        return service.update(id, dto)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Delete an engagement activity by its ID.
     *
     * @param id the UUID of the engagement to delete
     * @return HTTP 204 on success, or HTTP 404 if not found
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        if (service.delete(id)) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}
