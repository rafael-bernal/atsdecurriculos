import { Check } from "lucide-react";
import type { AnalysisType } from "@/lib/cvmatch/types";
import { cn } from "@/lib/utils";

const options: { id: AnalysisType; title: string; body: string }[] = [
  { id: "ats", title: "ATS Analysis", body: "Evaluate ATS compatibility." },
  {
    id: "professional",
    title: "Professional Analysis",
    body: "Evaluate career positioning and professional presentation.",
  },
  {
    id: "technical",
    title: "Technical Analysis",
    body: "Evaluate technical skills, tools, technologies, and qualifications.",
  },
  {
    id: "writing",
    title: "Writing Analysis",
    body: "Evaluate clarity, grammar, structure, and professional communication.",
  },
  { id: "keywords", title: "Keyword Analysis", body: "Identify relevant and missing keywords." },
  { id: "complete", title: "Complete Analysis", body: "Run all available analyses." },
];

export function AnalysisSelector({
  selected,
  onChange,
}: {
  selected: AnalysisType[];
  onChange: (next: AnalysisType[]) => void;
}) {
  const toggle = (id: AnalysisType) => {
    if (id === "complete") {
      onChange(selected.includes("complete") ? [] : ["complete"]);
      return;
    }
    const base = selected.filter((s) => s !== "complete");
    onChange(base.includes(id) ? base.filter((s) => s !== id) : [...base, id]);
  };

  return (
    <section className="card-surface p-6 sm:p-8">
      <h2 className="font-display text-lg font-semibold">What would you like to analyze?</h2>
      <p className="mt-1 text-sm text-muted-foreground">Select one or more. You can change this later.</p>

      <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {options.map((o) => {
          const active = selected.includes(o.id);
          return (
            <button
              key={o.id}
              type="button"
              onClick={() => toggle(o.id)}
              aria-pressed={active}
              className={cn(
                "group relative rounded-2xl border border-border bg-surface p-5 text-left transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/40",
                active && "border-primary bg-primary-soft/60 ring-1 ring-primary/25",
              )}
            >
              <span
                className={cn(
                  "absolute right-4 top-4 grid size-5 place-items-center rounded-full border border-border transition-colors",
                  active && "border-primary bg-primary",
                )}
              >
                {active && <Check className="size-3 text-primary-foreground" />}
              </span>
              <h3 className="pr-8 text-sm font-semibold">{o.title}</h3>
              <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">{o.body}</p>
            </button>
          );
        })}
      </div>
    </section>
  );
}
