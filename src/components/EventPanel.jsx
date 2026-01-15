import useStore from '../store/useStore';
import { baselineNodes } from '../data/baseline';

export default function EventPanel() {
  const latestEvent = useStore(state => state.latestEvent);
  const latestBackboardResponse = useStore(state => state.latestBackboardResponse);
  const acceptRecommendations = useStore(state => state.acceptRecommendations);
  const loading = useStore(state => state.loading);
  const recommendationsAccepted = useStore(state => state.recommendationsAccepted);

  // Helper to get node name from ID
  const getNodeName = (nodeId) => {
    const node = baselineNodes.find(n => n.id === nodeId);
    return node ? node.name : nodeId;
  };

  if (!latestEvent) {
    return (
      <div className="p-6 text-center">
        <p className="text-gray-400 text-sm">
          No events yet
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4 p-4">
      {/* Event Header */}
      <div className="bg-gray-900 border border-gray-700 rounded-lg p-3">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-bold text-white">{latestEvent.headline}</h3>
          <span className={`px-2 py-0.5 rounded text-xs font-semibold ${
            latestEvent.severity === 'HIGH' ? 'bg-red-900 text-red-300' :
            latestEvent.severity === 'MEDIUM' ? 'bg-yellow-900 text-yellow-300' :
            'bg-green-900 text-green-300'
          }`}>
            {latestEvent.severity}
          </span>
        </div>
        <p className="text-xs text-gray-400">
          {latestEvent.event_type.replace(/_/g, ' ')} | {latestEvent.time_horizon.replace(/_/g, ' ')}
        </p>
        <p className="text-xs text-gray-500 mt-1">
          {latestEvent.regions.join(', ')}
        </p>
      </div>

      {/* AI Analysis */}
      {loading && (
        <div className="text-center py-6">
          <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-400"></div>
          <p className="text-xs text-gray-400 mt-2">AI analyzing...</p>
        </div>
      )}

      {latestBackboardResponse && !loading && (
        <>
          {/* Summary */}
          <div className="bg-gray-900 border border-gray-700 rounded-lg p-3">
            <h4 className="text-xs font-bold text-blue-400 mb-2 uppercase">AI Analysis</h4>
            <p className="text-xs text-gray-300 leading-relaxed">{latestBackboardResponse.summary}</p>
          </div>

          {/* Affected Entities */}
          {latestBackboardResponse.affected_entities && (
            <div className="bg-gray-900 border border-gray-700 rounded-lg p-3">
              <h4 className="text-xs font-bold text-red-400 mb-2 uppercase">Affected</h4>
              <div className="space-y-1 text-xs text-gray-400">
                <div>
                  <span className="text-gray-500">Nodes:</span>{' '}
                  <span className="text-red-300">
                    {latestBackboardResponse.affected_entities.nodes?.map(getNodeName).join(', ') || 'None'}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500">Routes:</span>{' '}
                  <span className="text-red-300">{latestBackboardResponse.affected_entities.edges?.length || 0} disrupted</span>
                </div>
              </div>
            </div>
          )}

          {/* Success Message */}
          {recommendationsAccepted && (
            <div className="bg-blue-900/30 border border-blue-700 rounded-lg p-4 animate-pulse">
              <div className="flex items-center mb-2">
                <h4 className="font-bold text-sm text-blue-300">Applied Successfully!</h4>
              </div>
              <p className="text-xs text-blue-400">
                Check KPIs - supply chain recovering
              </p>
            </div>
          )}

          {/* Recommendations */}
          {!recommendationsAccepted && latestBackboardResponse.recommendations && latestBackboardResponse.recommendations.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center">
                <h4 className="text-xs font-bold text-green-400 uppercase">Recommendations</h4>
              </div>
              {latestBackboardResponse.recommendations.map((rec, idx) => (
                <div key={rec.id || idx} className="bg-gray-900 border border-green-700 rounded-lg p-3">
                  <div className="flex items-start justify-between mb-2">
                    <div className="font-bold text-xs text-green-300">
                      {idx + 1}. {rec.action_type?.replace(/_/g, ' ') || 'Action'}
                    </div>
                  </div>
                  <p className="text-xs text-gray-300 mb-2 leading-relaxed">{rec.rationale}</p>
                  {rec.expected_impact && (
                    <div className="bg-green-900/20 border border-green-800 rounded p-2 space-y-1">
                      <div className="text-xs font-semibold text-green-400 mb-1">Impact:</div>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="text-green-300">
                          Service: <strong>{rec.expected_impact.service_level_delta_pct > 0 ? '+' : ''}
                          {rec.expected_impact.service_level_delta_pct}%</strong>
                        </div>
                        <div className="text-green-300">
                          Cost: <strong>{rec.expected_impact.cost_index_delta_pct > 0 ? '+' : ''}
                          {rec.expected_impact.cost_index_delta_pct}%</strong>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}

              <button
                onClick={acceptRecommendations}
                disabled={loading}
                className={`w-full font-bold py-3 px-4 rounded-lg transition-all duration-200 text-sm ${
                  loading
                    ? 'bg-gray-700 cursor-not-allowed text-gray-400'
                    : 'bg-green-600 hover:bg-green-500 text-white'
                }`}
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Applying...
                  </span>
                ) : (
                  'Accept All'
                )}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
