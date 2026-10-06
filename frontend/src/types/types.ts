

type NodeType =
  | "CLIENT"
  | "CDN"
  | "LOAD_BALANCER"
  | "GATEWAY"
  | "PROXY"
  | "API_SERVER"
  | "WORKER"
  | "CACHE"
  | "DATABASE"
  | "STORAGE"
  | "QUEUE"
  | "EXTERNAL_SERVICE"
  | "OTHER";
export type Layer = "CLIENT" | "EDGE" | "APPLICATION" | "DATA" | "EXTERNAL";

export type ArchitectureNode = {
  id: string;
  label: string;
  type: NodeType;
  layer: Layer;
  description?: string;
};

type Communication = "SYNC" | "ASYNC";
type Direction = "ONE_WAY" | "BIDIRECTIONAL";

export type ArchitectureEdge = {
  from: string;
  to: string;
  label: string;
  protocol?: string;
  communication: Communication;
  direction: Direction;
};

export type ArchitectureGraph = {
  nodes: ArchitectureNode[];
  edges: ArchitectureEdge[];
};
