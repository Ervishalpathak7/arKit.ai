export type DiagramNodeType =
  | "client"
  | "service"
  | "worker"
  | "database"
  | "cache"
  | "queue"
  | "gateway"
  | "object-storage";

export type DiagramEdgeType =
  | "http"
  | "grpc"
  | "event"
  | "db"
  | "cache"
  | "storage";

export type DiagramNode = {
  id: string;
  label: string;
  type: DiagramNodeType;
  description?: string;
};

export type DiagramEdge = {
  id: string;
  source: string;
  target: string;
  direction: "one-way" | "two-way";
  type: DiagramEdgeType;
  label?: string;
};

export type DiagramBody = {
  nodes: DiagramNode[];
  edges: DiagramEdge[];
};
