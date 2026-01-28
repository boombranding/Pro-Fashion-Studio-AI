
import React from 'react';

interface GenerationLoaderProps {
  onBack: () => void;
  results: { poseId: string; loading: boolean; error?: string }[];
}

export const GenerationLoader: React.FC<GenerationLoaderProps> = ({ onBack, results }) => {
  const total = results.length;
  const completed = results.filter(r => !r.loading).length;
  const progress = Math.round((completed / total) * 100);

  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col">
      {/* Header */}
      <div className="px-4 py-4 border-b border-gray-100 flex items-center">
        <button 
          onClick={onBack}
          className="p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors mr-2"
        >
          <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
        </button>
        <h2 className="text-xl font-bold">Generating Photos</h2>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center max-w-md mx-auto">
        
        <div className="relative w-32 h-32 mb-8">
            <svg className="w-full h-full" viewBox="0 0 100 100">
                <circle className="text-gray-200 stroke-current" strokeWidth="8" cx="50" cy="50" r="40" fill="transparent"></circle>
                <circle className="text-blue-600 progress-ring__circle stroke-current transition-all duration-500 ease-out" strokeWidth="8" strokeLinecap="round" cx="50" cy="50" r="40" fill="transparent" strokeDasharray="251.2" strokeDashoffset={251.2 - (251.2 * progress) / 100} style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }}></circle>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-bold text-gray-800">{progress}%</span>
            </div>
        </div>

        <h3 className="text-2xl font-bold text-gray-900 mb-2">Rendering in progress...</h3>
        <p className="text-gray-500 mb-8">
            The AI is creating your high-resolution fashion shots. You can go back to the studio to prepare the next batch.
        </p>

        <div className="w-full bg-gray-50 rounded-xl p-4 text-left border border-gray-100">
             <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Status</div>
             <div className="space-y-3">
                 {results.map((res, idx) => (
                     <div key={res.poseId} className="flex items-center justify-between text-sm">
                         <span className="text-gray-700">Pose {idx + 1} ({res.poseId})</span>
                         {res.loading ? (
                             <span className="flex items-center text-blue-600">
                                 <svg className="animate-spin w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                 Rendering
                             </span>
                         ) : res.error ? (
                             <span className="text-red-500">Failed</span>
                         ) : (
                             <span className="text-green-600 font-medium">Completed</span>
                         )}
                     </div>
                 ))}
             </div>
        </div>
        
        <button 
             onClick={onBack}
             className="mt-8 text-blue-600 font-semibold hover:underline"
        >
            Go back to Studio
        </button>

      </div>
    </div>
  );
};
