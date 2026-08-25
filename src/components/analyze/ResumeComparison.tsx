import { ArrowLeftRight } from "lucide-react";
import { optimizedToText } from "@/lib/cvmatch/engine";
import type { AnalysisResult } from "@/lib/cvmatch/types";

const changes = [
  "Improved clarity",
  "Stronger wording",
  "Better keyword positioning",
  "Better achievement descriptions",
  "Improved structure",
];

export function ResumeComparison({
  original,
  result,
}: {
  original: string;
  result: AnalysisResult;
}) {
  return (
    <section className="card-surface p-6 sm:p-8">
      <div className="flex items-center gap-2.5">
        <ArrowLeftRight className="size-5 text-primary" />
        <h2 className="font-display text-xl font-semibold">Original vs Optimized</h2>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        {changes.map((c) => (
          <span
            key={c}
            className="rounded-full border border-primary/25 bg-primary-soft px-3 py-1 text-xs font-medium text-primary"
          >
            {c}
          </span>
        ))}
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-border bg-surface p-5">
          <h3 className="text-sm font-semibold text-muted-foreground">Original Resume</h3>
          <pre className="mt-3 max-h-[420px] overflow-auto whitespace-pre-wrap font-sans text-xs leading-relaxed text-muted-foreground">
            {original}
          </pre>
        </div>
        <div className="rounded-2xl border border-primary/25 bg-primary-soft/40 p-5">
          <h3 className="text-sm font-semibold text-primary">Optimized Resume</h3>
          <pre className="mt-3 max-h-[420px] overflow-auto whitespace-pre-wrap font-sans text-xs leading-relaxed text-foreground">
            {optimizedToText(result.optimized)}
          </pre>
        </div>
      </div>
    </section>
  );
}
