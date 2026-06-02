/**
 * Configuration des champs par template
 * Définit les sections et champs affichés pour chaque type de CV
 */
import { TemplateType } from './themes';

export type { TemplateType };

export type FieldType = 'text' | 'textarea' | 'email' | 'phone' | 'url' | 'date' | 'number' | 'select';

export interface FieldConfig {
  id: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  required?: boolean;
  maxLength?: number;
  helpText?: string;
}

export interface SectionConfig {
  id: string;
  label: string;
  icon?: string;
  description?: string;
  fields: FieldConfig[];
  allowMultiple?: boolean; // Pour expérience, éducation, compétences
}

export interface TemplateFieldConfig {
  templateId: TemplateType;
  name: string;
  description: string;
  sections: SectionConfig[];
}

// Configuration de base commune à tous les templates
const commonContactFields: FieldConfig[] = [
  { id: 'email', label: 'Email', type: 'email', required: true },
  { id: 'phone', label: 'Téléphone', type: 'phone' },
  { id: 'address', label: 'Adresse', type: 'text' },
];

const commonPersonalFields: FieldConfig[] = [
  { id: 'firstName', label: 'Prénom', type: 'text', required: true },
  { id: 'lastName', label: 'Nom', type: 'text', required: true },
  { id: 'jobTitle', label: 'Titre/Poste', type: 'text', required: true },
  { id: 'summary', label: 'Résumé professionnel', type: 'textarea' },
  { id: 'photo', label: 'Photo de profil', type: 'text', helpText: 'URL de l\'image' },
];

// Templates spécifiques

export const sidebarModeConfig: TemplateFieldConfig = {
  templateId: 'sidebarMode',
  name: 'Sidebar Mode',
  description: 'Design moderne avec barre latérale colorée',
  sections: [
    {
      id: 'personal',
      label: 'Informations personnelles',
      fields: commonPersonalFields,
    },
    {
      id: 'contact',
      label: 'Coordonnées',
      fields: commonContactFields,
    },
    {
      id: 'languages',
      label: 'Langues',
      fields: [
        { id: 'name', label: 'Langue', type: 'text', required: true },
        { id: 'level', label: 'Niveau (1-5)', type: 'number', required: true },
      ],
      allowMultiple: true,
    },
    {
      id: 'skills',
      label: 'Compétences',
      fields: [
        { id: 'name', label: 'Compétence', type: 'text', required: true },
        { id: 'category', label: 'Catégorie', type: 'text' },
        { id: 'level', label: 'Niveau (1-5)', type: 'number' },
      ],
      allowMultiple: true,
    },
    {
      id: 'experience',
      label: 'Expérience professionnelle',
      fields: [
        { id: 'company', label: 'Entreprise', type: 'text', required: true },
        { id: 'position', label: 'Poste', type: 'text', required: true },
        { id: 'startDate', label: 'Date de début', type: 'date' },
        { id: 'endDate', label: 'Date de fin', type: 'date' },
        { id: 'description', label: 'Description', type: 'textarea' },
      ],
      allowMultiple: true,
    },
    {
      id: 'education',
      label: 'Formation',
      fields: [
        { id: 'institution', label: 'Institution', type: 'text', required: true },
        { id: 'degree', label: 'Diplôme', type: 'text', required: true },
        { id: 'field', label: 'Domaine', type: 'text' },
        { id: 'startDate', label: 'Date de début', type: 'date' },
        { id: 'endDate', label: 'Date de fin', type: 'date' },
      ],
      allowMultiple: true,
    },
  ],
};

export const sidebarElegantConfig: TemplateFieldConfig = {
  templateId: 'sidebarElegant',
  name: 'Sidebar Élégant',
  description: 'Design professionnel avec barre latérale chaleureuse',
  sections: [
    {
      id: 'personal',
      label: 'Informations personnelles',
      fields: commonPersonalFields,
    },
    {
      id: 'contact',
      label: 'Coordonnées',
      fields: commonContactFields,
    },
    {
      id: 'qualities',
      label: 'Qualités',
      fields: [
        { id: 'name', label: 'Qualité', type: 'text', required: true },
      ],
      allowMultiple: true,
    },
    {
      id: 'languages',
      label: 'Langues',
      fields: [
        { id: 'name', label: 'Langue', type: 'text', required: true },
        { id: 'level', label: 'Niveau (1-5)', type: 'number', required: true },
      ],
      allowMultiple: true,
    },
    {
      id: 'interests',
      label: 'Intérêts',
      fields: [
        { id: 'name', label: 'Intérêt', type: 'text', required: true },
      ],
      allowMultiple: true,
    },
    {
      id: 'experience',
      label: 'Expériences professionnelles',
      fields: [
        { id: 'company', label: 'Entreprise', type: 'text', required: true },
        { id: 'position', label: 'Poste', type: 'text', required: true },
        { id: 'startDate', label: 'Date de début', type: 'date' },
        { id: 'endDate', label: 'Date de fin', type: 'date' },
        { id: 'description', label: 'Description', type: 'textarea' },
      ],
      allowMultiple: true,
    },
    {
      id: 'education',
      label: 'Formations',
      fields: [
        { id: 'institution', label: 'Institution', type: 'text', required: true },
        { id: 'degree', label: 'Diplôme', type: 'text', required: true },
        { id: 'field', label: 'Domaine', type: 'text' },
        { id: 'startDate', label: 'Date de début', type: 'date' },
        { id: 'endDate', label: 'Date de fin', type: 'date' },
      ],
      allowMultiple: true,
    },
    {
      id: 'skills',
      label: 'Compétences',
      fields: [
        { id: 'name', label: 'Compétence', type: 'text', required: true },
        { id: 'category', label: 'Catégorie', type: 'text' },
      ],
      allowMultiple: true,
    },
  ],
};

// Registre de toutes les configurations
export const templateFieldsRegistry: Record<TemplateType, TemplateFieldConfig> = {
  resumeIoStyle: sidebarModeConfig, // Fallback temporaire
  canvaPremium: sidebarModeConfig,
  novoresume: sidebarModeConfig,
  enhancv: sidebarElegantConfig,
  reactiveResume: sidebarModeConfig,
  sidebarMode: sidebarModeConfig,
  sidebarElegant: sidebarElegantConfig,
};

/**
 * Récupère la config pour un template donné
 */
export function getTemplateFieldConfig(templateId: TemplateType): TemplateFieldConfig {
  return templateFieldsRegistry[templateId] || sidebarModeConfig;
}

/**
 * Récupère les sections pour un template donné
 */
export function getTemplateSections(templateId: TemplateType): SectionConfig[] {
  return getTemplateFieldConfig(templateId).sections;
}

/**
 * Valide si un champ est requis dans une section
 */
export function isFieldRequired(templateId: TemplateType, sectionId: string, fieldId: string): boolean {
  const config = getTemplateFieldConfig(templateId);
  const section = config.sections.find(s => s.id === sectionId);
  const field = section?.fields.find(f => f.id === fieldId);
  return field?.required ?? false;
}
