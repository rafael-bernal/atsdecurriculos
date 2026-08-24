import { AlertTriangle, Check, X } from "lucide-react";
import type { AnalysisResult } from "@/lib/cvmatch/types";

function Tag({ label, missing }: { label: string; missing?: boolean }) {
  return (
    <span
      className={
        missing
          ? "inline-flex items-center gap-1.5 rounded-full border border-warning/40 bg-warning/10 px-3 py-1.5 text-xs font-medium text-warning-foreground"
          : "inline-flex items-center gap-1.5 rounded-full border border-primary/25 bg-primary-soft px-3 py-1.5 text-xs font-medium text-primary"
      }
    >
      {missing ? <X className="size-3" /> : <Check className="size-3" />}
      {label}
    </span>
  );
}

export function KeywordAnalysis({ result }: { result: AnalysisResult }) {
  return (
    <section className="card-surface p-6 sm:p-8">
      <h2 className="font-display text-xl font-semibold">Keyword Analysis</h2>

      <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div>
          <h3 className="text-sm font-semibold">Found in Your Resume</h3>
          <div className="mt-3 flex flex-wrap gap-2">
            {result.keywordsFound.length ? (
              result.keywordsFound.map((k) => <Tag key={k} label={k} />)
            ) : (
              <p className="text-sm text-muted-foreground">
                No widely-indexed keywords were detected. Consider adding a clear skills section.
              </p>
            )}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold">Missing From Your Resume</h3>
          <div className="mt-3 flex flex-wrap gap-2">
            {result.keywordsMissing.length ? (
              result.keywordsMissing.map((k) => <Tag key={k} label={k} missing />)
            ) : (
              <p className="text-sm text-muted-foreground">
                {result.hasJob
                  ? "Nothing significant is missing — your vocabulary covers this posting well."
                  : "Add a job description to see which keywords a specific role expects."}
              </p>
            )}
          </div>
        </div>
      </div>

      <p className="mt-7 text-sm leading-relaxed text-muted-foreground">
        These keywords appear relevant to the job description but are not clearly represented in
        your resume.
      </p>
      <p className="mt-3 flex gap-2.5 rounded-xl border border-warning/30 bg-warning/10 p-4 text-sm text-foreground">
        <AlertTriangle className="mt-0.5 size-4 shrink-0 text-warning" />
        Only add keywords that accurately reflect your real experience and skills.
      </p>
    </section>
  );
}
