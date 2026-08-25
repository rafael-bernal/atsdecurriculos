import { useEffect, useState } from "react";

export function ScoreRing({
  value,
  size = 180,
  label,
  sublabel,
}: {
  value: number;
  size?: number;
  label?: string;
  sublabel?: string;
}) {
  const [shown, setShown] = useState(0);
  const stroke = size > 150 ? 12 : 9;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;

  useEffect(() => {
    const t = window.setTimeout(() => setShown(value), 120);
    return () => window.clearTimeout(t);
  }, [value]);

  return (
    <div className="flex flex-col items-center" style={{ width: size }}>
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke="var(--muted)"
            strokeWidth={stroke}
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke="var(--primary)"
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={c}
            strokeDashoffset={c - (c * shown) / 100}
            style={{ transition: "stroke-dashoffset 1200ms cubic-bezier(0.22,1,0.36,1)" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center px-2 text-center">
          <span
            className="font-display font-bold tabular-nums tracking-tight"
            style={{ fontSize: size / 3.4 }}
          >
            {Math.round(shown)}%
          </span>
          {label && (
            <span
              className="mt-1 font-medium uppercase tracking-tight text-muted-foreground"
              style={{
                fontSize: Math.max(8.5, size / 16),
                lineHeight: 1.15,
                maxWidth: Math.round(size * 0.62),
              }}
            >
              {label}
            </span>
          )}
        </div>
      </div>
      {sublabel && <p className="mt-3 text-center text-sm text-muted-foreground">{sublabel}</p>}
    </div>
  );
}
