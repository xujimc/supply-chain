import { useEffect, useState } from 'react';
import useStore from '../store/useStore';

function KPICard({ title, baselineValue, currentValue, unit, inverse = false }) {
  const delta = currentValue - baselineValue;
  const isWorse = inverse ? delta > 0 : delta < 0;
  const isBetter = inverse ? delta < 0 : delta > 0;
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    if (delta !== 0) {
      setAnimate(true);
      const timer = setTimeout(() => setAnimate(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [delta, currentValue]);

  const percentChange = baselineValue !== 0 ? Math.abs((delta / baselineValue) * 100).toFixed(1) : 0;

  return (
    <div className={`bg-gray-900 border-b border-gray-700 p-3 transition-all duration-300 ${
      isWorse ? 'bg-red-900/20 border-red-800' :
      isBetter ? 'bg-green-900/20 border-green-800' :
      ''
    } ${animate ? 'scale-[1.02]' : ''}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide">{title}</h3>
      </div>

      {/* Value */}
      <div className="mb-2">
        <div className={`text-2xl font-bold transition-all duration-500 ${
          isWorse ? 'text-red-400' : isBetter ? 'text-green-400' : 'text-white'
        } ${animate ? 'scale-110' : ''}`}>
          {currentValue}{unit}
        </div>
      </div>

      {/* Baseline & Change */}
      <div className="flex items-center justify-between">
        <div className="text-xs text-gray-500">
          Base: <span className="text-gray-400">{baselineValue}{unit}</span>
        </div>

        {delta !== 0 && (
          <div className={`flex items-center space-x-1 text-xs font-bold px-2 py-0.5 rounded ${
            isWorse ? 'bg-red-900 text-red-300' :
            isBetter ? 'bg-green-900 text-green-300' :
            'bg-gray-700 text-gray-300'
          }`}>
            <span>{isBetter ? '↑' : '↓'}</span>
            <span>{percentChange}%</span>
          </div>
        )}
      </div>

      {/* Status */}
      {delta !== 0 && (
        <div className={`mt-2 text-xs font-semibold ${
          isWorse ? 'text-red-400' : 'text-green-400'
        }`}>
          {isWorse ? 'Degraded' : 'Improved'}
        </div>
      )}
    </div>
  );
}

export default function KPIStrip() {
  const baselineKPIs = useStore(state => state.baselineKPIs);
  const currentKPIs = useStore(state => state.currentKPIs);
  const recommendationsAccepted = useStore(state => state.recommendationsAccepted);
  const [flashAnimation, setFlashAnimation] = useState(false);

  useEffect(() => {
    if (recommendationsAccepted) {
      setFlashAnimation(true);
      const timer = setTimeout(() => setFlashAnimation(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [recommendationsAccepted]);

  return (
    <div className={`flex flex-col transition-all duration-500 ${
      flashAnimation ? 'animate-pulse' : ''
    }`}>
      <KPICard
        title="Service Level"
        baselineValue={baselineKPIs.service_level}
        currentValue={currentKPIs.service_level}
        unit="%"
        inverse={false}
      />
      <KPICard
        title="Stockout Risk"
        baselineValue={baselineKPIs.stockout_risk_customers}
        currentValue={currentKPIs.stockout_risk_customers}
        unit="/16"
        inverse={true}
      />
      <KPICard
        title="Avg Lead Time"
        baselineValue={baselineKPIs.avg_lead_time}
        currentValue={currentKPIs.avg_lead_time}
        unit="d"
        inverse={true}
      />
      <KPICard
        title="Cost Index"
        baselineValue={baselineKPIs.cost_index}
        currentValue={currentKPIs.cost_index}
        unit=""
        inverse={true}
      />
    </div>
  );
}
