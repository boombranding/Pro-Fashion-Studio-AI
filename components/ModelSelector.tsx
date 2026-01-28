
import React, { useState, useRef } from 'react';
import { BUILT_IN_MODELS } from '../constants';
import { Gender } from '../types';
import { normalizeFile } from '../services/geminiService';

interface ModelSelectorProps {
  mode: 'builtin' | 'upload';
  setMode: (m: 'builtin' | 'upload') => void;
  selectedId: string | null;
  setSelectedId: (id: string) => void;
  file: File | null;
  setFile: (f: File | null) => void;
  gender: string;
  setGender: (g: string) => void;
  race: string;
  setRace: (r: string) => void;
}

const ETHNICITY_OPTIONS = [
  { label: 'East Asian', region: 'CN, JP, KR', traits: 'Light skin tone, Straight hair' },
  { label: 'South Asian', region: 'IN, PK', traits: 'Dark skin tone, Deep features' },
  { label: 'Southeast Asian', region: 'MY, ID, PH', traits: 'Olive skin tone, Dark straight/wavy hair' },
  { label: 'Caucasian', region: 'EU, NA, AU', traits: 'Fair to light brown skin tone, Diverse hair colors' },
  { label: 'African', region: 'SSA', traits: 'Dark skin tone, Curly hair' },
  { label: 'Middle Eastern', region: 'WA, NAF', traits: 'Olive to light brown skin tone' },
  { label: 'Latino', region: 'CSA', traits: 'Diverse mixed-race background' },
  { label: 'Indigenous', region: 'NA, AU', traits: 'Regionally unique ethnic groups' },
];

export const ModelSelector: React.FC<ModelSelectorProps> = ({
  mode, setMode, selectedId, setSelectedId, file, setFile, gender, setGender, race, setRace
}) => {
  const [showModal, setShowModal] = useState(false);
  const [modalTab, setModalTab] = useState<'Female' | 'Male'>('Female');
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const selectedModel = selectedId ? BUILT_IN_MODELS.find(m => m.id === selectedId) : null;
  const displayedModels = BUILT_IN_MODELS.filter(m => ['f1', 'f2', 'm1', 'm2'].includes(m.id));

  const handleModelSelect = (id: string) => {
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
              alert("Failed to process photo.");
          } finally {
              setIsProcessing(false);
          }
      }
  };

  const modalModels = BUILT_IN_MODELS.filter(m => m.gender === modalTab);
  const selectedEthnicity = ETHNICITY_OPTIONS.find(opt => opt.label === race);

  return (
    <div ref={sectionRef} className="space-y-6">
      <div className="flex p-1 bg-gray-100 rounded-xl">
        <button
          onClick={() => setMode('builtin')}
          className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${mode === 'builtin' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
        >
          Built-in Models
        </button>
        <button
          onClick={() => setMode('upload')}
          className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${mode === 'upload' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
        >
          Upload Photo
        </button>
      </div>

      {mode === 'builtin' ? (
        <div className="flex flex-col items-center">
          {selectedModel ? (
            <div 
                onClick={() => { setModalTab(selectedModel.gender as any || 'Female'); setShowModal(true); }}
                className="cursor-pointer relative w-full max-w-[240px] aspect-square rounded-2xl overflow-hidden border-2 border-blue-600 ring-4 ring-blue-50 shadow-xl transition-all hover:scale-[1.02]"
            >
                <img src={selectedModel.url} alt={selectedModel.label} className="w-full h-full object-cover" />
                <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-md text-white text-[10px] px-2 py-0.5 rounded uppercase font-bold tracking-wider">
                   {selectedModel.id.toUpperCase()} - SELECTED
                </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full">
                {displayedModels.map((model) => (
                <div 
                    key={model.id}
                    onClick={() => setSelectedId(model.id)}
                    className="cursor-pointer relative rounded-xl overflow-hidden border-2 aspect-square hover:border-blue-300 transition-all border-transparent bg-gray-50"
                >
                    <img src={model.url} alt={model.label} className="w-full h-full object-cover" />
                    <div className="absolute top-2 left-2 bg-black/50 backdrop-blur-sm text-white text-[10px] px-2 py-0.5 rounded uppercase font-bold tracking-wider">
                       {model.id.toUpperCase()}
                    </div>
                </div>
                ))}
            </div>
          )}
          <button onClick={() => { setModalTab('Female'); setShowModal(true); }} className="text-blue-600 text-sm font-bold hover:underline mt-4">View More Models...</button>
        </div>
      ) : (
        <div className="border-2 border-dashed border-gray-300 rounded-2xl p-6 md:p-10 text-center hover:border-blue-500 transition-all bg-gray-50/50">
            <input type="file" accept="image/*,.heic,.heif" onChange={handleFileChange} className="hidden" id="model-upload" disabled={isProcessing} />
            <label htmlFor="model-upload" className={`cursor-pointer flex flex-col items-center w-full ${isProcessing ? 'opacity-50' : ''}`}>
               {file ? (
                 <div className="relative w-full max-w-[200px]">
                    <div className="aspect-square w-full rounded-2xl overflow-hidden border border-gray-200 shadow-md">
                        <img src={URL.createObjectURL(file)} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                    <p className="mt-2 text-xs text-gray-400">Click to change photo</p>
                 </div>
               ) : (
                 <>
                    <div className={`mb-3 flex items-center justify-center w-12 h-12 rounded-full ${isProcessing ? 'bg-blue-50' : 'bg-gray-100'}`}>
                        {isProcessing ? <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div> : <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>}
                    </div>
                    <span className="text-gray-900 font-bold">{isProcessing ? 'Processing...' : 'Click to upload model face'}</span>
                    <p className="text-xs text-gray-400 mt-1">Supports HEIC, JPG, PNG</p>
                 </>
               )}
            </label>
        </div>
      )}

      {/* Attributes Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-gray-100">
        <div>
          <label className="block text-sm font-bold text-gray-900 mb-3">
            Gender Selection <span className="text-gray-400 font-normal ml-1">Auto-detect</span>
          </label>
          <div className="flex flex-wrap gap-4">
             {Object.values(Gender).map((g) => (
               <label key={g} className="flex items-center cursor-pointer group">
                 <input type="radio" name="gender" value={g} checked={gender === g} onChange={(e) => setGender(e.target.value)} className="w-5 h-5 border-2 border-gray-300 rounded-full checked:border-black checked:bg-black transition-all appearance-none cursor-pointer" />
                 <span className={`ml-2 text-sm font-medium ${gender === g ? 'text-black font-bold' : 'text-gray-500'}`}>{g}</span>
               </label>
             ))}
          </div>
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-900 mb-3">Ethnicity / Physical Traits</label>
          <div className="relative">
            <select 
              value={race} 
              onChange={(e) => setRace(e.target.value)} 
              className={`w-full pl-4 pr-12 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-100 outline-none bg-white text-sm font-medium transition-colors appearance-none ${race === "" ? 'text-gray-400' : 'text-gray-900'}`}
            >
                  <option value="" className="text-gray-400">Auto-detect</option>
                  {ETHNICITY_OPTIONS.map((opt) => (
                      <option key={opt.label} value={opt.label} className="text-gray-900">{opt.label}: {opt.region}</option>
                  ))}
            </select>
            <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none flex items-center justify-center">
              <svg className="w-4 h-4 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
          {selectedEthnicity && (
            <p className="mt-2 text-[13px] text-gray-400 font-medium pl-1 animate-fade-in">
              {selectedEthnicity.traits}
            </p>
          )}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-[100] bg-white overflow-y-auto animate-fade-in">
          <div className="max-w-4xl mx-auto px-4 py-6">
            <div className="flex items-center justify-between mb-8 sticky top-0 bg-white/95 backdrop-blur-md py-4 z-10 border-b border-gray-100">
              <h2 className="text-xl font-bold">Select Built-in Model</h2>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 rounded-full transition-all"><svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>
            </div>
            <div className="flex justify-center mb-8">
                <div className="flex bg-gray-100 p-1 rounded-xl">
                    <button onClick={() => setModalTab('Female')} className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${modalTab === 'Female' ? 'bg-white text-black shadow-sm' : 'text-gray-500'}`}>Female</button>
                    <button onClick={() => setModalTab('Male')} className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${modalTab === 'Male' ? 'bg-white text-black shadow-sm' : 'text-gray-500'}`}>Male</button>
                </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 pb-12">
               {modalModels.map((model) => (
                  <div key={model.id} onClick={() => handleModelSelect(model.id)} className={`cursor-pointer relative rounded-2xl overflow-hidden border-2 aspect-square hover:shadow-xl transition-all ${selectedId === model.id ? 'border-blue-600 ring-2 ring-blue-100' : 'border-gray-100'}`}>
                    <img src={model.url} alt={model.label} className="w-full h-full object-cover" />
                    <div className="absolute top-2 left-2 bg-black/50 backdrop-blur-sm text-white text-[10px] px-2 py-0.5 rounded uppercase font-bold tracking-wider">
                       {model.id.toUpperCase()}
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
