# Supply Chain Intelligence Demo

Demo application showcasing Backboard.io AI memory and reasoning capabilities through a supply chain disruption scenario.

## Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure Backboard API:**
   - Copy `.env.example` to `.env`
   - Add your Backboard API key:
     ```
     VITE_BACKBOARD_API_KEY=your_actual_api_key_here
     ```

3. **Run BOTH servers (in separate terminals):**

   **Terminal 1 - Backend Server:**
   ```bash
   npm run server
   ```
   This starts the Express backend on http://localhost:3001

   **Terminal 2 - Frontend:**
   ```bash
   npm run dev
   ```
   This starts the Vite frontend on http://localhost:5173

4. **Open the app:**
   - Open http://localhost:5173 in your browser
   - Both servers must be running for the app to work

## How the Demo Works

1. Click "Generate World Event" button
2. A structured world event is generated (seeded random)
3. Event is sent to Backboard.io for AI analysis
4. Backboard returns structured JSON with:
   - Affected supply chain entities
   - Impact mutations (disruptions)
   - KPI implications
   - Recommended mitigation actions
5. Supply chain graph visually shows disruptions (red dashed lines, affected nodes)
6. KPIs worsen (service level down, lead time up, etc.)
7. AI recommendations appear
8. Click "Accept All Recommendations" to apply mitigations
9. Graph and KPIs improve

## Tech Stack

**Frontend:**
- **React 18** - UI framework
- **Vite** - Build tool and dev server
- **React Flow** - Interactive supply chain graph
- **Zustand** - State management
- **TailwindCSS** - Styling
- **Axios** - HTTP client

**Backend:**
- **Express** - REST API server
- **Backboard SDK** - Official Backboard.io SDK (server-side only)
- **CORS** - Cross-origin resource sharing

**Why Backend + Frontend?**
The Backboard SDK uses Node.js APIs and cannot run in the browser. The Express backend acts as a secure proxy, keeping your API key server-side.

## Architecture

```
src/
├── data/baseline.js          # Hardcoded supply chain structure
├── services/
│   ├── backboard.js          # Backboard REST API client
│   ├── eventGenerator.js     # World event generator
│   └── simulation.js         # KPI calculation engine
├── store/useStore.js         # Zustand state store
├── components/
│   ├── SupplyChainGraph.jsx  # React Flow graph
│   ├── KPIStrip.jsx          # KPI cards
│   ├── EventButton.jsx       # Generate button
│   └── EventPanel.jsx        # Event display + recommendations
└── App.jsx                   # Main layout
```

## Key Features

- **Persistent AI Memory**: Backboard maintains context across events
- **Structured Reasoning**: AI returns validated JSON, not free text
- **Visual Disruptions**: Graph changes are immediately visible
- **KPI Impact**: Non-AI simulation shows measurable effects
- **Human-in-the-Loop**: User approves AI recommendations

## Troubleshooting

**"Failed to initialize AI system"**
- Check that your `.env` file exists and contains a valid `VITE_BACKBOARD_API_KEY`
- Restart the dev server after adding the API key

**"AI returned invalid JSON"**
- The AI occasionally returns malformed JSON. The system retries once with a stricter prompt.
- If it persists, click "Generate World Event" again.

**Graph not updating**
- Check browser console for errors
- Verify that `impact_mutations` in the AI response contains valid entity IDs

## Demo Purpose

This is a **demo-ready** application, not a production system. It showcases:
- How Backboard.io provides persistent memory and structured reasoning
- How AI analysis can integrate with deterministic simulation
- How visual feedback makes AI decisions transparent

## Notes

- Seed resets to 1 on page refresh (no localStorage persistence)
- All recommendations are accepted together (no individual selection)
- KPI calculations use simple forward projection (not optimization)
- No authentication, no data persistence beyond session
