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
          Your Resume
        </label>
        <Button
          variant="ghost"
          size="sm"
          className="text-muted-foreground"
          onClick={() => onChange("")}
          disabled={!value}
        >
          <Trash2 className="size-4" />
          Clear
        </Button>
      </div>

      <Textarea
        id="resume"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Paste your complete resume here..."
        className="mt-4 min-h-[320px] resize-y rounded-2xl border-border bg-surface p-4 text-sm leading-relaxed focus-visible:ring-primary/30"
      />

      <div className="mt-3 flex flex-wrap items-center justify-between gap-3 text-xs text-muted-foreground">
        <span>No upload required. Simply paste the text of your resume.</span>
        <span className="tabular-nums">
          {value.length.toLocaleString()} characters · {words.toLocaleString()} words
        </span>
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
        <p className="flex items-center gap-2 text-xs text-muted-foreground">
          <Lock className="size-3.5 text-primary" />
          Your resume is only used to generate your analysis.
        </p>
        <Button onClick={onContinue} disabled={!ready} className="h-11 rounded-full px-6">
          Continue
          <ArrowRight className="size-4" />
        </Button>
      </div>
      {!ready && value.length > 0 && (
        <p className="mt-3 text-xs text-warning">
          Add a bit more of your resume (at least ~40 words) for a meaningful analysis.
        </p>
      )}
    </section>
  );
}
