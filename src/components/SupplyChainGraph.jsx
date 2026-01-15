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

    // Layout: vertical tiers by type
    let yPos = 0;
    if (node.type === 'supplier') yPos = 0;
    else if (node.type === 'factory') yPos = 150;
    else if (node.type === 'warehouse') yPos = 300;
    else if (node.type === 'customer') yPos = 450;

    // Spread horizontally within tier
    const tierCounts = { supplier: 4, factory: 4, warehouse: 4, customer: 16 };
    const tierIndex = graph.nodes.filter(n => n.type === node.type).indexOf(node);
    const xPos = (tierIndex * 200) + 50;

    return {
      id: node.id,
      type: 'default',
      position: { x: xPos, y: yPos },
      data: {
        label: (
          <div className="text-center">
            <div className="font-bold">{node.id}</div>
            <div className="text-xs text-gray-600">{node.type}</div>
            {isAffected && <div className="text-xs text-red-600">⚠ Affected</div>}
          </div>
        ),
      },
      style: {
        background: isAffected ? '#fecaca' : NODE_COLORS[node.type] || '#cbd5e1',
        border: isAffected ? '3px solid #dc2626' : '2px solid #64748b',
        borderRadius: '8px',
        padding: '10px',
        color: '#fff',
        fontSize: '12px',
        width: 120,
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
      label: isDisrupted ? `${edge.mode} +${edge.lead_time_days}d` : edge.mode,
      animated: !isDisrupted,
      style: {
        stroke: isDisrupted ? '#dc2626' : '#10b981',
        strokeWidth: isDisrupted ? 3 : 2,
        strokeDasharray: isDisrupted ? '5,5' : '0',
      },
      labelStyle: {
        fill: isDisrupted ? '#dc2626' : '#000',
        fontWeight: isDisrupted ? 'bold' : 'normal',
        fontSize: '10px',
      },
      labelBgStyle: {
        fill: '#fff',
        fillOpacity: 0.8,
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
    <div className="w-full h-full bg-gray-50 rounded-lg border-2 border-gray-300">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        fitView
        attributionPosition="bottom-left"
      >
        <Background />
        <Controls />
        <MiniMap
          nodeColor={(node) => {
            const originalNode = currentGraph.nodes.find(n => n.id === node.id);
            return NODE_COLORS[originalNode?.type] || '#cbd5e1';
          }}
        />
      </ReactFlow>
    </div>
  );
}
