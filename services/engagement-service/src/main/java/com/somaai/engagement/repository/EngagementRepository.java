package com.somaai.engagement.repository;

import com.somaai.engagement.model.Engagement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

/**
 * Spring Data JPA repository for {@link Engagement} entities.
 *
 * <p>Provides standard CRUD operations plus custom query methods
 * for filtering engagements by subject and active status.</p>
 */
@Repository
public interface EngagementRepository extends JpaRepository<Engagement, UUID> {

    /**
     * Find all engagements for a given subject.
     *
     * @param subject the subject area to filter by
     * @return list of matching engagements
     */
    List<Engagement> findBySubject(String subject);

    /**
     * Find all engagements by their active status.
     *
     * @param active {@code true} to return active engagements only
     * @return list of engagements with the given status
     */
    List<Engagement> findByActive(Boolean active);
}
