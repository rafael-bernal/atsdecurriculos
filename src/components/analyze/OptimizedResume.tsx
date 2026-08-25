import { Copy, Download, RefreshCw, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { optimizedToText } from "@/lib/cvmatch/engine";
import type { AnalysisResult } from "@/lib/cvmatch/types";

export function OptimizedResume({
  result,
  onRegenerate,
}: {
  result: AnalysisResult;
  onRegenerate: () => void;
}) {
  const text = optimizedToText(result.optimized);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Currículo otimizado copiado para a área de transferência");
    } catch {
      toast.error("Seu navegador bloqueou o acesso à área de transferência");
    }
  };

  const download = () => {
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "curriculo-otimizado.txt";
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Download iniciado");
  };

  return (
    <section className="card-surface p-6 sm:p-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="font-display text-xl font-semibold">Seu Currículo Otimizado</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Compatível com ATS, reestruturado e aprimorado — usando apenas suas próprias informações.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button size="sm" className="rounded-full" onClick={copy}>
            <Copy className="size-4" />
            Copiar Currículo
          </Button>
          <Button size="sm" variant="outline" className="rounded-full" onClick={download}>
            <Download className="size-4" />
            Baixar Currículo
          </Button>
          <Button size="sm" variant="ghost" className="rounded-full" onClick={onRegenerate}>
            <RefreshCw className="size-4" />
            Gerar Outra Versão
          </Button>
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-border bg-card p-6 shadow-soft sm:p-9">
        {result.optimized.map((s) => (
          <div key={s.title} className="mb-7 last:mb-0">
            <h3 className="border-b border-border pb-2 font-display text-[13px] font-bold uppercase tracking-[0.14em] text-primary">
              {s.title}
            </h3>
            <div className="mt-3 space-y-1.5">
              {s.lines.map((l, i) => (
                <p key={`${s.title}-${i}`} className="text-sm leading-relaxed text-foreground">
                  {l}
                </p>
              ))}
            </div>
          </div>
        ))}
      </div>

      <p className="mt-5 flex gap-2.5 text-xs leading-relaxed text-muted-foreground">
        <ShieldCheck className="mt-0.5 size-4 shrink-0 text-primary" />
        A redação, a estrutura e a clareza foram aprimoradas. Nenhuma empresa, cargo, data,
        habilidade, certificação ou conquista foi adicionada ou alterada.
      </p>
    </section>
  );
}
