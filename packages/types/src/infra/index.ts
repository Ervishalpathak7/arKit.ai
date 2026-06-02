export interface Infra {
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  healthCheck(): Promise<void>;
}
