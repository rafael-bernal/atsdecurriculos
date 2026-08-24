import { CheckCircle2 } from "lucide-react";
import { ProgressRow } from "@/components/analyze/ProgressRow";

const rows = [
  { label: "Structure", value: 92 },
  { label: "Keywords", value: 84 },
  { label: "Readability", value: 96 },
  { label: "Formatting", value: 90 },
  { label: "Section Organization", value: 94 },
];

const points = [
  "Detects headings that parsers commonly fail to read.",
  "Compares your terminology against the exact posting you target.",
  "Flags duty-based phrasing that hides real achievements.",
  "Never suggests adding a skill you do not actually have.",
];

export function AtsSection() {
  return (
    <section id="ats" className="scroll-mt-20 border-y border-border bg-surface py-20 sm:py-28">
      <div className="mx-auto grid w-full max-w-6xl grid-cols-1 items-center gap-12 px-5 sm:px-8 lg:grid-cols-2">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
            ATS compatibility
          </p>
          <h2 className="mt-3 text-balance-tight text-3xl font-bold sm:text-4xl">
            Most resumes are read by software before a human sees them.
          </h2>
          <p className="mt-5 text-base leading-relaxed text-muted-foreground">
            Applicant Tracking Systems parse, index and rank your resume. CVMatch AI evaluates the
            structural signals those systems depend on and shows you exactly where you lose ground.
          </p>
          <ul className="mt-7 space-y-3">
            {points.map((p) => (
              <li key={p} className="flex gap-3 text-sm text-surface-foreground">
                <CheckCircle2 className="mt-0.5 size-[18px] shrink-0 text-primary" />
                <span>{p}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="card-surface p-6 sm:p-8">
          <h3 className="text-lg font-semibold">ATS Compatibility</h3>
          <p className="mt-1 text-sm text-muted-foreground">Example breakdown</p>
          <div className="mt-6 space-y-5">
            {rows.map((r, i) => (
              <ProgressRow key={r.label} label={r.label} value={r.value} delay={i * 90} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
