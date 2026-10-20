import type { ComponentType } from 'react';
import {
  siPostgresql, siRedis, siApachekafka, siNginx, siKong,
  siMysql, siMongodb, siElasticsearch, siRabbitmq, siSqlite,
  siApachecassandra, siGrafana, siPrometheus, siStripe,
  siCloudflare, siAuth0, siFirebase, siSupabase
} from 'simple-icons';
import {
  Monitor, Globe, Network, Route, Shuffle, Server, Cog,
  Zap, Database, HardDrive, Layers, Cloud, Box,
} from 'lucide-react';
import type { ArchitectureNode, NodeType } from './types/types';

export type IconProps = { size?: number; className?: string };
export type Icon = ComponentType<IconProps>;

/**
 * Simple Icons ship a raw SVG path; Lucide ships components. Wrapping the
 * former means iconFor has one return type and callers never branch.
 * Simple Icons are filled shapes — Lucide are stroked and handle that
 * themselves, so never render a Lucide path with fill.
 */
function brand(icon: { path: string; title: string }): Icon {
  const Wrapped = ({ size = 18, className }: IconProps) => (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="currentColor"
      className={className}
      role="img"
      aria-label={icon.title}
    >
      <path d={icon.path} />
    </svg>
  );
  Wrapped.displayName = `Brand(${icon.title})`;
  return Wrapped;
}

/** Strip case and punctuation so "PostgreSQL", "Postgres", "postgre-sql" collapse. */
const key = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, '');

/**
 * Keyed on the normalised form. Aliases exist because the model is
 * inconsistent across runs and prompting it into one spelling costs
 * tokens for no gain — cheaper to accept both here.
 *
 * Deliberately absent: S3, CloudFront, and other AWS marks. AWS
 * trademark terms are restrictive, so those fall through to the
 * generic STORAGE and CDN icons.
 */
const TECH: Record<string, Icon> = {
  postgresql:    brand(siPostgresql),
  postgres:      brand(siPostgresql),
  redis:         brand(siRedis),
  kafka:         brand(siApachekafka),
  apachekafka:   brand(siApachekafka),
  nginx:         brand(siNginx),
  kong:          brand(siKong),
  mysql:         brand(siMysql),
  mongodb:       brand(siMongodb),
  mongo:         brand(siMongodb),
  elasticsearch: brand(siElasticsearch),
  rabbitmq:      brand(siRabbitmq),
  sqlite:        brand(siSqlite),
  cassandra:     brand(siApachecassandra),
  grafana:       brand(siGrafana),
  prometheus:    brand(siPrometheus),
  stripe:        brand(siStripe),
  cloudflare:    brand(siCloudflare),
  auth0:         brand(siAuth0),
  firebase:      brand(siFirebase),
  supabase:      brand(siSupabase),
};

/** Fallback by component category. Record<NodeType, …> fails to compile if a type is added. */
const TYPE: Record<NodeType, Icon> = {
  CLIENT:           Monitor,
  CDN:              Globe,
  LOAD_BALANCER:    Network,
  GATEWAY:          Route,
  PROXY:            Shuffle,
  API_SERVER:       Server,
  WORKER:           Cog,
  CACHE:            Zap,
  DATABASE:         Database,
  STORAGE:          HardDrive,
  QUEUE:            Layers,
  EXTERNAL_SERVICE: Cloud,
  OTHER:            Box,
};

/**
 * Brand icon when the technology is present and recognised, otherwise the
 * generic icon for the component's type. An unknown technology is not a
 * failure — it renders the category icon, which is still correct.
 */
export function iconFor(node: ArchitectureNode): Icon {
  if (node.technology) {
    const hit = TECH[key(node.technology)];
    if (hit) return hit;
  }
  return TYPE[node.type] ?? Box;
}