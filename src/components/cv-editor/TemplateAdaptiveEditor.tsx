/**
 * Éditeur adaptatif complet - Remplace tous les anciens éditeurs
 * S'adapte entièrement au template choisi
 */
import { useState } from 'react';
import { DynamicSectionForm } from './DynamicFormFields';
import { getTemplateFieldConfig } from '../../lib/templateFieldsConfig';
import { useCV } from '../../context/CVContext';
import { useAuth } from '../../context/AuthContext';
import { TemplateType } from '../../lib/themes';
import { useTemplateFieldValidation } from '../../hooks/useTemplateFieldValidation';
import { Plus, Trash2, ChevronDown, ChevronUp } from 'lucide-react';

interface TemplateAdaptiveEditorProps {
  cvId?: string;
  language?: string;
}

export function TemplateAdaptiveEditor({ cvId: _cvId, language: _language }: TemplateAdaptiveEditorProps) {
  const { cvData, updateCVLocal, saveCV, addExperience, addEducation, addSkill, deleteExperience, deleteEducation, deleteSkill, updateExperience, updateEducation, updateSkill } = useCV();
  const { user } = useAuth();
  const [isSaving, setIsSaving] = useState(false);
  const [expandedItems, setExpandedItems] = useState<{ [key: string]: boolean }>({});
  
  const currentTemplate = (cvData.cv?.template || 'sidebarMode') as TemplateType;
  const templateConfig = getTemplateFieldConfig(currentTemplate);
  const { errors, validateField, updateFieldError } = useTemplateFieldValidation(currentTemplate);

  if (!cvData.cv || !user) {
    return <div className="p-4 text-center">Chargement...</div>;
  }

  const personalInfo = (typeof cvData.cv.personal_info === 'object' && cvData.cv.personal_info !== null
    ? cvData.cv.personal_info
    : {}) as Record<string, any>;

  const handleFieldChange = (sectionId: string, fieldId: string, value: any) => {
    const error = validateField(fieldId, value);
    if (error) {
      updateFieldError(fieldId, error);
    } else {
      updateFieldError(fieldId, null);
    }

    const updatedPersonalInfo = {
      ...personalInfo,
      [sectionId]: {
        ...(personalInfo[sectionId] as Record<string, any> || {}),
        [fieldId]: value,
      },
    };

    updateCVLocal({
      ...cvData.cv!,
      personal_info: updatedPersonalInfo,
    });
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await saveCV();
    } finally {
      setIsSaving(false);
    }
  };

  const toggleExpanded = (id: string) => {
    setExpandedItems(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // Afficher les sections configurées pour ce template
  const sectionsToDisplay = templateConfig.sections.filter(
    section => !['experience', 'education', 'skills'].includes(section.id)
  );

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-gray-900">
            {templateConfig.name}
          </h2>
          <p className="text-xs text-gray-600 mt-1">{templateConfig.description}</p>
        </div>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {isSaving ? 'Sauvegarde...' : 'Enregistrer'}
        </button>
      </div>

      {/* Sections dynamiques simples */}
      <div className="space-y-8 max-h-[calc(100vh-300px)] overflow-y-auto">
        {sectionsToDisplay.map((section) => (
          <div
            key={section.id}
            className="bg-white border border-gray-200 rounded-lg p-5"
          >
            <DynamicSectionForm
              section={section}
              data={(personalInfo[section.id] as Record<string, any>) || {}}
              onChange={(fieldId, value) => handleFieldChange(section.id, fieldId, value)}
              errors={errors}
            />
          </div>
        ))}

        {/* Expériences multiples */}
        {templateConfig.sections.find(s => s.id === 'experience') && (
          <div className="bg-white border border-gray-200 rounded-lg p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide">
                Expériences professionnelles
              </h3>
              <button
                onClick={() => addExperience({ company: '', position: '' })}
                className="flex items-center gap-1 px-3 py-1.5 bg-blue-50 text-blue-600 text-xs font-semibold rounded hover:bg-blue-100"
              >
                <Plus className="w-3 h-3" />
                Ajouter
              </button>
            </div>
            <div className="space-y-3">
              {cvData.experiences.map((exp) => (
                <div key={exp.id} className="border border-gray-200 rounded-lg">
                  <button
                    onClick={() => toggleExpanded(exp.id)}
                    className="w-full flex items-center justify-between p-3 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex-1 text-left">
                      <h4 className="font-semibold text-gray-900">{exp.company || 'Entreprise'}</h4>
                      <p className="text-sm text-gray-600">{exp.position || 'Poste'}</p>
                    </div>
                    {expandedItems[exp.id] ? (
                      <ChevronUp className="w-4 h-4 text-gray-600" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-gray-600" />
                    )}
                  </button>

                  {expandedItems[exp.id] && (
                    <div className="border-t border-gray-200 p-3 space-y-3 bg-gray-50">
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-gray-700">Entreprise</label>
                        <input
                          type="text"
                          value={exp.company || ''}
                          onChange={(e) => updateExperience(exp.id, { company: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-gray-700">Poste</label>
                        <input
                          type="text"
                          value={exp.position || ''}
                          onChange={(e) => updateExperience(exp.id, { position: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-gray-700">Description</label>
                        <textarea
                          value={exp.description || ''}
                          onChange={(e) => updateExperience(exp.id, { description: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                          rows={3}
                        />
                      </div>
                      <button
                        onClick={() => deleteExperience(exp.id)}
                        className="flex items-center gap-2 px-3 py-2 text-red-600 text-sm font-semibold hover:bg-red-50 rounded"
                      >
                        <Trash2 className="w-3 h-3" />
                        Supprimer
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Formations multiples */}
        {templateConfig.sections.find(s => s.id === 'education') && (
          <div className="bg-white border border-gray-200 rounded-lg p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide">
                Formations
              </h3>
              <button
                onClick={() => addEducation({ institution: '', degree: '' })}
                className="flex items-center gap-1 px-3 py-1.5 bg-blue-50 text-blue-600 text-xs font-semibold rounded hover:bg-blue-100"
              >
                <Plus className="w-3 h-3" />
                Ajouter
              </button>
            </div>
            <div className="space-y-3">
              {cvData.education.map((edu) => (
                <div key={edu.id} className="border border-gray-200 rounded-lg">
                  <button
                    onClick={() => toggleExpanded(edu.id)}
                    className="w-full flex items-center justify-between p-3 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex-1 text-left">
                      <h4 className="font-semibold text-gray-900">{edu.institution || 'Institution'}</h4>
                      <p className="text-sm text-gray-600">{edu.degree || 'Diplôme'}</p>
                    </div>
                    {expandedItems[edu.id] ? (
                      <ChevronUp className="w-4 h-4 text-gray-600" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-gray-600" />
                    )}
                  </button>

                  {expandedItems[edu.id] && (
                    <div className="border-t border-gray-200 p-3 space-y-3 bg-gray-50">
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-gray-700">Institution</label>
                        <input
                          type="text"
                          value={edu.institution || ''}
                          onChange={(e) => updateEducation(edu.id, { institution: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-gray-700">Diplôme</label>
                        <input
                          type="text"
                          value={edu.degree || ''}
                          onChange={(e) => updateEducation(edu.id, { degree: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-gray-700">Domaine</label>
                        <input
                          type="text"
                          value={edu.field || ''}
                          onChange={(e) => updateEducation(edu.id, { field: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                        />
                      </div>
                      <button
                        onClick={() => deleteEducation(edu.id)}
                        className="flex items-center gap-2 px-3 py-2 text-red-600 text-sm font-semibold hover:bg-red-50 rounded"
                      >
                        <Trash2 className="w-3 h-3" />
                        Supprimer
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Compétences multiples */}
        {templateConfig.sections.find(s => s.id === 'skills') && (
          <div className="bg-white border border-gray-200 rounded-lg p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide">
                Compétences
              </h3>
              <button
                onClick={() => addSkill({ name: '' })}
                className="flex items-center gap-1 px-3 py-1.5 bg-blue-50 text-blue-600 text-xs font-semibold rounded hover:bg-blue-100"
              >
                <Plus className="w-3 h-3" />
                Ajouter
              </button>
            </div>
            <div className="space-y-2">
              {cvData.skills.map((skill) => (
                <div key={skill.id} className="flex items-center gap-2 p-2 border border-gray-200 rounded">
                  <input
                    type="text"
                    value={skill.name || ''}
                    onChange={(e) => updateSkill(skill.id, { name: e.target.value })}
                    placeholder="Compétence"
                    className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm"
                  />
                  <button
                    onClick={() => deleteSkill(skill.id)}
                    className="p-1 text-red-600 hover:bg-red-50 rounded"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
