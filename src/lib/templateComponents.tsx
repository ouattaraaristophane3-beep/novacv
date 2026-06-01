/**
 * Composants réutilisables pour tous les templates CV
 * Éléments communs : entête, section, badge, etc.
 */

import { Database } from './supabase';
import { ColorPalette } from './themes';
import { formatBirthDate, PersonalInfo } from './cvTypes';

type Experience = Database['public']['Tables']['experiences']['Row'];
type Education = Database['public']['Tables']['education']['Row'];
type Skill = Database['public']['Tables']['skills']['Row'];

/**
 * Formatte une date au format lisible
 */
export function formatDate(dateStr: string | null | undefined, language: string = 'fr'): string {
  if (!dateStr) return '';
  try {
    const date = new Date(dateStr);
    return date.toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-US', {
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return '';
  }
}

/**
 * Liens et coordonnées étendues (LinkedIn, GitHub, etc.)
 */
export function ContactLinks({
  info,
  paletteColor,
  language = 'fr',
}: {
  info: PersonalInfo;
  paletteColor: string;
  language?: string;
}) {
  const items: { label: string; value: string }[] = [];
  if (info.showBirthDate && info.birthDate) {
    items.push({
      label: language === 'fr' ? 'Date de naissance' : 'Date of birth',
      value: formatBirthDate(info.birthDate, language),
    });
  }
  if (info.linkedin) items.push({ label: 'LinkedIn', value: info.linkedin });
  if (info.github) items.push({ label: 'GitHub', value: info.github });
  if (info.portfolio) items.push({ label: language === 'fr' ? 'Portfolio' : 'Portfolio', value: info.portfolio });

  if (items.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-gray-600 mt-1">
      {items.map((item) => (
        <span key={item.label}>
          <span className="font-medium" style={{ color: paletteColor }}>
            {item.label}:
          </span>{' '}
          {item.value}
        </span>
      ))}
    </div>
  );
}

/**
 * Sections texte libre (langues, certifications, projets, etc.)
 */
export function ExtraSections({
  info,
  paletteColor,
  language = 'fr',
  variant = 'underline',
}: {
  info: PersonalInfo;
  paletteColor: string;
  language?: string;
  variant?: 'underline' | 'left-bar' | 'accent';
}) {
  const sections: { key: keyof PersonalInfo; titleFr: string; titleEn: string }[] = [
    { key: 'languages', titleFr: 'Langues', titleEn: 'Languages' },
    { key: 'certifications', titleFr: 'Certifications', titleEn: 'Certifications' },
    { key: 'projects', titleFr: 'Projets', titleEn: 'Projects' },
    { key: 'interests', titleFr: "Centres d'intérêt", titleEn: 'Interests' },
    { key: 'references', titleFr: 'Références', titleEn: 'References' },
  ];

  const visible = sections.filter((s) => {
    const v = info[s.key];
    return typeof v === 'string' && v.trim().length > 0;
  });

  if (visible.length === 0) return null;

  return (
    <div className="space-y-4">
      {visible.map((section) => (
        <section key={section.key}>
          <SectionHeader
            title={language === 'fr' ? section.titleFr : section.titleEn}
            paletteColor={paletteColor}
            variant={variant}
          />
          <p className="text-xs text-gray-700 whitespace-pre-line leading-relaxed">
            {info[section.key] as string}
          </p>
        </section>
      ))}
    </div>
  );
}

/**
 * Rendu des niveau de compétence (1-5 étoiles/points)
 */
export function SkillLevelBar({
  level,
  paletteColor,
  style = 'dots',
}: {
  level: number;
  paletteColor: string;
  style?: 'dots' | 'bar' | 'text';
}) {
  const level_num = Math.min(5, Math.max(1, level || 3));

  if (style === 'text') {
    const labels = {
      1: 'Débutant',
      2: 'Élémentaire',
      3: 'Intermédiaire',
      4: 'Avancé',
      5: 'Expert',
    };
    return <span className="text-xs">{labels[level_num as keyof typeof labels]}</span>;
  }

  if (style === 'bar') {
    return (
      <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full transition-all rounded-full"
          style={{
            backgroundColor: paletteColor,
            width: `${(level_num / 5) * 100}%`,
          }}
        />
      </div>
    );
  }

  // dots (défaut)
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((i) => (
        <div
          key={i}
          className="w-1.5 h-1.5 rounded-full"
          style={{
            backgroundColor: i <= level_num ? paletteColor : '#e5e7eb',
          }}
        />
      ))}
    </div>
  );
}

/**
 * En-tête d'une section du CV
 */
export function SectionHeader({
  title,
  paletteColor,
  variant = 'accent',
}: {
  title: string;
  paletteColor: string;
  variant?: 'accent' | 'underline' | 'left-bar';
}) {
  if (variant === 'underline') {
    return (
      <h2
        className="text-sm font-bold uppercase tracking-wider mb-3 pb-2"
        style={{ borderBottom: `2px solid ${paletteColor}`, color: paletteColor }}
      >
        {title}
      </h2>
    );
  }

  if (variant === 'left-bar') {
    return (
      <h2
        className="text-sm font-bold uppercase tracking-wider mb-3 pl-3"
        style={{ borderLeft: `3px solid ${paletteColor}` }}
      >
        {title}
      </h2>
    );
  }

  // accent (défaut)
  return (
    <h2
      className="text-sm font-bold uppercase tracking-wider mb-3 px-3 py-1.5 rounded-md text-white"
      style={{ backgroundColor: paletteColor }}
    >
      {title}
    </h2>
  );
}

/**
 * Entrée d'expérience professionnelle
 */
export function ExperienceEntry({
  experience,
  language = 'fr',
  showCompany = true,
}: {
  experience: Experience;
  language?: string;
  showCompany?: boolean;
}) {
  const startDate = formatDate(experience.start_date, language);
  const endDate = experience.is_current ? (language === 'fr' ? 'Présent' : 'Present') : formatDate(experience.end_date, language);

  return (
    <div className="mb-4">
      <div className="flex justify-between items-start">
        <div>
          <p className="font-semibold text-sm">{experience.position}</p>
          {showCompany && <p className="text-xs text-gray-600">{experience.company}</p>}
          {experience.location && <p className="text-xs text-gray-500">{experience.location}</p>}
        </div>
        <p className="text-xs text-gray-500 whitespace-nowrap ml-2">
          {startDate} – {endDate}
        </p>
      </div>
      {experience.description && <p className="text-xs text-gray-700 mt-1 leading-tight">{experience.description}</p>}
      {experience.achievements && Array.isArray(experience.achievements) && experience.achievements.length > 0 && (
        <ul className="text-xs text-gray-600 mt-1 ml-3 space-y-0.5">
          {experience.achievements.map((achievement, i) => (
            <li key={i}>• {String(achievement)}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

/**
 * Entrée de formation
 */
export function EducationEntry({
  education,
  language = 'fr',
}: {
  education: Education;
  language?: string;
}) {
  const startDate = formatDate(education.start_date, language);
  const endDate = education.is_current ? (language === 'fr' ? 'Présent' : 'Present') : formatDate(education.end_date, language);

  return (
    <div className="mb-4">
      <div className="flex justify-between items-start">
        <div>
          <p className="font-semibold text-sm">{education.degree}</p>
          {education.field && <p className="text-xs text-gray-600">{education.field}</p>}
          <p className="text-xs text-gray-500">{education.institution}</p>
        </div>
        <p className="text-xs text-gray-500 whitespace-nowrap ml-2">
          {startDate} – {endDate}
        </p>
      </div>
      {education.description && <p className="text-xs text-gray-700 mt-1 leading-tight">{education.description}</p>}
    </div>
  );
}

/**
 * Groupe de compétences catégorisées
 */
export function SkillGroup({
  skills,
  category,
  paletteColor,
  compact = false,
}: {
  skills: Skill[];
  category: string;
  paletteColor: string;
  compact?: boolean;
}) {
  const categorySkills = skills.filter((s) => s.category === category || (!s.category && category === 'other'));

  if (categorySkills.length === 0) return null;

  if (compact) {
    return (
      <div className="mb-2">
        <p className="text-xs font-semibold" style={{ color: paletteColor }}>
          {category}:
        </p>
        <div className="flex flex-wrap gap-1">
          {categorySkills.map((skill) => (
            <span key={skill.id} className="text-xs px-2 py-0.5 bg-gray-100 rounded-full">
              {skill.name}
            </span>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mb-3">
      <p className="text-xs font-semibold mb-2" style={{ color: paletteColor }}>
        {category}
      </p>
      <div className="space-y-1.5">
        {categorySkills.map((skill) => (
          <div key={skill.id} className="flex justify-between items-center">
            <span className="text-xs">{skill.name}</span>
            <SkillLevelBar level={skill.level || 3} paletteColor={paletteColor} style="bar" />
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Badge pour langues, certifications, etc.
 */
export function Badge({
  text,
  paletteColor,
  variant = 'outlined',
}: {
  text: string;
  paletteColor: string;
  variant?: 'solid' | 'outlined' | 'light';
}) {
  if (variant === 'solid') {
    return (
      <span
        className="text-xs font-semibold text-white px-2 py-1 rounded-full"
        style={{ backgroundColor: paletteColor }}
      >
        {text}
      </span>
    );
  }

  if (variant === 'light') {
    return (
      <span
        className="text-xs font-semibold px-2 py-1 rounded-full"
        style={{
          backgroundColor: `${paletteColor}15`,
          color: paletteColor,
        }}
      >
        {text}
      </span>
    );
  }

  // outlined (défaut)
  return (
    <span
      className="text-xs font-semibold px-2 py-1 rounded-full border"
      style={{
        borderColor: paletteColor,
        color: paletteColor,
      }}
    >
      {text}
    </span>
  );
}

/**
 * Info personnelle et résumé
 */
export function PersonalInfoSection({
  info,
  palette,
  language = 'fr',
  showPhoto = false,
}: {
  info: PersonalInfo;
  palette: ColorPalette;
  language?: string;
  showPhoto?: boolean;
}) {
  return (
    <div className="flex gap-4">
      {showPhoto && info.photo && (
        <img
          src={info.photo}
          alt=""
          className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
        />
      )}
      <div className="flex-1 min-w-0">
        <h1 className="text-2xl font-bold mb-0.5">
          {info.firstName} {info.lastName}
        </h1>
        {info.jobTitle && (
          <p className="text-sm font-semibold mb-2" style={{ color: palette.primary }}>
            {info.jobTitle}
          </p>
        )}
        <div className="flex flex-wrap gap-2 text-xs text-gray-600 mb-1">
          {info.email && <span>{info.email}</span>}
          {info.phone && <span>{info.phone}</span>}
          {info.address && <span>{info.address}</span>}
        </div>
        <ContactLinks info={info} paletteColor={palette.primary} language={language} />
        {info.summary && (
          <p className="text-xs text-gray-700 leading-relaxed italic mt-2">
            &ldquo;{info.summary}&rdquo;
          </p>
        )}
      </div>
    </div>
  );
}
