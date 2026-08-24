import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    q: "What is an ATS?",
    a: "An Applicant Tracking System is the software most companies use to receive, parse and rank applications. It reads your resume as structured text, which is why headings, wording and keywords matter as much as content.",
  },
  {
    q: "Do I need to upload my resume?",
    a: "No. You simply paste the text of your resume. There is no file upload and no processing pipeline to wait for.",
  },
  {
    q: "Can I analyze my resume for a specific job?",
    a: "Yes. Paste the job description and CVMatch AI compares requirements, keywords and seniority signals against your resume to produce a match score.",
  },
  {
    q: "Can CVMatch AI rewrite my resume?",
    a: "It generates an optimized, ATS-friendly version based strictly on what you wrote. It improves wording, structure and clarity — it never invents companies, skills, degrees or achievements.",
  },
  {
    q: "Does CVMatch AI guarantee interviews?",
    a: "CVMatch AI provides analysis and recommendations, but no tool can guarantee an interview or job offer.",
  },
  {
    q: "Do I need to create an account?",
    a: "No. The core product is completely usable without registration or login.",
  },
  {
    q: "Can I analyze multiple jobs?",
    a: "Yes. You can replace the job description and re-run the comparison as many times as you like within your session.",
  },
  {
    q: "Is my resume information private?",
    a: "Your resume stays in your browser session and is used only to generate your analysis. We do not ask for your email, phone number or any account credentials.",
  },
];

export function Faq() {
  return (
    <section id="faq" className="scroll-mt-20 border-t border-border bg-surface py-20 sm:py-28">
      <div className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-10 px-5 sm:px-8 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">FAQ</p>
          <h2 className="mt-3 text-balance-tight text-3xl font-bold sm:text-4xl">
            Questions, answered honestly.
          </h2>
        </div>

        <Accordion type="single" collapsible className="w-full">
          {faqs.map((f) => (
            <AccordionItem key={f.q} value={f.q} className="border-border">
              <AccordionTrigger className="text-left text-base font-medium hover:no-underline">
                {f.q}
              </AccordionTrigger>
              <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
                {f.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
