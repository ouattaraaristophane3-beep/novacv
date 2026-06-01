/**
 * CanvaPremiumTemplate — Premium, élégant, sidebar dégradé, espacements généreux
 * Inspiré par Canva : design luxe, sidebar moderne avec gradient, photo élégante
 */
import { buildTemplateContext } from '../core/buildContext';
import { TemplateShell } from '../core/TemplateShell';
import { SectionTitle, ContactRow, SocialLinks } from '../core/sections';
import { SidebarModern, ExperienceBlock, EducationBlock, SkillsSection } from '../core/components';
import { TemplateProps } from '../core/types';

export function CanvaPremiumTemplate(props: TemplateProps) {
  const ctx = buildTemplateContext(props);
  const { info, palette, customization, experiences, education, skills, labels } = ctx;
  const showSidebar = customization.showSidebar !== false;
  const showPhoto = customization.showPhoto !== false && Boolean(info.photo);

  if (!showSidebar) {
    return (
      <TemplateShell ctx={ctx} className="!p-0">
        <div className="p-8">
          <header className="mb-6 pb-5 border-b-2" style={{ borderColor: palette.primary }}>
            <div className="flex gap-5 items-start">
              {showPhoto && (
                <img
                  src={info.photo}
                  alt=""
                  className="w-24 h-24 rounded-xl object-cover border-2"
                  style={{ borderColor: palette.border }}
                />
              )}
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
                  {info.firstName} <span style={{ color: palette.primary }}>{info.lastName}</span>
                </h1>
                {info.jobTitle && (
                  <p className="text-xs font-semibold mt-1 uppercase" style={{ color: palette.primary }}>
                    {info.jobTitle}
                  </p>
                )}
                <div className="mt-3">
                  <ContactRow ctx={ctx} />
                  <SocialLinks ctx={ctx} />
                </div>
              </div>
            </div>
          </header>

          {info.summary && (
            <section className="mb-5 pb-5 border-b" style={{ borderColor: palette.border }}>
              <p className="text-xs text-gray-700 leading-relaxed italic border-l-4 pl-4" style={{ borderColor: palette.primary }}>
                {info.summary}
              </p>
            </section>
          )}

          {experiences.length > 0 && (
            <section className="mb-5 pb-5 border-b" style={{ borderColor: palette.border }}>
              <SectionTitle title={labels.experience} color={palette.primary} variant="pill" />
              <div>
                {experiences.map((exp) => (
                  <ExperienceBlock key={exp.id} exp={exp} ctx={ctx} variant="modern" />
                ))}
              </div>
            </section>
          )}

          {education.length > 0 && (
            <section className="mb-5">
              <SectionTitle title={labels.education} color={palette.primary} variant="pill" />
              <div>
                {education.map((edu) => (
                  <EducationBlock key={edu.id} edu={edu} ctx={ctx} variant="modern" />
                ))}
              </div>
            </section>
          )}

          {skills.length > 0 && (
            <section>
              <SectionTitle title={labels.skills} color={palette.primary} variant="pill" />
              <SkillsSection skills={skills} ctx={ctx} variant="tags" />
            </section>
          )}
        </div>
      </TemplateShell>
    );
  }

  return (
    <TemplateShell ctx={ctx} className="!p-0 flex min-h-[297mm]">
      <SidebarModern ctx={ctx} showPhoto={showPhoto} showSkills={true} skillsVariant="tags" />

      <main className="flex-1 p-8 bg-white overflow-hidden">
        {info.summary && (
          <p className="text-xs text-gray-600 leading-relaxed mb-6 italic border-l-4 pl-4" style={{ borderColor: palette.primary }}>
            {info.summary}
          </p>
        )}

        {experiences.length > 0 && (
          <section className="mb-6">
            <SectionTitle title={labels.experience} color={palette.primary} variant="pill" />
            <div>
              {experiences.map((exp) => (
                <ExperienceBlock key={exp.id} exp={exp} ctx={ctx} variant="modern" />
              ))}
            </div>
          </section>
        )}

        {education.length > 0 && (
          <section className="mb-6">
            <SectionTitle title={labels.education} color={palette.primary} variant="pill" />
            <div>
              {education.map((edu) => (
                <EducationBlock key={edu.id} edu={edu} ctx={ctx} variant="modern" />
              ))}
            </div>
          </section>
        )}
      </main>
    </TemplateShell>
  );
}
