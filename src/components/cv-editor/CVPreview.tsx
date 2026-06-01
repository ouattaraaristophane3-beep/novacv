import { forwardRef, useEffect, useRef, useState } from 'react';
import { ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';
import { Database } from '../../lib/supabase';
import { normalizeTemplate } from '../../lib/cvTypes';
import { TemplateType } from '../../lib/themes';
import { getTemplate, isValidTemplate } from '../cv-templates/templates';

type CV = Database['public']['Tables']['cvs']['Row'];
type Experience = Database['public']['Tables']['experiences']['Row'];
type Education = Database['public']['Tables']['education']['Row'];
type Skill = Database['public']['Tables']['skills']['Row'];

export interface CVPreviewProps {
  cv: CV;
  experiences: Experience[];
  education: Education[];
  skills: Skill[];
}

const A4_WIDTH_PX = 794;

const CVPreview = forwardRef<HTMLDivElement, CVPreviewProps>(function CVPreview(
  { cv, experiences, education, skills },
  ref
) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [fitScale, setFitScale] = useState(1);
  const [zoom, setZoom] = useState(1);

  const templateKey: TemplateType = isValidTemplate(cv.template)
    ? (cv.template as TemplateType)
    : normalizeTemplate(cv.template);

  const TemplateComponent = getTemplate(templateKey);
  const effectiveScale = fitScale * zoom;

  useEffect(() => {
    const updateScale = () => {
      if (!containerRef.current) return;
      const w = containerRef.current.offsetWidth;
      setFitScale(Math.min((w - 32) / A4_WIDTH_PX, 1));
    };
    updateScale();
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, []);

  const adjustZoom = (delta: number) => {
    setZoom((z) => Math.min(1.5, Math.max(0.5, Math.round((z + delta) * 10) / 10)));
  };

  return (
    <div className="w-full h-full flex flex-col bg-slate-100">
      <div className="flex items-center justify-center gap-2 py-2 px-3 bg-white border-b border-gray-200 print:hidden shrink-0">
        <button
          type="button"
          onClick={() => adjustZoom(-0.1)}
          className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-600"
          title="Zoom arrière"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <span className="text-xs font-medium text-gray-600 min-w-[3rem] text-center">
          {Math.round(zoom * 100)}%
        </span>
        <button
          type="button"
          onClick={() => adjustZoom(0.1)}
          className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-600"
          title="Zoom avant"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => setZoom(1)}
          className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-600"
          title="Réinitialiser"
        >
          <Maximize2 className="w-4 h-4" />
        </button>
      </div>

      <div
        ref={containerRef}
        className="flex-1 overflow-y-auto overflow-x-hidden p-4 flex justify-center items-start"
      >
        <div
          className="transition-transform duration-200 origin-top"
          style={{
            transform: `scale(${effectiveScale})`,
            marginBottom: effectiveScale < 1 ? `${-297 * 3.78 * (1 - effectiveScale)}px` : undefined,
          }}
        >
          <div
            ref={ref}
            id="cv-preview-content"
            className="shadow-2xl shadow-black/10 ring-1 ring-gray-900/5 bg-white"
          >
            <TemplateComponent
              key={`${templateKey}-${cv.color_theme}-${cv.updated_at}`}
              cv={cv}
              experiences={experiences}
              education={education}
              skills={skills}
            />
          </div>
        </div>
      </div>
    </div>
  );
});

export default CVPreview;
