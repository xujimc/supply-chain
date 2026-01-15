import useStore from '../store/useStore';

function KPICard({ title, baselineValue, currentValue, unit, inverse = false }) {
  const delta = currentValue - baselineValue;
  const isWorse = inverse ? delta > 0 : delta < 0;
  const isBetter = inverse ? delta < 0 : delta > 0;

  return (
    <div className="bg-white rounded-lg shadow-md p-4 border-2 border-gray-200">
      <h3 className="text-sm font-semibold text-gray-600 mb-2">{title}</h3>
      <div className="flex items-baseline justify-between">
        <div className="text-2xl font-bold text-gray-900">
          {currentValue}{unit}
        </div>
        {delta !== 0 && (
          <div className={`text-sm font-medium ${isWorse ? 'text-red-600' : isBetter ? 'text-green-600' : 'text-gray-500'}`}>
            {isBetter && '↑'}
            {isWorse && '↓'}
            {Math.abs(delta)}{unit}
          </div>
        )}
      </div>
      <div className="text-xs text-gray-500 mt-1">
        Baseline: {baselineValue}{unit}
      </div>
    </div>
  );
}

export default function KPIStrip() {
  const baselineKPIs = useStore(state => state.baselineKPIs);
  const currentKPIs = useStore(state => state.currentKPIs);

  return (
    <div className="grid grid-cols-4 gap-4 w-full">
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
