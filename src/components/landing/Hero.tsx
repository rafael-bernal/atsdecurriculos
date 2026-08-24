import { Link } from "@tanstack/react-router";
import { ArrowRight, ShieldCheck, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DashboardPreview } from "./DashboardPreview";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-hero-glow">
      <div className="mx-auto grid w-full max-w-6xl grid-cols-1 items-center gap-14 px-5 pb-20 pt-16 sm:px-8 lg:grid-cols-[1.05fr_1fr] lg:gap-12 lg:pb-28 lg:pt-24">
        <div className="animate-rise">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground shadow-soft">
            <Sparkles className="size-3.5 text-primary" />
            Resume intelligence for real job descriptions
          </span>

          <h1 className="mt-6 text-balance-tight text-4xl font-bold leading-[1.06] sm:text-5xl lg:text-[3.4rem]">
            Your resume might be losing opportunities without you knowing.
          </h1>

          <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            Analyze your resume with AI, understand how it performs against ATS systems, compare it
            with real job descriptions, and get personalized recommendations to improve your
            chances.
          </p>

          <p className="mt-4 max-w-xl text-sm text-muted-foreground/90">
            No account. No complicated setup. Just paste your resume and start improving it.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg" className="h-12 rounded-full px-7 text-[15px]">
              <Link to="/analyze">
                Analyze My Resume — Free
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="h-12 rounded-full border-border bg-card px-7 text-[15px]"
            >
              <a href="#how-it-works">See How It Works</a>
            </Button>
          </div>

          <p className="mt-5 flex items-center gap-2 text-xs text-muted-foreground">
            <ShieldCheck className="size-4 text-primary" />
            No sign-up required. Start analyzing instantly.
          </p>
        </div>

        <div className="animate-rise [animation-delay:120ms]">
          <DashboardPreview />
        </div>
      </div>
    </section>
  );
}
