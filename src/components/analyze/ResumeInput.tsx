import { ArrowRight, Lock, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export function ResumeInput({
  value,
  onChange,
  onContinue,
}: {
  value: string;
  onChange: (v: string) => void;
  onContinue: () => void;
}) {
  const words = value.trim() ? value.trim().split(/\s+/).length : 0;
  const ready = words >= 40;

  return (
    <section className="card-surface p-6 sm:p-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <label htmlFor="resume" className="font-display text-lg font-semibold">
          Seu Currículo
        </label>
        <Button
          variant="ghost"
          size="sm"
          className="text-muted-foreground"
          onClick={() => onChange("")}
          disabled={!value}
        >
          <Trash2 className="size-4" />
          Limpar
        </Button>
      </div>

      <Textarea
        id="resume"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Cole aqui o texto completo do seu currículo..."
        className="mt-4 min-h-[320px] resize-y rounded-2xl border-border bg-surface p-4 text-sm leading-relaxed focus-visible:ring-primary/30"
      />

      <div className="mt-3 flex flex-wrap items-center justify-between gap-3 text-xs text-muted-foreground">
        <span>Não é necessário enviar arquivos. Basta colar o texto do seu currículo.</span>
        <span className="tabular-nums">
          {value.length.toLocaleString()} caracteres · {words.toLocaleString()} palavras
        </span>
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
        <p className="flex items-center gap-2 text-xs text-muted-foreground">
          <Lock className="size-3.5 text-primary" />
          Seu currículo é usado apenas para gerar sua análise.
        </p>
        <Button onClick={onContinue} disabled={!ready} className="h-11 rounded-full px-6">
          Continuar
          <ArrowRight className="size-4" />
        </Button>
      </div>
      {!ready && value.length > 0 && (
        <p className="mt-3 text-xs text-warning">
          Adicione um pouco mais do seu currículo (pelo menos ~40 palavras) para uma análise significativa.
        </p>
      )}
    </section>
  );
}
