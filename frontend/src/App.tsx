import { useCallback, useState } from 'react';
import ReactFlow, {
  Background, BackgroundVariant, Controls,
  useNodesState, useEdgesState,
  type Node as FlowNode,
} from 'reactflow';
import 'reactflow/dist/style.css';
import './css/index.css';

import { layout } from './layout';
import { toReactFlow, LAYER_COLORS } from './mapGraph';
import type { ArchitectureGraph, ArchitectureNode, Layer } from './types/types.js';

const EXAMPLES = [
  'a URL shortener with caching and analytics',
  'a food delivery platform with live rider tracking',
  'a group chat app with message history and presence',
  'a payment processor with retries and reconciliation',
];

const LAYER_LABELS: Record<Layer, string> = {
  CLIENT: 'Client',
  EDGE: 'Edge',
  APPLICATION: 'Application',
  DATA: 'Data',
  EXTERNAL: 'External',
};

export default function App() {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [description, setDescription] = useState('');
  const [generated, setGenerated] = useState<string | null>(null);
  const [selected, setSelected] = useState<ArchitectureNode | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canSubmit = description.trim().length >= 20 && !loading;

  async function generate() {
    if (!canSubmit) return;
    const submitted = description.trim();

    setLoading(true);
    setError(null);
    setSelected(null);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/architectures`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description: submitted }),
      });

      if (res.status === 429) {
        const retry = res.headers.get('Retry-After');
        throw new Error(
          `You've hit the request limit. Try again in ${retry ?? 'a few'} seconds.`,
        );
      }
      if (!res.ok) {
        throw new Error("That didn't generate. Try describing the system differently.");
      }

      const body = await res.json();
      const graph: ArchitectureGraph = body.graph ?? body;
      const mapped = toReactFlow(graph);

      setNodes(layout(mapped.nodes, mapped.edges));
      setEdges(mapped.edges);
      setGenerated(submitted);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong. Try again.');
    } finally {
      setLoading(false);
    }
  }

  function reset() {
    setGenerated(null);
    setSelected(null);
    setNodes([]);
    setEdges([]);
    setError(null);
  }

  const onNodeClick = useCallback((_: unknown, node: FlowNode) => {
    setSelected(node.data.source as ArchitectureNode);
  }, []);

  function onKeyDown(e: React.KeyboardEvent) {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') generate();
  }

  // ── before generating ──────────────────────────────────

  if (!generated) {
    return (
      <div className="shell">
        <div className="hero">
          <div className="hero-inner">
            <p className="wordmark"><span className="wordmark-mark" />arkit</p>

            <h1>Describe a system.</h1>
            <p>You'll get its high-level architecture, drawn and ready to read.</p>

            <div className="field">
              <textarea
                value={description}
                onChange={e => setDescription(e.target.value)}
                onKeyDown={onKeyDown}
                placeholder="A food delivery platform where customers order from restaurants and riders deliver"
                maxLength={1000}
                disabled={loading}
                aria-label="System description"
              />

              <div className="field-foot">
                <span className="count">
                  {description.trim().length < 20
                    ? `${20 - description.trim().length} more characters`
                    : `${description.trim().length} / 1000`}
                </span>
                <button className="btn-primary" onClick={generate} disabled={!canSubmit}>
                  {loading ? 'Generating' : 'Generate diagram'}
                </button>
              </div>

              {error && <div className="error" role="alert">{error}</div>}

              <div className="examples">
                <p className="examples-label">Or start from one of these</p>
                <div className="chips">
                  {EXAMPLES.map(ex => (
                    <button
                      key={ex}
                      className="chip"
                      onClick={() => setDescription(ex)}
                      disabled={loading}
                    >
                      {ex}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── after generating ───────────────────────────────────

  return (
    <div className="shell">
      <header className="bar">
        <p className="wordmark"><span className="wordmark-mark" />arkit</p>
        <span className="bar-desc" title={generated}>{generated}</span>
        <span className="bar-count">{nodes.length} nodes · {edges.length} edges</span>
        <button className="btn-quiet" onClick={reset}>New diagram</button>
      </header>

      <div className="body">
        <div className="canvas">
          {loading ? (
            <div className="working">
              <div className="working-inner">
                <div className="scanline" />
                Working out the architecture
              </div>
            </div>
          ) : (
            <>
              <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onNodeClick={onNodeClick}
                onPaneClick={() => setSelected(null)}
                minZoom={0.2}
                fitView
                fitViewOptions={{ padding: 0.18 }}
              >
                <Background variant={BackgroundVariant.Dots} gap={22} size={1} color="#cfd5d4" />
                <Controls showInteractive={false} />
              </ReactFlow>

              <div className="legend">
                {(Object.keys(LAYER_LABELS) as Layer[]).map(l => (
                  <div className="legend-row" key={l}>
                    <span className="legend-swatch" style={{ background: LAYER_COLORS[l] }} />
                    {LAYER_LABELS[l]}
                  </div>
                ))}
                <div className="legend-note">Dashed edges are asynchronous</div>
              </div>
            </>
          )}
        </div>

        {selected && (
          <aside className="detail">
            <div className="detail-head">
              <h2>{selected.label}</h2>
              <button className="detail-close" onClick={() => setSelected(null)} aria-label="Close">
                ×
              </button>
            </div>

            <p className="detail-id">{selected.id}</p>

            <div className="detail-meta">
              <span className="tag">{selected.type.replace(/_/g, ' ').toLowerCase()}</span>
              <span
                className="tag tag-layer"
                style={{ borderLeftColor: LAYER_COLORS[selected.layer] }}
              >
                {LAYER_LABELS[selected.layer]}
              </span>
            </div>

            {selected.description ? (
              <p className="detail-desc">{selected.description}</p>
            ) : (
              <p className="detail-desc detail-empty">No description was generated for this node.</p>
            )}
          </aside>
        )}
      </div>

      {error && (
        <div className="error" style={{ margin: 16 }} role="alert">{error}</div>
      )}
    </div>
  );
}