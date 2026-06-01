/** Options de personnalisation stockées dans personal_info.customization (JSONB) */

export type FontFamily = 'inter' | 'georgia' | 'system';
export type SpacingDensity = 'compact' | 'normal' | 'relaxed';
export type SectionId = 'summary' | 'experience' | 'education' | 'skills' | 'extras';

export interface CvCustomization {
  showPhoto?: boolean;
  showSidebar?: boolean;
  showBirthDate?: boolean;
  fontFamily?: FontFamily;
  spacing?: SpacingDensity;
  sectionOrder?: SectionId[];
}

export const defaultCustomization: CvCustomization = {
  showPhoto: true,
  showSidebar: true,
  showBirthDate: false,
  fontFamily: 'inter',
  spacing: 'normal',
  sectionOrder: ['summary', 'experience', 'education', 'skills', 'extras'],
};

export function parseCustomization(data: unknown): CvCustomization {
  if (!data || typeof data !== 'object') return { ...defaultCustomization };
  const raw = data as Record<string, unknown>;
  const nested =
    raw.customization && typeof raw.customization === 'object'
      ? (raw.customization as CvCustomization)
      : {};
  return {
    ...defaultCustomization,
    ...nested,
    sectionOrder: Array.isArray(nested.sectionOrder)
      ? (nested.sectionOrder as SectionId[])
      : defaultCustomization.sectionOrder,
  };
}

export function spacingScale(spacing: SpacingDensity): number {
  if (spacing === 'compact') return 0.88;
  if (spacing === 'relaxed') return 1.18;
  return 1;
}

export function fontFamilyClass(font: FontFamily): string {
  if (font === 'georgia') return 'font-serif';
  if (font === 'system') return 'font-[system-ui,sans-serif]';
  return 'font-sans';
}

export function getLabels(lang: string) {
  const fr = lang === 'fr';
  return {
    experience: fr ? 'Expérience professionnelle' : 'Work Experience',
    education: fr ? 'Formation' : 'Education',
    skills: fr ? 'Compétences' : 'Skills',
    summary: fr ? 'Profil' : 'Profile',
    languages: fr ? 'Langues' : 'Languages',
    certifications: fr ? 'Certifications' : 'Certifications',
    projects: fr ? 'Projets' : 'Projects',
    interests: fr ? "Centres d'intérêt" : 'Interests',
    references: fr ? 'Références' : 'References',
    present: fr ? 'Présent' : 'Present',
    birthDate: fr ? 'Date de naissance' : 'Date of birth',
  };
}
