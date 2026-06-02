import React, { useState } from 'react';
import { X, ArrowRight } from 'lucide-react';
import { TemplateType, templateMetadata } from '../../lib/themes';
import { Language } from '../../lib/translations';
import { TemplatePreviewCard } from './TemplatePreviewCard';

interface TemplateGalleryProps {
  onTemplateSelect: (template: TemplateType) => void;
  onCancel: () => void;
  language: Language;
}

export const TemplateGallery: React.FC<TemplateGalleryProps> = ({
  onTemplateSelect,
  onCancel,
  language
}) => {
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateType>('sidebarMode');

  const handleConfirm = () => {
    onTemplateSelect(selectedTemplate);
  };

  const texts = {
    title: language === 'fr' ? 'Choisir un modèle' : 'Choose a template',
    subtitle: language === 'fr' 
      ? 'Sélectionnez le modèle qui correspond le mieux à votre profil'
      : 'Select the template that best matches your profile',
    selectedTemplate: language === 'fr' ? 'Modèle sélectionné :' : 'Selected template:',
    cancel: language === 'fr' ? 'Annuler' : 'Cancel',
    confirm: language === 'fr' ? 'Créer un CV avec ce modèle' : 'Create CV with this template',
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">{texts.title}</h2>
            <p className="text-blue-100 mt-1">{texts.subtitle}</p>
          </div>
          <button
            onClick={onCancel}
            className="text-white hover:bg-blue-800 rounded-full p-2 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Gallery Grid */}
        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {(Object.keys(templateMetadata) as TemplateType[]).map((template) => (
              <TemplatePreviewCard
                key={template}
                template={template}
                isSelected={selectedTemplate === template}
                onSelect={setSelectedTemplate}
              />
            ))}
          </div>

          {/* Selected Template Info */}
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded mb-8">
            <p className="text-sm text-gray-700">
              <span className="font-semibold">{texts.selectedTemplate}</span>
              {' '}
              {templateMetadata[selectedTemplate]?.name}
            </p>
            <p className="text-xs text-gray-600 mt-2">
              {templateMetadata[selectedTemplate]?.description}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3">
            <button
              onClick={onCancel}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              {texts.cancel}
            </button>
            <button
              onClick={handleConfirm}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center gap-2"
            >
              {texts.confirm}
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
