
import React, { useState, useEffect } from 'react';
import { Section } from './components/Section';
import { ModelSelector } from './components/ModelSelector';
import { BackgroundSelector } from './components/BackgroundSelector';
import { GarmentSelector } from './components/GarmentSelector';
import { PoseSelector } from './components/PoseSelector';
import { ShotTypeSelector } from './components/ShotTypeSelector';
import { Gallery } from './components/Gallery';
import { GenerationLoader } from './components/GenerationLoader';
import { POSES } from './constants';
import { AppState, ShotType, ValidationResult, GeneratedResult, GalleryItem, Project } from './types';
import { generateFashionImage } from './services/geminiService';
import { saveToGallery, getGalleryItems, deleteGalleryItem, saveProject, deleteProject } from './services/storageService';

const App: React.FC = () => {
    const [hasKey, setHasKey] = useState(!!import.meta.env.VITE_API_KEY);
    const [activeTab, setActiveTab] = useState<'studio' | 'gallery'>('studio');
    const [showNotification, setShowNotification] = useState<string | null>(null);
    const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);

    const [state, setState] = useState<AppState>({
        modelSource: 'builtin',
        builtInModelId: null,
        modelFile: null,
        gender: '',
        race: '',
        bgSource: 'builtin',
        builtInBgId: null,
        bgFile: null,
        garmentFiles: [],
        selectedPoseIds: [],
        shotType: null,
        viewMode: 'studio',
        isGenerating: false,
        results: [],
        error: null,
    });

    useEffect(() => {
        const init = async () => {
            if (!hasKey && window.aistudio) {
                const selected = await window.aistudio.hasSelectedApiKey();
                setHasKey(selected);
            }
            loadGallery();
        };
        init();
    }, []);

    const loadGallery = async () => {
        try {
            const items = await getGalleryItems();
            setGalleryItems(items);
        } catch (e) {
            console.error("Failed to load gallery", e);
        }
    };

    const updateState = (updates: Partial<AppState>) => {
        setState(prev => ({ ...prev, ...updates }));
    };

    const validate = (): ValidationResult => {
        const missing: string[] = [];
        if (state.garmentFiles.length === 0) missing.push("Upload garment photos");
        if (state.modelSource === 'builtin' && !state.builtInModelId) missing.push("Select or upload a model");
        if (state.modelSource === 'upload' && !state.modelFile) missing.push("Select or upload a model");
        if (state.bgSource === 'builtin' && !state.builtInBgId) missing.push("Select a scene background");
        if (state.bgSource === 'upload' && !state.bgFile) missing.push("Select a scene background");
        if (state.selectedPoseIds.length === 0) missing.push("Select shooting poses");
        if (!state.shotType) missing.push("Select shot composition");

        return { isValid: missing.length === 0, missingFields: missing };
    };

    const handleConnect = async () => {
        if (window.aistudio) {
            await window.aistudio.openSelectKey();
            setHasKey(true);
        }
    };

    const handleGenerate = async () => {
        const validation = validate();
        if (!validation.isValid) return;

        const projectId = crypto.randomUUID();
        const project: Project = { id: projectId, timestamp: Date.now(), itemCount: 0 };
        await saveProject(project);

        const initialResults: GeneratedResult[] = state.selectedPoseIds.map(id => ({
            poseId: id,
            imageUrl: '',
            loading: true
        }));

        updateState({ viewMode: 'generating', isGenerating: true, error: null, results: initialResults });
        const configSnapshot = { ...state };
        updateState({ garmentFiles: [] });

        // --- BATCH CONSISTENCY LOGIC ---
        // We generate specific style rules ONCE for this entire project batch.
        // This ensures that even if the AI hallucinates details, it tries to stick to this selected "theme".

        const jewelryOptions = [
            "Minimalist Silver Jewelry (Thin bracelet, small stud earrings)",
            "Elegant Gold Jewelry (Gold watch, hoop earrings)",
            "Rose Gold Accessories",
            "No Jewelry / Clean Look"
        ];
        const shoeOptions = [
            "Neutral Beige/Nude Heels or Flats",
            "Classic Black Footwear",
            "Clean White Minimalist Shoes",
            "Metallic Silver Shoes"
        ];
        const bagOptions = [
            "Matching Leather Clutch",
            "Minimalist Chain Bag",
            "Structured Tote Bag",
            "No Handbag"
        ];

        const pick = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)];

        // Randomly select ONE style for the whole batch
        const consistencyProfile = `
    UNIFORM BATCH STYLE GUIDE:
    - JEWELRY/ACCESSORIES: ${pick(jewelryOptions)}. Ensure all shots in this batch use this specific style.
    - SHOES (If not overridden by Skirt Logic): ${pick(shoeOptions)}.
    - HANDBAG (Optional): ${pick(bagOptions)}.
    - IMPORTANT: If the user did not upload these items, YOU MUST GENERATE THEM CONSISTENTLY across all images.
    `;

        processGenerationQueue(projectId, initialResults, configSnapshot, consistencyProfile);
    };

    const processGenerationQueue = async (projectId: string, initialResults: GeneratedResult[], config: AppState, consistencyPrompt: string) => {
        let currentResults = [...initialResults];
        const promises = config.selectedPoseIds.map(async (poseId) => {
            try {
                const imageUrl = await generateFashionImage(poseId, config, consistencyPrompt);
                const galleryItem: GalleryItem = { id: crypto.randomUUID(), projectId, poseId, imageUrl, timestamp: Date.now() };
                await saveToGallery(galleryItem);
                currentResults = currentResults.map(r => r.poseId === poseId ? { ...r, loading: false, imageUrl } : r);
                updateState({ results: currentResults });
                loadGallery();
                return true;
            } catch (err: any) {
                currentResults = currentResults.map(r => r.poseId === poseId ? { ...r, loading: false, error: err.message || "Failed" } : r);
                updateState({ results: currentResults });
                return false;
            }
        });
        await Promise.all(promises);
        updateState({ isGenerating: false });
        setShowNotification("All photos have been generated!");
        setTimeout(() => setShowNotification(null), 5000);
    };

    if (!hasKey) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
                <div className="text-center p-8 bg-white rounded-2xl shadow-xl max-w-md w-full border border-gray-100">
                    <div className="w-16 h-16 bg-black rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-lg"><span className="text-white text-2xl font-bold">AI</span></div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">ProFashion Studio</h1>
                    <p className="text-gray-600 mb-8 leading-relaxed">Please connect your Google AI Studio API Key to enable 8K high-definition fashion photography generation.</p>
                    <button onClick={handleConnect} className="w-full py-3 bg-blue-600 text-white rounded-xl font-semibold shadow-md transition-all hover:scale-[1.02]">Connect Google AI Studio</button>
                </div>
            </div>
        );
    }

    if (state.viewMode === 'generating') return <GenerationLoader results={state.results} onBack={() => updateState({ viewMode: 'studio' })} />;

    const validation = validate();

    return (
        <div className={`min-h-screen bg-gray-50 font-sans text-gray-800 relative ${activeTab === 'studio' ? 'pb-24' : 'pb-8'}`}>
            <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
                <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center"><span className="text-white font-bold text-xs">PF</span></div>
                        <h1 className="text-xl font-bold hidden sm:block">ProFashion<span className="text-blue-600">AI</span></h1>
                    </div>
                    <div className="flex bg-gray-100 p-1 rounded-lg">
                        <button onClick={() => setActiveTab('studio')} className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${activeTab === 'studio' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>Studio</button>
                        <button onClick={() => setActiveTab('gallery')} className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${activeTab === 'gallery' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>Gallery {state.isGenerating && "●"}</button>
                    </div>
                    {/* Disconnect button hidden */}
                    <div className="w-8"></div>
                </div>
            </header>

            <main className="max-w-6xl mx-auto px-4 py-6 sm:py-8">
                {activeTab === 'studio' && (
                    <div className="animate-fade-in max-w-4xl mx-auto space-y-6">
                        <Section title="Garment Photos" number={1}><GarmentSelector files={state.garmentFiles} setFiles={(f) => updateState({ garmentFiles: f })} /></Section>
                        <Section title="Model" number={2}><ModelSelector mode={state.modelSource} setMode={(m) => updateState({ modelSource: m })} selectedId={state.builtInModelId} setSelectedId={(id) => updateState({ builtInModelId: id })} file={state.modelFile} setFile={(f) => updateState({ modelFile: f })} gender={state.gender} setGender={(g) => updateState({ gender: g })} race={state.race} setRace={(r) => updateState({ race: r })} /></Section>
                        <Section title="Scene Background" number={3}><BackgroundSelector mode={state.bgSource} setMode={(m) => updateState({ bgSource: m })} selectedId={state.builtInBgId} setSelectedId={(id) => updateState({ builtInBgId: id })} file={state.bgFile} setFile={(f) => updateState({ bgFile: f })} /></Section>
                        <Section title="Poses" number={4}><PoseSelector selectedIds={state.selectedPoseIds} setSelectedIds={(ids) => updateState({ selectedPoseIds: ids })} /></Section>
                        <Section title="Shot Composition" number={5} isLast><ShotTypeSelector selectedType={state.shotType} onSelect={(type) => updateState({ shotType: type })} /></Section>
                    </div>
                )}
                {activeTab === 'gallery' && <Gallery items={galleryItems} onDelete={(id) => deleteGalleryItem(id).then(loadGallery)} onDeleteProject={(pid) => deleteProject(pid).then(loadGallery)} onRefresh={loadGallery} />}
            </main>

            {activeTab === 'studio' && (
                <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-2xl z-40 sm:px-6 sm:py-5">
                    <div className="max-w-4xl mx-auto flex flex-row items-center justify-between gap-4">
                        <div className="flex-1 min-w-0">
                            {!validation.isValid ? (
                                <div className="text-red-500 text-xs sm:text-sm font-semibold flex items-center gap-1.5 overflow-hidden">
                                    <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                                    <span className="truncate">Missing: {validation.missingFields[0]}</span>
                                </div>
                            ) : (
                                <div className="text-green-600 text-xs sm:text-sm font-bold flex items-center gap-1.5 overflow-hidden">
                                    <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                    <span className="truncate">Ready ({state.selectedPoseIds.length} poses)</span>
                                </div>
                            )}
                        </div>

                        <button
                            onClick={handleGenerate}
                            disabled={!validation.isValid || state.isGenerating}
                            className={`whitespace-nowrap px-6 sm:px-10 py-3 sm:py-3.5 rounded-xl sm:rounded-2xl font-black text-sm sm:text-base transition-all transform hover:scale-105 active:scale-95 shadow-xl flex-shrink-0
                        ${!validation.isValid || state.isGenerating
                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed shadow-none'
                                    : 'bg-black text-white hover:bg-gray-800'
                                }`}
                        >
                            {state.isGenerating ? 'Rendering...' : 'Generate'}
                        </button>
                    </div>
                </div>
            )}

            {showNotification && (
                <div className="fixed top-20 right-4 z-[100] animate-fade-in bg-black text-white px-6 py-3 rounded-xl shadow-2xl">{showNotification}</div>
            )}
        </div>
    );
};
export default App;
