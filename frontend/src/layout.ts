import dagre from "dagre";
import { type Node, type Edge, Position } from "reactflow";
import { NODE_HEIGHT, NODE_WIDTH } from "./mapGraph";



export function layout(nodes: Node[], edges: Edge[]): Node[] {
  const g = new dagre.graphlib.Graph();
  g.setDefaultEdgeLabel(() => ({}));
  g.setGraph({ rankdir: "LR", nodesep: 50, ranksep: 110 });

  nodes.forEach((n) =>
    g.setNode(n.id, { width: NODE_WIDTH, height: NODE_HEIGHT }),
  );
  edges.forEach((e) => g.setEdge(e.source, e.target));

  dagre.layout(g);

  return nodes.map((n) => {
    const { x, y } = g.node(n.id);
    return {
      ...n,
      targetPosition: Position.Left,
      sourcePosition: Position.Right,
      // dagre gives the centre; React Flow wants the top-left corner
      position: { x: x - NODE_WIDTH / 2, y: y - NODE_HEIGHT / 2 },
    };
  });
}
