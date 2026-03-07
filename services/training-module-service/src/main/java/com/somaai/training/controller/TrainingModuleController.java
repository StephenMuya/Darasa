package com.somaai.training.controller;

import com.somaai.training.dto.TrainingModuleDTO;
import com.somaai.training.model.TrainingModule;
import com.somaai.training.service.TrainingModuleService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

/**
 * REST controller for managing teacher training modules.
 *
 * <p>Exposes CRUD endpoints under {@code /api/v1/training-modules} for
 * creating, reading, updating, and deleting training modules in the
 * SomaAI CBC platform.</p>
 */
@RestController
@RequestMapping("/api/v1/training-modules")
@RequiredArgsConstructor
public class TrainingModuleController {

    private final TrainingModuleService service;

    /**
     * Retrieve all training modules.
     *
     * @return list of all training modules with HTTP 200
     */
    @GetMapping
    public ResponseEntity<List<TrainingModule>> getAll() {
        return ResponseEntity.ok(service.findAll());
    }

    /**
     * Retrieve a single training module by its ID.
     *
     * @param id the UUID of the training module
     * @return the training module with HTTP 200, or HTTP 404 if not found
     */
    @GetMapping("/{id}")
    public ResponseEntity<TrainingModule> getById(@PathVariable UUID id) {
        return service.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Create a new training module.
     *
     * @param dto the training module data
     * @return the created module with HTTP 201
     */
    @PostMapping
    public ResponseEntity<TrainingModule> create(@Valid @RequestBody TrainingModuleDTO dto) {
        TrainingModule created = service.create(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    /**
     * Update an existing training module.
     *
     * @param id  the UUID of the module to update
     * @param dto the updated module data
     * @return the updated module with HTTP 200, or HTTP 404 if not found
     */
    @PutMapping("/{id}")
    public ResponseEntity<TrainingModule> update(
            @PathVariable UUID id,
            @Valid @RequestBody TrainingModuleDTO dto) {
        return service.update(id, dto)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Delete a training module by its ID.
     *
     * @param id the UUID of the module to delete
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
