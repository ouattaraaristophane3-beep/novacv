/**
 * ResumeIOStyleTemplate — Moderne européen, épuré, corporate, ATS-friendly
 * Inspiré par Resume.io : propre, professionnel, une colonne, excellent pour les recruteurs
 */
import { buildTemplateContext } from '../core/buildContext';
import { TemplateShell } from '../core/TemplateShell';
import { SectionTitle } from '../core/sections';
import { HeaderModern, ExperienceBlock, EducationBlock, SkillsSection } from '../core/components';
import { TemplateProps } from '../core/types';

export function ResumeIOStyleTemplate(props: TemplateProps) {
  const ctx = buildTemplateContext(props);
  const { info, palette, experiences, education, skills, labels } = ctx;
  const showPhoto = ctx.customization.showPhoto !== false && !!info.photo;

  return (
    <TemplateShell ctx={ctx}>
      <HeaderModern ctx={ctx} showPhoto={showPhoto} photoPosition="left" />

      {info.summary && (
        <section className="mb-6 pb-5 border-b" style={{ borderColor: palette.border }}>
          <SectionTitle title={labels.summary} color={palette.primary} variant="line" />
          <p className="text-xs leading-relaxed text-gray-700">{info.summary}</p>
        </section>
      )}

      {experiences.length > 0 && (
        <section className="mb-6 pb-5 border-b" style={{ borderColor: palette.border }}>
          <SectionTitle title={labels.experience} color={palette.primary} variant="line" />
          <div>
            {experiences.map((exp) => (
              <ExperienceBlock key={exp.id} exp={exp} ctx={ctx} variant="modern" />
            ))}
          </div>
        </section>
      )}

      {education.length > 0 && (
        <section className="mb-6 pb-5 border-b" style={{ borderColor: palette.border }}>
          <SectionTitle title={labels.education} color={palette.primary} variant="line" />
          <div>
            {education.map((edu) => (
              <EducationBlock key={edu.id} edu={edu} ctx={ctx} variant="modern" />
            ))}
          </div>
        </section>
      )}

      {skills.length > 0 && (
        <section className="mb-6">
          <SectionTitle title={labels.skills} color={palette.primary} variant="line" />
          <SkillsSection skills={skills} ctx={ctx} variant="tags" />
        </section>
      )}
    </TemplateShell>
  );
}
