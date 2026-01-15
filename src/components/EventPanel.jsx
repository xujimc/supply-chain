import useStore from '../store/useStore';

export default function EventPanel() {
  const latestEvent = useStore(state => state.latestEvent);
  const latestBackboardResponse = useStore(state => state.latestBackboardResponse);
  const acceptRecommendations = useStore(state => state.acceptRecommendations);
  const loading = useStore(state => state.loading);

  if (!latestEvent) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 border-2 border-gray-200">
        <p className="text-gray-500 text-center">
          Click "Generate World Event" to start the demo
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border-2 border-gray-200 space-y-4">
      {/* Event Header */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xl font-bold text-gray-900">{latestEvent.headline}</h2>
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
            latestEvent.severity === 'HIGH' ? 'bg-red-200 text-red-800' :
            latestEvent.severity === 'MEDIUM' ? 'bg-yellow-200 text-yellow-800' :
            'bg-green-200 text-green-800'
          }`}>
            {latestEvent.severity}
          </span>
        </div>
        <p className="text-sm text-gray-600">
          {latestEvent.event_type.replace(/_/g, ' ')} | {latestEvent.time_horizon.replace(/_/g, ' ')}
        </p>
        <p className="text-xs text-gray-500 mt-1">
          Regions: {latestEvent.regions.join(', ')} | Modes: {latestEvent.logistics.modes.join(', ')}
        </p>
      </div>

      {/* AI Analysis */}
      {loading && (
        <div className="text-center py-4">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="text-sm text-gray-600 mt-2">AI analyzing event...</p>
        </div>
      )}

      {latestBackboardResponse && !loading && (
        <>
          {/* Summary */}
          <div className="border-t pt-4">
            <h3 className="font-semibold text-gray-900 mb-2">AI Analysis</h3>
            <p className="text-sm text-gray-700">{latestBackboardResponse.summary}</p>
          </div>

          {/* Affected Entities */}
          {latestBackboardResponse.affected_entities && (
            <div className="border-t pt-4">
              <h3 className="font-semibold text-gray-900 mb-2">Affected Supply Chain</h3>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="font-medium">Nodes:</span>{' '}
                  {latestBackboardResponse.affected_entities.nodes?.join(', ') || 'None'}
                </div>
                <div>
                  <span className="font-medium">Routes:</span>{' '}
                  {latestBackboardResponse.affected_entities.edges?.length || 0} affected
                </div>
              </div>
            </div>
          )}

          {/* Recommendations */}
          {latestBackboardResponse.recommendations && latestBackboardResponse.recommendations.length > 0 && (
            <div className="border-t pt-4">
              <h3 className="font-semibold text-gray-900 mb-3">AI Recommendations</h3>
              <div className="space-y-3">
                {latestBackboardResponse.recommendations.map((rec, idx) => (
                  <div key={rec.id || idx} className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <div className="font-medium text-sm text-blue-900 mb-1">
                      {rec.action_type?.replace(/_/g, ' ') || 'Recommended Action'}
                    </div>
                    <p className="text-xs text-gray-700 mb-2">{rec.rationale}</p>
                    {rec.expected_impact && (
                      <div className="text-xs text-gray-600">
                        Expected: Service Level {rec.expected_impact.service_level_delta_pct > 0 ? '+' : ''}
                        {rec.expected_impact.service_level_delta_pct}% |
                        Cost {rec.expected_impact.cost_index_delta_pct > 0 ? '+' : ''}
                        {rec.expected_impact.cost_index_delta_pct}%
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <button
                onClick={acceptRecommendations}
                className="mt-4 w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
              >
                Accept All Recommendations
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
