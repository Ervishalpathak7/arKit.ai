import { memo } from 'react';
import { Handle, Position, type NodeProps } from 'reactflow';
import { iconFor } from './icon';
import { LAYER_COLORS } from './mapGraph';
import type { ArchitectureNode } from './types/types';

export type ArchitectureNodeData = {
  source: ArchitectureNode;
};

function ArchitectureNodeView({ data, selected }: NodeProps<ArchitectureNodeData>) {
  const node = data.source;
  const Icon = iconFor(node);
  const accent = LAYER_COLORS[node.layer];

  return (
    <div
      className={`arch-node${selected ? ' is-selected' : ''}`}
      style={{ borderLeftColor: accent }}
      title={node.label}
    >
      {/* Without both handles React Flow has no attachment points and every edge vanishes. */}
      <Handle type="target" position={Position.Left} />

      <span className="arch-node-icon" style={{ color: accent }}>
        <Icon size={17} />
      </span>

      <span className="arch-node-body">
        <span className="arch-node-label">{node.label}</span>
        {node.technology && (
          <span className="arch-node-tech">{node.technology}</span>
        )}
      </span>

      <Handle type="source" position={Position.Right} />
    </div>
  );
}

/**
 * memo because React Flow re-renders every node on any node change —
 * dragging one node would otherwise re-run iconFor for all twelve.
 */
export default memo(ArchitectureNodeView);
