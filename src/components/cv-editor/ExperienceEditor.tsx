import { useState } from 'react';
import { translations, Language } from '../../lib/translations';
import { useCV } from '../../context/CVContext';
import { Briefcase, Plus, Trash2, ChevronDown, ChevronUp } from 'lucide-react';

interface ExperienceEditorProps {
  language: Language;
}

export function ExperienceEditor({ language }: ExperienceEditorProps) {
  const { cvData, addExperience, updateExperience, deleteExperience } = useCV();
  const t = translations[language];
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [newAchievement, setNewAchievement] = useState<{ [key: string]: string }>({});

  const handleAddExperience = () => {
    addExperience({
      company: '',
      position: '',
      location: '',
      description: '',
      achievements: [],
      is_current: false,
    });
    setTimeout(() => {
      const ids = cvData.experiences.map(e => e.id);
      if (ids.length > 0) {
        setExpandedId(ids[ids.length - 1]);
      }
    }, 0);
  };

  const handleChange = (id: string, field: string, value: string | boolean) => {
    updateExperience(id, { [field]: value });
  };

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const newExperiences = [...cvData.experiences];
    [newExperiences[index - 1], newExperiences[index]] = [
      newExperiences[index],
      newExperiences[index - 1],
    ];
    newExperiences.forEach((exp, i) => {
      updateExperience(exp.id, { display_order: i });
    });
  };

  const handleMoveDown = (index: number) => {
    if (index === cvData.experiences.length - 1) return;
    const newExperiences = [...cvData.experiences];
    [newExperiences[index], newExperiences[index + 1]] = [
      newExperiences[index + 1],
      newExperiences[index],
    ];
    newExperiences.forEach((exp, i) => {
      updateExperience(exp.id, { display_order: i });
    });
  };

  const handleAddAchievement = (id: string) => {
    const achievement = newAchievement[id];
    if (!achievement?.trim()) return;

    const experience = cvData.experiences.find(e => e.id === id);
    if (!experience) return;

    const achievements = (experience.achievements as string[]) || [];
    updateExperience(id, {
      achievements: [...achievements, achievement.trim()],
    });
    setNewAchievement({ ...newAchievement, [id]: '' });
  };

  const handleRemoveAchievement = (experienceId: string, achievementIndex: number) => {
    const experience = cvData.experiences.find(e => e.id === experienceId);
    if (!experience) return;

    const achievements = (experience.achievements as string[]) || [];
    updateExperience(experienceId, {
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
          <Briefcase className="w-5 h-5 text-blue-600" />
          {t.cv.experiences}
        </h2>
      </div>

      <div className="space-y-3">
        {cvData.experiences.map((experience, index) => (
          <div
            key={experience.id}
            className="border border-gray-200 rounded-lg overflow-hidden"
          >
            <div
              className="flex items-center justify-between p-4 bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors"
              onClick={() => setExpandedId(expandedId === experience.id ? null : experience.id)}
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
                    disabled={index === cvData.experiences.length - 1}
                    className="p-1 hover:bg-white rounded transition-colors disabled:opacity-30"
                  >
                    <ChevronDown className="w-4 h-4 text-gray-500" />
                  </button>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">{experience.position || (language === 'fr' ? 'Nouveau poste' : 'New Position')}</h3>
                  <p className="text-sm text-gray-500">{experience.company || (language === 'fr' ? 'Entreprise' : 'Company')}</p>
                </div>
              </div>
              <ChevronDown
                className={`w-5 h-5 text-gray-400 transition-transform ${
                  expandedId === experience.id ? 'rotate-180' : ''
                }`}
              />
            </div>

            {expandedId === experience.id && (
              <div className="p-4 space-y-4 border-t border-gray-200">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      {t.cv.company}
                    </label>
                    <input
                      type="text"
                      value={experience.company}
                      onChange={(e) => handleChange(experience.id, 'company', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      {t.cv.position}
                    </label>
                    <input
                      type="text"
                      value={experience.position}
                      onChange={(e) => handleChange(experience.id, 'position', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      {t.cv.location}
                    </label>
                    <input
                      type="text"
                      value={experience.location}
                      onChange={(e) => handleChange(experience.id, 'location', e.target.value)}
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
                        value={formatDate(experience.start_date)}
                        onChange={(e) =>
                          handleChange(experience.id, 'start_date', e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      />
                    </div>
                    <div className="flex items-center pt-6">
                      <input
                        type="checkbox"
                        id={`current-${experience.id}`}
                        checked={experience.is_current}
                        onChange={(e) => handleChange(experience.id, 'is_current', e.target.checked)}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <label
                        htmlFor={`current-${experience.id}`}
                        className="ml-2 text-sm text-gray-700"
                      >
                        {t.cv.current}
                      </label>
                    </div>
                  </div>

                  {!experience.is_current && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        {t.cv.endDate}
                      </label>
                      <input
                        type="date"
                        value={formatDate(experience.end_date)}
                        onChange={(e) =>
                          handleChange(experience.id, 'end_date', e.target.value)
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
                    value={experience.description || ''}
                    onChange={(e) => handleChange(experience.id, 'description', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    {t.cv.achievements}
                  </label>
                  <div className="space-y-2">
                    {((experience.achievements as string[]) || []).map((achievement, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-2 group"
                      >
                        <span className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0"></span>
                        <span className="flex-1 text-sm text-gray-700">{achievement}</span>
                        <button
                          onClick={() => handleRemoveAchievement(experience.id, i)}
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
                      value={newAchievement[experience.id] || ''}
                      onChange={(e) =>
                        setNewAchievement({ ...newAchievement, [experience.id]: e.target.value })
                      }
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddAchievement(experience.id);
                        }
                      }}
                      placeholder={t.cv.addAchievement}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
                    />
                    <button
                      onClick={() => handleAddAchievement(experience.id)}
                      className="px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors font-medium text-sm"
                    >
                      {t.common.add}
                    </button>
                  </div>
                </div>

                <button
                  onClick={() => deleteExperience(experience.id)}
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
          onClick={handleAddExperience}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 transition-all"
        >
          <Plus className="w-5 h-5" />
          <span>{t.common.add}</span>
        </button>
      </div>
    </div>
  );
}
