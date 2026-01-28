
import React, { useState, useRef } from 'react';
import { BUILT_IN_BACKGROUNDS } from '../constants';
import { normalizeFile } from '../services/geminiService';

interface BackgroundSelectorProps {
  mode: 'builtin' | 'upload';
  setMode: (m: 'builtin' | 'upload') => void;
  selectedId: string | null;
  setSelectedId: (id: string) => void;
  file: File | null;
  setFile: (f: File | null) => void;
}

export const BackgroundSelector: React.FC<BackgroundSelectorProps> = ({
  mode, setMode, selectedId, setSelectedId, file, setFile
}) => {
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'Studio' | 'Outdoor' | 'Wilderness'>('Studio');
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const selectedBg = selectedId ? BUILT_IN_BACKGROUNDS.find(b => b.id === selectedId) : null;
  
  // Show specific backgrounds: S1, S2, O1, W1
  const displayedBackgrounds = BUILT_IN_BACKGROUNDS.filter(b => ['s1', 's2', 'o1', 'w1'].includes(b.id));

  const handleSelect = (id: string) => {
    setSelectedId(id);
    setShowModal(false);
    setTimeout(() => {
        sectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);
  };
  
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
          setIsProcessing(true);
          try {
            const processedFile = await normalizeFile(e.target.files[0]);
            setFile(processedFile);
          } catch (err) {
              console.error(err);
              alert("Failed to process image.");
          } finally {
              setIsProcessing(false);
          }
      }
  };

  const modalBackgrounds = BUILT_IN_BACKGROUNDS.filter(b => b.category === activeTab);

  return (
    <div ref={sectionRef} className="space-y-6">
       <div className="flex p-1 bg-gray-100 rounded-xl">
        <button
          onClick={() => setMode('builtin')}
          className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all ${mode === 'builtin' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
        >
          Built-in Scenes
        </button>
        <button
          onClick={() => setMode('upload')}
          className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all ${mode === 'upload' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
        >
          Upload Background
        </button>
      </div>

      {mode === 'builtin' ? (
        <>
            {selectedBg ? (
                 <div className="flex flex-col items-center animate-fade-in">
                    <div 
                        onClick={() => {
                            setActiveTab(selectedBg.category as any || 'Studio');
                            setShowModal(true);
                        }}
                        className="cursor-pointer relative w-full max-w-[240px] aspect-square rounded-2xl overflow-hidden border-2 border-blue-600 ring-4 ring-blue-50 shadow-xl transition-transform hover:scale-[1.01]"
                    >
                        <img src={selectedBg.url} alt={selectedBg.label} className="w-full h-full object-cover" />
                        <div className="absolute top-2 left-2 bg-black/50 backdrop-blur-sm text-white text-[10px] px-2 py-0.5 rounded uppercase font-bold tracking-wider">
                           {selectedBg.id}
                        </div>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {displayedBackgrounds.map((bg) => (
                    <div 
                        key={bg.id}
                        onClick={() => setSelectedId(bg.id)}
                        className={`cursor-pointer rounded-lg overflow-hidden border-2 relative group aspect-square hover:border-blue-300 transition-all border-transparent`}
                    >
                        <img src={bg.url} alt={bg.label} className="w-full h-full object-cover" />
                        <div className="absolute top-2 left-2 bg-black/50 backdrop-blur-sm text-white text-[10px] px-2 py-0.5 rounded uppercase font-bold tracking-wider">
                           {bg.id}
                        </div>
                    </div>
                    ))}
                </div>
            )}

            <button 
                onClick={() => {
                    if (selectedBg) setActiveTab(selectedBg.category as any);
                    else setActiveTab('Studio');
                    setShowModal(true);
                }}
                className="text-blue-600 text-sm font-semibold hover:underline mt-4 block w-full text-center"
            >
                {selectedBg ? 'Change Scene (more)' : 'more'}
            </button>
        </>
      ) : (
        <div className="border-2 border-dashed border-gray-300 rounded-2xl p-6 text-center hover:border-blue-500 transition-colors bg-gray-50/50">
            <input
                type="file"
                accept="image/*,.heic,.heif"
                onChange={handleFileChange}
                className="hidden"
                id="bg-upload"
                disabled={isProcessing}
            />
            <label htmlFor="bg-upload" className={`cursor-pointer block w-full ${isProcessing ? 'opacity-50' : ''}`}>
                {file ? (
                    <div className="relative w-full max-w-[200px] mx-auto">
                        <div className="aspect-square w-full rounded-2xl overflow-hidden bg-gray-100 mb-2 border border-gray-200 shadow-md">
                            <img 
                                src={URL.createObjectURL(file)} 
                                alt="Bg Preview" 
                                className="w-full h-full object-cover" 
                                onError={(e) => {
                                    e.currentTarget.style.display = 'none';
                                    e.currentTarget.parentElement?.querySelector('.fallback-icon')?.classList.remove('hidden');
                                }}
                            />
                            <div className="fallback-icon hidden w-full h-full flex flex-col items-center justify-center text-gray-400">
                                <span className="font-bold text-lg uppercase mb-1">{file.name.split('.').pop()}</span>
                                <span className="text-xs">Preview Unavailable</span>
                            </div>
                        </div>
                        <div className="text-xs text-gray-400">Click to change</div>
                    </div>
                ) : (
                    <div className="py-8">
                        {isProcessing ? (
                            <div className="flex flex-col items-center">
                                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mb-3"></div>
                                <span className="text-gray-500">Processing...</span>
                            </div>
                        ) : (
                            <>
                                <svg className="w-12 h-12 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                <span className="text-gray-500 font-medium">Click to upload background image</span>
                                <p className="text-xs text-gray-400 mt-1">Lighting will auto-adjust to match your image</p>
                            </>
                        )}
                    </div>
                )}
            </label>
        </div>
      )}

      {/* Full Screen Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[100] bg-white overflow-y-auto">
          <div className="max-w-6xl mx-auto px-4 py-6">
            <div className="flex items-center justify-between mb-4 sticky top-0 bg-white/95 backdrop-blur-sm py-4 z-10 border-b border-gray-100">
              <h2 className="text-2xl font-bold">Select a Scene</h2>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                 <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <div className="flex justify-center mb-8">
                <div className="flex bg-gray-100 p-1 rounded-xl">
                    {(['Studio', 'Outdoor', 'Wilderness'] as const).map((tab) => (
                        <button key={tab} onClick={() => setActiveTab(tab)} className={`px-6 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === tab ? 'bg-white text-black shadow-sm' : 'text-gray-500 hover:text-gray-800'}`}>{tab}</button>
                    ))}
                </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 pb-12">
               {modalBackgrounds.map((bg) => (
                  <div key={bg.id} onClick={() => handleSelect(bg.id)} className={`cursor-pointer rounded-lg overflow-hidden border-2 relative group aspect-square hover:shadow-lg transition-all ${selectedId === bg.id ? 'border-blue-600 ring-2 ring-blue-300' : 'border-gray-100 hover:border-gray-300'}`}>
                    <img src={bg.url} alt={bg.label} className="w-full h-full object-cover" />
                    <div className="absolute top-2 left-2 bg-black/50 backdrop-blur-sm text-white text-[10px] px-2 py-0.5 rounded uppercase font-bold tracking-wider">
                       {bg.id}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
