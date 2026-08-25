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
      toast.success("Optimized resume copied to your clipboard");
    } catch {
      toast.error("Your browser blocked clipboard access");
    }
  };

  const download = () => {
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "cvmatch-optimized-resume.txt";
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Download started");
  };

  return (
    <section className="card-surface p-6 sm:p-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="font-display text-xl font-semibold">Your Optimized Resume</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            ATS-friendly, restructured and tightened — using only your own information.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button size="sm" className="rounded-full" onClick={copy}>
            <Copy className="size-4" />
            Copy Resume
          </Button>
          <Button size="sm" variant="outline" className="rounded-full" onClick={download}>
            <Download className="size-4" />
            Download Resume
          </Button>
          <Button size="sm" variant="ghost" className="rounded-full" onClick={onRegenerate}>
            <RefreshCw className="size-4" />
            Generate Another Version
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
        Wording, structure and clarity were improved. No companies, roles, dates, skills,
        certifications or achievements were added or changed.
      </p>
    </section>
  );
}
