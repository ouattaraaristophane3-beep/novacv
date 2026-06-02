/**
 * SidebarElegantTemplate — Layout 2 colonnes avec barre latérale ocre/beige
 * Inspiré par le design d'Elvire : sidebar chaleureux, contenu structuré, hiérarchie claire
 */
import { buildTemplateContext } from '../core/buildContext';
import { TemplateShell } from '../core/TemplateShell';
import { ExperienceBlock, EducationBlock } from '../core/components';
import { TemplateProps } from '../core/types';

export function SidebarElegantTemplate(props: TemplateProps) {
  const ctx = buildTemplateContext(props);
  const { info, palette, customization, experiences, education, skills, labels } = ctx;
  const showPhoto = customization.showPhoto !== false && !!info.photo;

  return (
    <TemplateShell ctx={ctx} style={{ backgroundColor: '#ffffff' }} className="!p-0 !gap-0 flex">
      {/* Sidebar gauche */}
      <div
        className="w-1/3 p-8 text-gray-800"
        style={{ backgroundColor: palette.secondary }}
      >
        {/* Photo de profil */}
        {showPhoto && info.photo && (
          <div className="mb-8">
            <div className="w-28 h-28 mx-auto rounded-full overflow-hidden shadow-md border-4" style={{ borderColor: palette.primary }}>
              <img
                src={info.photo}
                alt={`${info.firstName} ${info.lastName}`}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        )}

        {/* Contacts */}
        <div className="mb-8">
          <h3 className="text-sm font-bold mb-3 uppercase tracking-widest" style={{ color: palette.primary }}>
            Coordonnées
          </h3>
          <div className="text-xs space-y-2">
            {info.phone && (
              <div className="flex items-start gap-2">
                <span className="flex-shrink-0 font-semibold" style={{ color: palette.primary }}>📱</span>
                <span>{info.phone}</span>
              </div>
            )}
            {info.email && (
              <div className="flex items-start gap-2">
                <span className="flex-shrink-0 font-semibold" style={{ color: palette.primary }}>✉</span>
                <span className="break-all">{info.email}</span>
              </div>
            )}
            {info.address && (
              <div className="flex items-start gap-2">
                <span className="flex-shrink-0 font-semibold" style={{ color: palette.primary }}>📍</span>
                <span>{info.address}</span>
              </div>
            )}
          </div>
        </div>

        {/* Qualités */}
        {skills.some(s => s.category === 'Qualités') && (
          <section className="mb-8">
            <h3 className="text-sm font-bold mb-3 uppercase tracking-widest" style={{ color: palette.primary }}>
              Qualités
            </h3>
            <div className="text-xs space-y-1">
              {skills
                .filter(s => s.category === 'Qualités')
                .slice(0, 6)
                .map(skill => (
                  <div key={skill.id} className="flex items-start gap-2">
                    <span className="flex-shrink-0 mt-1">•</span>
                    <span>{skill.name}</span>
                  </div>
                ))}
            </div>
          </section>
        )}

        {/* Langues */}
        {skills.some(s => s.category === 'Langues') && (
          <section className="mb-8">
            <h3 className="text-sm font-bold mb-3 uppercase tracking-widest" style={{ color: palette.primary }}>
              Langues
            </h3>
            <div className="space-y-2 text-xs">
              {skills
                .filter(s => s.category === 'Langues')
                .map(skill => (
                  <div key={skill.id} className="flex items-center justify-between">
                    <span className="font-medium">{skill.name}</span>
                    <div className="flex gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <div
                          key={i}
                          className="w-1.5 h-1.5 rounded-full"
                          style={{
                            backgroundColor: i < (skill.level || 0) ? palette.primary : '#d1d5db',
                          }}
                        />
                      ))}
                    </div>
                  </div>
                ))}
            </div>
          </section>
        )}

        {/* Intérêts */}
        <section>
          <h3 className="text-sm font-bold mb-3 uppercase tracking-widest" style={{ color: palette.primary }}>
            Intérêts
          </h3>
          <div className="text-xs space-y-1">
            <div className="flex items-start gap-2">
              <span className="flex-shrink-0">•</span>
              <span>Lecture</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="flex-shrink-0">•</span>
              <span>Musique</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="flex-shrink-0">•</span>
              <span>Sport</span>
            </div>
          </div>
        </section>
      </div>

      {/* Contenu principal */}
      <div className="w-2/3 p-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold" style={{ color: palette.text }}>
            {info.firstName} {info.lastName}
          </h1>
          <p className="text-sm font-semibold mt-1" style={{ color: palette.lightText }}>
            {info.jobTitle}
          </p>
        </div>

        {/* Description */}
        {info.summary && (
          <section className="mb-8 pb-6 border-b" style={{ borderColor: palette.border }}>
            <h2 className="text-xs font-bold mb-3 uppercase tracking-widest" style={{ color: palette.primary }}>
              Description
            </h2>
            <p className="text-xs leading-relaxed" style={{ color: palette.lightText }}>
              {info.summary}
            </p>
          </section>
        )}

        {/* Expériences professionnelles */}
        {experiences.length > 0 && (
          <section className="mb-8">
            <h2 className="text-xs font-bold mb-4 uppercase tracking-widest" style={{ color: palette.primary }}>
              {labels.experience}
            </h2>
            <div className="space-y-4">
              {experiences.map((exp) => (
                <ExperienceBlock key={exp.id} exp={exp} ctx={ctx} variant="minimal" />
              ))}
            </div>
          </section>
        )}

        {/* Formations et Compétences */}
        <div className="grid grid-cols-2 gap-6">
          {/* Formations */}
          {education.length > 0 && (
            <section>
              <h2 className="text-xs font-bold mb-4 uppercase tracking-widest" style={{ color: palette.primary }}>
                {labels.education}
              </h2>
              <div className="space-y-3">
                {education.map((edu) => (
                  <EducationBlock key={edu.id} edu={edu} ctx={ctx} variant="minimal" />
                ))}
              </div>
            </section>
          )}

          {/* Compétences */}
          {skills.filter(s => s.category !== 'Qualités' && s.category !== 'Langues').length > 0 && (
            <section>
              <h2 className="text-xs font-bold mb-4 uppercase tracking-widest" style={{ color: palette.primary }}>
                {labels.skills}
              </h2>
              <div className="space-y-2 text-xs">
                {skills
                  .filter(s => s.category !== 'Qualités' && s.category !== 'Langues')
                  .slice(0, 10)
                  .map(skill => (
                    <div key={skill.id} className="flex items-center gap-2">
                      <span className="text-lg">➤</span>
                      <span>{skill.name}</span>
                    </div>
                  ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </TemplateShell>
  );
}
