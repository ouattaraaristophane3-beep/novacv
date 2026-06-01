/**
 * Composants de sidebar réutilisables
 */
import { TemplateContext } from '../types';
import { ContactRow, SocialLinks, SectionTitle } from '../sections';
import { SkillsSection } from './SkillsSection';

interface SidebarProps {
  ctx: TemplateContext;
  showPhoto?: boolean;
  showSkills?: boolean;
  skillsVariant?: 'bars' | 'tags' | 'dots' | 'badges' | 'minimal';
}

export function SidebarModern({
  ctx,
  showPhoto = true,
  showSkills = true,
  skillsVariant = 'bars',
}: SidebarProps) {
  const { info, palette, skills, labels } = ctx;

  return (
    <aside
      className="w-1/3 shrink-0 p-8 text-white flex flex-col"
      style={{
        background: `linear-gradient(165deg, ${palette.primary} 0%, ${palette.accent} 100%)`,
      }}
    >
      {showPhoto && info.photo && (
        <img
          src={info.photo}
          alt=""
          className="w-full aspect-square max-w-40 mx-auto rounded-2xl object-cover border-4 border-white/30 shadow-xl mb-6"
        />
      )}

      <h2 className="text-xl font-bold leading-tight mb-1">
        {info.firstName}
        <br />
        <span className="font-light opacity-90">{info.lastName}</span>
      </h2>

      {info.jobTitle && (
        <p className="text-xs font-medium opacity-90 mb-5 border-b border-white/20 pb-4">
          {info.jobTitle}
        </p>
      )}

      <div className="space-y-5 text-xs opacity-95 flex-1">
        <div>
          <SectionTitle title="CONTACT" color="#ffffff" variant="sidebar" />
          <ContactRow ctx={ctx} light />
          <SocialLinks ctx={ctx} light />
        </div>

        {showSkills && skills.length > 0 && (
          <div>
            <SectionTitle title={labels.skills} color="#ffffff" variant="sidebar" />
            <div className="text-xs">
              <SkillsSection skills={skills} ctx={{ ...ctx, palette: { ...palette, primary: '#ffffff' } }} variant={skillsVariant} />
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}

export function SidebarCompact({
  ctx,
  showPhoto = true,
  showSkills = true,
  skillsVariant = 'tags',
}: SidebarProps) {
  const { info, palette, skills, labels } = ctx;

  return (
    <aside className="w-48 shrink-0 p-6 text-white flex flex-col" style={{ backgroundColor: palette.primary }}>
      {showPhoto && info.photo && (
        <img
          src={info.photo}
          alt=""
          className="w-24 h-24 rounded-xl object-cover mx-auto mb-3 border-2 border-white/40"
        />
      )}

      <h3 className="text-sm font-bold text-center mb-0.5">
        {info.firstName} {info.lastName}
      </h3>

      {info.jobTitle && (
        <p className="text-xs text-center font-medium opacity-85 mb-3 pb-2 border-b border-white/20">
          {info.jobTitle}
        </p>
      )}

      <div className="space-y-3 text-xs flex-1">
        <div>
          <p className="font-bold uppercase text-xs mb-2 opacity-85">Contact</p>
          <ContactRow ctx={ctx} light />
        </div>

        {showSkills && skills.length > 0 && (
          <div>
            <p className="font-bold uppercase text-xs mb-2 opacity-85">{labels.skills}</p>
            <SkillsSection skills={skills} ctx={{ ...ctx, palette: { ...palette, primary: '#ffffff' } }} variant={skillsVariant} />
          </div>
        )}
      </div>
    </aside>
  );
}
