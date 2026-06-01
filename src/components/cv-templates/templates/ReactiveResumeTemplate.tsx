/**
 * ReactiveResumeTemplate — Minimaliste, ultra-propre, développeur/ingénieur, PDF-optimisé
 * Inspiré par Reactive Resume : extrêmement épuré, monospaced, professionnel, excellent pour techs
 */
import { buildTemplateContext } from '../core/buildContext';
import { TemplateShell } from '../core/TemplateShell';
import { SectionTitle } from '../core/sections';
import { HeaderMinimal, ExperienceBlock, EducationBlock, SkillsSection } from '../core/components';
import { TemplateProps } from '../core/types';

export function ReactiveResumeTemplate(props: TemplateProps) {
  const ctx = buildTemplateContext(props);
  const { info, experiences, education, skills, labels } = ctx;
  const showPhoto = ctx.customization.showPhoto !== false && !!info.photo;

  return (
    <TemplateShell
      ctx={ctx}
      style={{
        fontFamily: '"Menlo", "Monaco", "Courier New", monospace',
        fontSize: '10px',
      }}
    >
      <HeaderMinimal ctx={ctx} showPhoto={showPhoto} />

      <div className="space-y-4 text-xs">
        {info.summary && (
          <section>
            <SectionTitle title={labels.summary} color={ctx.palette.primary} variant="minimal" />
            <p className="text-gray-700 leading-relaxed">{info.summary}</p>
          </section>
        )}

        {experiences.length > 0 && (
          <section>
            <SectionTitle title={labels.experience} color={ctx.palette.primary} variant="minimal" />
            <div>
              {experiences.map((exp) => (
                <ExperienceBlock key={exp.id} exp={exp} ctx={ctx} variant="minimal" />
              ))}
            </div>
          </section>
        )}

        {education.length > 0 && (
          <section>
            <SectionTitle title={labels.education} color={ctx.palette.primary} variant="minimal" />
            <div>
              {education.map((edu) => (
                <EducationBlock key={edu.id} edu={edu} ctx={ctx} variant="minimal" />
              ))}
            </div>
          </section>
        )}

        {skills.length > 0 && (
          <section>
            <SectionTitle title={labels.skills} color={ctx.palette.primary} variant="minimal" />
            <SkillsSection skills={skills} ctx={ctx} variant="tags" />
          </section>
        )}
      </div>

      <footer
        className="mt-8 pt-3 border-t text-xs text-gray-400 text-center"
        style={{ borderColor: ctx.palette.border }}
      >
        {info.email && <span>{info.email}</span>}
      </footer>
    </TemplateShell>
  );
}
