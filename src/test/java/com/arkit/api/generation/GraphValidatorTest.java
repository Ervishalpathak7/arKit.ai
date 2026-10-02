package com.arkit.api.generation;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.List;

import org.junit.jupiter.api.Test;

import com.arkit.api.generation.types.ArchitectureGraph;
import com.arkit.api.generation.types.Communication;
import com.arkit.api.generation.types.Direction;
import com.arkit.api.generation.types.Edge;
import com.arkit.api.generation.types.Layer;
import com.arkit.api.generation.types.Node;
import com.arkit.api.generation.types.NodeType;

public class GraphValidatorTest {
    private final GraphValidator validator = new GraphValidator();

    @Test
    void dropEdgesPointingAtUnknownNodes() {
        List<Node> nodes = List.of(new Node("api", "API", NodeType.API_SERVER, Layer.APPLICATION, "The api server"),
                new Node("db", "database", NodeType.DATABASE, Layer.DATA, "database"));
        List<Edge> edges = List.of(
                new Edge("drop", "drop", "dropping", "protocol", Direction.ONE_WAY, Communication.SYNC),
                new Edge("api", "db", "writes", "SQL", Direction.BIDIRECTIONAL, Communication.SYNC),
                new Edge("api", "ghost", "???", "HTTP", Direction.ONE_WAY, Communication.ASYNC));

        ArchitectureGraph result = validator.validate(new ArchitectureGraph(nodes, edges));

        assertThat(result.edges()).hasSize(1);
        assertThat(result.nodes()).hasSize(2);
    }

    @Test
    void keepsAllEdgesWhenEveryReferenceIsValid() {
        List<Node> nodes = List.of(
                new Node("api", "API", NodeType.API_SERVER, Layer.APPLICATION, "the api"),
                new Node("db", "DB", NodeType.DATABASE, Layer.DATA, "the database"));
        List<Edge> edges = List.of(
                new Edge("api", "db", "writes", "SQL", Direction.BIDIRECTIONAL, Communication.SYNC));

        ArchitectureGraph result = validator.validate(new ArchitectureGraph(nodes, edges));

        assertThat(result.edges()).hasSize(1);
    }
}
