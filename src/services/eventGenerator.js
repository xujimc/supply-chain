// World event generator with seeded randomness
// 6 event types: PORT_STRIKE, EXTREME_WEATHER, BORDER_DELAY, ENERGY_PRICE_SPIKE, SANCTIONS, CANAL_BLOCKAGE

// Seeded random number generator (simple LCG)
function seededRandom(seed) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

// Get random int between min and max (inclusive)
function randomInt(seed, min, max) {
  return Math.floor(seededRandom(seed) * (max - min + 1)) + min;
}

// Get random element from array
function randomChoice(seed, array) {
  return array[Math.floor(seededRandom(seed) * array.length)];
}

const EVENT_TYPES = [
  'PORT_STRIKE',
  'EXTREME_WEATHER',
  'BORDER_DELAY',
  'ENERGY_PRICE_SPIKE',
  'SANCTIONS',
  'CANAL_BLOCKAGE',
];

const EVENT_TEMPLATES = {
  PORT_STRIKE: {
    headline: 'Major port strike disrupts shipping operations',
    regions: ['APAC', 'NA-WEST'],
    modes: ['OCEAN'],
    lanes: ['APAC->NA-WEST', 'APAC->NA-EAST'],
    impact_ranges: {
      lead_time_delta_days: [5, 10],
      capacity_delta_pct: [-30, -15],
      cost_delta_pct: [20, 40],
    },
    facts: [
      'Port workers demanding better wages and conditions',
      'Estimated 300+ ships waiting at anchor',
      'Alternative ports operating at capacity',
    ],
  },
  EXTREME_WEATHER: {
    headline: 'Severe typhoon forces port closures across Asia-Pacific',
    regions: ['APAC'],
    modes: ['OCEAN', 'AIR'],
    lanes: ['APAC->NA-WEST', 'APAC->EU'],
    impact_ranges: {
      lead_time_delta_days: [7, 14],
      capacity_delta_pct: [-40, -20],
      cost_delta_pct: [30, 60],
    },
    facts: [
      'Category 4 typhoon approaching major shipping lanes',
      'Airport closures expected for 3-5 days',
      'Infrastructure damage assessment ongoing',
    ],
  },
  BORDER_DELAY: {
    headline: 'New customs regulations cause massive border delays',
    regions: ['EU', 'NA-WEST'],
    modes: ['TRUCK', 'RAIL'],
    lanes: ['EU->NA-WEST'],
    impact_ranges: {
      lead_time_delta_days: [3, 7],
      capacity_delta_pct: [-20, -10],
      cost_delta_pct: [10, 25],
    },
    facts: [
      'New digital customs documentation required',
      'Processing times increased by 200%',
      'Truck queues stretching 15+ miles',
    ],
  },
  ENERGY_PRICE_SPIKE: {
    headline: 'Oil prices surge amid geopolitical tensions',
    regions: ['APAC', 'EU', 'NA-WEST'],
    modes: ['OCEAN', 'TRUCK', 'AIR'],
    lanes: ['APAC->NA-WEST', 'EU->NA-EAST'],
    impact_ranges: {
      lead_time_delta_days: [0, 2],
      capacity_delta_pct: [-10, 0],
      cost_delta_pct: [40, 80],
    },
    facts: [
      'Brent crude up 35% in two weeks',
      'Carriers imposing emergency fuel surcharges',
      'Some routes becoming economically unviable',
    ],
  },
  SANCTIONS: {
    headline: 'New trade sanctions restrict key shipping routes',
    regions: ['APAC', 'EU'],
    modes: ['OCEAN'],
    lanes: ['APAC->EU', 'EU->APAC'],
    impact_ranges: {
      lead_time_delta_days: [10, 20],
      capacity_delta_pct: [-50, -30],
      cost_delta_pct: [50, 100],
    },
    facts: [
      'Major carriers suspending certain routes',
      'Rerouting through alternative corridors required',
      'Compliance verification adding delays',
    ],
  },
  CANAL_BLOCKAGE: {
    headline: 'Container ship runs aground, blocking major canal',
    regions: ['APAC', 'EU'],
    modes: ['OCEAN'],
    lanes: ['APAC->EU', 'EU->APAC'],
    impact_ranges: {
      lead_time_delta_days: [14, 28],
      capacity_delta_pct: [-60, -40],
      cost_delta_pct: [80, 150],
    },
    facts: [
      'Ultra-large container vessel stuck sideways',
      'Salvage operations expected to take weeks',
      'Hundreds of ships rerouting around Africa',
    ],
  },
};

const SEVERITY_LEVELS = ['LOW', 'MEDIUM', 'HIGH'];
const TIME_HORIZONS = ['IMMEDIATE', '1_2_WEEKS'];

/**
 * Generate a structured world event using seeded randomness
 * @param {number} seed - Seed for deterministic randomness
 * @returns {Object} World event JSON
 */
export function generateWorldEvent(seed) {
  // Select event type deterministically
  const eventTypeIndex = seed % EVENT_TYPES.length;
  const eventType = EVENT_TYPES[eventTypeIndex];
  const template = EVENT_TEMPLATES[eventType];

  // Use different seed offsets for different random values
  const severity = randomChoice(seed * 2, SEVERITY_LEVELS);
  const timeHorizon = randomChoice(seed * 3, TIME_HORIZONS);

  // Generate ID
  const id = `EVT_${String(seed).padStart(4, '0')}`;

  // Get timestamp
  const timestamp = new Date().toISOString();

  // Calculate impact ranges (use template ranges)
  const impact_ranges = {
    lead_time_delta_days: template.impact_ranges.lead_time_delta_days,
    capacity_delta_pct: template.impact_ranges.capacity_delta_pct,
    cost_delta_pct: template.impact_ranges.cost_delta_pct,
  };

  return {
    id,
    seed,
    timestamp,
    headline: template.headline,
    event_type: eventType,
    regions: template.regions,
    severity,
    time_horizon: timeHorizon,
    logistics: {
      modes: template.modes,
      lanes: template.lanes,
    },
    impact_ranges,
    facts: template.facts,
  };
}
