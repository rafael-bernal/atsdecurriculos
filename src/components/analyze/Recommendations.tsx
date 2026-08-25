import { Check, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import type { AnalysisResult } from "@/lib/cvmatch/types";
import { PriorityBadge } from "./Insights";

export function Recommendations({ result }: { result: AnalysisResult }) {
  const [status, setStatus] = useState<Record<string, "applied" | "dismissed">>({});

  return (
    <section className="card-surface p-6 sm:p-8">
      <h2 className="font-display text-xl font-semibold">Personalized AI Recommendations</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Each suggestion rewrites what you already wrote — it never adds new facts.
      </p>

      <div className="mt-6 space-y-4">
        {result.recommendations.map((r) => {
          const s = status[r.id];
          return (
            <article
              key={r.id}
              className="rounded-2xl border border-border bg-surface p-5 transition-opacity"
              style={{ opacity: s === "dismissed" ? 0.5 : 1 }}
            >
              <div className="flex flex-wrap items-center gap-3">
                <PriorityBadge priority={r.priority} />
                <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  {r.category}
                </span>
              </div>

              <h3 className="mt-3 text-base font-semibold">{r.problem}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{r.why}</p>

              {r.current && (
                <div className="mt-4 rounded-xl border border-border bg-card p-4">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                    Current
                  </p>
                  <p className="mt-1.5 text-sm italic text-foreground">"{r.current}"</p>
                </div>
              )}

              <div className="mt-3 rounded-xl border border-primary/25 bg-primary-soft/50 p-4">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-primary">
                  Suggested
                </p>
                <p className="mt-1.5 text-sm leading-relaxed text-foreground">{r.suggested}</p>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                <Button
                  size="sm"
                  variant={s === "applied" ? "default" : "outline"}
                  className="rounded-full"
                  onClick={() => {
                    setStatus((p) => ({ ...p, [r.id]: "applied" }));
                    toast.success("Marked as applied", {
                      description: "Update this wording in your resume text, then re-run the analysis.",
                    });
                  }}
                >
                  <Check className="size-4" />
                  {s === "applied" ? "Applied" : "Apply Suggestion"}
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="rounded-full text-muted-foreground"
                  onClick={() => setStatus((p) => ({ ...p, [r.id]: "dismissed" }))}
                >
                  <X className="size-4" />
                  Dismiss
                </Button>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
