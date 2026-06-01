/**
 * Thèmes et palettes — plateforme premium NovaCV
 */

export interface ColorPalette {
  name: string;
  primary: string;
  secondary: string;
  accent: string;
  text: string;
  lightText: string;
  background: string;
  border: string;
  primaryBg: string;
  secondaryBg: string;
  accentBg: string;
  textClass: string;
  lightTextClass: string;
}

export const colorPalettes: Record<string, ColorPalette> = {
  bleuModerne: {
    name: 'Bleu moderne',
    primary: '#2563eb',
    secondary: '#eff6ff',
    accent: '#1d4ed8',
    text: '#0f172a',
    lightText: '#64748b',
    background: '#ffffff',
    border: '#e2e8f0',
    primaryBg: 'bg-blue-600',
    secondaryBg: 'bg-blue-50',
    accentBg: 'bg-blue-700',
    textClass: 'text-blue-600',
    lightTextClass: 'text-blue-500',
  },
  bleuMarine: {
    name: 'Bleu marine',
    primary: '#0f2744',
    secondary: '#e8eef5',
    accent: '#1e3a5f',
    text: '#0f172a',
    lightText: '#475569',
    background: '#ffffff',
    border: '#e2e8f0',
    primaryBg: 'bg-slate-900',
    secondaryBg: 'bg-slate-100',
    accentBg: 'bg-slate-800',
    textClass: 'text-slate-900',
    lightTextClass: 'text-slate-600',
  },
  noirBlanc: {
    name: 'Noir & blanc',
    primary: '#18181b',
    secondary: '#f4f4f5',
    accent: '#3f3f46',
    text: '#18181b',
    lightText: '#71717a',
    background: '#ffffff',
    border: '#d4d4d8',
    primaryBg: 'bg-zinc-900',
    secondaryBg: 'bg-zinc-100',
    accentBg: 'bg-zinc-700',
    textClass: 'text-zinc-900',
    lightTextClass: 'text-zinc-600',
  },
  vertEmeraude: {
    name: 'Vert émeraude',
    primary: '#059669',
    secondary: '#ecfdf5',
    accent: '#047857',
    text: '#064e3b',
    lightText: '#6b7280',
    background: '#ffffff',
    border: '#d1fae5',
    primaryBg: 'bg-emerald-600',
    secondaryBg: 'bg-emerald-50',
    accentBg: 'bg-emerald-700',
    textClass: 'text-emerald-600',
    lightTextClass: 'text-emerald-500',
  },
  bordeaux: {
    name: 'Bordeaux',
    primary: '#881337',
    secondary: '#fff1f2',
    accent: '#9f1239',
    text: '#1f2937',
    lightText: '#6b7280',
    background: '#ffffff',
    border: '#fecdd3',
    primaryBg: 'bg-rose-900',
    secondaryBg: 'bg-rose-50',
    accentBg: 'bg-rose-800',
    textClass: 'text-rose-900',
    lightTextClass: 'text-rose-700',
  },
  anthracite: {
    name: 'Anthracite',
    primary: '#374151',
    secondary: '#f3f4f6',
    accent: '#1f2937',
    text: '#111827',
    lightText: '#6b7280',
    background: '#ffffff',
    border: '#e5e7eb',
    primaryBg: 'bg-gray-700',
    secondaryBg: 'bg-gray-100',
    accentBg: 'bg-gray-800',
    textClass: 'text-gray-700',
    lightTextClass: 'text-gray-600',
  },
  beigePremium: {
    name: 'Beige premium',
    primary: '#78350f',
    secondary: '#fffbeb',
    accent: '#92400e',
    text: '#292524',
    lightText: '#78716c',
    background: '#fffdf7',
    border: '#fde68a',
    primaryBg: 'bg-amber-900',
    secondaryBg: 'bg-amber-50',
    accentBg: 'bg-amber-800',
    textClass: 'text-amber-900',
    lightTextClass: 'text-amber-700',
  },
  violetProfessionnel: {
    name: 'Violet professionnel',
    primary: '#6d28d9',
    secondary: '#f5f3ff',
    accent: '#5b21b6',
    text: '#1e1b4b',
    lightText: '#6b7280',
    background: '#ffffff',
    border: '#ede9fe',
    primaryBg: 'bg-violet-600',
    secondaryBg: 'bg-violet-50',
    accentBg: 'bg-violet-700',
    textClass: 'text-violet-600',
    lightTextClass: 'text-violet-500',
  },
};

const LEGACY_PALETTE_MAP: Record<string, string> = {
  blue: 'bleuModerne',
  bleuClassique: 'bleuModerne',
  gray: 'anthracite',
  grisAnthracite: 'anthracite',
  teal: 'vertEmeraude',
  turquoise: 'vertEmeraude',
  green: 'vertEmeraude',
  red: 'bordeaux',
  beige: 'beigePremium',
  violet: 'violetProfessionnel',
  indigoModerne: 'violetProfessionnel',
  orangeProfessionnel: 'bordeaux',
};

export function normalizePalette(value: string | null | undefined): string {
  if (!value) return 'bleuModerne';
  if (LEGACY_PALETTE_MAP[value]) return LEGACY_PALETTE_MAP[value];
  if (value in colorPalettes) return value;
  return 'bleuModerne';
}

export function getPalette(paletteKey: string): ColorPalette {
  return colorPalettes[normalizePalette(paletteKey)] || colorPalettes.bleuModerne;
}

export function getCvPalette(colorTheme: string | null | undefined): ColorPalette {
  return getPalette(normalizePalette(colorTheme));
}

export function getAvailablePalettes() {
  return Object.entries(colorPalettes).map(([key, palette]) => ({
    key,
    name: palette.name,
  }));
}

export type TemplateType =
  | 'resumeIoStyle'
  | 'canvaPremium'
  | 'novoresume'
  | 'enhancv'
  | 'reactiveResume';

export const templateMetadata: Record<
  TemplateType,
  { name: string; description: string; atsCompatible: boolean; brand: string }
> = {
  resumeIoStyle: {
    name: 'Resume.io',
    brand: 'Resume.io',
    description: 'Européen corporate, épuré et compatible ATS',
    atsCompatible: true,
  },
  canvaPremium: {
    name: 'Canva Premium',
    brand: 'Canva',
    description: 'Sidebar élégante, rendu visuel premium',
    atsCompatible: false,
  },
  novoresume: {
    name: 'Novoresume',
    brand: 'Novoresume',
    description: 'Sections structurées, équilibre parfait',
    atsCompatible: true,
  },
  enhancv: {
    name: 'Enhancv',
    brand: 'Enhancv',
    description: 'Créatif avec timeline — marketing, design, tech',
    atsCompatible: false,
  },
  reactiveResume: {
    name: 'Reactive Resume',
    brand: 'Reactive Resume',
    description: 'Minimaliste développeur, optimisé PDF',
    atsCompatible: true,
  },
};

export function getTemplateMetadata(templateType: TemplateType) {
  return templateMetadata[templateType];
}
