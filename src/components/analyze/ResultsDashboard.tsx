import { FileEdit, RotateCcw, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { AnalysisResult } from "@/lib/cvmatch/types";
import { AtsScore } from "./AtsScore";
import { CareerInsights, Improvements, Strengths } from "./Insights";
import { KeywordAnalysis } from "./KeywordAnalysis";
import { MatchScore } from "./MatchScore";
import { OptimizedResume } from "./OptimizedResume";
import { Recommendations } from "./Recommendations";
import { ResumeComparison } from "./ResumeComparison";

export function ResultsDashboard({
  result,
  original,
  onEditResume,
  onNewJob,
  onRestart,
  onRegenerate,
}: {
  result: AnalysisResult;
  original: string;
  onEditResume: () => void;
  onNewJob: () => void;
  onRestart: () => void;
  onRegenerate: () => void;
}) {
  return (
    <div className="space-y-5">
      <MatchScore result={result} />

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <Strengths result={result} />
        <Improvements result={result} />
      </div>

      <KeywordAnalysis result={result} />
      <AtsScore result={result} />
      <Recommendations result={result} />
      <OptimizedResume result={result} onRegenerate={onRegenerate} />
      <ResumeComparison original={original} result={result} />
      <CareerInsights result={result} />

      <section className="card-surface flex flex-wrap items-center justify-between gap-4 p-6">
        <div>
          <h2 className="font-display text-base font-semibold">Continue avançando</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Tudo permanece nesta sessão do navegador. Nenhuma conta é necessária.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" className="rounded-full" onClick={onEditResume}>
            <FileEdit className="size-4" />
            Editar Currículo
          </Button>
          <Button variant="outline" size="sm" className="rounded-full" onClick={onNewJob}>
            <Target className="size-4" />
            Analisar Outra Vaga
          </Button>
          <Button variant="ghost" size="sm" className="rounded-full" onClick={onRestart}>
            <RotateCcw className="size-4" />
            Começar de Novo
          </Button>
        </div>
      </section>
    </div>
  );
}
