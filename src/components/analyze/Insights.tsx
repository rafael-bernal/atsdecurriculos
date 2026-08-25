import { AlertTriangle, CheckCircle2, Compass } from "lucide-react";
import type { AnalysisResult, Priority } from "@/lib/cvmatch/types";
import { cn } from "@/lib/utils";

const priorityStyles: Record<Priority, string> = {
  high: "border-destructive/30 bg-destructive/10 text-destructive",
  medium: "border-warning/40 bg-warning/10 text-warning",
  low: "border-border bg-muted text-muted-foreground",
};

const priorityLabel: Record<Priority, string> = {
  high: "High Priority",
  medium: "Medium Priority",
  low: "Low Priority",
};

export function PriorityBadge({ priority }: { priority: Priority }) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full border px-2.5 py-1 text-[11px] font-semibold",
        priorityStyles[priority],
      )}
    >
      {priorityLabel[priority]}
    </span>
  );
}

export function Strengths({ result }: { result: AnalysisResult }) {
  return (
    <section className="card-surface p-6 sm:p-8">
      <h2 className="font-display text-xl font-semibold">What's Working</h2>
      <ul className="mt-5 space-y-4">
        {result.strengths.map((s) => (
          <li key={s.title} className="flex gap-3">
            <CheckCircle2 className="mt-0.5 size-[18px] shrink-0 text-primary" />
            <div>
              <p className="text-sm font-semibold">{s.title}</p>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{s.detail}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function Improvements({ result }: { result: AnalysisResult }) {
  return (
    <section className="card-surface p-6 sm:p-8">
      <h2 className="font-display text-xl font-semibold">What You Should Improve</h2>
      <ul className="mt-5 space-y-4">
        {result.improvements.map((imp) => (
          <li key={imp.title} className="rounded-2xl border border-border bg-surface p-4">
            <div className="flex flex-wrap items-center gap-3">
              <PriorityBadge priority={imp.priority} />
              <p className="text-sm font-semibold">{imp.title}</p>
            </div>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{imp.detail}</p>
          </li>
        ))}
      </ul>
      <p className="mt-6 flex gap-2.5 text-xs text-muted-foreground">
        <AlertTriangle className="mt-0.5 size-3.5 shrink-0 text-warning" />
        Recommendations never ask you to claim skills you do not have. Where a requirement is
        missing, learn it, highlight related experience, or explain how your experience transfers.
      </p>
    </section>
  );
}

export function CareerInsights({ result }: { result: AnalysisResult }) {
  return (
    <section className="card-surface p-6 sm:p-8">
      <div className="flex items-center gap-2.5">
        <Compass className="size-5 text-primary" />
        <h2 className="font-display text-xl font-semibold">Career Insights</h2>
      </div>
      <p className="mt-1 text-sm text-muted-foreground">
        AI-generated suggestions based on your resume and target position.
      </p>
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {result.insights.map((i) => (
          <article key={i.title} className="rounded-2xl border border-border bg-surface p-5">
            <h3 className="text-sm font-semibold">{i.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{i.detail}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
