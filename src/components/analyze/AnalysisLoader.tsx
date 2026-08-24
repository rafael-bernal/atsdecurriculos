import { Check, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const ALL_STEPS = [
  "Analyzing your resume...",
  "Identifying relevant skills...",
  "Analyzing job requirements...",
  "Comparing keywords...",
  "Calculating compatibility...",
  "Generating personalized recommendations...",
  "Preparing your optimized resume...",
];

export function AnalysisLoader({ hasJob, onDone }: { hasJob: boolean; onDone: () => void }) {
  const steps = hasJob ? ALL_STEPS : ALL_STEPS.filter((s) => !/job requirements|compatibility/i.test(s));
  const [i, setI] = useState(0);

  useEffect(() => {
    const per = 420;
    const timers = steps.map((_, idx) =>
      window.setTimeout(() => setI(idx + 1), per * (idx + 1)),
    );
    const end = window.setTimeout(onDone, per * steps.length + 260);
    return () => {
      timers.forEach(window.clearTimeout);
      window.clearTimeout(end);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const pct = Math.round((i / steps.length) * 100);

  return (
    <section className="card-surface p-8 sm:p-10">
      <h2 className="font-display text-xl font-semibold">Analyzing your application</h2>
      <p className="mt-1 text-sm text-muted-foreground">This usually takes just a few seconds.</p>

      <div className="mt-6 h-2 overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-gradient-primary"
          style={{ width: `${pct}%`, transition: "width 420ms cubic-bezier(0.22,1,0.36,1)" }}
        />
      </div>

      <ul className="mt-7 space-y-3.5">
        {steps.map((s, idx) => {
          const done = idx < i;
          const active = idx === i;
          return (
            <li
              key={s}
              className={cn(
                "flex items-center gap-3 text-sm transition-colors",
                done ? "text-foreground" : active ? "text-foreground" : "text-muted-foreground/50",
              )}
            >
              <span
                className={cn(
                  "grid size-5 shrink-0 place-items-center rounded-full border",
                  done ? "border-primary bg-primary" : "border-border",
                )}
              >
                {done ? (
                  <Check className="size-3 text-primary-foreground" />
                ) : active ? (
                  <Loader2 className="size-3 animate-spin text-primary" />
                ) : null}
              </span>
              {s}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
