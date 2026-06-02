import type { FC } from 'react';
import { TemplateType } from '../../../lib/themes';
import { normalizeTemplate } from '../../../lib/cvTypes';
import { TemplateProps } from '../core/types';
import { ResumeIOStyleTemplate } from './ResumeIOStyleTemplate';
import { CanvaPremiumTemplate } from './CanvaPremiumTemplate';
import { NovoresumeTemplate } from './NovoresumeTemplate';
import { EnhancvTemplate } from './EnhancvTemplate';
import { ReactiveResumeTemplate } from './ReactiveResumeTemplate';
import { SidebarModeTemplate } from './SidebarModeTemplate';
import { SidebarElegantTemplate } from './SidebarElegantTemplate';

export type { TemplateProps };

export const templateRegistry: Record<TemplateType, FC<TemplateProps>> = {
  resumeIoStyle: ResumeIOStyleTemplate,
  canvaPremium: CanvaPremiumTemplate,
  novoresume: NovoresumeTemplate,
  enhancv: EnhancvTemplate,
  reactiveResume: ReactiveResumeTemplate,
  sidebarMode: SidebarModeTemplate,
  sidebarElegant: SidebarElegantTemplate,
};

export function getTemplate(templateType: TemplateType | string): FC<TemplateProps> {
  const key = normalizeTemplate(templateType);
  return templateRegistry[key] || templateRegistry.resumeIoStyle;
}

export function isValidTemplate(templateType: string): templateType is TemplateType {
  return templateType in templateRegistry;
}

export function getAllTemplates(): TemplateType[] {
  return Object.keys(templateRegistry) as TemplateType[];
}
