import { type Node, type Edge, MarkerType } from "reactflow";
import { type ArchitectureGraph, type Layer } from "./types/types.js";

export const NODE_WIDTH = 180;
export const NODE_HEIGHT = 56;

const LAYER_COLORS: Record<Layer, string> = {
  CLIENT: "#60a5fa",
  EDGE: "#a78bfa",
  APPLICATION: "#34d399",
  DATA: "#fbbf24",
  EXTERNAL: "#f87171",
};

export function toReactFlow(graph: ArchitectureGraph): {
  nodes: Node[];
  edges: Edge[];
} {
  const nodes: Node[] = graph.nodes.map((n) => {
    const label = n.label.length > 22 ? n.label.slice(0, 21) + "…" : n.label;
    return {
      id: n.id,
      data: { label },
      position: { x: 0, y: 0 },
      style: {
        width: NODE_WIDTH,
        height: NODE_HEIGHT,
        borderLeft: `4px solid ${LAYER_COLORS[n.layer]}`,
        borderRadius: 6,
        fontSize: 12,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: "0 8px",
      },
    };
  });

  const edges: Edge[] = graph.edges.map((edge, i) => ({
    id: `${edge.from}-${edge.to}-${i}`,
    source: edge.from,
    target: edge.to,
    label: edge.label,
    type: 'smoothstep',
    markerEnd: { type: MarkerType.ArrowClosed },
    markerStart:
      edge.direction === "BIDIRECTIONAL"
        ? { type: MarkerType.ArrowClosed }
        : undefined,
    animated: edge.communication === "ASYNC",
  }));

  return {
    nodes,
    edges,
  };
}
