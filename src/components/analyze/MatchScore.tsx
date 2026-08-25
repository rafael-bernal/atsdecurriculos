import type { AnalysisResult } from "@/lib/cvmatch/types";
import { ProgressRow } from "./ProgressRow";
import { ScoreRing } from "./ScoreRing";
import { StatTile } from "./StatTile";

function verdict(score: number, hasJob: boolean) {
  if (!hasJob) return "Qualidade geral do currículo com base em estrutura, clareza e habilidades";
  if (score >= 85) return "Ótima compatibilidade com esta vaga";
  if (score >= 70) return "Boa compatibilidade — algumas lacunas a resolver";
  if (score >= 55) return "Compatibilidade parcial — lacunas relevantes a resolver";
  return "Baixa compatibilidade — reposicionamento significativo necessário";
}

export function MatchScore({ result }: { result: AnalysisResult }) {
  return (
    <section className="card-surface p-6 sm:p-8">
      <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-[auto_1fr]">
        <div className="mx-auto">
          <h2 className="mb-5 text-center font-display text-lg font-semibold lg:text-left">
            {result.hasJob ? "Pontuação de Compatibilidade do Currículo" : "Pontuação do Currículo"}
          </h2>
          <ScoreRing
            value={result.matchScore}
            size={196}
            sublabel={verdict(result.matchScore, result.hasJob)}
          />
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          <StatTile label="Pontuação ATS" value={`${result.atsScore}%`} />
          <StatTile label="Compatibilidade" value={result.hasJob ? `${result.matchScore}%` : "—"} />
          <StatTile
            label="Palavras-chave"
            value={
              result.hasJob
                ? `${result.keywordsFound.length} / ${result.keywordsFound.length + result.keywordsMissing.length}`
                : String(result.keywordsFound.length)
            }
          />
          <StatTile
            label="Requisitos Atendidos"
            value={result.hasJob ? `${result.requirementsMet} / ${result.requirementsTotal}` : "—"}
          />
          <StatTile label="Melhorias" value={String(result.improvements.length)} tone="warning" />
        </div>
      </div>

      <div className="mt-9 border-t border-border pt-7">
        <h3 className="font-display text-lg font-semibold">Por que essa pontuação?</h3>
        <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
          {result.breakdown.map((b, i) => (
            <ProgressRow key={b.label} label={b.label} value={b.value} delay={i * 80} />
          ))}
        </div>
      </div>
    </section>
  );
}
