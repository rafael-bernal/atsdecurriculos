import { Link } from "@tanstack/react-router";
import { ArrowRight, ShieldCheck, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DashboardPreview } from "./DashboardPreview";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-hero-glow">
      <div className="mx-auto grid w-full max-w-6xl grid-cols-1 items-center gap-14 px-5 pb-20 pt-16 sm:px-8 lg:grid-cols-[1.05fr_1fr] lg:gap-12 lg:pb-28 lg:pt-24">
        <div className="animate-rise">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground shadow-soft">
            <Sparkles className="size-3.5 text-primary" />
            Inteligência de currículo para descrições de vagas reais
          </span>

          <h1 className="mt-6 text-balance-tight text-4xl font-bold leading-[1.06] sm:text-5xl lg:text-[3.4rem]">
            Seu currículo pode estar perdendo oportunidades sem que você saiba.
          </h1>

          <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            Analise seu currículo com IA, entenda como ele se sai em sistemas ATS, compare-o
            com descrições de vagas reais e receba recomendações personalizadas para melhorar suas
            chances.
          </p>

          <p className="mt-4 max-w-xl text-sm text-muted-foreground/90">
            Sem conta. Sem configuração complicada. Basta colar seu currículo e começar a melhorá-lo.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg" className="h-12 rounded-full px-7 text-[15px]">
              <Link to="/analyze">
                Analisar Meu Currículo — Grátis
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="h-12 rounded-full border-border bg-card px-7 text-[15px]"
            >
              <a href="#how-it-works">Veja Como Funciona</a>
            </Button>
          </div>

          <p className="mt-5 flex items-center gap-2 text-xs text-muted-foreground">
            <ShieldCheck className="size-4 text-primary" />
            Não é necessário cadastro. Comece a analisar instantaneamente.
          </p>
        </div>

        <div className="animate-rise [animation-delay:120ms]">
          <DashboardPreview />
        </div>
      </div>
    </section>
  );
}
