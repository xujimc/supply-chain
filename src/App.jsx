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

  useEffect(() => {
    initializeBackboard();
  }, [initializeBackboard]);

  // Determine current step
  const currentStep = !latestEvent ? 1 : !latestBackboardResponse ? 2 : latestBackboardResponse.recommendations?.length > 0 ? 3 : 2;

  return (
    <div className="h-screen flex flex-col bg-gray-900">
      {/* Compact Header */}
      <header className="bg-gray-800 border-b border-gray-700 px-4 py-2 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center space-x-4">
          <h1 className="text-lg font-bold text-white">Supply Chain Intelligence</h1>
          <span className="text-xs text-gray-400">Powered by Backboard.io</span>
        </div>

        <div className="flex items-center space-x-4">
          {/* Compact Step Indicator */}
          <div className="flex items-center space-x-2 text-xs">
            <div className={`flex items-center ${currentStep >= 1 ? 'text-blue-400' : 'text-gray-500'}`}>
              <div className={`w-5 h-5 rounded-full flex items-center justify-center mr-1 text-xs ${currentStep >= 1 ? 'bg-blue-500 text-white' : 'bg-gray-600'}`}>1</div>
              Event
            </div>
            <span className="text-gray-600">→</span>
            <div className={`flex items-center ${currentStep >= 2 ? 'text-blue-400' : 'text-gray-500'}`}>
              <div className={`w-5 h-5 rounded-full flex items-center justify-center mr-1 text-xs ${currentStep >= 2 ? 'bg-blue-500 text-white' : 'bg-gray-600'}`}>2</div>
              Analysis
            </div>
            <span className="text-gray-600">→</span>
            <div className={`flex items-center ${currentStep >= 3 ? 'text-blue-400' : 'text-gray-500'}`}>
              <div className={`w-5 h-5 rounded-full flex items-center justify-center mr-1 text-xs ${currentStep >= 3 ? 'bg-blue-500 text-white' : 'bg-gray-600'}`}>3</div>
              Action
            </div>
          </div>

          {/* Generate Event Button */}
          <EventButton />
        </div>
      </header>

      {/* Error Display */}
      {error && (
        <div className="bg-red-900 border-b border-red-700 px-4 py-2">
          <p className="text-red-200 text-sm">{error}</p>
        </div>
      )}

      {/* Main Layout - VS Code Style */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - KPIs */}
        <aside className="w-64 bg-gray-800 border-r border-gray-700 flex flex-col overflow-y-auto">
          <div className="p-3 border-b border-gray-700">
            <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wide">Key Metrics</h2>
          </div>
          <KPIStrip />
        </aside>

        {/* Center - Main Map */}
        <main className="flex-1 flex flex-col bg-gray-50 overflow-hidden">
          <div className="px-4 py-2 bg-white border-b border-gray-300">
            <h2 className="text-sm font-semibold text-gray-700">Global Supply Chain Network</h2>
          </div>
          <div className="flex-1 p-4">
            <SupplyChainGraph />
          </div>
        </main>

        {/* Right Sidebar - Event Panel */}
        <aside className="w-96 bg-gray-800 border-l border-gray-700 flex flex-col overflow-y-auto">
          <div className="p-3 border-b border-gray-700">
            <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wide">Event Feed</h2>
          </div>
          <div className="flex-1 overflow-y-auto">
            <EventPanel />
          </div>
        </aside>
      </div>
    </div>
  );
}

export default App;
