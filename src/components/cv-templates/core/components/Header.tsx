/**
 * Composants d'en-têtes réutilisables pour les templates
 */
import { TemplateContext } from '../types';
import { ContactRow, SocialLinks } from '../sections';

interface HeaderProps {
  ctx: TemplateContext;
  variant?: 'modern' | 'classic' | 'creative' | 'minimal' | 'sidebar';
  showPhoto?: boolean;
  photoPosition?: 'left' | 'right' | 'top' | 'none';
}

export function HeaderModern({ ctx, showPhoto = true, photoPosition = 'left' }: HeaderProps) {
  const { info, palette } = ctx;

  return (
    <header className="mb-6 pb-5 border-b-2" style={{ borderColor: palette.primary }}>
      <div className="flex gap-4 items-start">
        {showPhoto && photoPosition === 'left' && (
          <img
            src={info.photo}
            alt=""
            className="w-20 h-20 rounded-lg object-cover shrink-0 border-2"
            style={{ borderColor: palette.border }}
          />
        )}
        <div className="flex-1">
          <div className="flex justify-between items-baseline gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
                {info.firstName} <span style={{ color: palette.primary }}>{info.lastName}</span>
              </h1>
              {info.jobTitle && (
                <p className="text-xs font-semibold mt-1" style={{ color: palette.primary }}>
                  {info.jobTitle.toUpperCase()}
                </p>
              )}
            </div>
            {showPhoto && photoPosition === 'right' && (
              <img
                src={info.photo}
                alt=""
                className="w-16 h-16 rounded-lg object-cover border-2"
                style={{ borderColor: palette.border }}
              />
            )}
          </div>
          <div className="mt-3 flex flex-col gap-1">
            <ContactRow ctx={ctx} />
            <SocialLinks ctx={ctx} />
          </div>
        </div>
      </div>
    </header>
  );
}

export function HeaderCreative({ ctx, showPhoto = true }: HeaderProps) {
  const { info, palette } = ctx;

  return (
    <div className="text-white px-8 pt-8 pb-6 relative overflow-hidden" style={{ background: `linear-gradient(135deg, ${palette.primary} 0%, ${palette.accent} 100%)` }}>
      <div className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-5 -translate-y-1/2 translate-x-1/4" style={{ backgroundColor: palette.text }} />
      
      <div className="relative flex gap-6 items-end">
        {showPhoto && (
          <img
            src={info.photo}
            alt=""
            className="w-24 h-24 rounded-2xl object-cover border-4 border-white/40 shadow-xl"
          />
        )}
        <div>
          <h1 className="text-3xl font-black tracking-tight leading-none">
            {info.firstName}
          </h1>
          <h2 className="text-3xl font-light opacity-90 -mt-1">
            {info.lastName}
          </h2>
          {info.jobTitle && (
            <p className="text-xs mt-2 font-semibold bg-white/20 inline-block px-3 py-1 rounded-full">
              {info.jobTitle}
            </p>
          )}
        </div>
      </div>

      <div className="mt-4 text-xs opacity-95">
        <ContactRow ctx={ctx} light />
        <SocialLinks ctx={ctx} light />
      </div>
    </div>
  );
}

export function HeaderSidebar({ ctx, showPhoto = true }: HeaderProps) {
  const { info, palette } = ctx;

  return (
    <div className="text-center pb-6 border-b" style={{ borderColor: `${palette.primary}20` }}>
      {showPhoto && (
        <img
          src={info.photo}
          alt=""
          className="w-32 h-32 rounded-2xl object-cover mx-auto mb-4 border-4 border-white shadow-lg"
          style={{ borderColor: `${palette.primary}40` }}
        />
      )}
      <h1 className="text-xl font-bold text-white">
        {info.firstName}
        <br />
        <span className="font-light opacity-90">{info.lastName}</span>
      </h1>
      {info.jobTitle && (
        <p className="text-xs font-semibold mt-1 opacity-85">
          {info.jobTitle}
        </p>
      )}
      <div className="mt-4 text-xs opacity-95">
        <ContactRow ctx={ctx} light />
        <SocialLinks ctx={ctx} light />
      </div>
    </div>
  );
}

export function HeaderMinimal({ ctx, showPhoto = true }: HeaderProps) {
  const { info } = ctx;

  return (
    <header className="mb-6">
      <div className="flex justify-between items-start gap-4">
        <div>
          <h1 className="text-lg font-bold text-gray-900 font-mono">
            {info.firstName?.toLowerCase()}.{info.lastName?.toLowerCase()}
          </h1>
          {info.jobTitle && (
            <p className="text-xs text-gray-600 mt-1">{info.jobTitle}</p>
          )}
        </div>
        {showPhoto && (
          <img
            src={info.photo}
            alt=""
            className="w-14 h-14 rounded object-cover grayscale border border-gray-300"
          />
        )}
      </div>
      <div className="mt-2 text-xs">
        <ContactRow ctx={ctx} />
        <SocialLinks ctx={ctx} />
      </div>
    </header>
  );
}

export function HeaderClassic({ ctx, showPhoto = true, photoPosition = 'right' }: HeaderProps) {
  const { info, palette } = ctx;

  return (
    <header className="grid grid-cols-[1fr_auto] gap-6 items-center mb-8 pb-6 border-b" style={{ borderColor: palette.border }}>
      <div>
        <p className="text-xs uppercase tracking-widest text-gray-400 mb-1">Curriculum Vitae</p>
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
          {info.firstName} <span style={{ color: palette.primary }}>{info.lastName}</span>
        </h1>
        {info.jobTitle && (
          <p className="text-sm text-gray-600 mt-2 font-medium">{info.jobTitle}</p>
        )}
        <div className="mt-3">
          <ContactRow ctx={ctx} />
          <SocialLinks ctx={ctx} />
        </div>
      </div>
      {showPhoto && photoPosition === 'right' && (
        <img
          src={info.photo}
          alt=""
          className="w-28 h-28 rounded-full object-cover border-4 border-white"
          style={{ boxShadow: `0 0 0 4px ${palette.secondary}` }}
        />
      )}
    </header>
  );
}
