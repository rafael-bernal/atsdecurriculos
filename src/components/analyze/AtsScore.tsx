import type { AnalysisResult } from "@/lib/cvmatch/types";
import { ProgressRow } from "./ProgressRow";

export function AtsScore({ result }: { result: AnalysisResult }) {
  return (
    <section className="card-surface p-6 sm:p-8">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="font-display text-xl font-semibold">ATS Compatibility</h2>
        <span className="font-display text-2xl font-bold tabular-nums text-primary">
          {result.atsScore}%
        </span>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
        {result.atsBreakdown.map((r, i) => (
          <ProgressRow key={r.label} label={r.label} value={r.value} delay={i * 80} />
        ))}
      </div>

      <p className="mt-7 rounded-xl bg-surface p-4 text-sm leading-relaxed text-muted-foreground">
        Your resume has a strong ATS-friendly structure, but there are opportunities to improve its
        relevance for this specific position.
      </p>
    </section>
  );
}
