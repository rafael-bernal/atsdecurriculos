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
      <h2 className="font-display text-xl font-semibold">Análise de Palavras-chave</h2>

      <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div>
          <h3 className="text-sm font-semibold">Encontradas no seu currículo</h3>
          <div className="mt-3 flex flex-wrap gap-2">
            {result.keywordsFound.length ? (
              result.keywordsFound.map((k) => <Tag key={k} label={k} />)
            ) : (
              <p className="text-sm text-muted-foreground">
                Nenhuma palavra-chave amplamente indexada foi detectada. Considere adicionar uma
                seção clara de habilidades.
              </p>
            )}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold">Ausentes no seu currículo</h3>
          <div className="mt-3 flex flex-wrap gap-2">
            {result.keywordsMissing.length ? (
              result.keywordsMissing.map((k) => <Tag key={k} label={k} missing />)
            ) : (
              <p className="text-sm text-muted-foreground">
                {result.hasJob
                  ? "Nada significativo está faltando — seu vocabulário cobre bem esta vaga."
                  : "Adicione uma descrição de vaga para ver quais palavras-chave uma função específica exige."}
              </p>
            )}
          </div>
        </div>
      </div>

      <p className="mt-7 text-sm leading-relaxed text-muted-foreground">
        Essas palavras-chave parecem relevantes para a descrição da vaga, mas não estão claramente
        representadas no seu currículo.
      </p>
      <p className="mt-3 flex gap-2.5 rounded-xl border border-warning/30 bg-warning/10 p-4 text-sm text-foreground">
        <AlertTriangle className="mt-0.5 size-4 shrink-0 text-warning" />
        Adicione apenas palavras-chave que reflitam com precisão sua real experiência e habilidades.
      </p>
    </section>
  );
}
