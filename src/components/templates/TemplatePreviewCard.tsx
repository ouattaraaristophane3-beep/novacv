import React from 'react';
import { Check } from 'lucide-react';
import { templateMetadata, TemplateType } from '../../lib/themes';

interface TemplatePreviewCardProps {
  template: TemplateType;
  isSelected: boolean;
  onSelect: (template: TemplateType) => void;
}

export const TemplatePreviewCard: React.FC<TemplatePreviewCardProps> = ({
  template,
  isSelected,
  onSelect,
}) => {
  const metadata = templateMetadata[template];

  if (!metadata) return null;

  return (
    <button
      onClick={() => onSelect(template)}
      className={`
        relative overflow-hidden rounded-lg border-2 transition-all
        ${isSelected 
          ? 'border-blue-500 ring-2 ring-blue-300 shadow-lg' 
          : 'border-gray-200 hover:border-gray-400 hover:shadow-md'
        }
        focus:outline-none focus:ring-2 focus:ring-blue-500
      `}
    >
      {/* Preview Box */}
      <div className="aspect-[3/4] bg-gray-50 overflow-hidden relative">
        {/* Template Preview Visual */}
        <div className="w-full h-full p-4 flex flex-col bg-white">
          {/* Header Section */}
          <div className="mb-4 pb-3 border-b border-gray-300">
            <h3 className="text-sm font-bold text-gray-800">Jean Example</h3>
            <p className="text-xs text-gray-600">Paris, France</p>
          </div>

          {/* Content Areas */}
          <div className="space-y-2 flex-1">
            <div className="h-2 bg-gray-400 rounded w-3/4" />
            <div className="h-2 bg-gray-300 rounded w-full" />
            <div className="h-2 bg-gray-300 rounded w-5/6" />
          </div>
        </div>
      </div>

      {/* Card Footer */}
      <div className="p-3 border-t border-gray-200 bg-white">
        <h4 className="font-semibold text-gray-800 text-sm">{metadata.name}</h4>
        <p className="text-xs text-gray-600 line-clamp-2">{metadata.description}</p>
      </div>

      {/* Selection Indicator */}
      {isSelected && (
        <div className="absolute top-2 right-2 bg-blue-500 text-white rounded-full p-1.5">
          <Check size={16} />
        </div>
      )}
    </button>
  );
};
