
import React, { useState, useEffect } from 'react';
import { GalleryItem, Project } from '../types';
import { POSES } from '../constants';
import { getProjects } from '../services/storageService';

interface GalleryProps {
  items: GalleryItem[];
  onDelete: (id: string) => void; // Used for single item delete or library delete
  onDeleteProject: (projectId: string) => void;
  onRefresh: () => void; // Trigger data reload
}

type Tab = 'projects' | 'library';

export const Gallery: React.FC<GalleryProps> = ({ items, onDelete, onDeleteProject, onRefresh }) => {
  const [activeTab, setActiveTab] = useState<Tab>('projects');
  const [projects, setProjects] = useState<Project[]>([]);
  
  // Navigation State
  const [currentProject, setCurrentProject] = useState<Project | null>(null); // If set, we show Project Details

  // Lightbox State
  const [zoomedItem, setZoomedItem] = useState<GalleryItem | null>(null);

  // Selection State
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // Load Projects on mount or update
  useEffect(() => {
    loadProjects();
  }, [items]); // Reload projects when items change (counts might update)

  const loadProjects = async () => {
      const projs = await getProjects();
      setProjects(projs);
  };

  // Reset selection when changing views
  useEffect(() => {
    setIsSelectionMode(false);
    setSelectedIds(new Set());
    setZoomedItem(null);
  }, [activeTab, currentProject]);

  // --- Handlers ---

  const handleToggleSelect = (id: string) => {
    const newSet = new Set(selectedIds);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setSelectedIds(newSet);
  };

  const handleBulkSend = () => {
    alert(`Sent ${selectedIds.size} items successfully!`);
    setIsSelectionMode(false);
    setSelectedIds(new Set());
  };

  const handleBulkDelete = () => {
      if (!window.confirm(`Delete ${selectedIds.size} selected items?`)) return;
      
      const ids = Array.from(selectedIds);
      
      if (activeTab === 'projects' && !currentProject) {
          // Deleting Projects
          ids.forEach(id => onDeleteProject(id));
      } else {
          // Deleting Items (Library)
          ids.forEach(id => onDelete(id));
      }
      setIsSelectionMode(false);
      setSelectedIds(new Set());
  };

  const handleDownload = (e: React.MouseEvent, item: GalleryItem) => {
    e.stopPropagation();
    const link = document.createElement('a');
    link.href = item.imageUrl;
    link.download = `profashion-${item.poseId}-${item.id.slice(0, 4)}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSingleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (window.confirm("Delete this photo?")) {
        onDelete(id);
        if (zoomedItem?.id === id) setZoomedItem(null);
    }
  };

  const handleSendSingle = (e: React.MouseEvent) => {
      e.stopPropagation();
      alert("Sent successfully!");
  };

  // --- Render Helpers ---

  const renderProjectCard = (project: Project) => (
      <div 
        key={project.id} 
        onClick={() => {
            if (isSelectionMode) handleToggleSelect(project.id);
            else setCurrentProject(project);
        }}
        className={`group relative aspect-square bg-gray-100 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${isSelectionMode && selectedIds.has(project.id) ? 'border-blue-600 ring-2 ring-blue-100' : 'border-transparent hover:border-gray-300'}`}
      >
         {/* Stack Effect */}
         <div className="absolute top-0 right-0 w-full h-full bg-gray-200 transform translate-x-1 -translate-y-1 rounded-xl -z-10"></div>
         
         {project.thumbnailUrl ? (
             <img src={project.thumbnailUrl} alt="Project" className="w-full h-full object-cover" />
         ) : (
             <div className="w-full h-full flex items-center justify-center text-gray-400">
                 <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" /></svg>
             </div>
         )}
         
         {/* Simplified Info Overlay: Only Photo Count */}
         <div className="absolute bottom-0 w-full p-3 flex justify-end">
             <div className="bg-black/60 backdrop-blur-sm text-white text-xs font-bold px-2 py-1 rounded-lg border border-white/10 shadow-sm">
                 {project.itemCount} Photos
             </div>
         </div>

         {/* Selection Circle */}
         {isSelectionMode && (
             <div className={`absolute top-2 right-2 w-6 h-6 rounded-full border-2 border-white flex items-center justify-center ${selectedIds.has(project.id) ? 'bg-blue-600' : 'bg-black/40'}`}>
                 {selectedIds.has(project.id) && <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
             </div>
         )}
      </div>
  );

  const renderPhotoCard = (item: GalleryItem, showFooter: boolean = false) => {
      return (
        <div key={item.id} className="flex flex-col">
            {/* Image Container */}
            <div 
                onClick={() => {
                    if (isSelectionMode) handleToggleSelect(item.id);
                    else setZoomedItem(item); // Open Lightbox
                }}
                className={`group relative aspect-square bg-gray-100 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${isSelectionMode && selectedIds.has(item.id) ? 'border-blue-600 ring-2 ring-blue-100' : 'border-transparent shadow-sm hover:border-gray-300'}`}
            >
                <img src={item.imageUrl} alt="Generated" className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" />
                
                {/* Selection Mode: Checkbox */}
                {isSelectionMode && (
                    <div className={`absolute top-2 right-2 w-6 h-6 rounded-full border-2 border-white flex items-center justify-center ${selectedIds.has(item.id) ? 'bg-blue-600' : 'bg-black/40'}`}>
                        {selectedIds.has(item.id) && <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                    </div>
                )}
            </div>

            {/* Footer with Whitespace (Only used in Project Detail View currently) */}
            {!isSelectionMode && showFooter && (
                <div className="mt-3 flex items-center justify-between px-1">
                    {/* Left: Image ID */}
                    <span className="text-xs font-mono text-gray-400 font-medium">
                        #{item.id.slice(0, 8).toUpperCase()}
                    </span>

                    {/* Right: Actions */}
                    <div className="flex items-center space-x-2">
                        {/* Delete Button */}
                        <button 
                            onClick={(e) => handleSingleDelete(e, item.id)}
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-all"
                            title="Delete"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        </button>

                        {/* Download Button (Rightmost) */}
                        <button 
                            onClick={(e) => handleDownload(e, item)}
                            className="p-2 text-gray-500 hover:text-black hover:bg-gray-100 rounded-full transition-all"
                            title="Download"
                        >
                             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                        </button>
                    </div>
                </div>
            )}
        </div>
      );
  };

  // --- View Content ---

  let content;
  
  if (activeTab === 'projects' && !currentProject) {
      // 1. PROJECT LIST VIEW
      content = (
          <div className="grid grid-cols-3 gap-3">
              {projects.length === 0 ? (
                  <div className="col-span-full text-center py-20 text-gray-400">No Projects Yet</div>
              ) : (
                  projects.map(renderProjectCard)
              )}
          </div>
      );
  } else if (activeTab === 'projects' && currentProject) {
      // 2. PROJECT DETAIL VIEW
      const projectItems = items.filter(i => i.projectId === currentProject.id);
      
      content = (
        <div className="flex flex-col space-y-8 max-w-xl mx-auto">
            {projectItems.length === 0 ? (
                <div className="col-span-full text-center py-20 text-gray-400">Project is empty</div>
            ) : (
                projectItems.map(item => renderPhotoCard(item, true))
            )}
        </div>
      );
  } else {
      // 3. LIBRARY VIEW (3 Columns)
      content = (
        <div className="grid grid-cols-3 gap-2">
            {items.length === 0 ? (
                 <div className="col-span-full text-center py-20 text-gray-400">Library is empty</div>
            ) : (
                items.map(item => renderPhotoCard(item, false))
            )}
        </div>
      );
  }

  return (
    <div className="min-h-[500px]">
       
       {/* Lightbox Modal (Zoom View) */}
       {zoomedItem && (
         <div className="fixed inset-0 z-[100] bg-white flex items-center justify-center animate-fade-in">
             
             {/* Image */}
             <div className="relative w-full h-full flex items-center justify-center p-4">
                 <img 
                    src={zoomedItem.imageUrl} 
                    alt="Full View" 
                    className="max-w-full max-h-full object-contain shadow-2xl transition-transform duration-300 transform scale-100" 
                 />
             </div>

             {/* Top Left: Back */}
             <button 
                onClick={() => setZoomedItem(null)}
                className="absolute top-6 left-6 p-4 bg-white hover:bg-gray-100 text-gray-900 rounded-full shadow-lg border border-gray-200 transition-all z-50 group"
                title="Back"
             >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
             </button>

             {/* Top Right: Delete */}
             <button 
                onClick={(e) => handleSingleDelete(e, zoomedItem.id)}
                className="absolute top-6 right-6 p-4 bg-white hover:bg-red-50 text-gray-900 hover:text-red-600 rounded-full shadow-lg border border-gray-200 transition-all z-50"
                title="Delete"
             >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
             </button>

             {/* Bottom Left: Send */}
             <button 
                onClick={handleSendSingle}
                className="absolute bottom-6 left-6 p-4 bg-white hover:bg-blue-50 text-gray-900 hover:text-blue-600 rounded-full shadow-lg border border-gray-200 transition-all z-50"
                title="Send"
             >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
             </button>

             {/* Bottom Right: Download */}
             <button 
                onClick={(e) => handleDownload(e, zoomedItem)}
                className="absolute bottom-6 right-6 p-4 bg-black text-white hover:bg-gray-800 rounded-full shadow-lg transition-all z-50"
                title="Download"
             >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
             </button>
         </div>
       )}

       {/* Top Bar */}
       <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
           <div className="flex items-center space-x-4">
                {currentProject && (
                    <button onClick={() => setCurrentProject(null)} className="p-2 hover:bg-gray-100 rounded-full transition-colors flex items-center gap-2 group">
                        <svg className="w-6 h-6 text-gray-600 group-hover:text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                        <span className="text-sm font-medium text-gray-600 group-hover:text-black">Back to Projects</span>
                    </button>
                )}
                
                {!currentProject && (
                    <div className="flex bg-gray-100 p-1 rounded-lg">
                        <button 
                            onClick={() => setActiveTab('projects')}
                            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${activeTab === 'projects' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            Projects
                        </button>
                        <button 
                            onClick={() => setActiveTab('library')}
                            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${activeTab === 'library' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            Library
                        </button>
                    </div>
                )}
                {currentProject && (
                    <div className="flex flex-col border-l border-gray-200 pl-4">
                        <h2 className="text-lg font-bold leading-none text-gray-900">{new Date(currentProject.timestamp).toLocaleString()}</h2>
                        <span className="text-xs text-gray-500 mt-1">{currentProject.itemCount} Photos</span>
                    </div>
                )}
           </div>

           {/* Actions - HIDE if in Project Detail View (Select button gone) */}
           {!currentProject && (
               <div className="flex items-center space-x-2">
                   {isSelectionMode ? (
                       <>
                         <span className="text-sm font-medium mr-2">{selectedIds.size} Selected</span>
                         <button 
                            onClick={handleBulkDelete}
                            disabled={selectedIds.size === 0}
                            className="px-4 py-1.5 bg-red-50 text-red-600 rounded-lg text-sm font-medium hover:bg-red-100 disabled:opacity-50"
                         >
                            Delete
                         </button>
                         <button 
                            onClick={handleBulkSend}
                            disabled={selectedIds.size === 0}
                            className="px-4 py-1.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
                         >
                            Send
                         </button>
                         <button 
                            onClick={() => { setIsSelectionMode(false); setSelectedIds(new Set()); }}
                            className="px-4 py-1.5 text-gray-500 hover:text-gray-700 text-sm"
                         >
                            Cancel
                         </button>
                       </>
                   ) : (
                       <button 
                            onClick={() => setIsSelectionMode(true)}
                            className="px-4 py-1.5 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50"
                       >
                           Select
                       </button>
                   )}
               </div>
           )}
       </div>

       <div className="animate-fade-in">
           {content}
       </div>
    </div>
  );
};
