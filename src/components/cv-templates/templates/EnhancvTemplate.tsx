/**
 * EnhancvTemplate — Moderne, créatif, timeline élégante
 * Inspiré par Enhancv : design créatif, header dégradé, timeline propre, couleurs dynamiques
 */
import { buildTemplateContext } from '../core/buildContext';
import { TemplateShell } from '../core/TemplateShell';
import { SectionTitle } from '../core/sections';
import { HeaderCreative, ExperienceBlock, EducationBlock, SkillsSection } from '../core/components';
import { TemplateProps } from '../core/types';

export function EnhancvTemplate(props: TemplateProps) {
  const ctx = buildTemplateContext(props);
  const { info, palette, customization, experiences, education, skills, labels } = ctx;
  const showPhoto = customization.showPhoto !== false && !!info.photo;

  return (
    <TemplateShell ctx={ctx} className="!p-0 overflow-hidden">
      <HeaderCreative ctx={ctx} showPhoto={showPhoto} />

      <div className="px-8 py-8">
        {info.summary && (
          <div
            className="mb-8 p-5 rounded-xl -mt-10 relative z-10 bg-white shadow-lg border-2"
            style={{ borderColor: palette.border }}
          >
            <p className="text-xs text-gray-700 leading-relaxed italic">{info.summary}</p>
          </div>
        )}

        {experiences.length > 0 && (
          <section className="mb-8">
            <SectionTitle title={labels.experience} color={palette.primary} variant="line" />
            <div className="mt-3">
              {experiences.map((exp) => (
                <ExperienceBlock key={exp.id} exp={exp} ctx={ctx} variant="timeline" />
              ))}
            </div>
          </section>
        )}

        <div className="grid grid-cols-2 gap-8">
          {education.length > 0 && (
            <section>
              <SectionTitle title={labels.education} color={palette.primary} variant="line" />
              <div>
                {education.map((edu) => (
                  <EducationBlock key={edu.id} edu={edu} ctx={ctx} variant="modern" />
                ))}
              </div>
            </section>
          )}

          {skills.length > 0 && (
            <section>
              <SectionTitle title={labels.skills} color={palette.primary} variant="line" />
              <SkillsSection skills={skills} ctx={ctx} variant="badges" />
            </section>
          )}
        </div>
      </div>
    </TemplateShell>
  );
}
