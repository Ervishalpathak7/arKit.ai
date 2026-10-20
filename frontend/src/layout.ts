import dagre from "dagre";
import { type Node, type Edge, Position } from "reactflow";
import { NODE_HEIGHT, NODE_WIDTH } from "./mapGraph";

const RANKSEP = 160;
const RANK_PITCH = RANKSEP + NODE_WIDTH;

export function layout(nodes: Node[], edges: Edge[]): Node[] {
  const g = new dagre.graphlib.Graph();
  g.setDefaultEdgeLabel(() => ({}));
  g.setGraph({ rankdir: "LR", nodesep: 50, ranksep: RANKSEP });

  nodes.forEach((n) =>
    g.setNode(n.id, { width: NODE_WIDTH, height: NODE_HEIGHT }),
  );
  edges.forEach((e) => g.setEdge(e.source, e.target));

  dagre.layout(g);

  const xById = new Map(nodes.map((n) => [n.id, g.node(n.id).x]));

  edges.forEach((e) => {
    const span = Math.abs(xById.get(e.target)! - xById.get(e.source)!);
    if (span > RANK_PITCH * 1.5) e.label = undefined; // > 516px = 2+ ranks
  });

  return nodes.map((n) => {
    const { x, y } = g.node(n.id);
    return {
      ...n,
      targetPosition: Position.Left,
      sourcePosition: Position.Right,
      position: { x: x - NODE_WIDTH / 2, y: y - NODE_HEIGHT / 2 },
    };
  });
}
