import { MarkerType, type Node, type Edge } from "reactflow";
import type { ArchitectureGraph, Layer } from "./types/types.js";

export const NODE_WIDTH = 184;
export const NODE_HEIGHT = 54;

/** Tuned for a light ground — deep enough to read as ink, distinct from each other. */
export const LAYER_COLORS: Record<Layer, string> = {
  CLIENT: "#1d4ed8",
  EDGE: "#6d28d9",
  APPLICATION: "#047857",
  DATA: "#a16207",
  EXTERNAL: "#be123c",
};

const MAX_LABEL = 24;

export function toReactFlow(graph: ArchitectureGraph): {
  nodes: Node[];
  edges: Edge[];
} {
  const nodes: Node[] = graph.nodes.map((n) => ({
    id: n.id,
    data: {
      label:
        n.label.length > MAX_LABEL
          ? `${n.label.slice(0, MAX_LABEL - 1)}…`
          : n.label,
      source: n,
    },
    position: { x: 0, y: 0 },
    style: {
      width: NODE_WIDTH,
      height: NODE_HEIGHT,
      boxSizing: "border-box",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      textAlign: "center",
      padding: "0 12px 0 14px",
      background: "#ffffff",
      color: "#1a2024",
      border: "1px solid #d6dbda",
      borderLeft: `3px solid ${LAYER_COLORS[n.layer]}`,
      borderRadius: 3,
      fontSize: 12,
      fontWeight: 450,
      lineHeight: 1.3,
      cursor: "pointer",
    },
  }));

  const edges: Edge[] = graph.edges.map((e, i) => ({
    id: `${e.from}-${e.to}-${i}`,
    source: e.from,
    target: e.to,
    label: e.label,
    type: "smoothstep",
    animated: false,
    style: {
      stroke: "#9aa3a8",
      strokeWidth: 1.2,
      strokeDasharray: e.communication === "ASYNC" ? "5 4" : undefined,
    },
    markerEnd: {
      type: MarkerType.ArrowClosed,
      width: 14,
      height: 14,
      color: "#9aa3a8",
    },
    markerStart:
      e.direction === "BIDIRECTIONAL"
        ? {
            type: MarkerType.ArrowClosed,
            width: 14,
            height: 14,
            color: "#9aa3a8",
          }
        : undefined,
    labelBgPadding: [6, 3] as [number, number],
    labelBgBorderRadius: 2,
    labelBgStyle: { fill: "#eff1f0", fillOpacity: 0.95 },
    labelStyle: { fill: "#5a646c", fontSize: 10 },
  }));

  return { nodes, edges };
}
