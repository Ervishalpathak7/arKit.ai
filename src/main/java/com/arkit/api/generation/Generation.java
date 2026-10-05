package com.arkit.api.generation;

import java.time.Instant;
import java.util.UUID;

import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.annotations.UuidGenerator;
import org.hibernate.annotations.UuidGenerator.Style;
import org.hibernate.type.SqlTypes;

import com.arkit.api.generation.types.ArchitectureGraph;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "generations")
public class Generation {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(insertable = false, updatable = false)
    private UUID id;

    @Column(name = "description_hash", length = 64, nullable = false, updatable = false)
    private String descriptionHash;

    @Column(length = 1000, nullable = false, updatable = false)
    private String description;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(nullable = false, updatable = false, columnDefinition = "jsonb")
    private ArchitectureGraph graph;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt;

    public Generation(String description, String descriptionHash, ArchitectureGraph graph) {
        this.description = description;
        this.descriptionHash = descriptionHash;
        this.graph = graph;
        this.createdAt = Instant.now();
    }

    protected Generation() {
    }

    public UUID getId() {
        return this.id;
    }

    public String getDesciptionHash() {
        return this.descriptionHash;
    }

    public String getDescription() {
        return this.description;
    }

    public ArchitectureGraph getGraph() {
        return this.graph;
    }

}
