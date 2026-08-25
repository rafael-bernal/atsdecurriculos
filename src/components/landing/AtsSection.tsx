import { CheckCircle2 } from "lucide-react";
import { ProgressRow } from "@/components/analyze/ProgressRow";

const rows = [
  { label: "Estrutura", value: 92 },
  { label: "Palavras-chave", value: 84 },
  { label: "Legibilidade", value: 96 },
  { label: "Formatação", value: 90 },
  { label: "Organização de Seções", value: 94 },
];

const points = [
  "Detecta cabeçalhos que os leitores automáticos costumam falhar em reconhecer.",
  "Compara sua terminologia com a vaga exata que você está buscando.",
  "Sinaliza frases baseadas em funções que escondem conquistas reais.",
  "Nunca sugere adicionar uma habilidade que você não possui de fato.",
];

export function AtsSection() {
  return (
    <section id="ats" className="scroll-mt-20 border-y border-border bg-surface py-20 sm:py-28">
      <div className="mx-auto grid w-full max-w-6xl grid-cols-1 items-center gap-12 px-5 sm:px-8 lg:grid-cols-2">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
            Compatibilidade com ATS
          </p>
          <h2 className="mt-3 text-balance-tight text-3xl font-bold sm:text-4xl">
            A maioria dos currículos é lida por software antes de chegar a uma pessoa.
          </h2>
          <p className="mt-5 text-base leading-relaxed text-muted-foreground">
            Sistemas de Rastreamento de Candidatos (ATS) analisam, indexam e classificam seu currículo. O CVMatch AI avalia os
            sinais estruturais dos quais esses sistemas dependem e mostra exatamente onde você perde pontos.
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
          <h3 className="text-lg font-semibold">Compatibilidade ATS</h3>
          <p className="mt-1 text-sm text-muted-foreground">Exemplo de detalhamento</p>
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
