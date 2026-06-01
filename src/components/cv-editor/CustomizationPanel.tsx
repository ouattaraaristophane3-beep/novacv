import { Sliders, Type, Layout, Eye, ListOrdered } from 'lucide-react';
import { useCV } from '../../context/CVContext';
import { Language, translations } from '../../lib/translations';
import {
  CvCustomization,
  FontFamily,
  SpacingDensity,
  SectionId,
  defaultCustomization,
} from '../../lib/cvCustomization';
import { parsePersonalInfo } from '../../lib/cvTypes';
import { Json } from '../../lib/supabase';

interface CustomizationPanelProps {
  language: Language;
}

export function CustomizationPanel({ language }: CustomizationPanelProps) {
  const { cvData, updateCVLocal } = useCV();
  const t = translations[language];
  const cv = cvData.cv;
  if (!cv) return null;

  const info = parsePersonalInfo(cv.personal_info);
  const custom: CvCustomization = {
    ...defaultCustomization,
    ...info.customization,
  };

  const patchCustomization = (patch: Partial<CvCustomization>) => {
    updateCVLocal({
      personal_info: {
        ...info,
        customization: { ...custom, ...patch },
        showBirthDate: patch.showBirthDate ?? info.showBirthDate,
      } as Json,
    });
  };

  const toggleBirthDate = (show: boolean) => {
    updateCVLocal({
      personal_info: {
        ...info,
        showBirthDate: show,
        customization: { ...custom, showBirthDate: show },
      } as Json,
    });
  };

  const sectionLabels: Record<SectionId, string> = {
    summary: t.cv.summary,
    experience: t.cv.experiences,
    education: t.cv.education,
    skills: t.cv.skills,
    extras: language === 'fr' ? 'Sections additionnelles' : 'Additional sections',
  };

  const moveSection = (id: SectionId, dir: -1 | 1) => {
    const order = [...(custom.sectionOrder ?? defaultCustomization.sectionOrder!)];
    const i = order.indexOf(id);
    if (i < 0) return;
    const j = i + dir;
    if (j < 0 || j >= order.length) return;
    [order[i], order[j]] = [order[j], order[i]];
    patchCustomization({ sectionOrder: order });
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-6">
      <div className="flex items-center gap-2">
        <Sliders className="w-5 h-5 text-gray-600" />
        <h3 className="font-semibold text-gray-900">
          {language === 'fr' ? 'Personnalisation' : 'Customization'}
        </h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={custom.showPhoto !== false}
            onChange={(e) => patchCustomization({ showPhoto: e.target.checked })}
            className="rounded border-gray-300 text-blue-600"
          />
          <Eye className="w-4 h-4 text-gray-500" />
          <span className="text-sm text-gray-700">{t.cv.showPhoto}</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={custom.showSidebar !== false}
            onChange={(e) => patchCustomization({ showSidebar: e.target.checked })}
            className="rounded border-gray-300 text-blue-600"
          />
          <Layout className="w-4 h-4 text-gray-500" />
          <span className="text-sm text-gray-700">{t.cv.showSidebar}</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer sm:col-span-2">
          <input
            type="checkbox"
            checked={Boolean(info.showBirthDate ?? custom.showBirthDate)}
            onChange={(e) => toggleBirthDate(e.target.checked)}
            className="rounded border-gray-300 text-blue-600"
          />
          <span className="text-sm text-gray-700">{t.cv.showBirthDate}</span>
        </label>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
            <Type className="w-4 h-4" />
            {t.cv.fontFamily}
          </label>
          <select
            value={custom.fontFamily ?? 'inter'}
            onChange={(e) => patchCustomization({ fontFamily: e.target.value as FontFamily })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
          >
            <option value="inter">Inter (moderne)</option>
            <option value="georgia">Georgia (classique)</option>
            <option value="system">System UI</option>
          </select>
        </div>
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
            <Sliders className="w-4 h-4" />
            {t.cv.spacing}
          </label>
          <select
            value={custom.spacing ?? 'normal'}
            onChange={(e) => patchCustomization({ spacing: e.target.value as SpacingDensity })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
          >
            <option value="compact">{language === 'fr' ? 'Compact' : 'Compact'}</option>
            <option value="normal">{language === 'fr' ? 'Normal' : 'Normal'}</option>
            <option value="relaxed">{language === 'fr' ? 'Aéré' : 'Relaxed'}</option>
          </select>
        </div>
      </div>

      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
          <ListOrdered className="w-4 h-4" />
          {t.cv.sectionOrder}
        </label>
        <ul className="space-y-1">
          {(custom.sectionOrder ?? []).map((id) => (
            <li
              key={id}
              className="flex items-center justify-between gap-2 px-3 py-2 bg-gray-50 rounded-lg text-sm"
            >
              <span>{sectionLabels[id]}</span>
              <div className="flex gap-1">
                <button
                  type="button"
                  onClick={() => moveSection(id, -1)}
                  className="px-2 py-0.5 rounded border border-gray-200 hover:bg-white text-xs"
                >
                  ↑
                </button>
                <button
                  type="button"
                  onClick={() => moveSection(id, 1)}
                  className="px-2 py-0.5 rounded border border-gray-200 hover:bg-white text-xs"
                >
                  ↓
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
