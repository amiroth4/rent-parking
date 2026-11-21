import * as React from "react";
import { cn } from "@/lib/utils";

export interface StatCardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  tone?: "slate" | "emerald" | "indigo" | "amber";
  hint?: string;
}

const toneClasses = {
  slate: "bg-slate-100 text-slate-700",
  emerald: "bg-emerald-50 text-emerald-700",
  indigo: "bg-indigo-50 text-indigo-700",
  amber: "bg-amber-50 text-amber-700",
};

export function StatCard({
  label,
  value,
  icon,
  tone = "slate",
  hint,
}: StatCardProps) {
  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-3.5 shadow-[0_1px_2px_rgba(15,23,42,0.03)]">
      <div className="flex items-center justify-between gap-2">
        <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">
          {label}
        </span>
        <span
          className={cn(
            "h-8 w-8 rounded-xl flex items-center justify-center shrink-0",
            toneClasses[tone]
          )}
        >
          {icon}
        </span>
      </div>
      <div className="mt-2 text-2xl font-extrabold text-slate-900 tracking-tight">
        {value}
      </div>
      {hint && <p className="mt-0.5 text-[11px] text-slate-500">{hint}</p>}
    </div>
  );
}
