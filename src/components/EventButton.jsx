import useStore from '../store/useStore';

export default function EventButton() {
  const generateEvent = useStore(state => state.generateEvent);
  const loading = useStore(state => state.loading);

  return (
    <button
      onClick={generateEvent}
      disabled={loading}
      className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 disabled:bg-gray-600 text-white font-bold py-3 px-8 rounded-lg text-base shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 animate-pulse"
    >
      {loading ? 'Generating...' : 'Generate Event'}
    </button>
  );
}
