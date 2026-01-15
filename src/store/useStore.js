import { create } from 'zustand';
import { baselineNodes, baselineEdges, baselineKPIs, createGraphCopy } from '../data/baseline';
import { generateWorldEvent } from '../services/eventGenerator';
import { computeKPIs, applyMutations, cloneGraph } from '../services/simulation';
import { BackboardClient } from '../services/backboard';

// Initialize Backboard client (will be created on first use)
let backboardClient = null;

const useStore = create((set, get) => ({
  // Graph state
  baselineGraph: { nodes: baselineNodes, edges: baselineEdges },
  currentGraph: { nodes: baselineNodes, edges: baselineEdges },

  // KPIs
  baselineKPIs: baselineKPIs,
  currentKPIs: baselineKPIs,

  // Event flow
  eventSeed: 1,
  latestEvent: null,
  latestBackboardResponse: null,

  // Backboard session
  assistantId: null,
  threadId: null,

  // UI state
  loading: false,
  error: null,
  recommendationsAccepted: false,

  // Initialize Backboard session
  initializeBackboard: async () => {
    try {
      set({ loading: true, error: null });

      if (!backboardClient) {
        backboardClient = new BackboardClient();
      }

      // Create assistant
      const assistant = await backboardClient.createAssistant({
        name: 'Supply Chain Reasoner',
        description: 'Expert supply chain analyst that analyzes events and provides structured JSON responses with impact analysis and recommendations.',
      });

      // Create thread
      const thread = await backboardClient.createThread(assistant.assistantId);

      set({
        assistantId: assistant.assistantId,
        threadId: thread.threadId,
        loading: false,
      });

      console.log('Backboard initialized:', { assistantId: assistant.assistantId, threadId: thread.threadId });
    } catch (error) {
      console.error('Failed to initialize Backboard:', error);
      set({
        loading: false,
        error: 'Failed to initialize AI system. Please check your API key.'
      });
    }
  },

  // Generate and process event
  generateEvent: async () => {
    const state = get();

    try {
      set({ loading: true, error: null, recommendationsAccepted: false });

      // Generate event
      const event = generateWorldEvent(state.eventSeed);
      console.log('Generated event:', event);

      set({ latestEvent: event });

      // Send to Backboard if initialized
      if (!state.threadId) {
        set({
          loading: false,
          error: 'AI system not initialized. Please refresh the page.'
        });
        return;
      }

      const backboardResponse = await backboardClient.analyzeEvent(state.threadId, event);
      console.log('Backboard response:', backboardResponse);

      set({ latestBackboardResponse: backboardResponse });

      // Apply impact mutations to graph
      if (backboardResponse.impact_mutations && backboardResponse.impact_mutations.length > 0) {
        const newGraph = applyMutations(state.currentGraph, backboardResponse.impact_mutations);
        const newKPIs = computeKPIs(newGraph);

        set({
          currentGraph: newGraph,
          currentKPIs: newKPIs,
          loading: false,
          eventSeed: state.eventSeed + 1,
        });
      } else {
        set({
          loading: false,
          eventSeed: state.eventSeed + 1
        });
      }
    } catch (error) {
      console.error('Failed to generate/process event:', error);
      set({
        loading: false,
        error: error.message || 'Failed to process event. Please try again.'
      });
    }
  },

  // Accept recommendations
  acceptRecommendations: () => {
    const state = get();

    if (!state.latestBackboardResponse || !state.latestBackboardResponse.recommendations) {
      return;
    }

    set({ loading: true });

    // Collect all mutations from all recommendations
    const allMutations = state.latestBackboardResponse.recommendations.flatMap(
      rec => rec.mutations || []
    );

    if (allMutations.length === 0) {
      set({ loading: false });
      return;
    }

    // Apply all recommendation mutations with slight delay for visual feedback
    setTimeout(() => {
      const newGraph = applyMutations(state.currentGraph, allMutations);
      const newKPIs = computeKPIs(newGraph);

      set({
        currentGraph: newGraph,
        currentKPIs: newKPIs,
        loading: false,
        recommendationsAccepted: true,
      });

      console.log('✅ Recommendations accepted! New KPIs:', newKPIs);
    }, 500);
  },

  // Reset to baseline
  reset: () => {
    set({
      currentGraph: createGraphCopy(),
      currentKPIs: baselineKPIs,
      latestEvent: null,
      latestBackboardResponse: null,
      eventSeed: 1,
      error: null,
      recommendationsAccepted: false,
    });
  },
}));

export default useStore;
