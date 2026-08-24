import { Link } from "@tanstack/react-router";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const plans = [
  {
    name: "Free",
    price: "$0",
    note: "No account required",
    features: [
      "1 resume analysis",
      "Basic ATS score",
      "Basic recommendations",
      "Job match score",
    ],
    cta: "Start Free",
    featured: false,
  },
  {
    name: "Pro",
    price: "$12",
    note: "per month",
    features: [
      "Unlimited resume analyses",
      "Unlimited job comparisons",
      "Advanced ATS analysis",
      "AI resume optimization",
      "Keyword analysis",
      "Resume versions",
    ],
    cta: "Start Pro",
    featured: true,
  },
  {
    name: "Premium",
    price: "$24",
    note: "per month",
    features: [
      "Everything in Pro",
      "Advanced career insights",
      "Multiple resume versions",
      "Advanced job targeting",
      "Priority AI analysis",
    ],
    cta: "Get Premium",
    featured: false,
  },
];

export function Pricing() {
  return (
    <section id="pricing" className="scroll-mt-20 py-20 sm:py-28">
      <div className="mx-auto w-full max-w-6xl px-5 sm:px-8">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Pricing</p>
          <h2 className="mt-3 text-balance-tight text-3xl font-bold sm:text-4xl">
            Simple plans for every stage of your job search.
          </h2>
          <p className="mt-4 text-muted-foreground">
            The core product is free to use right now — no account, no card, no setup.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-5 lg:grid-cols-3">
          {plans.map((p) => (
            <div
              key={p.name}
              className={cn(
                "card-surface card-interactive flex flex-col p-7",
                p.featured && "border-primary/40 ring-1 ring-primary/15",
              )}
            >
              <div className="flex items-center justify-between">
                <h3 className="font-display text-lg font-semibold">{p.name}</h3>
                {p.featured && (
                  <span className="rounded-full bg-primary-soft px-2.5 py-1 text-[11px] font-semibold text-primary">
                    Most popular
                  </span>
                )}
              </div>
              <div className="mt-5 flex items-baseline gap-2">
                <span className="font-display text-4xl font-bold tracking-tight">{p.price}</span>
                <span className="text-sm text-muted-foreground">{p.note}</span>
              </div>
              <ul className="mt-7 flex-1 space-y-3">
                {p.features.map((f) => (
                  <li key={f} className="flex gap-2.5 text-sm">
                    <Check className="mt-0.5 size-4 shrink-0 text-primary" />
                    <span className="text-muted-foreground">{f}</span>
                  </li>
                ))}
              </ul>
              <Button
                asChild
                variant={p.featured ? "default" : "outline"}
                className="mt-8 h-11 w-full rounded-full"
              >
                <Link to="/analyze">{p.cta}</Link>
              </Button>
            </div>
          ))}
        </div>

        <p className="mt-6 text-xs text-muted-foreground">
          Paid plans are not active yet. Everything shown today runs free and anonymously in your
          browser.
        </p>
      </div>
    </section>
  );
}
