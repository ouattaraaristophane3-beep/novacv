import { ReactNode, CSSProperties } from 'react';
import { fontFamilyClass } from '../../../lib/cvCustomization';
import { TemplateContext } from './types';

interface TemplateShellProps {
  ctx: TemplateContext;
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}

/** Conteneur A4 commun à tous les templates */
export function TemplateShell({ ctx, children, className = '', style }: TemplateShellProps) {
  const font = fontFamilyClass(ctx.customization.fontFamily ?? 'inter');
  const pad = `${Math.round(32 * ctx.scale)}px`;

  return (
    <div
      className={`w-[210mm] min-h-[297mm] bg-white text-gray-800 leading-relaxed ${font} ${className}`}
      style={{
        padding: pad,
        fontSize: `${10.5 * ctx.scale}px`,
        color: ctx.palette.text,
        ...style,
      }}
    >
      {children}
    </div>
  );
}
