
import React from 'react';
import { SHOT_TYPE_OPTIONS } from '../constants';
import { ShotType } from '../types';

interface ShotTypeSelectorProps {
  selectedType: ShotType | null;
  onSelect: (type: ShotType) => void;
}

export const ShotTypeSelector: React.FC<ShotTypeSelectorProps> = ({ selectedType, onSelect }) => {
  return (
    <div className="grid grid-cols-3 md:grid-cols-5 gap-6">
      {SHOT_TYPE_OPTIONS.map((option) => {
        const isSelected = selectedType === option.type;
        return (
          <div
            key={option.type}
            onClick={() => onSelect(option.type)}
            className="group cursor-pointer flex flex-col items-center"
          >
            {/* Image Container */}
            <div
              className={`w-full aspect-square relative rounded-xl border-2 overflow-hidden bg-gray-50 transition-all duration-300 
              ${isSelected
                  ? 'border-blue-600 ring-4 ring-blue-50 shadow-md'
                  : 'border-gray-200 hover:border-blue-300 hover:shadow-sm'
                }`}
            >
              {/* Image/Icon */}
              <img
                src={option.url}
                alt={option.label}
                className="w-full h-full object-cover"
              />

              {/* Hover overlay - light blue tint */}
              <div className={`absolute inset-0 bg-blue-600/5 pointer-events-none transition-opacity duration-300 ${isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`} />

              {/* Selection Checkmark */}
              {isSelected && (
                <div className="absolute top-2 right-2 bg-blue-600 text-white rounded-full p-1 shadow-md animate-fade-in">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                </div>
              )}
            </div>

            {/* Label Below Image */}
            <div className="mt-3 text-center">
              <p className={`font-bold text-sm ${isSelected ? 'text-blue-600' : 'text-gray-900 group-hover:text-black'}`}>
                {option.label}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};
