package com.somaai.training.repository;

import com.somaai.training.model.TrainingModule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

/**
 * Spring Data JPA repository for {@link TrainingModule} entities.
 *
 * <p>Provides standard CRUD operations plus custom query methods
 * for filtering training modules by subject and publication status.</p>
 */
@Repository
public interface TrainingModuleRepository extends JpaRepository<TrainingModule, UUID> {

    /**
     * Find all training modules for a given subject.
     *
     * @param subject the subject area to filter by
     * @return list of matching training modules
     */
    List<TrainingModule> findBySubject(String subject);

    /**
     * Find all training modules by their publication status.
     *
     * @param published {@code true} to return published modules only
     * @return list of training modules with the given status
     */
    List<TrainingModule> findByPublished(Boolean published);
}
