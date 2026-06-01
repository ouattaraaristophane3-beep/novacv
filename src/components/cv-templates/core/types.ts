import { Database } from '../../../lib/supabase';
import { ColorPalette } from '../../../lib/themes';
import { PersonalInfo } from '../../../lib/cvTypes';
import { CvCustomization } from '../../../lib/cvCustomization';

export type CV = Database['public']['Tables']['cvs']['Row'];
export type Experience = Database['public']['Tables']['experiences']['Row'];
export type Education = Database['public']['Tables']['education']['Row'];
export type Skill = Database['public']['Tables']['skills']['Row'];

export interface TemplateProps {
  cv: CV;
  experiences: Experience[];
  education: Education[];
  skills: Skill[];
}

export interface TemplateContext extends TemplateProps {
  lang: string;
  palette: ColorPalette;
  info: PersonalInfo;
  customization: CvCustomization;
  labels: ReturnType<typeof import('../../../lib/cvCustomization').getLabels>;
  scale: number;
}
