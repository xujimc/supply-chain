import { useEffect, useState } from 'react';
import useStore from '../store/useStore';

function KPICard({ title, baselineValue, currentValue, unit, inverse = false, icon }) {
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
    <div className={`bg-white rounded-xl shadow-lg p-6 border-4 transition-all duration-300 ${
      isWorse ? 'border-red-500 bg-red-50' :
      isBetter ? 'border-green-500 bg-green-50' :
      'border-gray-200'
    } ${animate ? 'scale-105 shadow-2xl' : ''}`}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wide">{title}</h3>
        <span className="text-2xl">{icon}</span>
      </div>

      <div className="mb-3">
        <div className={`text-5xl font-black transition-all duration-500 ${
          isWorse ? 'text-red-600' : isBetter ? 'text-green-600' : 'text-gray-900'
        } ${animate ? 'scale-110' : ''}`}>
          {currentValue}{unit}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-xs text-gray-600">
          Baseline: <span className="font-semibold">{baselineValue}{unit}</span>
        </div>

        {delta !== 0 && (
          <div className={`flex items-center space-x-1 text-lg font-bold px-3 py-1 rounded-full ${
            isWorse ? 'bg-red-600 text-white' :
            isBetter ? 'bg-green-600 text-white' :
            'bg-gray-200 text-gray-700'
          }`}>
            <span>{isBetter ? '↑' : '↓'}</span>
            <span>{percentChange}%</span>
          </div>
        )}
      </div>

      {delta !== 0 && (
        <div className={`mt-3 pt-3 border-t-2 text-sm font-semibold ${
          isWorse ? 'border-red-300 text-red-700' :
          isBetter ? 'border-green-300 text-green-700' :
          'border-gray-300'
        }`}>
          {isWorse ? '⚠️ Performance Degraded' : '✓ Performance Improved'}
        </div>
      )}
    </div>
  );
}

export default function KPIStrip() {
  const baselineKPIs = useStore(state => state.baselineKPIs);
  const currentKPIs = useStore(state => state.currentKPIs);

  return (
    <div className="grid grid-cols-4 gap-6 w-full">
      <KPICard
        title="Service Level"
        baselineValue={baselineKPIs.service_level}
        currentValue={currentKPIs.service_level}
        unit="%"
        inverse={false}
        icon="📈"
      />
      <KPICard
        title="Stockout Risk"
        baselineValue={baselineKPIs.stockout_risk_customers}
        currentValue={currentKPIs.stockout_risk_customers}
        unit="/16"
        inverse={true}
        icon="⚠️"
      />
      <KPICard
        title="Avg Lead Time"
        baselineValue={baselineKPIs.avg_lead_time}
        currentValue={currentKPIs.avg_lead_time}
        unit="d"
        inverse={true}
        icon="⏱️"
      />
      <KPICard
        title="Cost Index"
        baselineValue={baselineKPIs.cost_index}
        currentValue={currentKPIs.cost_index}
        unit=""
        inverse={true}
        icon="💰"
      />
    </div>
  );
}
