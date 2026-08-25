import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { AnalysisLoader } from "@/components/analyze/AnalysisLoader";
import { AnalysisSelector } from "@/components/analyze/AnalysisSelector";
import { JobDescriptionInput } from "@/components/analyze/JobDescriptionInput";
import { ResultsDashboard } from "@/components/analyze/ResultsDashboard";
import { ResumeInput } from "@/components/analyze/ResumeInput";
import { Footer } from "@/components/landing/Footer";
import { Navbar } from "@/components/landing/Navbar";
import { analyzeResume } from "@/lib/cvmatch/engine";
import { useSession } from "@/lib/cvmatch/session";
import type { AnalysisType } from "@/lib/cvmatch/types";

const title = "Analise Seu Currículo — CVMatch AI";
const description =
  "Cole seu currículo, escolha sua análise, adicione opcionalmente uma descrição de vaga e obtenha sua pontuação de ATS, pontuação de compatibilidade e um currículo otimizado. Grátis, sem necessidade de conta.";

export const Route = createFileRoute("/analyze")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AnalyzePage,
});

type Step = "resume" | "setup" | "loading" | "results";

function AnalyzePage() {
  const { state, update, reset, hydrated } = useSession();
  const [step, setStep] = useState<Step>("resume");
  const [hasJobChoice, setHasJobChoice] = useState<boolean | null>(null);
  const [variant, setVariant] = useState(0);
  const setupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (hydrated && state.result) setStep("results");
  }, [hydrated]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
  }, [step]);

  const runAnalysis = (nextVariant = variant) => {
    const analyses: AnalysisType[] = state.analyses.length ? state.analyses : ["complete"];
    const hasJob = hasJobChoice === true && state.jobDescription.trim().length > 40;
    const result = analyzeResume({
      resume: state.resume,
      jobDescription: state.jobDescription,
      hasJob,
      analyses,
      variant: nextVariant,
    });
    update({ hasJob, analyses, result });
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />

      <main className="mx-auto w-full max-w-5xl flex-1 px-5 py-12 sm:px-8 sm:py-16">
        <header className="mb-8">
          <h1 className="text-3xl font-bold sm:text-4xl">Analise Seu Currículo</h1>
          <p className="mt-3 max-w-2xl text-muted-foreground">
            Descubra o que está funcionando, o que está faltando e como melhorar seu currículo.
          </p>
        </header>

        {step === "resume" && (
          <div className="animate-rise">
            <ResumeInput
              value={state.resume}
              onChange={(resume) => update({ resume })}
              onContinue={() => setStep("setup")}
            />
          </div>
        )}

        {step === "setup" && (
          <div ref={setupRef} className="animate-rise space-y-5">
            <AnalysisSelector
              selected={state.analyses}
              onChange={(analyses) => update({ analyses })}
            />
            <JobDescriptionInput
              hasJob={hasJobChoice}
              setHasJob={setHasJobChoice}
              value={state.jobDescription}
              onChange={(jobDescription) => update({ jobDescription })}
              canAnalyze={
                state.analyses.length > 0 &&
                (hasJobChoice === false || state.jobDescription.trim().length > 40)
              }
              onAnalyze={() => {
                runAnalysis();
                setStep("loading");
              }}
            />
            <button
              className="text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
              onClick={() => setStep("resume")}
            >
              Voltar para meu currículo
            </button>
          </div>
        )}

        {step === "loading" && (
          <div className="animate-rise">
            <AnalysisLoader
              hasJob={hasJobChoice === true}
              onDone={() => setStep("results")}
            />
          </div>
        )}

        {step === "results" && state.result && (
          <div className="animate-rise">
            <ResultsDashboard
              result={state.result}
              original={state.resume}
              onEditResume={() => setStep("resume")}
              onNewJob={() => {
                setHasJobChoice(true);
                update({ jobDescription: "" });
                setStep("setup");
              }}
              onRestart={() => {
                reset();
                setHasJobChoice(null);
                setStep("resume");
              }}
              onRegenerate={() => {
                const next = variant + 1;
                setVariant(next);
                runAnalysis(next);
              }}
            />
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
