interface SectionHeadingProps {
  eyebrow: string;
  title: string;
  description?: string;
}

export function SectionHeading({ eyebrow, title, description }: SectionHeadingProps) {
  return (
    <div className="max-w-2xl space-y-2">
      <p className="text-sm font-medium uppercase tracking-[0.18em] text-gold">{eyebrow}</p>
      <h2 className="text-3xl font-semibold text-primary">{title}</h2>
      {description && <p className="text-muted-foreground">{description}</p>}
    </div>
  );
}
