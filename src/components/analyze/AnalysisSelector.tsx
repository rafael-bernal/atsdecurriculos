import { Check } from "lucide-react";
import type { AnalysisType } from "@/lib/cvmatch/types";
import { cn } from "@/lib/utils";

const options: { id: AnalysisType; title: string; body: string }[] = [
  { id: "ats", title: "Análise de ATS", body: "Avalie a compatibilidade com sistemas ATS." },
  {
    id: "professional",
    title: "Análise Profissional",
    body: "Avalie o posicionamento de carreira e a apresentação profissional.",
  },
  {
    id: "technical",
    title: "Análise Técnica",
    body: "Avalie habilidades técnicas, ferramentas, tecnologias e qualificações.",
  },
  {
    id: "writing",
    title: "Análise de Redação",
    body: "Avalie clareza, gramática, estrutura e comunicação profissional.",
  },
  { id: "keywords", title: "Análise de Palavras-chave", body: "Identifique palavras-chave relevantes e ausentes." },
  { id: "complete", title: "Análise Completa", body: "Execute todas as análises disponíveis." },
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
      <h2 className="font-display text-lg font-semibold">O que você gostaria de analisar?</h2>
      <p className="mt-1 text-sm text-muted-foreground">Selecione uma ou mais opções. Você pode alterar isso depois.</p>

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
