import { useState } from 'react';
import ReactFlow, {
  Background, Controls, useNodesState, useEdgesState,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { layout } from './layout';
import { toReactFlow } from './mapGraph';
import type { ArchitectureGraph } from './types/types.js';

export default function App() {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function generate() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/architectures`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description }),
      });

      if (res.status === 429) {
        const retry = res.headers.get('Retry-After');
        throw new Error(`Too many requests. Try again in ${retry ?? 'a few'} seconds.`);
      }
      if (!res.ok) throw new Error("That didn't generate. Try rewording the description.");

      const body = await res.json();
      const graph: ArchitectureGraph = body.graph ?? body;
      const mapped = toReactFlow(graph);
      setNodes(layout(mapped.nodes, mapped.edges));
      setEdges(mapped.edges);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  const canSubmit = description.trim().length >= 20 && !loading;

  return (
    <div style={S.shell}>
      <aside style={S.panel}>
        <h1 style={S.title}>arkit</h1>
        <p style={S.sub}>Describe a system. Get its architecture.</p>

        <textarea
          style={S.input}
          value={description}
          onChange={e => setDescription(e.target.value)}
          placeholder="A food delivery platform where customers order from restaurants and riders deliver"
          maxLength={1000}
          disabled={loading}
        />

        <div style={S.meta}>{description.trim().length} / 1000</div>

        <button
          style={{ ...S.button, ...(canSubmit ? {} : S.buttonOff) }}
          onClick={generate}
          disabled={!canSubmit}
        >
          {loading ? 'Generating…' : 'Generate diagram'}
        </button>

        {error && <div style={S.error}>{error}</div>}
      </aside>

      <main style={S.canvas}>
        {nodes.length === 0 && !loading ? (
          <div style={S.empty}>Your diagram appears here.</div>
        ) : (
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            fitView
          >
            <Background color="#2a2a30" gap={20} />
            <Controls />
          </ReactFlow>
        )}
      </main>
    </div>
  );
}

const S: Record<string, React.CSSProperties> = {
  shell:  { display: 'flex', height: '100vh', background: '#0d0d10', color: '#e8e8ea',
            fontFamily: 'ui-sans-serif, system-ui, sans-serif' },
  panel:  { width: 340, flexShrink: 0, padding: 28, borderRight: '1px solid #26262c',
            display: 'flex', flexDirection: 'column', gap: 12 },
  title:  { margin: 0, fontSize: 22, fontWeight: 600, letterSpacing: '-0.02em' },
  sub:    { margin: 0, fontSize: 13, color: '#8a8a94', lineHeight: 1.5 },
  input:  { marginTop: 10, minHeight: 150, padding: 12, resize: 'vertical',
            background: '#16161a', color: '#e8e8ea', border: '1px solid #2e2e36',
            borderRadius: 8, fontSize: 13, lineHeight: 1.6, fontFamily: 'inherit' },
  meta:   { fontSize: 11, color: '#6a6a74', textAlign: 'right' },
  button: { padding: '11px 16px', border: 'none', borderRadius: 8, cursor: 'pointer',
            background: '#34d399', color: '#06281c', fontSize: 14, fontWeight: 600 },
  buttonOff: { background: '#26262c', color: '#6a6a74', cursor: 'not-allowed' },
  error:  { padding: 10, borderRadius: 6, background: '#2a1416',
            border: '1px solid #5c2328', color: '#f1a4a4', fontSize: 12, lineHeight: 1.5 },
  canvas: { flex: 1, position: 'relative' },
  empty:  { height: '100%', display: 'grid', placeItems: 'center',
            color: '#4a4a54', fontSize: 14 },
};