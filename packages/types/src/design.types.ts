// packages/shared/types.ts
export type DiagramNode = {
  id: string;
  label: string;
  type: "service" | "database" | "queue" | "cache" | "external" | "client";
};

export type DiagramEdge = {
  from: string;
  to: string;
  label?: string;
};

export type DiagramBody = {
  mermaid: string;
  nodes: DiagramNode[];
  edges: DiagramEdge[];
};
