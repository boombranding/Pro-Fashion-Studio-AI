
import React, { useState } from 'react';
import { normalizeFile } from '../services/geminiService';

interface GarmentSelectorProps {
  files: File[];
  setFiles: (files: File[]) => void;
}

export const GarmentSelector: React.FC<GarmentSelectorProps> = ({ files, setFiles }) => {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setIsProcessing(true);
      try {
        const rawFiles = Array.from(e.target.files);
        const processedFiles = await Promise.all(rawFiles.map(normalizeFile));
        
        if (files.length + processedFiles.length > 5) {
          alert("Maximum 5 garments allowed.");
          return;
        }
        setFiles([...files, ...processedFiles]);
      } catch (err) {
        console.error(err);
        // Error is now unlikely due to normalizeFile robustness, but keep for safety
        alert("Failed to process images.");
      } finally {
        setIsProcessing(false);
      }
    }
  };

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      <div className={`border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition-colors ${isProcessing ? 'opacity-75 cursor-wait' : ''}`}>
        <input
          type="file"
          multiple
          accept="image/*,.heic,.heif"
          onChange={handleFileChange}
          className="hidden"
          id="garment-upload"
          disabled={isProcessing}
        />
        <label htmlFor="garment-upload" className="cursor-pointer block w-full">
          {isProcessing ? (
             <div className="flex flex-col items-center justify-center">
                 <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mb-2"></div>
                 <span className="text-gray-600 font-medium">Processing images...</span>
             </div>
          ) : (
             <>
                <svg className="w-12 h-12 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                <span className="text-gray-500 font-medium">Click to upload garment images</span>
                <p className="text-xs text-gray-400 mt-1">Select 1 to 5 items</p>
             </>
          )}
        </label>
      </div>

      {files.length > 0 && (
        <div className="grid grid-cols-3 md:grid-cols-5 gap-4">
          {files.map((file, index) => (
            <div key={index} className="relative group border rounded-lg overflow-hidden aspect-square bg-gray-50">
              <img
                src={URL.createObjectURL(file)}
                alt="garment"
                className="w-full h-full object-contain p-2"
                onError={(e) => {
                    // Fallback for when browser cannot display the file (e.g. raw HEIC)
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.parentElement?.querySelector('.fallback-icon')?.classList.remove('hidden');
                }}
              />
              {/* Fallback Icon for HEIC/Raw files that browser can't render */}
              <div className="fallback-icon hidden absolute inset-0 flex flex-col items-center justify-center text-gray-400 bg-gray-50">
                  <span className="font-bold text-xs uppercase">{file.name.split('.').pop()}</span>
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
              </div>

              <button
                onClick={() => removeFile(index)}
                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity z-10"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
