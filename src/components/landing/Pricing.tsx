import { Link } from "@tanstack/react-router";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const plans = [
  {
    name: "Grátis",
    price: "R$0",
    note: "Sem necessidade de conta",
    features: [
      "1 análise de currículo",
      "Pontuação ATS básica",
      "Recomendações básicas",
      "Pontuação de compatibilidade com a vaga",
    ],
    cta: "Começar Grátis",
    featured: false,
  },
  {
    name: "Pro",
    price: "R$59",
    note: "por mês",
    features: [
      "Análises de currículo ilimitadas",
      "Comparações de vagas ilimitadas",
      "Análise ATS avançada",
      "Otimização de currículo com IA",
      "Análise de palavras-chave",
      "Versões de currículo",
    ],
    cta: "Começar com o Pro",
    featured: true,
  },
  {
    name: "Premium",
    price: "R$119",
    note: "por mês",
    features: [
      "Tudo do plano Pro",
      "Insights avançados de carreira",
      "Múltiplas versões de currículo",
      "Direcionamento avançado de vagas",
      "Análise prioritária com IA",
    ],
    cta: "Obter o Premium",
    featured: false,
  },
];

export function Pricing() {
  return (
    <section id="pricing" className="scroll-mt-20 py-20 sm:py-28">
      <div className="mx-auto w-full max-w-6xl px-5 sm:px-8">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Preços</p>
          <h2 className="mt-3 text-balance-tight text-3xl font-bold sm:text-4xl">
            Planos simples para cada etapa da sua busca por emprego.
          </h2>
          <p className="mt-4 text-muted-foreground">
            O produto principal é gratuito para uso agora — sem conta, sem cartão, sem configuração.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-5 lg:grid-cols-3">
          {plans.map((p) => (
            <div
              key={p.name}
              className={cn(
                "card-surface card-interactive flex flex-col p-7",
                p.featured && "border-primary/40 ring-1 ring-primary/15",
              )}
            >
              <div className="flex items-center justify-between">
                <h3 className="font-display text-lg font-semibold">{p.name}</h3>
                {p.featured && (
                  <span className="rounded-full bg-primary-soft px-2.5 py-1 text-[11px] font-semibold text-primary">
                    Mais popular
                  </span>
                )}
              </div>
              <div className="mt-5 flex items-baseline gap-2">
                <span className="font-display text-4xl font-bold tracking-tight">{p.price}</span>
                <span className="text-sm text-muted-foreground">{p.note}</span>
              </div>
              <ul className="mt-7 flex-1 space-y-3">
                {p.features.map((f) => (
                  <li key={f} className="flex gap-2.5 text-sm">
                    <Check className="mt-0.5 size-4 shrink-0 text-primary" />
                    <span className="text-muted-foreground">{f}</span>
                  </li>
                ))}
              </ul>
              <Button
                asChild
                variant={p.featured ? "default" : "outline"}
                className="mt-8 h-11 w-full rounded-full"
              >
                <Link to="/analyze">{p.cta}</Link>
              </Button>
            </div>
          ))}
        </div>

        <p className="mt-6 text-xs text-muted-foreground">
          Os planos pagos ainda não estão ativos. Tudo o que é mostrado hoje funciona de forma gratuita e anônima no seu
          navegador.
        </p>
      </div>
    </section>
  );
}
