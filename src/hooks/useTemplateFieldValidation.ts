/**
 * Hook pour gérer la validation des champs de CV
 */
import { useState, useCallback } from 'react';
import { FieldConfig, getTemplateFieldConfig, type TemplateType } from '../lib/templateFieldsConfig';

interface ValidationErrors {
  [fieldId: string]: string;
}

export function useTemplateFieldValidation(templateId: TemplateType) {
  const [errors, setErrors] = useState<ValidationErrors>({});
  const templateConfig = getTemplateFieldConfig(templateId);

  const validateField = useCallback((fieldId: string, value: any): string | null => {
    // Trouver le champ dans toutes les sections
    let fieldConfig: FieldConfig | undefined;
    for (const section of templateConfig.sections) {
      const found = section.fields.find(f => f.id === fieldId);
      if (found) {
        fieldConfig = found;
        break;
      }
    }

    if (!fieldConfig) return null;

    // Validations de base
    if (fieldConfig.required && !value) {
      return `${fieldConfig.label} est obligatoire`;
    }

    // Validations spécifiques au type
    if (value) {
      if (fieldConfig.type === 'email' && !isValidEmail(value)) {
        return 'Email invalide';
      }
      if (fieldConfig.type === 'phone' && !isValidPhone(value)) {
        return 'Téléphone invalide';
      }
      if (fieldConfig.type === 'url' && !isValidUrl(value)) {
        return 'URL invalide';
      }
      if (fieldConfig.type === 'number') {
        const num = parseInt(value);
        if (isNaN(num) || num < 1 || num > 5) {
          return 'Niveau doit être entre 1 et 5';
        }
      }
    }

    return null;
  }, [templateConfig]);

  const validateSection = useCallback((sectionId: string, data: Record<string, any>) => {
    const section = templateConfig.sections.find(s => s.id === sectionId);
    if (!section) return {};

    const newErrors: ValidationErrors = {};
    for (const field of section.fields) {
      const error = validateField(field.id, data[field.id]);
      if (error) {
        newErrors[field.id] = error;
      }
    }
    return newErrors;
  }, [templateConfig, validateField]);

  const updateFieldError = useCallback((fieldId: string, error: string | null) => {
    setErrors(prev => {
      if (error) {
        return { ...prev, [fieldId]: error };
      } else {
        const { [fieldId]: _, ...rest } = prev;
        return rest;
      }
    });
  }, []);

  const clearErrors = useCallback(() => {
    setErrors({});
  }, []);

  const validateAll = useCallback((data: Record<string, any>): boolean => {
    const allErrors: ValidationErrors = {};
    for (const section of templateConfig.sections) {
      const sectionErrors = validateSection(section.id, data);
      Object.assign(allErrors, sectionErrors);
    }
    setErrors(allErrors);
    return Object.keys(allErrors).length === 0;
  }, [templateConfig, validateSection]);

  return {
    errors,
    validateField,
    validateSection,
    updateFieldError,
    clearErrors,
    validateAll,
  };
}

// Utilitaires de validation
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function isValidPhone(phone: string): boolean {
  const phoneRegex = /^[\d\s\-\+\(\)]{7,}$/;
  return phoneRegex.test(phone);
}

function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}
