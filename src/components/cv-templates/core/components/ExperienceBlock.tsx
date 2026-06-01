/**
 * Composants d'expérience professionnelle réutilisables
 */
import { formatDate } from '../../../../lib/templateComponents';
import { TemplateContext } from '../types';
import { Experience } from '../types';

interface ExperienceBlockProps {
  exp: Experience;
  ctx: TemplateContext;
  variant?: 'modern' | 'compact' | 'timeline' | 'bold' | 'minimal';
}

export function ExperienceBlockModern({ exp, ctx, variant = 'modern' }: ExperienceBlockProps) {
  const start = formatDate(exp.start_date, ctx.lang);
  const end = exp.is_current ? ctx.labels.present : formatDate(exp.end_date, ctx.lang);
  const achievements = Array.isArray(exp.achievements) ? exp.achievements : [];

  const spacing = variant === 'compact' ? 10 : 16;

  return (
    <div style={{ marginBottom: `${spacing * ctx.scale}px` }}>
      <div className="flex justify-between items-start gap-3 mb-1">
        <div className="flex-1">
          <p className="font-bold text-sm text-gray-900">{exp.position}</p>
          <p className="text-xs font-semibold mt-0.5" style={{ color: ctx.palette.primary }}>
            {exp.company}
            {exp.location ? ` · ${exp.location}` : ''}
          </p>
        </div>
        <span className="text-xs text-gray-500 whitespace-nowrap font-medium">
          {start} – {end}
        </span>
      </div>
      {exp.description && (
        <p className="text-xs text-gray-600 leading-relaxed mt-2">{exp.description}</p>
      )}
      {achievements.length > 0 && (
        <ul className="mt-2 space-y-1 text-xs text-gray-600 list-disc ml-4">
          {achievements.map((a, i) => (
            <li key={i} className="leading-snug">{String(a)}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function ExperienceBlockBold({ exp, ctx }: ExperienceBlockProps) {
  const start = formatDate(exp.start_date, ctx.lang);
  const end = exp.is_current ? ctx.labels.present : formatDate(exp.end_date, ctx.lang);
  const achievements = Array.isArray(exp.achievements) ? exp.achievements : [];

  return (
    <div className="mb-5 pb-4 border-b" style={{ borderColor: ctx.palette.border }}>
      <div className="flex justify-between gap-3 mb-1">
        <div>
          <p className="font-black text-xs uppercase tracking-wide text-gray-900">{exp.position}</p>
          <p className="font-bold text-xs mt-1" style={{ color: ctx.palette.primary }}>
            {exp.company}
          </p>
          {exp.location && (
            <p className="text-xs text-gray-500">{exp.location}</p>
          )}
        </div>
        <div className="text-right text-xs font-medium text-gray-500 whitespace-nowrap">
          <div>{start}</div>
          <div>{end}</div>
        </div>
      </div>
      {exp.description && (
        <p className="text-xs text-gray-700 leading-snug mt-2">{exp.description}</p>
      )}
      {achievements.length > 0 && (
        <ul className="mt-2 space-y-1 text-xs text-gray-600">
          {achievements.map((a, i) => (
            <li key={i}>• {String(a)}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function ExperienceBlockTimeline({ exp, ctx }: ExperienceBlockProps) {
  const start = formatDate(exp.start_date, ctx.lang);
  const end = exp.is_current ? ctx.labels.present : formatDate(exp.end_date, ctx.lang);
  const achievements = Array.isArray(exp.achievements) ? exp.achievements : [];

  return (
    <div className="relative pl-8 pb-6">
      <div
        className="absolute left-0 top-2 w-3 h-3 rounded-full border-2 bg-white"
        style={{ borderColor: ctx.palette.primary }}
      />
      <div className="absolute left-1.5 top-5 bottom-0 w-px" style={{ backgroundColor: `${ctx.palette.primary}20` }} />

      <div className="flex justify-between gap-3 mb-1">
        <div>
          <p className="font-bold text-sm text-gray-900">{exp.position}</p>
          <p className="text-xs font-semibold mt-0.5" style={{ color: ctx.palette.primary }}>
            {exp.company}
          </p>
        </div>
        <span className="text-xs text-gray-500 font-medium whitespace-nowrap">
          {start} – {end}
        </span>
      </div>
      {exp.description && (
        <p className="text-xs text-gray-600 leading-relaxed mt-1">{exp.description}</p>
      )}
      {achievements.length > 0 && (
        <ul className="mt-1.5 space-y-0.5 text-xs text-gray-600 list-disc ml-3">
          {achievements.map((a, i) => (
            <li key={i}>{String(a)}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function ExperienceBlockMinimal({ exp, ctx }: ExperienceBlockProps) {
  const start = formatDate(exp.start_date, ctx.lang);

  return (
    <div className="mb-4">
      <div className="flex justify-between gap-3">
        <div>
          <p className="font-semibold text-xs">{exp.position}</p>
          <p className="text-xs text-gray-600">{exp.company}</p>
        </div>
        <span className="text-xs text-gray-500 whitespace-nowrap">{start}</span>
      </div>
      {exp.description && (
        <p className="text-xs text-gray-600 mt-1 leading-snug">{exp.description}</p>
      )}
    </div>
  );
}

export function ExperienceBlock(props: ExperienceBlockProps) {
  switch (props.variant) {
    case 'bold':
      return <ExperienceBlockBold {...props} />;
    case 'timeline':
      return <ExperienceBlockTimeline {...props} />;
    case 'minimal':
      return <ExperienceBlockMinimal {...props} />;
    case 'compact':
      return <ExperienceBlockModern {...props} variant="compact" />;
    default:
      return <ExperienceBlockModern {...props} />;
  }
}
