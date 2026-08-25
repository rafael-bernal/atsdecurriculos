import { BarChart3, Braces, FileCheck2, KeyRound, Sparkles, Target } from "lucide-react";

const features = [
  {
    icon: FileCheck2,
    title: "Pontuação ATS",
    body: "Entenda como seu currículo pode se sair em Sistemas de Rastreamento de Candidatos.",
  },
  {
    icon: Target,
    title: "Compatibilidade com a Vaga",
    body: "Veja o quão próximo seu currículo está de uma descrição de vaga específica.",
  },
  {
    icon: Braces,
    title: "Análise Técnica",
    body: "Identifique habilidades técnicas relevantes que estão ausentes ou mal apresentadas.",
  },
  {
    icon: BarChart3,
    title: "Análise Profissional",
    body: "Avalie o posicionamento profissional, experiência, senioridade e narrativa de carreira.",
  },
  {
    icon: KeyRound,
    title: "Análise de Palavras-chave",
    body: "Identifique palavras-chave importantes da descrição da vaga e compare-as com o currículo.",
  },
  {
    icon: Sparkles,
    title: "Otimização de Currículo com IA",
    body: "Gere uma versão mais clara, mais forte e compatível com ATS do currículo.",
  },
];

export function Features() {
  return (
    <section id="features" className="scroll-mt-20 py-20 sm:py-28">
      <div className="mx-auto w-full max-w-6xl px-5 sm:px-8">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Recursos</p>
        <h2 className="mt-3 max-w-2xl text-balance-tight text-3xl font-bold sm:text-4xl">
          Tudo o que você precisa para melhorar sua próxima candidatura.
        </h2>

        <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <article key={f.title} className="card-surface card-interactive p-6">
              <span className="grid size-10 place-items-center rounded-xl bg-primary-soft">
                <f.icon className="size-[18px] text-primary" />
              </span>
              <h3 className="mt-5 text-lg font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
