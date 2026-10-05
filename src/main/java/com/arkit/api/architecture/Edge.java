package com.arkit.api.architecture;

public record Edge(
                String from,
                String to,
                String label,
                String protocol,
                Direction direction,
                Communication communication) {
}
