
import React from 'react';

interface SectionProps {
  title: string;
  number: number;
  children: React.ReactNode;
  isValid?: boolean;
  isLast?: boolean;
}

export const Section: React.FC<SectionProps> = ({ title, number, children, isValid, isLast }) => {
  return (
    <div className={`p-6 rounded-2xl border ${isLast ? 'mb-0' : 'mb-0'} ${isValid === false ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-white'} shadow-sm transition-all`}>
      <div className="flex items-center mb-4">
        <span className={`flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold mr-3 ${isValid === false ? 'bg-red-500 text-white' : 'bg-black text-white'}`}>
          {number}
        </span>
        <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
      </div>
      <div>
        {children}
      </div>
    </div>
  );
};
