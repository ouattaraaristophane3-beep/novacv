/**
 * SidebarModeTemplate — Layout 2 colonnes avec barre latérale colorée
 * Inspiré par le design de Diarassouba : sidebar rose/marron, contenu principal épuré
 */
import { buildTemplateContext } from '../core/buildContext';
import { TemplateShell } from '../core/TemplateShell';
import { SectionTitle } from '../core/sections';
import { ExperienceBlock, EducationBlock } from '../core/components';
import { TemplateProps } from '../core/types';

export function SidebarModeTemplate(props: TemplateProps) {
  const ctx = buildTemplateContext(props);
  const { info, palette, customization, experiences, education, skills, labels } = ctx;
  const showPhoto = customization.showPhoto !== false && !!info.photo;

  return (
    <TemplateShell ctx={ctx} style={{ backgroundColor: '#ffffff' }} className="!p-0 !gap-0 flex">
      {/* Sidebar gauche */}
      <div
        className="w-1/3 p-8 text-white"
        style={{ backgroundColor: palette.primary }}
      >
        {/* Photo de profil */}
        {showPhoto && info.photo && (
          <div className="mb-6">
            <img
              src={info.photo}
              alt={`${info.firstName} ${info.lastName}`}
              className="w-32 h-32 rounded-lg object-cover shadow-lg"
            />
          </div>
        )}

        {/* Coordonnées */}
        <div className="mb-8">
          <div className="text-xs space-y-2 opacity-90">
            {info.email && (
              <div className="flex items-start gap-2">
                <span className="font-semibold flex-shrink-0 mt-0.5">✉</span>
                <span className="break-all">{info.email}</span>
              </div>
            )}
            {info.phone && (
              <div className="flex items-start gap-2">
                <span className="font-semibold flex-shrink-0">☎</span>
                <span>{info.phone}</span>
              </div>
            )}
            {info.address && (
              <div className="flex items-start gap-2">
                <span className="font-semibold flex-shrink-0">📍</span>
                <span>{info.address}</span>
              </div>
            )}
          </div>
        </div>

        {/* Langues */}
        {skills.some(s => s.category === 'Langues') && (
          <section className="mb-8">
            <h3 className="text-sm font-bold mb-3 uppercase tracking-wide">{labels.languages || 'Langues'}</h3>
            <div className="space-y-2 text-xs">
              {skills
                .filter(s => s.category === 'Langues')
                .map(skill => (
                  <div key={skill.id} className="flex justify-between items-center">
                    <span>{skill.name}</span>
                    <div className="flex gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <div
                          key={i}
                          className="w-1.5 h-1.5 rounded-full"
                          style={{
                            backgroundColor: i < (skill.level || 0) ? 'currentColor' : 'rgba(255,255,255,0.3)',
                          }}
                        />
                      ))}
                    </div>
                  </div>
                ))}
            </div>
          </section>
        )}

        {/* Compétences */}
        {skills.length > 0 && (
          <section className="mb-8">
            <h3 className="text-sm font-bold mb-3 uppercase tracking-wide">{labels.skills}</h3>
            <div className="space-y-1 text-xs">
              {skills
                .filter(s => s.category !== 'Langues')
                .slice(0, 10)
                .map(skill => (
                  <div key={skill.id} className="opacity-90">{skill.name}</div>
                ))}
            </div>
          </section>
        )}

        {/* Centres d'intérêt */}
        <section>
          <h3 className="text-sm font-bold mb-3 uppercase tracking-wide">{labels.interests || 'Centres d\'intérêt'}</h3>
          <div className="text-xs space-y-1 opacity-90">
            <div>Lecture</div>
            <div>Voyages</div>
            <div>Sport</div>
          </div>
        </section>
      </div>

      {/* Contenu principal */}
      <div className="w-2/3 p-8">
        {/* Header */}
        <div className="mb-8 pb-6 border-b" style={{ borderColor: palette.border }}>
          <h1 className="text-3xl font-bold" style={{ color: palette.text }}>
            {info.firstName} {info.lastName}
          </h1>
          <p className="text-sm font-semibold mt-1" style={{ color: palette.primary }}>
            {info.jobTitle}
          </p>
        </div>

        {/* Résumé */}
        {info.summary && (
          <section className="mb-8">
            <p className="text-xs leading-relaxed" style={{ color: palette.lightText }}>
              {info.summary}
            </p>
          </section>
        )}

        {/* Expérience */}
        {experiences.length > 0 && (
          <section className="mb-8">
            <SectionTitle title={labels.experience} color={palette.primary} variant="line" />
            <div className="space-y-4 mt-4">
              {experiences.map((exp) => (
                <ExperienceBlock key={exp.id} exp={exp} ctx={ctx} variant="minimal" />
              ))}
            </div>
          </section>
        )}

        {/* Formation */}
        {education.length > 0 && (
          <section className="mb-8">
            <SectionTitle title={labels.education} color={palette.primary} variant="line" />
            <div className="space-y-4 mt-4">
              {education.map((edu) => (
                <EducationBlock key={edu.id} edu={edu} ctx={ctx} variant="minimal" />
              ))}
            </div>
          </section>
        )}
      </div>
    </TemplateShell>
  );
}
