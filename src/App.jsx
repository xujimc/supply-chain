import { useEffect } from 'react';
import useStore from './store/useStore';
import SupplyChainGraph from './components/SupplyChainGraph';
import KPIStrip from './components/KPIStrip';
import EventButton from './components/EventButton';
import EventPanel from './components/EventPanel';

function App() {
  const initializeBackboard = useStore(state => state.initializeBackboard);
  const error = useStore(state => state.error);

  useEffect(() => {
    // Initialize Backboard session on app load
    initializeBackboard();
  }, [initializeBackboard]);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900">
            Supply Chain Intelligence Demo
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Powered by Backboard.io AI Memory & Reasoning
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border-2 border-red-500 rounded-lg p-4">
            <p className="text-red-800 font-semibold">{error}</p>
          </div>
        )}

        {/* KPI Strip */}
        <KPIStrip />

        {/* Main Grid */}
        <div className="grid grid-cols-3 gap-6">
          {/* Graph (2/3 width) */}
          <div className="col-span-2 h-[600px]">
            <SupplyChainGraph />
          </div>

          {/* Event Panel (1/3 width) */}
          <div className="col-span-1">
            <EventPanel />
          </div>
        </div>

        {/* Action Button */}
        <div className="flex justify-center">
          <EventButton />
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center text-gray-500 text-sm py-4">
        Demo-ready intelligence showcase | Not for production use
      </footer>
    </div>
  );
}

export default App;
