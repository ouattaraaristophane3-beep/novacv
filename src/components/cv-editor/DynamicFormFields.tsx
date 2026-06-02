/**
 * Composant de formulaire dynamique
 * Génère des champs de formulaire basés sur la configuration
 */
import React from 'react';
import { FieldConfig, SectionConfig } from '../../lib/templateFieldsConfig';

interface DynamicFieldProps {
  field: FieldConfig;
  value?: string | number;
  onChange: (value: string | number) => void;
  onBlur?: () => void;
  error?: string;
}

export function DynamicField({
  field,
  value = '',
  onChange,
  onBlur,
  error,
}: DynamicFieldProps) {
  const baseClasses =
    'w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500';
  const errorClasses = error ? 'border-red-500 bg-red-50' : 'border-gray-300';

  const commonProps = {
    className: `${baseClasses} ${errorClasses}`,
    value,
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      onChange(e.target.value),
    onBlur,
  };

  return (
    <div className="space-y-1">
      <label className="block text-xs font-semibold text-gray-700">
        {field.label}
        {field.required && <span className="text-red-500 ml-1">*</span>}
      </label>

      {field.type === 'textarea' ? (
        <textarea
          {...commonProps}
          placeholder={field.placeholder}
          rows={3}
          maxLength={field.maxLength}
        />
      ) : field.type === 'date' ? (
        <input type="date" {...commonProps} />
      ) : field.type === 'email' ? (
        <input type="email" {...commonProps} placeholder={field.placeholder} />
      ) : field.type === 'phone' ? (
        <input type="tel" {...commonProps} placeholder={field.placeholder} />
      ) : field.type === 'number' ? (
        <input
          type="number"
          {...commonProps}
          placeholder={field.placeholder}
          min="1"
          max="5"
        />
      ) : field.type === 'url' ? (
        <input type="url" {...commonProps} placeholder={field.placeholder} />
      ) : (
        <input
          type="text"
          {...commonProps}
          placeholder={field.placeholder}
          maxLength={field.maxLength}
        />
      )}

      {field.helpText && <p className="text-xs text-gray-500">{field.helpText}</p>}
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}

interface DynamicSectionFormProps {
  section: SectionConfig;
  data?: Record<string, any>;
  onChange: (fieldId: string, value: any) => void;
  onBlur?: (fieldId: string) => void;
  errors?: Record<string, string>;
}

export function DynamicSectionForm({
  section,
  data = {},
  onChange,
  onBlur,
  errors = {},
}: DynamicSectionFormProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide">
        {section.label}
      </h3>

      {section.description && (
        <p className="text-xs text-gray-600">{section.description}</p>
      )}

      <div className="space-y-3">
        {section.fields.map((field) => (
          <DynamicField
            key={field.id}
            field={field}
            value={data[field.id] ?? ''}
            onChange={(value) => onChange(field.id, value)}
            onBlur={() => onBlur?.(field.id)}
            error={errors[field.id]}
          />
        ))}
      </div>
    </div>
  );
}
