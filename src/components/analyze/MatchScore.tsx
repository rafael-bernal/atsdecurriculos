import type { AnalysisResult } from "@/lib/cvmatch/types";
import { ProgressRow } from "./ProgressRow";
import { ScoreRing } from "./ScoreRing";
import { StatTile } from "./StatTile";

function verdict(score: number, hasJob: boolean) {
  if (!hasJob) return "Overall resume quality based on structure, clarity and skill signals";
  if (score >= 85) return "Strong match with this position";
  if (score >= 70) return "Good match — a few gaps to close";
  if (score >= 55) return "Partial match — meaningful gaps to address";
  return "Weak match — significant repositioning needed";
}

export function MatchScore({ result }: { result: AnalysisResult }) {
  return (
    <section className="card-surface p-6 sm:p-8">
      <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-[auto_1fr]">
        <div className="mx-auto">
          <h2 className="mb-5 text-center font-display text-lg font-semibold lg:text-left">
            {result.hasJob ? "Resume Match Score" : "Resume Score"}
          </h2>
          <ScoreRing
            value={result.matchScore}
            size={196}
            sublabel={verdict(result.matchScore, result.hasJob)}
          />
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          <StatTile label="ATS Score" value={`${result.atsScore}%`} />
          <StatTile label="Job Match" value={result.hasJob ? `${result.matchScore}%` : "—"} />
          <StatTile
            label="Keywords"
            value={
              result.hasJob
                ? `${result.keywordsFound.length} / ${result.keywordsFound.length + result.keywordsMissing.length}`
                : String(result.keywordsFound.length)
            }
          />
          <StatTile
            label="Requirements Met"
            value={result.hasJob ? `${result.requirementsMet} / ${result.requirementsTotal}` : "—"}
          />
          <StatTile label="Improvements" value={String(result.improvements.length)} tone="warning" />
        </div>
      </div>

      <div className="mt-9 border-t border-border pt-7">
        <h3 className="font-display text-lg font-semibold">Why this score?</h3>
        <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
          {result.breakdown.map((b, i) => (
            <ProgressRow key={b.label} label={b.label} value={b.value} delay={i * 80} />
          ))}
        </div>
      </div>
    </section>
  );
}
