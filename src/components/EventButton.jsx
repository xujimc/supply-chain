import useStore from '../store/useStore';

export default function EventButton() {
  const generateEvent = useStore(state => state.generateEvent);
  const loading = useStore(state => state.loading);

  return (
    <button
      onClick={generateEvent}
      disabled={loading}
      className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-3 px-6 rounded-lg shadow-lg transition-colors duration-200"
    >
      {loading ? 'Generating...' : 'Generate World Event'}
    </button>
  );
}
