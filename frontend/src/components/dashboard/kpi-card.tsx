type KpiCardProps = {
  title: string;
  value: string;
  description: string;
};

export function KpiCard({ title, value, description }: KpiCardProps) {
  return (
    <article className="relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white/95 p-5 shadow-[0_12px_40px_-26px_rgba(0,0,0,0.35)] backdrop-blur-sm transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_20px_45px_-28px_rgba(15,23,42,0.42)]">
      <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-gradient-to-br from-emerald-200/40 to-cyan-100/30 blur-2xl" />
      <p className="text-sm font-medium tracking-wide text-slate-500">{title}</p>
      <p className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">{value}</p>
      <p className="mt-2 text-sm text-slate-600">{description}</p>
    </article>
  );
}
