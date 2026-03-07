package com.somaai.engagement;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Engagement Service - Spring Boot Application Entry Point.
 *
 * <p>This microservice manages interactive learning and engagement tools
 * for the SomaAI platform, fostering critical thinking and active participation
 * in Kenya's Competency-Based Curriculum framework.</p>
 */
@SpringBootApplication
public class EngagementApplication {

    /**
     * Main method that bootstraps the Spring Boot application.
     *
     * @param args command-line arguments passed at startup
     */
    public static void main(String[] args) {
        SpringApplication.run(EngagementApplication.class, args);
    }
}
