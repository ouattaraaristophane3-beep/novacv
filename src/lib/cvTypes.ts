import { TemplateType } from './themes';

export interface PersonalInfo {
  firstName?: string;
  lastName?: string;
  jobTitle?: string;
  email?: string;
  phone?: string;
  address?: string;
  summary?: string;
  photo?: string;
  birthDate?: string;
  showBirthDate?: boolean;
  linkedin?: string;
  github?: string;
  portfolio?: string;
  languages?: string;
  certifications?: string;
  projects?: string;
  interests?: string;
  references?: string;
  customization?: import('./cvCustomization').CvCustomization;
}

export const defaultPersonalInfo: PersonalInfo = {
  firstName: '',
  lastName: '',
  jobTitle: '',
  email: '',
  phone: '',
  address: '',
  summary: '',
  photo: '',
  birthDate: '',
  showBirthDate: false,
  linkedin: '',
  github: '',
  portfolio: '',
  languages: '',
  certifications: '',
  projects: '',
  interests: '',
  references: '',
};

export function parsePersonalInfo(data: unknown): PersonalInfo {
  if (!data || typeof data !== 'object') return { ...defaultPersonalInfo };
  return { ...defaultPersonalInfo, ...(data as PersonalInfo) };
}

const LEGACY_TEMPLATE_MAP: Record<string, TemplateType> = {
  modern: 'resumeIoStyle',
  europeenModerne: 'resumeIoStyle',
  classic: 'novoresume',
  classiqueSobre: 'novoresume',
  executive: 'canvaPremium',
  executifSenior: 'canvaPremium',
  minimal: 'reactiveResume',
  ats: 'resumeIoStyle',
  atsMinimaliste: 'resumeIoStyle',
  corporateAmerica: 'resumeIoStyle',
  developpeurTech: 'reactiveResume',
  elegantCreatif: 'enhancv',
  creativDesignMarketing: 'enhancv',
  africainProfessionnel: 'canvaPremium',
  moderneSidebar: 'canvaPremium',
  moderneTimeline: 'enhancv',
  internationalMulticolonne: 'novoresume',
};

export function normalizeTemplate(value: string | null | undefined): TemplateType {
  if (!value) return 'resumeIoStyle';
  if (value in LEGACY_TEMPLATE_MAP) return LEGACY_TEMPLATE_MAP[value];
  if (isTemplateType(value)) return value;
  return 'resumeIoStyle';
}

export function isTemplateType(value: string): value is TemplateType {
  const valid: TemplateType[] = [
    'resumeIoStyle',
    'canvaPremium',
    'novoresume',
    'enhancv',
    'reactiveResume',
  ];
  return valid.includes(value as TemplateType);
}

export { normalizePalette } from './themes';

export function formatBirthDate(
  birthDate: string | undefined,
  language: string = 'fr'
): string {
  if (!birthDate) return '';
  try {
    const d = new Date(birthDate);
    if (Number.isNaN(d.getTime())) return birthDate;
    return d.toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-US', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  } catch {
    return birthDate;
  }
}
