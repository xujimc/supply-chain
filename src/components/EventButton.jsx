import useStore from '../store/useStore';

export default function EventButton() {
  const generateEvent = useStore(state => state.generateEvent);
  const loading = useStore(state => state.loading);

  return (
    <button
      onClick={generateEvent}
      disabled={loading}
      className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white font-semibold py-2 px-4 rounded text-sm transition-colors duration-200"
    >
      {loading ? '⏳ Generating...' : '🌍 Generate Event'}
    </button>
  );
}
