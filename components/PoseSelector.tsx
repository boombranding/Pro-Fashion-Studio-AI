
import React, { useState } from 'react';
import { POSES } from '../constants';

interface PoseSelectorProps {
  selectedIds: string[];
  setSelectedIds: (ids: string[]) => void;
}

export const PoseSelector: React.FC<PoseSelectorProps> = ({ selectedIds, setSelectedIds }) => {
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'A' | 'B'>('A');

  const defaultPoses = POSES.slice(0, 4);
  const defaultIds = defaultPoses.map(p => p.id);

  // LOGIC: 
  // 1. "Default View": If the user's selection is completely contained within the default 4 poses (or empty),
  //    we show all 4 default poses. This prevents the "disappearing options" issue when clicking one.
  // 2. "Custom View": If the user selects a pose outside the default set (via More),
  //    we show EXACTLY what is selected.
  const isDefaultSubset = selectedIds.length === 0 || selectedIds.every(id => defaultIds.includes(id));

  const displayPoses = isDefaultSubset 
    ? defaultPoses
    : POSES.filter(p => selectedIds.includes(p.id));

  // Grid Logic:
  // - 1 to 4 items (or Default View): Use standard 4-column grid
  // - More than 4 items: Use 3-column grid for better visibility
  const gridClassName = displayPoses.length > 4
    ? "grid-cols-2 md:grid-cols-3"
    : "grid-cols-2 md:grid-cols-4";

  const handleToggle = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(pid => pid !== id));
    } else {
      if (selectedIds.length >= 6) {
        alert("Maximum 6 poses allowed.");
        return;
      }
      setSelectedIds([...selectedIds, id]);
    }
  };

  const filteredPoses = POSES.filter(p => p.category === activeTab);

  return (
    <div className="space-y-4">
      
      {/* 1. Preview Grid */}
      <div className={`grid ${gridClassName} gap-4 transition-all duration-300`}>
        {displayPoses.map((pose) => (
          <div 
            key={pose.id}
            onClick={() => handleToggle(pose.id)}
            className={`cursor-pointer rounded-lg overflow-hidden border-2 relative group aspect-square hover:border-blue-300 transition-all ${selectedIds.includes(pose.id) ? 'border-blue-600 ring-2 ring-blue-50' : 'border-gray-100'}`}
          >
            <img src={pose.url} alt={pose.title} className="w-full h-full object-cover" />
            
            {/* ID Tag */}
            <div className="absolute top-2 left-2 bg-black/50 backdrop-blur-sm text-white text-[10px] px-2 py-0.5 rounded uppercase font-bold tracking-wider">
               {pose.id}
            </div>

            {/* Selection Indicator */}
            {selectedIds.includes(pose.id) && (
              <div className="absolute top-2 right-2 bg-blue-600 text-white rounded-full p-1 shadow-md">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
              </div>
            )}
            
            {/* Bottom Description Removed */}
          </div>
        ))}
      </div>

      <button 
        onClick={() => setShowModal(true)}
        className="text-blue-600 text-sm font-semibold hover:underline mt-4 block w-full text-center"
      >
        {selectedIds.length > 0 ? 'Change Poses (more)' : 'more'}
      </button>

      {/* 2. Full Screen Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[100] bg-white overflow-y-auto">
          <div className="max-w-6xl mx-auto px-4 py-6 pb-28">
            {/* Header */}
            <div className="flex items-center justify-between mb-6 sticky top-0 bg-white/95 backdrop-blur-sm py-4 z-10 border-b border-gray-100">
              <h2 className="text-2xl font-bold">Select Poses</h2>
              <div className="text-sm font-medium text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                  {selectedIds.length} / 6 Selected
              </div>
            </div>

            {/* Tabs */}
            <div className="flex justify-center mb-8">
              <div className="flex bg-gray-100 p-1 rounded-xl">
                <button 
                  onClick={() => setActiveTab('A')}
                  className={`px-6 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === 'A' ? 'bg-white text-black shadow-sm' : 'text-gray-500 hover:text-gray-800'}`}
                >
                  Model pose
                </button>
                <button 
                  onClick={() => setActiveTab('B')}
                  className={`px-6 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === 'B' ? 'bg-white text-black shadow-sm' : 'text-gray-500 hover:text-gray-800'}`}
                >
                  Detail Shots
                </button>
              </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
               {filteredPoses.map((pose) => {
                 const isSelected = selectedIds.includes(pose.id);
                 return (
                   <div 
                     key={pose.id}
                     onClick={() => handleToggle(pose.id)}
                     className={`cursor-pointer rounded-lg overflow-hidden border-2 relative group aspect-square hover:shadow-xl transition-all ${isSelected ? 'border-blue-600 ring-2 ring-blue-300' : 'border-gray-100 hover:border-gray-300'}`}
                   >
                     <img src={pose.url} alt={pose.title} className="w-full h-full object-cover" />
                     
                     {/* ID Tag (Restored) */}
                     <div className="absolute top-2 left-2 bg-black/50 backdrop-blur-sm text-white text-[10px] px-2 py-0.5 rounded uppercase font-bold tracking-wider z-10">
                        {pose.id}
                     </div>

                     {isSelected && (
                       <div className="absolute top-2 right-2 bg-blue-600 text-white rounded-full p-1.5 shadow-sm z-10">
                         <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                       </div>
                     )}
                   </div>
                 );
               })}
            </div>

            {/* Sticky OK Button */}
            <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 p-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] z-50">
                <div className="max-w-6xl mx-auto flex justify-center">
                    <button 
                        onClick={() => setShowModal(false)}
                        className="bg-black text-white px-12 py-3 rounded-full font-bold text-lg hover:bg-gray-800 transition-transform hover:scale-105 active:scale-95 shadow-lg flex items-center"
                    >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                        OK ({selectedIds.length} Selected)
                    </button>
                </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};
