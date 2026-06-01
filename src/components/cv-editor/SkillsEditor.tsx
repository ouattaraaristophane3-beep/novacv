import { useState } from 'react';
import { translations, Language } from '../../lib/translations';
import { Database } from '../../lib/supabase';
import { useCV } from '../../context/CVContext';
import { Wrench, Plus, Trash2 } from 'lucide-react';

type Skill = Database['public']['Tables']['skills']['Row'];

interface SkillsEditorProps {
  language: Language;
}

export function SkillsEditor({ language }: SkillsEditorProps) {
  const { cvData, addSkill, deleteSkill } = useCV();
  const t = translations[language];
  const [newSkill, setNewSkill] = useState('');
  const [newSkillCategory, setNewSkillCategory] = useState('technical');
  const [newSkillLevel, setNewSkillLevel] = useState(3);

  const categories = [
    { value: 'technical', label: t.cv.skillsCategories.technical },
    { value: 'language', label: t.cv.skillsCategories.language },
    { value: 'soft', label: t.cv.skillsCategories.soft },
    { value: 'other', label: t.cv.skillsCategories.other },
  ];

  const handleAddSkill = () => {
    if (!newSkill.trim()) return;

    addSkill({
      name: newSkill.trim(),
      category: newSkillCategory,
      level: newSkillLevel,
    });

    setNewSkill('');
    setNewSkillLevel(3);
  };

  const groupedSkills = cvData.skills.reduce((acc, skill) => {
    const category = skill.category || 'other';
    if (!acc[category]) acc[category] = [];
    acc[category].push(skill);
    return acc;
  }, {} as Record<string, Skill[]>);

  const getLevelLabel = (level: number) => {
    if (language === 'fr') {
      const labels = ['', 'Débutant', 'Intermédiaire', 'Bon', 'Très bon', 'Expert'];
      return labels[level] || '';
    } else {
      const labels = ['', 'Beginner', 'Intermediate', 'Good', 'Very Good', 'Expert'];
      return labels[level] || '';
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <Wrench className="w-5 h-5 text-blue-600" />
          {t.cv.skills}
        </h2>
      </div>

      <div className="space-y-4">
        {categories.map((category) => {
          const skills = groupedSkills[category.value] || [];
          if (skills.length === 0) return null;

          return (
            <div key={category.value}>
              <h3 className="text-sm font-medium text-gray-500 mb-2">
                {category.label}
              </h3>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <div
                    key={skill.id}
                    className="group relative flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg border border-gray-200 hover:border-blue-300 transition-colors"
                  >
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((level) => (
                        <div
                          key={level}
                          className={`w-2 h-2 rounded-full ${
                            level <= skill.level ? 'bg-blue-600' : 'bg-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-700">{skill.name}</span>
                    <button
                      onClick={() => deleteSkill(skill.id)}
                      className="p-1 hover:bg-red-50 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="w-3 h-3 text-red-500" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        <div className="border-t border-gray-200 pt-4">
          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-1">
              <input
                type="text"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddSkill();
                  }
                }}
                placeholder={t.cv.skillName}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
              />
            </div>
            <div>
              <select
                value={newSkillCategory}
                onChange={(e) => setNewSkillCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
              >
                {categories.map((category) => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <select
                value={newSkillLevel}
                onChange={(e) => setNewSkillLevel(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
              >
                {[1, 2, 3, 4, 5].map((level) => (
                  <option key={level} value={level}>
                    {getLevelLabel(level)}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <button
            onClick={handleAddSkill}
            className="mt-3 w-full flex items-center justify-center gap-2 px-4 py-2.5 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span className="text-sm font-medium">{t.common.add}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
