import { useMemo } from 'react';
import ReactFlow, {
  Background, Controls, useNodesState, useEdgesState,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { layout } from './layout';
import { toReactFlow } from './mapGraph';
import { type ArchitectureGraph } from './types/types.ts';
import sample from './sample.json';

export default function App() {
  const { initialNodes, initialEdges } = useMemo(() => {
    const { nodes, edges } = toReactFlow(sample as ArchitectureGraph);
    return { initialNodes: layout(nodes, edges), initialEdges: edges };
  }, []);

  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, , onEdgesChange] = useEdgesState(initialEdges);

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        fitView
      >
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
}