import { Layout, Palette, Shield } from 'lucide-react';
import { useCV } from '../../context/CVContext';
import { Language, translations } from '../../lib/translations';
import { templateMetadata, getAvailablePalettes, colorPalettes } from '../../lib/themes';
import { getAllTemplates } from '../cv-templates/templates';
import { normalizePalette, normalizeTemplate } from '../../lib/cvTypes';

interface TemplatePalettePanelProps {
  language: Language;
}

export function TemplatePalettePanel({ language }: TemplatePalettePanelProps) {
  const { cvData, updateCVLocal } = useCV();
  const t = translations[language];
  const cv = cvData.cv;
  if (!cv) return null;

  const currentTemplate = normalizeTemplate(cv.template);
  const currentPalette = normalizePalette(cv.color_theme);
  const templates = getAllTemplates();
  const palettes = getAvailablePalettes();

  return (
    <>
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Layout className="w-5 h-5 text-gray-600" />
          <h3 className="font-semibold text-gray-900">{t.templatesTab}</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {templates.map((key) => {
            const meta = templateMetadata[key];
            const selected = currentTemplate === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => updateCVLocal({ template: key })}
                className={`text-left p-4 rounded-xl border-2 transition-all hover:shadow-md ${
                  selected
                    ? 'border-blue-600 bg-blue-50 shadow-sm'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-gray-400">{meta.brand}</p>
                    <p className="text-sm font-semibold text-gray-900">{meta.name}</p>
                  </div>
                  {meta.atsCompatible && (
                    <Shield
                      className="w-4 h-4 text-emerald-600 shrink-0"
                      aria-label="Compatible ATS"
                    />
                  )}
                </div>
                <p className="text-xs text-gray-500 line-clamp-2">{meta.description}</p>
              </button>
            );
          })}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Palette className="w-5 h-5 text-gray-600" />
          <h3 className="font-semibold text-gray-900">{t.themeTab}</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {palettes.map(({ key, name }) => {
            const palette = colorPalettes[key];
            const selected = currentPalette === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => updateCVLocal({ color_theme: key })}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg border-2 transition-all ${
                  selected
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div
                  className="w-5 h-5 rounded-full border border-gray-200"
                  style={{ backgroundColor: palette?.primary }}
                />
                <span className="text-sm font-medium text-gray-900">{name}</span>
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
}
