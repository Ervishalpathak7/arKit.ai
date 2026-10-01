package com.arkit.api.generation.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.NotBlank;

public record GenerateArchitecturesRequest(
                @NotBlank @Max(value = 1000, message = "Description must be 1000 character max") String description) {
}
