import { ScoreRing } from "@/components/analyze/ScoreRing";
import { StatTile } from "@/components/analyze/StatTile";

const bars = [
  { label: "Experiência", value: 88 },
  { label: "Habilidades Técnicas", value: 81 },
  { label: "Palavras-chave", value: 76 },
  { label: "Estrutura ATS", value: 92 },
];

export function DashboardPreview() {
  return (
    <div className="card-surface relative overflow-hidden p-5 shadow-lift sm:p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Visão geral da análise
          </p>
          <p className="mt-1 font-display text-lg font-semibold">Analista de Dados Sênior</p>
        </div>
        <span className="rounded-full bg-primary-soft px-3 py-1 text-xs font-semibold text-primary">
          Pré-visualização ao vivo
        </span>
      </div>

      <div className="mt-6 flex flex-col items-center gap-6 rounded-2xl bg-surface p-5 sm:flex-row">
        <ScoreRing value={87} size={132} label="Compatibilidade com a Vaga" />
        <div className="w-full space-y-3">
          {bars.map((b) => (
            <div key={b.label}>
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-surface-foreground">{b.label}</span>
                <span className="tabular-nums text-muted-foreground">{b.value}%</span>
              </div>
              <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-gradient-primary transition-[width] duration-1000"
                  style={{ width: `${b.value}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatTile label="Pontuação ATS" value="92%" />
        <StatTile label="Palavras-chave" value="24 / 28" />
        <StatTile label="Requisitos" value="18 / 22" />
        <StatTile label="Melhorias" value="6" tone="warning" />
      </div>
    </div>
  );
}
