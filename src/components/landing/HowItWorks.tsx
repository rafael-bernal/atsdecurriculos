const steps = [
  {
    n: "01",
    title: "Cole Seu Currículo",
    body: "Cole seu currículo diretamente na plataforma. Sem upload e sem necessidade de conta.",
  },
  { n: "02", title: "Escolha Sua Análise", body: "Escolha exatamente o que você quer analisar." },
  {
    n: "03",
    title: "Adicione uma Descrição de Vaga",
    body: "Opcionalmente, cole a descrição da vaga para a qual deseja se candidatar.",
  },
  {
    n: "04",
    title: "Melhore Seu Currículo",
    body: "Receba recomendações personalizadas e gere uma versão otimizada.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="scroll-mt-20 border-t border-border bg-surface py-20 sm:py-28">
      <div className="mx-auto w-full max-w-6xl px-5 sm:px-8">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Como funciona</p>
        <h2 className="mt-3 max-w-2xl text-balance-tight text-3xl font-bold sm:text-4xl">
          Do currículo à candidatura otimizada em minutos.
        </h2>

        <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s) => (
            <div key={s.n} className="card-surface card-interactive p-6">
              <span className="font-display text-sm font-bold tabular-nums text-primary/60">
                {s.n}
              </span>
              <h3 className="mt-4 text-lg font-semibold">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
