// Non-AI KPI calculation engine and graph mutation logic

/**
 * Applies impact mutations to graph state
 * @param {Object} graphState - Current graph with nodes and edges
 * @param {Array} mutations - Array of mutation objects from Backboard
 * @returns {Object} New graph state with mutations applied
 */
export function applyMutations(graphState, mutations) {
  const newNodes = graphState.nodes.map(node => ({ ...node }));
  const newEdges = graphState.edges.map(edge => ({ ...edge }));

  mutations.forEach(mutation => {
    if (mutation.entity_type === 'NODE') {
      const node = newNodes.find(n => n.id === mutation.entity_id);
      if (node && mutation.changes) {
        // Apply node changes
        if (mutation.changes.risk_score_delta !== undefined) {
          node.risk_score = (node.risk_score || 0) + mutation.changes.risk_score_delta;
        }
        if (mutation.changes.capacity_multiplier !== undefined) {
          node.capacity = (node.capacity || 0) * mutation.changes.capacity_multiplier;
        }
        if (mutation.changes.inventory_delta !== undefined) {
          node.inventory = (node.inventory || 0) + mutation.changes.inventory_delta;
        }
        if (mutation.changes.status) {
          node.status = mutation.changes.status;
        }
      }
    } else if (mutation.entity_type === 'EDGE') {
      const edge = newEdges.find(e => e.id === mutation.entity_id);
      if (edge && mutation.changes) {
        // Apply edge changes
        if (mutation.changes.lead_time_days_delta !== undefined) {
          edge.lead_time_days = edge.lead_time_days + mutation.changes.lead_time_days_delta;
        }
        if (mutation.changes.cost_index_multiplier !== undefined) {
          edge.cost_index = edge.cost_index * mutation.changes.cost_index_multiplier;
        }
        if (mutation.changes.capacity_multiplier !== undefined) {
          edge.capacity_pct = (edge.capacity_pct || 1.0) * mutation.changes.capacity_multiplier;
        }
        if (mutation.changes.status) {
          edge.status = mutation.changes.status;
        }
        // Store reason for display
        if (mutation.reason) {
          edge.disruption_reason = mutation.reason;
        }
      }
    }
  });

  return { nodes: newNodes, edges: newEdges };
}

/**
 * Computes KPIs based on current graph state
 * Simple 14-day forward projection
 * @param {Object} graphState - Current graph with nodes and edges
 * @returns {Object} KPI values
 */
export function computeKPIs(graphState) {
  const { nodes, edges } = graphState;

  // Get all customers
  const customers = nodes.filter(n => n.type === 'customer');

  // Calculate average lead time across all active edges
  const activeEdges = edges.filter(e => e.status === 'OK' || !e.status);
  const totalLeadTime = activeEdges.reduce((sum, e) => sum + (e.lead_time_days || 0), 0);
  const avgLeadTime = activeEdges.length > 0 ? Math.round(totalLeadTime / activeEdges.length) : 0;

  // Calculate total cost index
  const totalCost = edges.reduce((sum, e) => sum + (e.cost_index || 0), 0);

  // Simple stockout risk calculation
  // For each customer, check if their warehouse can supply them
  let stockoutCustomers = 0;

  customers.forEach(customer => {
    // Find edge from warehouse to this customer
    const customerEdge = edges.find(e => e.to === customer.id);
    if (!customerEdge) {
      stockoutCustomers++;
      return;
    }

    // Check if edge is disrupted or has very long lead time
    if (customerEdge.status === 'DISRUPTED' || customerEdge.lead_time_days > 10) {
      stockoutCustomers++;
      return;
    }

    // Find the warehouse
    const warehouse = nodes.find(n => n.id === customerEdge.from);
    if (!warehouse) {
      stockoutCustomers++;
      return;
    }

    // Simple check: if warehouse inventory is low, risk of stockout
    const demand14days = customer.daily_demand * 14;
    if ((warehouse.inventory || 0) < demand14days) {
      stockoutCustomers++;
    }
  });

  // Service level: inverse of stockout rate
  const serviceLevel = customers.length > 0
    ? Math.round(((customers.length - stockoutCustomers) / customers.length) * 100)
    : 95;

  return {
    service_level: Math.max(0, Math.min(100, serviceLevel)), // clamp 0-100
    stockout_risk_customers: stockoutCustomers,
    avg_lead_time: avgLeadTime,
    cost_index: Math.round(totalCost),
  };
}

/**
 * Creates a deep copy of graph state
 */
export function cloneGraph(graph) {
  return {
    nodes: graph.nodes.map(n => ({ ...n })),
    edges: graph.edges.map(e => ({ ...e })),
  };
}
