package com.arkit.api.generation;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record GenerateArchitecturesRequest(
                @NotBlank(message = "description is required") @Size(min = 20, max = 1000, message = "description must be between 10 and 1000 characters") String description) {
}
