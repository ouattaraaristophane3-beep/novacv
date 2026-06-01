import { useRef } from 'react';
import { translations, Language } from '../../lib/translations';
import { User, Upload, X } from 'lucide-react';
import { useCV } from '../../context/CVContext';
import { parsePersonalInfo, PersonalInfo } from '../../lib/cvTypes';
import { Json } from '../../lib/supabase';

interface PersonalInfoEditorProps {
  language: Language;
}

export function PersonalInfoEditor({ language }: PersonalInfoEditorProps) {
  const { cvData, updateCVLocal } = useCV();
  const t = translations[language];
  const fileInputRef = useRef<HTMLInputElement>(null);

  const personalInfo = parsePersonalInfo(cvData.cv?.personal_info);

  const handleChange = (field: keyof PersonalInfo, value: string | boolean) => {
    updateCVLocal({
      personal_info: {
        ...personalInfo,
        [field]: value,
      } as Json,
    });
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert(language === 'fr' ? 'Veuillez sélectionner une image' : 'Please select an image');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      handleChange('photo', reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = () => {
    handleChange('photo', '');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const textFields: {
    key: keyof PersonalInfo;
    label: string;
    type?: string;
    colSpan?: boolean;
    rows?: number;
    placeholder?: string;
  }[] = [
    { key: 'firstName', label: t.cv.firstName },
    { key: 'lastName', label: t.cv.lastName },
    { key: 'jobTitle', label: t.cv.jobTitle },
    { key: 'email', label: t.common.email, type: 'email' },
    { key: 'phone', label: t.cv.phone, type: 'tel' },
    { key: 'address', label: t.cv.address, colSpan: true },
    { key: 'linkedin', label: 'LinkedIn', colSpan: true, placeholder: 'https://linkedin.com/in/...' },
    { key: 'github', label: 'GitHub', colSpan: true, placeholder: 'https://github.com/...' },
    { key: 'portfolio', label: t.cv.portfolio, colSpan: true },
    {
      key: 'summary',
      label: t.cv.summary,
      colSpan: true,
      rows: 4,
      placeholder:
        language === 'fr'
          ? 'Résumé professionnel en quelques phrases...'
          : 'Professional summary in a few sentences...',
    },
    { key: 'languages', label: t.cv.languagesText, colSpan: true, rows: 2 },
    { key: 'certifications', label: t.cv.certifications, colSpan: true, rows: 2 },
    { key: 'projects', label: t.cv.projects, colSpan: true, rows: 2 },
    { key: 'interests', label: t.cv.interests, colSpan: true, rows: 2 },
    { key: 'references', label: t.cv.references, colSpan: true, rows: 2 },
  ];

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <User className="w-5 h-5 text-blue-600" />
          {t.cv.personalInfo}
        </h2>
      </div>

      <div className="flex gap-6 flex-col sm:flex-row">
        <div className="flex-shrink-0">
          <div className="relative">
            {personalInfo.photo ? (
              <div className="relative group">
                <img
                  src={personalInfo.photo}
                  alt="Profile"
                  className="w-24 h-24 rounded-xl object-cover border-2 border-gray-200"
                />
                <button
                  type="button"
                  onClick={handleRemovePhoto}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-24 h-24 rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center gap-1 hover:border-blue-400 hover:bg-blue-50 transition-colors"
              >
                <Upload className="w-6 h-6 text-gray-400" />
                <span className="text-xs text-gray-500">{t.cv.uploadPhoto}</span>
              </button>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handlePhotoUpload}
              className="hidden"
            />
          </div>
        </div>

        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {textFields.map((field) => (
            <div key={field.key} className={field.colSpan ? 'sm:col-span-2' : ''}>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                {field.label}
              </label>
              {field.rows ? (
                <textarea
                  value={(personalInfo[field.key] as string) || ''}
                  onChange={(e) => handleChange(field.key, e.target.value)}
                  rows={field.rows}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                  placeholder={field.placeholder}
                />
              ) : (
                <input
                  type={field.type || 'text'}
                  value={(personalInfo[field.key] as string) || ''}
                  onChange={(e) => handleChange(field.key, e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder={field.placeholder}
                />
              )}
            </div>
          ))}

          <div className="sm:col-span-2 border-t border-gray-100 pt-4 space-y-3">
            <label className="block text-sm font-medium text-gray-700">
              {t.cv.birthDate}
            </label>
            <input
              type="date"
              value={personalInfo.birthDate || ''}
              onChange={(e) => handleChange('birthDate', e.target.value)}
              className="w-full max-w-xs px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={Boolean(personalInfo.showBirthDate)}
                onChange={(e) => handleChange('showBirthDate', e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">{t.cv.showBirthDate}</span>
            </label>
            <p className="text-xs text-gray-500">{t.cv.birthDateHint}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
