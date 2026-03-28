export function AppPageHeader({
  label,
  title,
  description,
}: {
  label: string;
  title: string;
  description: string;
}) {
  return (
    <header className="mb-10 pb-8 border-b border-zinc-900/[0.07]">
      <p className="lifeline-section-label mb-3">{label}</p>
      <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">{title}</h1>
      <p className="text-sm text-zinc-500 mt-2.5 max-w-lg leading-relaxed">{description}</p>
    </header>
  );
}
