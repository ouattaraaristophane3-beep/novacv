/**
 * Sections de compétences avec variantes
 */
import { Skill, TemplateContext } from '../types';

interface SkillsSectionProps {
  skills: Skill[];
  ctx: TemplateContext;
  variant?: 'bars' | 'tags' | 'dots' | 'badges' | 'minimal';
  maxCols?: number;
}

export function SkillBar({ skill, ctx }: { skill: Skill; ctx: TemplateContext }) {
  const percentage = ((skill.level || 3) / 5) * 100;
  return (
    <div className="mb-2">
      <div className="flex justify-between items-center mb-0.5">
        <span className="text-xs font-medium text-gray-900">{skill.name}</span>
        <span className="text-xs text-gray-500">{skill.level || 3}/5</span>
      </div>
      <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all"
          style={{
            width: `${percentage}%`,
            backgroundColor: ctx.palette.primary,
          }}
        />
      </div>
    </div>
  );
}

export function SkillDot({ skill }: { skill: Skill }) {
  const dots = Array.from({ length: 5 }, (_, i) => i < (skill.level || 3));
  return (
    <div className="flex items-center gap-2 mb-2">
      <span className="text-xs font-medium text-gray-900 flex-1">{skill.name}</span>
      <div className="flex gap-1">
        {dots.map((filled, i) => (
          <div
            key={i}
            className={`w-1.5 h-1.5 rounded-full ${filled ? 'bg-gray-900' : 'bg-gray-300'}`}
          />
        ))}
      </div>
    </div>
  );
}

export function SkillTag({ skill, ctx }: { skill: Skill; ctx: TemplateContext }) {
  return (
    <span
      className="inline-block px-2.5 py-1 rounded-full text-xs font-medium text-white"
      style={{ backgroundColor: ctx.palette.primary }}
    >
      {skill.name}
    </span>
  );
}

export function SkillBadge({ skill, ctx }: { skill: Skill; ctx: TemplateContext }) {
  return (
    <span
      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium text-white"
      style={{ backgroundColor: ctx.palette.primary }}
    >
      {skill.name}
      <span className="opacity-80 font-bold">{skill.level || 3}</span>
    </span>
  );
}

export function SkillMinimal({ skill }: { skill: Skill }) {
  return (
    <span className="text-xs text-gray-700">
      {skill.name}
    </span>
  );
}

interface CategorySkillsProps {
  category: string;
  skills: Skill[];
  ctx: TemplateContext;
  variant: 'bars' | 'tags' | 'dots' | 'badges' | 'minimal';
}

function CategorySkills({ category, skills, ctx, variant }: CategorySkillsProps) {
  if (skills.length === 0) return null;

  return (
    <div className="mb-4">
      <p className="text-xs font-bold uppercase tracking-wide text-gray-700 mb-2">{category}</p>
      <div className={variant === 'bars' || variant === 'dots' ? '' : 'flex flex-wrap gap-2'}>
        {skills.map((skill) => {
          switch (variant) {
            case 'bars':
              return <SkillBar key={skill.id} skill={skill} ctx={ctx} />;
            case 'dots':
              return <SkillDot key={skill.id} skill={skill} />;
            case 'tags':
              return <SkillTag key={skill.id} skill={skill} ctx={ctx} />;
            case 'badges':
              return <SkillBadge key={skill.id} skill={skill} ctx={ctx} />;
            case 'minimal':
              return <SkillMinimal key={skill.id} skill={skill} />;
            default:
              return null;
          }
        })}
      </div>
    </div>
  );
}

export function SkillsSection({
  skills,
  ctx,
  variant = 'bars',
}: SkillsSectionProps) {
  if (!skills.length) return null;

  // Grouper par catégorie
  const categorized = skills.reduce((acc, skill) => {
    const cat = skill.category || 'General';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(skill);
    return acc;
  }, {} as Record<string, Skill[]>);

  return (
    <div>
      {Object.entries(categorized).map(([category, categorySkills]) => (
        <CategorySkills
          key={category}
          category={category}
          skills={categorySkills}
          ctx={ctx}
          variant={variant}
        />
      ))}
    </div>
  );
}
