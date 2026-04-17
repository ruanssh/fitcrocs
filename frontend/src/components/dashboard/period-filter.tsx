import { CalendarRange } from 'lucide-react';

type PeriodFilterProps = {
  from: string;
  to: string;
  onChangeFrom: (value: string) => void;
  onChangeTo: (value: string) => void;
};

export function PeriodFilter({
  from,
  to,
  onChangeFrom,
  onChangeTo,
}: PeriodFilterProps) {
  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white/95 p-4 shadow-[0_10px_30px_-24px_rgba(0,0,0,0.35)] backdrop-blur-sm">
      <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-700">
        <CalendarRange className="h-4 w-4 text-emerald-600" />
        <span>Periodo de analise</span>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-medium uppercase tracking-wide text-slate-500">
            De
          </span>
          <input
            type="month"
            value={from}
            onChange={(event) => onChangeFrom(event.target.value)}
            className="rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-sm text-slate-800 outline-none ring-emerald-500 transition focus:bg-white focus:ring-2"
          />
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-medium uppercase tracking-wide text-slate-500">
            Ate
          </span>
          <input
            type="month"
            value={to}
            onChange={(event) => onChangeTo(event.target.value)}
            className="rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-sm text-slate-800 outline-none ring-emerald-500 transition focus:bg-white focus:ring-2"
          />
        </label>
      </div>
    </div>
  );
}
