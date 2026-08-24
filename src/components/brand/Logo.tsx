import { cn } from "@/lib/utils";

export function Logo({ className, inverted = false }: { className?: string; inverted?: boolean }) {
  return (
    <span className={cn("flex items-center gap-2.5", className)}>
      <span
        className={cn(
          "grid size-8 place-items-center rounded-[10px] bg-gradient-primary",
          inverted && "bg-background",
        )}
      >
        <svg viewBox="0 0 24 24" className="size-4" aria-hidden="true">
          <path
            d="M4 13.5 9.2 18.5 20 6.5"
            fill="none"
            stroke={inverted ? "var(--primary)" : "var(--primary-foreground)"}
            strokeWidth="2.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      <span className="font-display text-[17px] font-bold tracking-tight">CVMatch AI</span>
    </span>
  );
}
