import { formatBirthDate } from '../../../lib/cvTypes';
import { formatDate } from '../../../lib/templateComponents';
import type { SectionId } from '../../../lib/cvCustomization';
import { TemplateContext } from './types';
import type { Experience, Education, Skill } from './types';

export function SectionTitle({
  title,
  color,
  variant = 'line',
}: {
  title: string;
  color: string;
  variant?: 'line' | 'pill' | 'minimal' | 'sidebar';
}) {
  if (variant === 'pill') {
    return (
      <h2
        className="text-[10px] font-bold uppercase tracking-[0.2em] mb-3 px-3 py-1.5 rounded-md text-white inline-block"
        style={{ backgroundColor: color }}
      >
        {title}
      </h2>
    );
  }
  if (variant === 'minimal') {
    return (
      <h2 className="text-[11px] font-bold uppercase tracking-widest mb-3 text-gray-900">{title}</h2>
    );
  }
  if (variant === 'sidebar') {
    return (
      <h2
        className="text-[10px] font-bold uppercase tracking-wider mb-3 pb-1 border-b"
        style={{ borderColor: `${color}40`, color }}
      >
        {title}
      </h2>
    );
  }
  return (
    <h2
      className="text-[11px] font-bold uppercase tracking-wider mb-3 pb-1.5 border-b-2"
      style={{ borderColor: color, color }}
    >
      {title}
    </h2>
  );
}

export function ContactRow({ ctx, light = false }: { ctx: TemplateContext; light?: boolean }) {
  const { info, customization, labels } = ctx;
  const items: string[] = [];
  if (info.email) items.push(info.email);
  if (info.phone) items.push(info.phone);
  if (info.address) items.push(info.address);
  if (customization.showBirthDate && info.birthDate) {
    items.push(`${labels.birthDate}: ${formatBirthDate(info.birthDate, ctx.lang)}`);
  }

  if (items.length === 0) return null;
  return (
    <p
      className={`text-[10px] flex flex-wrap gap-x-3 gap-y-1 ${light ? 'text-white/90' : 'text-gray-600'}`}
    >
      {items.map((item, i) => (
        <span key={i}>{item}</span>
      ))}
    </p>
  );
}

export function SocialLinks({ ctx, light = false }: { ctx: TemplateContext; light?: boolean }) {
  const { info, palette: pal } = ctx;
  const links = [
    info.linkedin && { label: 'LinkedIn', href: info.linkedin },
    info.github && { label: 'GitHub', href: info.github },
    info.portfolio && { label: 'Portfolio', href: info.portfolio },
  ].filter(Boolean) as { label: string; href: string }[];

  if (!links.length) return null;
  return (
    <div className={`flex flex-wrap gap-2 mt-2 text-[9px] ${light ? 'text-white/85' : ''}`}>
      {links.map((l) => (
        <span
          key={l.label}
          className={light ? '' : 'font-medium'}
          style={light ? undefined : { color: pal.primary }}
        >
          {l.label}: {l.href.replace(/^https?:\/\//, '')}
        </span>
      ))}
    </div>
  );
}

function ExperienceItem({
  exp,
  ctx,
  variant = 'default',
}: {
  exp: Experience;
  ctx: TemplateContext;
  variant?: 'default' | 'timeline' | 'compact';
}) {
  const start = formatDate(exp.start_date, ctx.lang);
  const end = exp.is_current ? ctx.labels.present : formatDate(exp.end_date, ctx.lang);
  const achievements = Array.isArray(exp.achievements) ? exp.achievements : [];

  if (variant === 'timeline') {
    return (
      <div className="relative pl-5 pb-4 last:pb-0">
        <div
          className="absolute left-0 top-1.5 w-2.5 h-2.5 rounded-full border-2 bg-white"
          style={{ borderColor: ctx.palette.primary }}
        />
        <div className="absolute left-[4px] top-4 bottom-0 w-px bg-gray-200 last:hidden" />
        <div className="flex justify-between gap-2 flex-wrap">
          <div>
            <p className="font-semibold text-[11px]">{exp.position}</p>
            <p className="text-[10px] font-medium" style={{ color: ctx.palette.primary }}>
              {exp.company}
            </p>
          </div>
          <span className="text-[9px] text-gray-500 whitespace-nowrap">
            {start} – {end}
          </span>
        </div>
        {exp.description && (
          <p className="text-[10px] text-gray-600 mt-1 leading-snug">{exp.description}</p>
        )}
        {achievements.length > 0 && (
          <ul className="mt-1 space-y-0.5 text-[9px] text-gray-600 list-disc ml-3">
            {achievements.map((a, i) => (
              <li key={i}>{String(a)}</li>
            ))}
          </ul>
        )}
      </div>
    );
  }

  return (
    <div style={{ marginBottom: variant === 'compact' ? 10 * ctx.scale : 14 * ctx.scale }}>
      <div className="flex justify-between items-start gap-2">
        <div>
          <p className="font-semibold text-[11px] text-gray-900">{exp.position}</p>
          <p className="text-[10px] font-medium" style={{ color: ctx.palette.primary }}>
            {exp.company}
            {exp.location ? ` · ${exp.location}` : ''}
          </p>
        </div>
        <span className="text-[9px] text-gray-500 shrink-0">{start} – {end}</span>
      </div>
      {exp.description && (
        <p className="text-[10px] text-gray-600 mt-1 leading-snug">{exp.description}</p>
      )}
      {achievements.length > 0 && (
        <ul className="mt-1.5 space-y-0.5 text-[9px] text-gray-600">
          {achievements.map((a, i) => (
            <li key={i} className="flex gap-1.5">
              <span style={{ color: ctx.palette.primary }}>▸</span>
              <span>{String(a)}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function EducationItem({ edu, ctx }: { edu: Education; ctx: TemplateContext }) {
  const start = formatDate(edu.start_date, ctx.lang);
  const end = edu.is_current ? ctx.labels.present : formatDate(edu.end_date, ctx.lang);
  return (
    <div style={{ marginBottom: 12 * ctx.scale }}>
      <div className="flex justify-between gap-2">
        <div>
          <p className="font-semibold text-[11px]">{edu.degree}</p>
          <p className="text-[10px] text-gray-600">
            {edu.institution}
            {edu.field ? ` — ${edu.field}` : ''}
          </p>
        </div>
        <span className="text-[9px] text-gray-500 shrink-0">{start} – {end}</span>
      </div>
      {edu.description && (
        <p className="text-[10px] text-gray-600 mt-0.5">{edu.description}</p>
      )}
    </div>
  );
}

function SkillsBlock({
  skills,
  ctx,
  variant = 'bars',
}: {
  skills: Skill[];
  ctx: TemplateContext;
  variant?: 'bars' | 'tags' | 'dots';
}) {
  if (!skills.length) return null;
  const categories = Array.from(new Set(skills.map((s) => s.category || 'General')));

  return (
    <div className="space-y-3">
      {categories.map((cat) => {
        const items = skills.filter((s) => (s.category || 'General') === cat);
        return (
          <div key={cat}>
            <p className="text-[9px] font-bold uppercase tracking-wide mb-1.5" style={{ color: ctx.palette.primary }}>
              {cat}
            </p>
            {variant === 'tags' ? (
              <div className="flex flex-wrap gap-1.5">
                {items.map((s) => (
                  <span
                    key={s.id}
                    className="text-[9px] px-2 py-0.5 rounded-full"
                    style={{ backgroundColor: ctx.palette.secondary, color: ctx.palette.text }}
                  >
                    {s.name}
                  </span>
                ))}
              </div>
            ) : (
              <div className="space-y-1.5">
                {items.map((s) => (
                  <div key={s.id} className="flex justify-between items-center gap-2">
                    <span className="text-[10px]">{s.name}</span>
                    <div className="flex gap-0.5">
                      {[1, 2, 3, 4, 5].map((n) => (
                        <div
                          key={n}
                          className="w-1.5 h-1.5 rounded-full"
                          style={{
                            backgroundColor:
                              n <= (s.level || 3) ? ctx.palette.primary : '#e5e7eb',
                          }}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function ExtraBlock({ ctx }: { ctx: TemplateContext }) {
  const { info, labels, palette } = ctx;
  const blocks: { key: string; title: string; text?: string }[] = [
    { key: 'languages', title: labels.languages, text: info.languages },
    { key: 'certifications', title: labels.certifications, text: info.certifications },
    { key: 'projects', title: labels.projects, text: info.projects },
    { key: 'interests', title: labels.interests, text: info.interests },
    { key: 'references', title: labels.references, text: info.references },
  ].filter((b) => b.text?.trim());

  if (!blocks.length) return null;
  return (
    <div className="space-y-3">
      {blocks.map((b) => (
        <div key={b.key}>
          <p className="text-[9px] font-bold uppercase mb-1" style={{ color: palette.primary }}>
            {b.title}
          </p>
          <p className="text-[10px] text-gray-600 whitespace-pre-line leading-snug">{b.text}</p>
        </div>
      ))}
    </div>
  );
}

export function RenderSections({
  ctx,
  sectionTitleVariant = 'line',
  experienceVariant = 'default',
  skillsVariant = 'bars',
}: {
  ctx: TemplateContext;
  sectionTitleVariant?: 'line' | 'pill' | 'minimal' | 'sidebar';
  experienceVariant?: 'default' | 'timeline' | 'compact';
  skillsVariant?: 'bars' | 'tags' | 'dots';
}) {
  const order = ctx.customization.sectionOrder ?? [];
  const { experiences, education, skills, info, labels, palette } = ctx;

  const renderSection = (id: SectionId) => {
    switch (id) {
      case 'summary':
        return info.summary ? (
          <section key="summary" style={{ marginBottom: 16 * ctx.scale }}>
            <SectionTitle title={labels.summary} color={palette.primary} variant={sectionTitleVariant} />
            <p className="text-[10px] text-gray-600 leading-relaxed">{info.summary}</p>
          </section>
        ) : null;
      case 'experience':
        return experiences.length > 0 ? (
          <section key="experience" style={{ marginBottom: 16 * ctx.scale }}>
            <SectionTitle title={labels.experience} color={palette.primary} variant={sectionTitleVariant} />
            {experiences.map((exp) => (
              <ExperienceItem key={exp.id} exp={exp} ctx={ctx} variant={experienceVariant} />
            ))}
          </section>
        ) : null;
      case 'education':
        return education.length > 0 ? (
          <section key="education" style={{ marginBottom: 16 * ctx.scale }}>
            <SectionTitle title={labels.education} color={palette.primary} variant={sectionTitleVariant} />
            {education.map((edu) => (
              <EducationItem key={edu.id} edu={edu} ctx={ctx} />
            ))}
          </section>
        ) : null;
      case 'skills':
        return skills.length > 0 ? (
          <section key="skills" style={{ marginBottom: 16 * ctx.scale }}>
            <SectionTitle title={labels.skills} color={palette.primary} variant={sectionTitleVariant} />
            <SkillsBlock skills={skills} ctx={ctx} variant={skillsVariant} />
          </section>
        ) : null;
      case 'extras':
        return (
          <section key="extras">
            <ExtraBlock ctx={ctx} />
          </section>
        );
      default:
        return null;
    }
  };

  return <>{order.map((id) => renderSection(id))}</>;
}
