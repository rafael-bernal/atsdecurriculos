import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function FinalCta() {
  return (
    <section className="py-20 sm:py-28">
      <div className="mx-auto w-full max-w-6xl px-5 sm:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-primary px-6 py-16 text-center sm:px-12">
          <h2 className="mx-auto max-w-2xl text-balance-tight text-3xl font-bold text-primary-foreground sm:text-4xl">
            Your next opportunity starts with a better resume.
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-primary-foreground/80">
            Understand what is holding your resume back and optimize your next application with AI —
            no account required.
          </p>
          <Button
            asChild
            size="lg"
            variant="secondary"
            className="mt-8 h-12 rounded-full px-7 text-[15px] font-semibold"
          >
            <Link to="/analyze">
              Analyze My Resume for Free
              <ArrowRight className="size-4" />
            </Link>
          </Button>
          <p className="mt-5 text-xs text-primary-foreground/70">
            No sign-up. No complicated setup. Start instantly.
          </p>
        </div>
      </div>
    </section>
  );
}
