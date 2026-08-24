import { cn } from "@/lib/utils";

export function StatTile({
  label,
  value,
  tone = "default",
}: {
  label: string;
  value: string;
  tone?: "default" | "warning";
}) {
  return (
    <div className="rounded-xl border border-border bg-card px-3.5 py-3 transition-colors hover:border-primary/30">
      <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
      <p
        className={cn(
          "mt-1 font-display text-xl font-bold tabular-nums",
          tone === "warning" ? "text-warning" : "text-primary",
        )}
      >
        {value}
      </p>
    </div>
  );
}
