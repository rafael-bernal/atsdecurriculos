import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

export function JobDescriptionInput({
  hasJob,
  setHasJob,
  value,
  onChange,
  onAnalyze,
  canAnalyze,
}: {
  hasJob: boolean | null;
  setHasJob: (v: boolean) => void;
  value: string;
  onChange: (v: string) => void;
  onAnalyze: () => void;
  canAnalyze: boolean;
}) {
  const options = [
    { label: "Sim, quero analisar uma vaga específica", value: true },
    { label: "Não, apenas analisar meu currículo", value: false },
  ];

  return (
    <section className="card-surface p-6 sm:p-8">
      <h2 className="font-display text-lg font-semibold">Você está se candidatando a uma vaga específica?</h2>

      <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {options.map((o) => (
          <button
            key={o.label}
            type="button"
            onClick={() => setHasJob(o.value)}
            aria-pressed={hasJob === o.value}
            className={cn(
              "rounded-2xl border border-border bg-surface px-5 py-4 text-left text-sm font-medium transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/40",
              hasJob === o.value && "border-primary bg-primary-soft/60 ring-1 ring-primary/25",
            )}
          >
            {o.label}
          </button>
        ))}
      </div>

      {hasJob === true && (
        <div className="mt-6 animate-rise">
          <label htmlFor="jd" className="text-sm font-semibold">
            Descrição da vaga
          </label>
          <Textarea
            id="jd"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Cole aqui a descrição completa da vaga..."
            className="mt-3 min-h-[240px] resize-y rounded-2xl border-border bg-surface p-4 text-sm leading-relaxed focus-visible:ring-primary/30"
          />
          <p className="mt-2 text-xs text-muted-foreground tabular-nums">
            {value.trim() ? value.trim().split(/\s+/).length.toLocaleString() : 0} palavras
          </p>
        </div>
      )}

      {hasJob !== null && (
        <div className="mt-7 flex justify-end">
          <Button onClick={onAnalyze} disabled={!canAnalyze} className="h-11 rounded-full px-6">
            <Sparkles className="size-4" />
            {hasJob ? "Comparar Currículo com a Vaga" : "Analisar Meu Currículo"}
          </Button>
        </div>
      )}
    </section>
  );
}
