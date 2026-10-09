export function DashHeading({ title, text }: { title: string; text: string }) {
  return (
    <div>
      <h1 className="text-3xl font-semibold text-primary">{title}</h1>
      <p className="mt-1 text-muted-foreground">{text}</p>
    </div>
  );
}