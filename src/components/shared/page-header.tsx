import { ruledPaper } from "@/lib/ui";

interface PageHeaderProps {
  eyebrow: string;
  title: string;
  description: string;
}

export function PageHeader({ eyebrow, title, description }: PageHeaderProps) {
  return (
    <header className="border-b bg-secondary/60" style={ruledPaper}>
      <div className="mx-auto max-w-6xl px-5 py-14 sm:py-20">
        <p className="text-sm font-medium uppercase tracking-[0.18em] text-gold">{eyebrow}</p>
        <h1 className="mt-3 max-w-3xl text-4xl font-semibold text-primary sm:text-5xl">{title}</h1>
        <p className="mt-4 max-w-2xl text-lg text-muted-foreground">{description}</p>
      </div>
    </header>
  );
}
