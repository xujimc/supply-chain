import { useCallback, useMemo } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
} from 'reactflow';
import 'reactflow/dist/style.css';
import useStore from '../store/useStore';

// Node colors by type
const NODE_COLORS = {
  supplier: '#10b981', // green
  factory: '#3b82f6', // blue
  warehouse: '#f59e0b', // amber
  customer: '#8b5cf6', // purple
};

// Convert graph data to React Flow format
function convertToReactFlow(graph) {
  const nodes = graph.nodes.map((node, index) => {
    const affectedEntities = useStore.getState().latestBackboardResponse?.affected_entities || { nodes: [] };
    const isAffected = affectedEntities.nodes?.includes(node.id);

    // Layout: vertical tiers by type with clear separation
    let yPos = 0;
    let emoji = '';
    if (node.type === 'supplier') {
      yPos = 0;
      emoji = '🏭';
    } else if (node.type === 'factory') {
      yPos = 200;
      emoji = '⚙️';
    } else if (node.type === 'warehouse') {
      yPos = 400;
      emoji = '📦';
    } else if (node.type === 'customer') {
      yPos = 600;
      emoji = '🏢';
    }

    // Spread horizontally within tier
    const tierCounts = { supplier: 4, factory: 4, warehouse: 4, customer: 16 };
    const tierIndex = graph.nodes.filter(n => n.type === node.type).indexOf(node);
    const nodeSpacing = 200; // Increased spacing for wider nodes
    const tierWidth = tierCounts[node.type] * nodeSpacing;
    const startX = (1400 - tierWidth) / 2; // Center the tier (increased canvas width)
    const xPos = startX + (tierIndex * nodeSpacing);

    return {
      id: node.id,
      type: 'default',
      position: { x: xPos, y: yPos },
      data: {
        label: (
          <div className="text-center">
            <div className="text-2xl mb-1">{emoji}</div>
            <div className="font-bold text-sm">{node.id}</div>
            <div className="text-xs font-semibold text-gray-700">{node.city}</div>
            <div className="text-xs text-gray-500">{node.country}</div>
            {isAffected && <div className="text-xs text-red-600 font-bold mt-1">⚠️ DISRUPTED</div>}
          </div>
        ),
      },
      style: {
        background: isAffected ? '#fee2e2' : NODE_COLORS[node.type] || '#cbd5e1',
        border: isAffected ? '4px solid #dc2626' : '3px solid #475569',
        borderRadius: '12px',
        padding: '14px',
        color: '#1e293b',
        fontSize: '12px',
        width: 160,
        minHeight: 100,
        boxShadow: isAffected ? '0 8px 20px rgba(220, 38, 38, 0.4)' : '0 4px 6px rgba(0, 0, 0, 0.1)',
      },
    };
  });

  const edges = graph.edges.map(edge => {
    const affectedEntities = useStore.getState().latestBackboardResponse?.affected_entities || { edges: [] };
    const isDisrupted = edge.status === 'DISRUPTED' || affectedEntities.edges?.includes(edge.id);

    return {
      id: edge.id,
      source: edge.from,
      target: edge.to,
      type: 'smoothstep', // Use smoothstep for better visual flow
      label: isDisrupted ? `⚠️ ${edge.mode} DELAYED +${edge.lead_time_days}d` : `✓ ${edge.mode}`,
      animated: !isDisrupted,
      style: {
        stroke: isDisrupted ? '#dc2626' : '#10b981',
        strokeWidth: isDisrupted ? 5 : 3,
        strokeDasharray: isDisrupted ? '10,10' : '0',
      },
      labelStyle: {
        fill: '#fff',
        fontWeight: 'bold',
        fontSize: '11px',
      },
      labelBgStyle: {
        fill: isDisrupted ? '#dc2626' : '#10b981',
        fillOpacity: 1,
        rx: 4,
        ry: 4,
      },
      labelBgPadding: [8, 4],
      markerEnd: {
        type: 'arrowclosed',
        color: isDisrupted ? '#dc2626' : '#10b981',
        width: 25,
        height: 25,
      },
    };
  });

  return { nodes, edges };
}

export default function SupplyChainGraph() {
  const currentGraph = useStore(state => state.currentGraph);

  const { nodes: initialNodes, edges: initialEdges } = useMemo(
    () => convertToReactFlow(currentGraph),
    [currentGraph]
  );

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // Update nodes and edges when graph changes
  useMemo(() => {
    const { nodes: newNodes, edges: newEdges } = convertToReactFlow(currentGraph);
    setNodes(newNodes);
    setEdges(newEdges);
  }, [currentGraph, setNodes, setEdges]);

  return (
    <div className="w-full h-full bg-white rounded border border-gray-300">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        fitView
        attributionPosition="bottom-left"
      >
        <Background color="#f0f0f0" />
        <Controls />
        <MiniMap
          nodeColor={(node) => {
            const originalNode = currentGraph.nodes.find(n => n.id === node.id);
            return NODE_COLORS[originalNode?.type] || '#cbd5e1';
          }}
          className="bg-gray-100"
        />
      </ReactFlow>
    </div>
  );
}
