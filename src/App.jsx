import { useEffect, useState } from 'react';
import useStore from './store/useStore';
import SupplyChainGraph from './components/SupplyChainGraph';
import KPIStrip from './components/KPIStrip';
import EventButton from './components/EventButton';
import EventPanel from './components/EventPanel';

function App() {
  const initializeBackboard = useStore(state => state.initializeBackboard);
  const error = useStore(state => state.error);
  const latestEvent = useStore(state => state.latestEvent);
  const latestBackboardResponse = useStore(state => state.latestBackboardResponse);
  const [showGuide, setShowGuide] = useState(true);

  useEffect(() => {
    initializeBackboard();
  }, [initializeBackboard]);

  // Hide guide after first event
  useEffect(() => {
    if (latestEvent) {
      setShowGuide(false);
    }
  }, [latestEvent]);

  // Determine current step
  const currentStep = !latestEvent ? 1 : !latestBackboardResponse ? 2 : latestBackboardResponse.recommendations?.length > 0 ? 3 : 2;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-lg border-b-4 border-blue-500">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Supply Chain Intelligence Demo
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                Powered by Backboard.io AI Memory & Reasoning
              </p>
            </div>

            {/* Step Indicator */}
            <div className="flex items-center space-x-4 text-sm">
              <div className={`flex items-center ${currentStep >= 1 ? 'text-blue-600 font-semibold' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-2 ${currentStep >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-300'}`}>1</div>
                Generate Event
              </div>
              <div className="text-gray-300">→</div>
              <div className={`flex items-center ${currentStep >= 2 ? 'text-blue-600 font-semibold' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-2 ${currentStep >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-300'}`}>2</div>
                AI Analysis
              </div>
              <div className="text-gray-300">→</div>
              <div className={`flex items-center ${currentStep >= 3 ? 'text-blue-600 font-semibold' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-2 ${currentStep >= 3 ? 'bg-blue-600 text-white' : 'bg-gray-300'}`}>3</div>
                Take Action
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border-2 border-red-500 rounded-lg p-4 animate-pulse">
            <p className="text-red-800 font-semibold">{error}</p>
          </div>
        )}

        {/* Guide Overlay */}
        {showGuide && (
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg p-6 shadow-xl border-2 border-blue-400">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h2 className="text-2xl font-bold mb-3">👋 Welcome! Here's how it works:</h2>
                <ol className="space-y-2 text-lg">
                  <li className="flex items-start">
                    <span className="font-bold mr-2">1.</span>
                    <span>Click <strong>"Generate World Event"</strong> below to create a supply chain disruption</span>
                  </li>
                  <li className="flex items-start">
                    <span className="font-bold mr-2">2.</span>
                    <span>Watch the <strong>graph turn red</strong> as routes get disrupted and <strong>KPIs worsen</strong></span>
                  </li>
                  <li className="flex items-start">
                    <span className="font-bold mr-2">3.</span>
                    <span>See <strong>AI recommendations</strong> appear on the right</span>
                  </li>
                  <li className="flex items-start">
                    <span className="font-bold mr-2">4.</span>
                    <span>Click <strong>"Accept"</strong> to apply fixes and watch metrics improve!</span>
                  </li>
                </ol>
              </div>
              <button
                onClick={() => setShowGuide(false)}
                className="ml-4 text-white hover:text-gray-200 text-2xl"
              >
                ×
              </button>
            </div>
          </div>
        )}

        {/* Action Button - More Prominent */}
        {!latestEvent && (
          <div className="flex justify-center">
            <div className="text-center">
              <div className="mb-4 text-gray-600 text-lg font-medium">
                👇 Start by generating a world event
              </div>
              <EventButton />
            </div>
          </div>
        )}

        {/* KPI Strip with Labels */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xl font-bold text-gray-800">📊 Key Performance Indicators</h2>
            {latestEvent && (
              <span className="text-sm text-gray-600 bg-white px-3 py-1 rounded-full border">
                {latestBackboardResponse ? '✓ Impact Applied' : '⏳ Analyzing...'}
              </span>
            )}
          </div>
          <KPIStrip />
        </div>

        {/* Main Grid */}
        {latestEvent && (
          <div className="grid grid-cols-3 gap-6">
            {/* Graph (2/3 width) */}
            <div className="col-span-2">
              <h2 className="text-xl font-bold text-gray-800 mb-3">🗺️ Supply Chain Network</h2>
              <div className="h-[600px]">
                <SupplyChainGraph />
              </div>
            </div>

            {/* Event Panel (1/3 width) */}
            <div className="col-span-1">
              <h2 className="text-xl font-bold text-gray-800 mb-3">🎯 Event & Recommendations</h2>
              <EventPanel />
            </div>
          </div>
        )}

        {/* Action Button - After Event */}
        {latestEvent && (
          <div className="flex justify-center">
            <EventButton />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="text-center text-gray-500 text-sm py-4 mt-8">
        Demo-ready intelligence showcase | Not for production use
      </footer>
    </div>
  );
}

export default App;
