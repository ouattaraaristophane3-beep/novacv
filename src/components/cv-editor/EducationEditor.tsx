import { useState } from 'react';
import { translations, Language } from '../../lib/translations';
import { useCV } from '../../context/CVContext';
import { GraduationCap, Plus, Trash2, ChevronDown, ChevronUp } from 'lucide-react';

interface EducationEditorProps {
  language: Language;
}

export function EducationEditor({ language }: EducationEditorProps) {
  const { cvData, addEducation, updateEducation, deleteEducation } = useCV();
  const t = translations[language];
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [newAchievement, setNewAchievement] = useState<{ [key: string]: string }>({});

  const handleAddEducation = () => {
    addEducation({
      institution: '',
      degree: '',
      field: '',
      location: '',
      description: '',
      achievements: [],
      is_current: false,
    });
    setTimeout(() => {
      const ids = cvData.education.map(e => e.id);
      if (ids.length > 0) {
        setExpandedId(ids[ids.length - 1]);
      }
    }, 0);
  };

  const handleChange = (id: string, field: string, value: string | boolean) => {
    updateEducation(id, { [field]: value });
  };

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const newEducation = [...cvData.education];
    [newEducation[index - 1], newEducation[index]] = [
      newEducation[index],
      newEducation[index - 1],
    ];
    newEducation.forEach((edu, i) => {
      updateEducation(edu.id, { display_order: i });
    });
  };

  const handleMoveDown = (index: number) => {
    if (index === cvData.education.length - 1) return;
    const newEducation = [...cvData.education];
    [newEducation[index], newEducation[index + 1]] = [
      newEducation[index + 1],
      newEducation[index],
    ];
    newEducation.forEach((edu, i) => {
      updateEducation(edu.id, { display_order: i });
    });
  };

  const handleAddAchievement = (id: string) => {
    const achievement = newAchievement[id];
    if (!achievement?.trim()) return;

    const education = cvData.education.find(e => e.id === id);
    if (!education) return;

    const achievements = (education.achievements as string[]) || [];
    updateEducation(id, {
      achievements: [...achievements, achievement.trim()],
    });
    setNewAchievement({ ...newAchievement, [id]: '' });
  };

  const handleRemoveAchievement = (educationId: string, achievementIndex: number) => {
    const education = cvData.education.find(e => e.id === educationId);
    if (!education) return;

    const achievements = (education.achievements as string[]) || [];
    updateEducation(educationId, {
      achievements: achievements.filter((_, i) => i !== achievementIndex),
    });
  };

  const formatDate = (date: string | null) => {
    if (!date) return '';
    return new Date(date).toISOString().split('T')[0];
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <GraduationCap className="w-5 h-5 text-blue-600" />
          {t.cv.education}
        </h2>
      </div>

      <div className="space-y-3">
        {cvData.education.map((education, index) => (
          <div
            key={education.id}
            className="border border-gray-200 rounded-lg overflow-hidden"
          >
            <div
              className="flex items-center justify-between p-4 bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors"
              onClick={() => setExpandedId(expandedId === education.id ? null : education.id)}
            >
              <div className="flex items-center gap-3">
                <div className="flex flex-col gap-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleMoveUp(index);
                    }}
                    disabled={index === 0}
                    className="p-1 hover:bg-white rounded transition-colors disabled:opacity-30"
                  >
                    <ChevronUp className="w-4 h-4 text-gray-500" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleMoveDown(index);
                    }}
                    disabled={index === cvData.education.length - 1}
                    className="p-1 hover:bg-white rounded transition-colors disabled:opacity-30"
                  >
                    <ChevronDown className="w-4 h-4 text-gray-500" />
                  </button>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">{education.degree || (language === 'fr' ? 'Nouveau diplôme' : 'New Degree')}</h3>
                  <p className="text-sm text-gray-500">{education.institution || (language === 'fr' ? 'Établissement' : 'Institution')}</p>
                </div>
              </div>
              <ChevronDown
                className={`w-5 h-5 text-gray-400 transition-transform ${
                  expandedId === education.id ? 'rotate-180' : ''
                }`}
              />
            </div>

            {expandedId === education.id && (
              <div className="p-4 space-y-4 border-t border-gray-200">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      {t.cv.institution}
                    </label>
                    <input
                      type="text"
                      value={education.institution}
                      onChange={(e) => handleChange(education.id, 'institution', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      {t.cv.degree}
                    </label>
                    <input
                      type="text"
                      value={education.degree}
                      onChange={(e) => handleChange(education.id, 'degree', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      {t.cv.field}
                    </label>
                    <input
                      type="text"
                      value={education.field || ''}
                      onChange={(e) => handleChange(education.id, 'field', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      {t.cv.location}
                    </label>
                    <input
                      type="text"
                      value={education.location || ''}
                      onChange={(e) => handleChange(education.id, 'location', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  </div>

                  <div className="flex items-end gap-2">
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        {t.cv.startDate}
                      </label>
                      <input
                        type="date"
                        value={formatDate(education.start_date)}
                        onChange={(e) =>
                          handleChange(education.id, 'start_date', e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      />
                    </div>
                    <div className="flex items-center pt-6">
                      <input
                        type="checkbox"
                        id={`current-edu-${education.id}`}
                        checked={education.is_current}
                        onChange={(e) => handleChange(education.id, 'is_current', e.target.checked)}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <label
                        htmlFor={`current-edu-${education.id}`}
                        className="ml-2 text-sm text-gray-700"
                      >
                        {t.cv.current}
                      </label>
                    </div>
                  </div>

                  {!education.is_current && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        {t.cv.endDate}
                      </label>
                      <input
                        type="date"
                        value={formatDate(education.end_date)}
                        onChange={(e) =>
                          handleChange(education.id, 'end_date', e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      />
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    {t.cv.description}
                  </label>
                  <textarea
                    value={education.description || ''}
                    onChange={(e) => handleChange(education.id, 'description', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    {t.cv.achievements}
                  </label>
                  <div className="space-y-2">
                    {((education.achievements as string[]) || []).map((achievement, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-2 group"
                      >
                        <span className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0"></span>
                        <span className="flex-1 text-sm text-gray-700">{achievement}</span>
                        <button
                          onClick={() => handleRemoveAchievement(education.id, i)}
                          className="p-1 hover:bg-red-50 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2 mt-2">
                    <input
                      type="text"
                      value={newAchievement[education.id] || ''}
                      onChange={(e) =>
                        setNewAchievement({ ...newAchievement, [education.id]: e.target.value })
                      }
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddAchievement(education.id);
                        }
                      }}
                      placeholder={t.cv.addAchievement}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
                    />
                    <button
                      onClick={() => handleAddAchievement(education.id)}
                      className="px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors font-medium text-sm"
                    >
                      {t.common.add}
                    </button>
                  </div>
                </div>

                <button
                  onClick={() => deleteEducation(education.id)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>{t.common.delete}</span>
                </button>
              </div>
            )}
          </div>
        ))}

        <button
          onClick={handleAddEducation}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 transition-all"
        >
          <Plus className="w-5 h-5" />
          <span>{t.common.add}</span>
        </button>
      </div>
    </div>
  );
}
