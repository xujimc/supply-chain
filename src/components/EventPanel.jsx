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
            <div className="border-t-4 border-green-500 pt-4 bg-green-50 -mx-6 px-6 pb-6">
              <div className="flex items-center mb-3">
                <span className="text-2xl mr-2">💡</span>
                <h3 className="font-bold text-lg text-green-900">AI-Powered Recommendations</h3>
              </div>
              <div className="space-y-3">
                {latestBackboardResponse.recommendations.map((rec, idx) => (
                  <div key={rec.id || idx} className="bg-white border-2 border-green-300 rounded-xl p-4 shadow-md">
                    <div className="flex items-start justify-between mb-2">
                      <div className="font-bold text-base text-green-900">
                        {idx + 1}. {rec.action_type?.replace(/_/g, ' ') || 'Recommended Action'}
                      </div>
                      <span className="text-green-600 text-xl">✓</span>
                    </div>
                    <p className="text-sm text-gray-700 mb-3">{rec.rationale}</p>
                    {rec.expected_impact && (
                      <div className="bg-green-100 rounded-lg p-3 space-y-1">
                        <div className="text-xs font-semibold text-green-800 mb-1">Expected Impact:</div>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div className="flex items-center">
                            <span className="mr-1">📈</span>
                            <span className="text-green-700">
                              Service: <strong>{rec.expected_impact.service_level_delta_pct > 0 ? '+' : ''}
                              {rec.expected_impact.service_level_delta_pct}%</strong>
                            </span>
                          </div>
                          <div className="flex items-center">
                            <span className="mr-1">💰</span>
                            <span className="text-green-700">
                              Cost: <strong>{rec.expected_impact.cost_index_delta_pct > 0 ? '+' : ''}
                              {rec.expected_impact.cost_index_delta_pct}%</strong>
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <button
                onClick={acceptRecommendations}
                className="mt-4 w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-bold py-4 px-6 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-200 text-lg"
              >
                ✓ Accept All Recommendations
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
