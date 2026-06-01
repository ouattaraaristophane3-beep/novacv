/**
 * Composants d'éducation réutilisables
 */
import { formatDate } from '../../../../lib/templateComponents';
import { TemplateContext } from '../types';
import { Education } from '../types';

interface EducationBlockProps {
  edu: Education;
  ctx: TemplateContext;
  variant?: 'modern' | 'compact' | 'bold' | 'minimal';
}

export function EducationBlockModern({ edu, ctx, variant = 'modern' }: EducationBlockProps) {
  const start = formatDate(edu.start_date, ctx.lang);
  const end = edu.is_current ? ctx.labels.present : formatDate(edu.end_date, ctx.lang);

  const spacing = variant === 'compact' ? 12 : 14;

  return (
    <div style={{ marginBottom: `${spacing * ctx.scale}px` }}>
      <p className="font-bold text-sm text-gray-900">{edu.degree}</p>
      <p className="text-xs font-semibold mt-0.5" style={{ color: ctx.palette.primary }}>
        {edu.institution}
      </p>
      {edu.field && (
        <p className="text-xs text-gray-600">{edu.field}</p>
      )}
      <p className="text-xs text-gray-500 mt-1">
        {start} – {end}
      </p>
      {edu.description && (
        <p className="text-xs text-gray-600 leading-relaxed mt-1">{edu.description}</p>
      )}
    </div>
  );
}

export function EducationBlockBold({ edu, ctx }: EducationBlockProps) {
  const start = formatDate(edu.start_date, ctx.lang);
  const end = edu.is_current ? ctx.labels.present : formatDate(edu.end_date, ctx.lang);

  return (
    <div className="mb-4 pb-3 border-b" style={{ borderColor: ctx.palette.border }}>
      <p className="font-black text-xs uppercase tracking-wide">{edu.degree}</p>
      <p className="font-bold text-xs mt-1" style={{ color: ctx.palette.primary }}>
        {edu.institution}
      </p>
      {edu.field && (
        <p className="text-xs text-gray-600">{edu.field}</p>
      )}
      <p className="text-xs text-gray-500 mt-1 font-medium">
        {start} – {end}
      </p>
    </div>
  );
}

export function EducationBlockMinimal({ edu, ctx }: EducationBlockProps) {
  const start = formatDate(edu.start_date, ctx.lang);

  return (
    <div className="mb-3">
      <p className="font-semibold text-xs">{edu.degree}</p>
      <p className="text-xs text-gray-600">{edu.institution}</p>
      {edu.field && (
        <p className="text-xs text-gray-500">{edu.field}</p>
      )}
      <p className="text-xs text-gray-500 mt-0.5">{start}</p>
    </div>
  );
}

export function EducationBlock(props: EducationBlockProps) {
  switch (props.variant) {
    case 'bold':
      return <EducationBlockBold {...props} />;
    case 'minimal':
      return <EducationBlockMinimal {...props} />;
    case 'compact':
      return <EducationBlockModern {...props} variant="compact" />;
    default:
      return <EducationBlockModern {...props} />;
  }
}
