package com.arkit.api.generation;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

interface GenerationRepository extends JpaRepository<Generation, UUID> {
    Optional<Generation> findByDescriptionHash(String descriptionHash);
}
