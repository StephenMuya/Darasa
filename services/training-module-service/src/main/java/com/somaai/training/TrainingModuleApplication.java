package com.somaai.training;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Training Module Service - Spring Boot Application Entry Point.
 *
 * <p>This microservice manages teacher training modules and online courses for
 * the SomaAI CBC platform, supporting professional development in line with
 * Kenya's Competency-Based Curriculum.</p>
 */
@SpringBootApplication
public class TrainingModuleApplication {

    /**
     * Main method that bootstraps the Spring Boot application.
     *
     * @param args command-line arguments passed at startup
     */
    public static void main(String[] args) {
        SpringApplication.run(TrainingModuleApplication.class, args);
    }
}
