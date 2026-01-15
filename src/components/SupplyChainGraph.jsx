import { useCallback, useMemo } from 'react';
import ReactFlow, {
  Background,
  Controls,
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

// Seeded random function for consistent "messy" layout
function seededRandom(seed) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

// Check if two positions are too close (overlapping)
function isTooClose(pos1, pos2, minDistance = 200) {
  const dx = pos1.x - pos2.x;
  const dy = pos1.y - pos2.y;
  const distance = Math.sqrt(dx * dx + dy * dy);
  return distance < minDistance;
}

// Adjust positions to avoid overlaps
function resolveOverlaps(positions) {
  const minDistance = 200; // Minimum distance between nodes
  const maxIterations = 50; // Max attempts to resolve overlaps

  for (let iteration = 0; iteration < maxIterations; iteration++) {
    let hadOverlap = false;

    for (let i = 0; i < positions.length; i++) {
      for (let j = i + 1; j < positions.length; j++) {
        if (isTooClose(positions[i], positions[j], minDistance)) {
          hadOverlap = true;

          // Calculate push direction
          const dx = positions[i].x - positions[j].x;
          const dy = positions[i].y - positions[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy) || 1;

          // Normalize and push apart
          const pushX = (dx / distance) * (minDistance - distance) / 2;
          const pushY = (dy / distance) * (minDistance - distance) / 2;

          positions[i].x += pushX;
          positions[i].y += pushY;
          positions[j].x -= pushX;
          positions[j].y -= pushY;
        }
      }
    }

    // If no overlaps found, we're done
    if (!hadOverlap) break;
  }

  return positions;
}

// Convert graph data to React Flow format
function convertToReactFlow(graph) {
  // First pass: calculate initial positions
  const initialPositions = graph.nodes.map((node) => {
    const seed = node.id.charCodeAt(node.id.length - 1) * 123 + node.id.charCodeAt(0) * 456;

    // Random X position across wide range
    let x = seededRandom(seed) * 2000 - 250;
    const y = seededRandom(seed + 789) * 1000 - 100;

    // Move specific nodes to the right
    if (node.id === 'S4' || node.id === 'S2' || node.id === 'C8' || node.id === 'C16') {
      x = x + 800;
    }

    return { id: node.id, x, y };
  });

  // Resolve overlaps
  const adjustedPositions = resolveOverlaps(initialPositions);

  // Second pass: create actual nodes with adjusted positions
  const nodes = graph.nodes.map((node, index) => {
    const affectedEntities = useStore.getState().latestBackboardResponse?.affected_entities || { nodes: [] };
    const isAffected = affectedEntities.nodes?.includes(node.id);

    // Get adjusted position for this node
    const position = adjustedPositions.find(p => p.id === node.id);

    return {
      id: node.id,
      type: 'default',
      position: { x: position.x, y: position.y },
      data: {
        label: (
          <div className="text-center">
            <div className={`font-bold text-sm ${isAffected ? 'text-gray-900' : 'text-white'}`}>{node.name}</div>
            <div className={`text-xs font-semibold ${isAffected ? 'text-gray-700' : 'text-white/90'}`}>{node.city}</div>
            <div className={`text-xs ${isAffected ? 'text-gray-600' : 'text-white/70'}`}>{node.country}</div>
            {isAffected && <div className="text-xs text-red-700 font-bold mt-1">DISRUPTED</div>}
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
      </ReactFlow>
    </div>
  );
}
