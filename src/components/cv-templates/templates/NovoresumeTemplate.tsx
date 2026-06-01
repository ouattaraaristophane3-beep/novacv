/**
 * NovoresumeTemplate — Très structuré, sections en cartes, équilibre design/professionnel
 * Inspiré par Novoresume : élégant, deux colonnes, excellente hiérarchie visuelle
 */
import { buildTemplateContext } from '../core/buildContext';
import { TemplateShell } from '../core/TemplateShell';
import { SectionTitle } from '../core/sections';
import { HeaderClassic, ExperienceBlock, EducationBlock, SkillsSection } from '../core/components';
import { TemplateProps } from '../core/types';

export function NovoresumeTemplate(props: TemplateProps) {
  const ctx = buildTemplateContext(props);
  const { info, palette, experiences, education, skills, labels } = ctx;
  const showPhoto = ctx.customization.showPhoto !== false && !!info.photo;

  return (
    <TemplateShell ctx={ctx} style={{ backgroundColor: '#f8fafc' }} className="!bg-slate-50">
      <div
        className="bg-white rounded-lg shadow-sm border p-8"
        style={{ borderColor: palette.border, minHeight: 'calc(297mm - 48px)' }}
      >
        <HeaderClassic ctx={ctx} showPhoto={showPhoto} photoPosition="right" />

        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2">
            {info.summary && (
              <section className="mb-6">
                <p className="text-xs text-gray-700 leading-relaxed border-l-4 pl-4 italic" style={{ borderColor: palette.primary }}>
                  {info.summary}
                </p>
              </section>
            )}

            {experiences.length > 0 && (
              <section className="mb-6">
                <SectionTitle title={labels.experience} color={palette.primary} variant="line" />
                <div>
                  {experiences.map((exp) => (
                    <ExperienceBlock key={exp.id} exp={exp} ctx={ctx} variant="bold" />
                  ))}
                </div>
              </section>
            )}

            {education.length > 0 && (
              <section>
                <SectionTitle title={labels.education} color={palette.primary} variant="line" />
                <div>
                  {education.map((edu) => (
                    <EducationBlock key={edu.id} edu={edu} ctx={ctx} variant="bold" />
                  ))}
                </div>
              </section>
            )}
          </div>

          <div className="col-span-1">
            <div
              className="rounded-lg p-5 h-fit sticky top-0"
              style={{ backgroundColor: palette.secondary }}
            >
              {skills.length > 0 && (
                <section>
                  <SectionTitle title={labels.skills} color={palette.primary} variant="line" />
                  <SkillsSection skills={skills} ctx={ctx} variant="bars" />
                </section>
              )}
            </div>
          </div>
        </div>
      </div>
    </TemplateShell>
  );
}
