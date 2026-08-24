import { useEffect, useState } from "react";

export function ProgressRow({ label, value, delay = 0 }: { label: string; value: number; delay?: number }) {
  const [w, setW] = useState(0);
  useEffect(() => {
    const t = window.setTimeout(() => setW(value), 100 + delay);
    return () => window.clearTimeout(t);
  }, [value, delay]);

  return (
    <div>
      <div className="flex items-baseline justify-between">
        <span className="text-sm font-medium">{label}</span>
        <span className="font-display text-sm font-semibold tabular-nums text-primary">{value}%</span>
      </div>
      <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-gradient-primary"
          style={{ width: `${w}%`, transition: "width 1100ms cubic-bezier(0.22,1,0.36,1)" }}
        />
      </div>
    </div>
  );
}
