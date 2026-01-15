// Hardcoded baseline supply chain structure
// 28 nodes: 4 suppliers, 4 factories, 4 warehouses, 16 customers
// 28 edges: supplier→factory(8), factory→warehouse(4), warehouse→customer(16)

export const baselineNodes = [
  // Suppliers (4) - with specific locations
  { id: 'S1', name: 'Shanghai Components', type: 'supplier', region: 'APAC', country: 'China', city: 'Shanghai', risk_score: 0.2 },
  { id: 'S2', name: 'HK Electronics', type: 'supplier', region: 'APAC', country: 'China', city: 'Hong Kong', risk_score: 0.3 },
  { id: 'S3', name: 'Rotterdam Materials', type: 'supplier', region: 'EU', country: 'Netherlands', city: 'Rotterdam', risk_score: 0.1 },
  { id: 'S4', name: 'Pacific Supply Co', type: 'supplier', region: 'NA-WEST', country: 'USA', city: 'Seattle', risk_score: 0.15 },

  // Factories (4) - with specific locations and capacity
  { id: 'F1', name: 'Shenzhen Mfg Plant', type: 'factory', region: 'APAC', country: 'China', city: 'Shenzhen', capacity: 1000, risk_score: 0.3 },
  { id: 'F2', name: 'Taipei Assembly', type: 'factory', region: 'APAC', country: 'Taiwan', city: 'Taipei', capacity: 1200, risk_score: 0.25 },
  { id: 'F3', name: 'Hamburg Production', type: 'factory', region: 'EU', country: 'Germany', city: 'Hamburg', capacity: 900, risk_score: 0.2 },
  { id: 'F4', name: 'LA Manufacturing', type: 'factory', region: 'NA-WEST', country: 'USA', city: 'Los Angeles', capacity: 1100, risk_score: 0.15 },

  // Warehouses (4) - with specific locations and inventory
  { id: 'W1', name: 'SF Distribution', type: 'warehouse', region: 'NA-WEST', country: 'USA', city: 'San Francisco', inventory: 500, risk_score: 0.1 },
  { id: 'W2', name: 'NJ Logistics Hub', type: 'warehouse', region: 'NA-EAST', country: 'USA', city: 'New Jersey', inventory: 600, risk_score: 0.1 },
  { id: 'W3', name: 'London Depot', type: 'warehouse', region: 'EU', country: 'UK', city: 'London', inventory: 450, risk_score: 0.15 },
  { id: 'W4', name: 'Singapore Center', type: 'warehouse', region: 'APAC', country: 'Singapore', city: 'Singapore', inventory: 550, risk_score: 0.2 },

  // Customers (16) - with specific locations and daily demand
  { id: 'C1', name: 'TechCorp SF', type: 'customer', region: 'NA-WEST', country: 'USA', city: 'San Francisco', daily_demand: 10 },
  { id: 'C2', name: 'LA Retail Group', type: 'customer', region: 'NA-WEST', country: 'USA', city: 'Los Angeles', daily_demand: 12 },
  { id: 'C3', name: 'Seattle Systems', type: 'customer', region: 'NA-WEST', country: 'USA', city: 'Seattle', daily_demand: 8 },
  { id: 'C4', name: 'Portland Trading', type: 'customer', region: 'NA-WEST', country: 'USA', city: 'Portland', daily_demand: 15 },
  { id: 'C5', name: 'NYC Enterprises', type: 'customer', region: 'NA-EAST', country: 'USA', city: 'New York', daily_demand: 11 },
  { id: 'C6', name: 'Boston Industries', type: 'customer', region: 'NA-EAST', country: 'USA', city: 'Boston', daily_demand: 9 },
  { id: 'C7', name: 'Miami Commerce', type: 'customer', region: 'NA-EAST', country: 'USA', city: 'Miami', daily_demand: 13 },
  { id: 'C8', name: 'DC Solutions', type: 'customer', region: 'NA-EAST', country: 'USA', city: 'Washington DC', daily_demand: 10 },
  { id: 'C9', name: 'London Merchants', type: 'customer', region: 'EU', country: 'UK', city: 'London', daily_demand: 14 },
  { id: 'C10', name: 'Berlin Tech', type: 'customer', region: 'EU', country: 'Germany', city: 'Berlin', daily_demand: 10 },
  { id: 'C11', name: 'Paris Distributors', type: 'customer', region: 'EU', country: 'France', city: 'Paris', daily_demand: 12 },
  { id: 'C12', name: 'Madrid Wholesale', type: 'customer', region: 'EU', country: 'Spain', city: 'Madrid', daily_demand: 11 },
  { id: 'C13', name: 'Singapore Trade', type: 'customer', region: 'APAC', country: 'Singapore', city: 'Singapore', daily_demand: 9 },
  { id: 'C14', name: 'Tokyo Partners', type: 'customer', region: 'APAC', country: 'Japan', city: 'Tokyo', daily_demand: 13 },
  { id: 'C15', name: 'Seoul Markets', type: 'customer', region: 'APAC', country: 'South Korea', city: 'Seoul', daily_demand: 10 },
  { id: 'C16', name: 'Sydney Imports', type: 'customer', region: 'APAC', country: 'Australia', city: 'Sydney', daily_demand: 12 },
];

export const baselineEdges = [
  // Supplier → Factory (8 edges, each factory has 2 suppliers)
  { id: 'E_S1_F1', from: 'S1', to: 'F1', mode: 'OCEAN', lead_time_days: 14, cost_index: 10, status: 'OK' },
  { id: 'E_S2_F1', from: 'S2', to: 'F1', mode: 'OCEAN', lead_time_days: 12, cost_index: 9, status: 'OK' },
  { id: 'E_S1_F2', from: 'S1', to: 'F2', mode: 'OCEAN', lead_time_days: 15, cost_index: 11, status: 'OK' },
  { id: 'E_S2_F2', from: 'S2', to: 'F2', mode: 'OCEAN', lead_time_days: 13, cost_index: 10, status: 'OK' },
  { id: 'E_S3_F3', from: 'S3', to: 'F3', mode: 'RAIL', lead_time_days: 7, cost_index: 6, status: 'OK' },
  { id: 'E_S4_F3', from: 'S4', to: 'F3', mode: 'OCEAN', lead_time_days: 18, cost_index: 12, status: 'OK' },
  { id: 'E_S3_F4', from: 'S3', to: 'F4', mode: 'OCEAN', lead_time_days: 16, cost_index: 11, status: 'OK' },
  { id: 'E_S4_F4', from: 'S4', to: 'F4', mode: 'TRUCK', lead_time_days: 3, cost_index: 5, status: 'OK' },

  // Factory → Warehouse (4 edges, each factory ships to 1 warehouse)
  { id: 'E_F1_W1', from: 'F1', to: 'W1', mode: 'OCEAN', lead_time_days: 21, cost_index: 20, status: 'OK' },
  { id: 'E_F2_W2', from: 'F2', to: 'W2', mode: 'OCEAN', lead_time_days: 23, cost_index: 22, status: 'OK' },
  { id: 'E_F3_W3', from: 'F3', to: 'W3', mode: 'RAIL', lead_time_days: 5, cost_index: 8, status: 'OK' },
  { id: 'E_F4_W4', from: 'F4', to: 'W4', mode: 'OCEAN', lead_time_days: 19, cost_index: 18, status: 'OK' },

  // Warehouse → Customer (16 edges, each warehouse serves 4 customers)
  { id: 'E_W1_C1', from: 'W1', to: 'C1', mode: 'TRUCK', lead_time_days: 2, cost_index: 5, status: 'OK' },
  { id: 'E_W1_C2', from: 'W1', to: 'C2', mode: 'TRUCK', lead_time_days: 1, cost_index: 4, status: 'OK' },
  { id: 'E_W1_C3', from: 'W1', to: 'C3', mode: 'TRUCK', lead_time_days: 2, cost_index: 5, status: 'OK' },
  { id: 'E_W1_C4', from: 'W1', to: 'C4', mode: 'TRUCK', lead_time_days: 3, cost_index: 6, status: 'OK' },
  { id: 'E_W2_C5', from: 'W2', to: 'C5', mode: 'TRUCK', lead_time_days: 2, cost_index: 5, status: 'OK' },
  { id: 'E_W2_C6', from: 'W2', to: 'C6', mode: 'TRUCK', lead_time_days: 1, cost_index: 4, status: 'OK' },
  { id: 'E_W2_C7', from: 'W2', to: 'C7', mode: 'TRUCK', lead_time_days: 2, cost_index: 5, status: 'OK' },
  { id: 'E_W2_C8', from: 'W2', to: 'C8', mode: 'TRUCK', lead_time_days: 2, cost_index: 5, status: 'OK' },
  { id: 'E_W3_C9', from: 'W3', to: 'C9', mode: 'TRUCK', lead_time_days: 1, cost_index: 4, status: 'OK' },
  { id: 'E_W3_C10', from: 'W3', to: 'C10', mode: 'TRUCK', lead_time_days: 2, cost_index: 5, status: 'OK' },
  { id: 'E_W3_C11', from: 'W3', to: 'C11', mode: 'TRUCK', lead_time_days: 3, cost_index: 6, status: 'OK' },
  { id: 'E_W3_C12', from: 'W3', to: 'C12', mode: 'TRUCK', lead_time_days: 2, cost_index: 5, status: 'OK' },
  { id: 'E_W4_C13', from: 'W4', to: 'C13', mode: 'TRUCK', lead_time_days: 2, cost_index: 5, status: 'OK' },
  { id: 'E_W4_C14', from: 'W4', to: 'C14', mode: 'TRUCK', lead_time_days: 1, cost_index: 4, status: 'OK' },
  { id: 'E_W4_C15', from: 'W4', to: 'C15', mode: 'TRUCK', lead_time_days: 3, cost_index: 6, status: 'OK' },
  { id: 'E_W4_C16', from: 'W4', to: 'C16', mode: 'TRUCK', lead_time_days: 2, cost_index: 5, status: 'OK' },
];

// Baseline KPIs (before any disruptions)
export const baselineKPIs = {
  service_level: 95, // percentage
  stockout_risk_customers: 2, // out of 16
  avg_lead_time: 18, // days
  cost_index: 100, // baseline = 100
};

// Helper to create deep copy of graph
export function createGraphCopy() {
  return {
    nodes: baselineNodes.map(n => ({ ...n })),
    edges: baselineEdges.map(e => ({ ...e })),
  };
}
