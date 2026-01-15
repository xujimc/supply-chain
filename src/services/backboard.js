import axios from 'axios';
import { baselineNodes, baselineEdges } from '../data/baseline';

// Local backend server URL
const BACKEND_URL = 'http://localhost:3001/api';

// Expected JSON schema for validation
const EXPECTED_SCHEMA_KEYS = [
  'event_id',
  'summary',
  'affected_entities',
  'impact_mutations',
  'kpi_implications',
  'recommendations'
];

export class BackboardClient {
  constructor() {
    this.client = axios.create({
      baseURL: BACKEND_URL,
      timeout: 60000,
    });
  }

  /**
   * Create an assistant
   */
  async createAssistant({ name, description }) {
    try {
      const response = await this.client.post('/assistant', {
        name,
        description: description || 'Supply chain reasoning assistant that analyzes events and provides structured recommendations.'
      });

      return {
        assistantId: response.data.assistantId,
      };
    } catch (error) {
      console.error('Create assistant error:', error);
      throw new Error(`Failed to create assistant: ${error.response?.data?.error || error.message}`);
    }
  }

  /**
   * Create a thread for an assistant
   */
  async createThread(assistantId) {
    try {
      const response = await this.client.post('/thread', {
        assistantId
      });

      return {
        threadId: response.data.threadId,
      };
    } catch (error) {
      console.error('Create thread error:', error);
      throw new Error(`Failed to create thread: ${error.response?.data?.error || error.message}`);
    }
  }

  /**
   * Send a message to analyze an event
   * Returns structured JSON response from AI
   */
  async analyzeEvent(threadId, event, retryCount = 0) {
    const prompt = this._buildAnalysisPrompt(event, retryCount);

    try {
      const response = await this.client.post('/analyze', {
        threadId,
        content: prompt,
        retryCount
      });

      console.log('Raw AI response:', response.data.content);

      // Parse JSON response
      const parsed = this._parseAIResponse(response.data.content);

      // Validate schema
      if (!this._validateResponse(parsed)) {
        throw new Error('Invalid response schema');
      }

      return parsed;
    } catch (error) {
      console.error('Analyze event error:', error);

      // Retry once with stricter prompt
      if (retryCount === 0) {
        console.log('Retrying with stricter prompt...');
        return this.analyzeEvent(threadId, event, 1);
      }

      throw new Error(`AI analysis failed: ${error.response?.data?.error || error.message}`);
    }
  }

  /**
   * Build the analysis prompt for the AI
   */
  _buildAnalysisPrompt(event, retryCount) {
    const strictPrefix = retryCount > 0
      ? 'CRITICAL: Return ONLY valid JSON. No markdown code blocks, no backticks, no explanation text. ONLY the JSON object.\n\n'
      : '';

    // Build supply chain topology description
    const supplyChainTopology = this._buildSupplyChainContext();

    return `${strictPrefix}You are a supply chain reasoning assistant with expertise in geopolitics and logistics.

CURRENT SUPPLY CHAIN TOPOLOGY:
${supplyChainTopology}

WORLD EVENT:
${JSON.stringify(event, null, 2)}

Your task:
1. Analyze how this event impacts the supply chain based on GEOGRAPHY and ROUTES
2. Identify which specific nodes/edges are affected (e.g., Shanghai suppliers, ocean routes through Taiwan Strait)
3. Calculate realistic impact (lead time delays, cost increases, capacity reductions)
4. Recommend 1-2 SPECIFIC mitigation actions using ALTERNATIVE GEOGRAPHICAL ROUTES or nodes
   - Example: "Reroute from Shanghai (S1) to Rotterdam supplier (S3)"
   - Example: "Shift production from Shenzhen factory (F1) to Hamburg factory (F3)"
5. Explain KPI implications

Return ONLY valid JSON matching this EXACT schema:
{
  "event_id": "${event.id}",
  "summary": "2-4 sentence analysis",
  "affected_entities": {
    "nodes": ["S1", "F1"],
    "edges": ["E_S1_F1", "E_F1_W1"]
  },
  "impact_mutations": [
    {
      "entity_type": "EDGE",
      "entity_id": "E_F1_W1",
      "changes": {
        "lead_time_days_delta": 5,
        "cost_index_multiplier": 1.3,
        "status": "DISRUPTED"
      },
      "reason": "Ocean shipping delays"
    }
  ],
  "kpi_implications": [
    {
      "metric": "SERVICE_LEVEL",
      "direction": "DOWN",
      "why": "Longer lead times increase risk"
    }
  ],
  "recommendations": [
    {
      "id": "REC_0001",
      "action_type": "REROUTE",
      "mutations": [
        {
          "entity_type": "EDGE",
          "entity_id": "E_F2_W1",
          "changes": { "lead_time_days_delta": -2 }
        }
      ],
      "expected_impact": {
        "service_level_delta_pct": 3,
        "cost_index_delta_pct": 8,
        "stockout_customers_delta": -1
      },
      "rationale": "Reroute to reduce delays"
    }
  ]
}

Do not include extra text. Return ONLY the JSON object.`;
  }

  /**
   * Build supply chain topology context with geographical information
   */
  _buildSupplyChainContext() {
    // Group nodes by type
    const suppliers = baselineNodes.filter(n => n.type === 'supplier');
    const factories = baselineNodes.filter(n => n.type === 'factory');
    const warehouses = baselineNodes.filter(n => n.type === 'warehouse');
    const customers = baselineNodes.filter(n => n.type === 'customer');

    let context = 'NODES:\n';

    context += '\nSuppliers:\n';
    suppliers.forEach(n => {
      context += `  ${n.id}: ${n.city}, ${n.country} (${n.region})\n`;
    });

    context += '\nFactories:\n';
    factories.forEach(n => {
      context += `  ${n.id}: ${n.city}, ${n.country} (${n.region}) - Capacity: ${n.capacity}\n`;
    });

    context += '\nWarehouses:\n';
    warehouses.forEach(n => {
      context += `  ${n.id}: ${n.city}, ${n.country} (${n.region}) - Inventory: ${n.inventory}\n`;
    });

    context += '\nCustomers:\n';
    customers.forEach(n => {
      context += `  ${n.id}: ${n.city}, ${n.country} (${n.region}) - Demand: ${n.daily_demand}/day\n`;
    });

    context += '\nROUTES (EDGES):\n';

    // Supplier -> Factory routes
    const supplierToFactory = baselineEdges.filter(e => e.from.startsWith('S') && e.to.startsWith('F'));
    context += '\nSupplier → Factory:\n';
    supplierToFactory.forEach(e => {
      const from = baselineNodes.find(n => n.id === e.from);
      const to = baselineNodes.find(n => n.id === e.to);
      context += `  ${e.id}: ${from.city} → ${to.city} (${e.mode}, ${e.lead_time_days}d, cost: ${e.cost_index})\n`;
    });

    // Factory -> Warehouse routes
    const factoryToWarehouse = baselineEdges.filter(e => e.from.startsWith('F') && e.to.startsWith('W'));
    context += '\nFactory → Warehouse:\n';
    factoryToWarehouse.forEach(e => {
      const from = baselineNodes.find(n => n.id === e.from);
      const to = baselineNodes.find(n => n.id === e.to);
      context += `  ${e.id}: ${from.city} → ${to.city} (${e.mode}, ${e.lead_time_days}d, cost: ${e.cost_index})\n`;
    });

    // Warehouse -> Customer routes (summarized to avoid too much text)
    const warehouseToCustomer = baselineEdges.filter(e => e.from.startsWith('W') && e.to.startsWith('C'));
    context += '\nWarehouse → Customer: (16 routes, all by TRUCK, 1-3 days)\n';
    context += '  W1 (San Francisco) serves 4 customers in NA-WEST\n';
    context += '  W2 (New Jersey) serves 4 customers in NA-EAST\n';
    context += '  W3 (London) serves 4 customers in EU\n';
    context += '  W4 (Singapore) serves 4 customers in APAC\n';

    return context;
  }

  /**
   * Parse AI response, handling various formats
   */
  _parseAIResponse(response) {
    let text = typeof response === 'string' ? response : JSON.stringify(response);

    // Remove markdown code blocks if present
    text = text.replace(/```json\n?/g, '').replace(/```\n?/g, '');

    // Try to extract JSON from text
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      text = jsonMatch[0];
    }

    // Parse JSON
    try {
      return JSON.parse(text);
    } catch (e) {
      console.error('Failed to parse JSON:', text);
      throw new Error('AI returned invalid JSON');
    }
  }

  /**
   * Validate response has required fields
   */
  _validateResponse(response) {
    if (!response || typeof response !== 'object') {
      return false;
    }

    // Check for required keys
    const hasRequiredKeys = EXPECTED_SCHEMA_KEYS.every(key => key in response);
    if (!hasRequiredKeys) {
      console.warn('Missing required keys:', EXPECTED_SCHEMA_KEYS.filter(k => !(k in response)));
      return false;
    }

    return true;
  }
}
