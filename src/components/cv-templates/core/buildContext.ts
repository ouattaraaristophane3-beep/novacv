import { parsePersonalInfo } from '../../../lib/cvTypes';
import { parseCustomization, spacingScale, getLabels } from '../../../lib/cvCustomization';
import { getCvPalette } from '../../../lib/themes';
import { TemplateProps, TemplateContext } from './types';

export function buildTemplateContext(props: TemplateProps): TemplateContext {
  const lang = (props.cv.language as string) || 'fr';
  const info = parsePersonalInfo(props.cv.personal_info);
  const parsedCustom = parseCustomization(props.cv.personal_info);
  const customization = {
    ...parsedCustom,
    showBirthDate: info.showBirthDate ?? parsedCustom.showBirthDate,
    showPhoto: parsedCustom.showPhoto ?? true,
    showSidebar: parsedCustom.showSidebar ?? true,
  };

  return {
    ...props,
    lang,
    palette: getCvPalette(props.cv.color_theme),
    info,
    customization,
    labels: getLabels(lang),
    scale: spacingScale(customization.spacing ?? 'normal'),
  };
}
