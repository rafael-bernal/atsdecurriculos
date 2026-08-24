import { BarChart3, Braces, FileCheck2, KeyRound, Sparkles, Target } from "lucide-react";

const features = [
  {
    icon: FileCheck2,
    title: "ATS Score",
    body: "Understand how your resume may perform against Applicant Tracking Systems.",
  },
  {
    icon: Target,
    title: "Job Match",
    body: "See how closely your resume matches a specific job description.",
  },
  {
    icon: Braces,
    title: "Technical Analysis",
    body: "Identify relevant technical skills that are missing or poorly presented.",
  },
  {
    icon: BarChart3,
    title: "Professional Analysis",
    body: "Evaluate professional positioning, experience, seniority, and career narrative.",
  },
  {
    icon: KeyRound,
    title: "Keyword Analysis",
    body: "Identify important keywords from the job description and compare them against the resume.",
  },
  {
    icon: Sparkles,
    title: "AI Resume Optimization",
    body: "Generate a clearer, stronger, ATS-friendly version of the resume.",
  },
];

export function Features() {
  return (
    <section id="features" className="scroll-mt-20 py-20 sm:py-28">
      <div className="mx-auto w-full max-w-6xl px-5 sm:px-8">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Features</p>
        <h2 className="mt-3 max-w-2xl text-balance-tight text-3xl font-bold sm:text-4xl">
          Everything you need to improve your next application.
        </h2>

        <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <article key={f.title} className="card-surface card-interactive p-6">
              <span className="grid size-10 place-items-center rounded-xl bg-primary-soft">
                <f.icon className="size-[18px] text-primary" />
              </span>
              <h3 className="mt-5 text-lg font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
