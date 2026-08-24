import { Logo } from "@/components/brand/Logo";

const groups = [
  { title: "Product", links: ["Features", "Pricing", "FAQ"] },
  { title: "Legal", links: ["Privacy", "Terms"] },
];

const hrefs: Record<string, string> = {
  Features: "/#features",
  Pricing: "/#pricing",
  FAQ: "/#faq",
  Privacy: "/#faq",
  Terms: "/#faq",
};

export function Footer() {
  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-10 px-5 py-14 sm:grid-cols-3 sm:px-8">
        <div className="sm:col-span-1">
          <Logo />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
            AI-powered tools for stronger resumes and smarter job applications.
          </p>
        </div>

        {groups.map((g) => (
          <div key={g.title}>
            <h3 className="text-sm font-semibold">{g.title}</h3>
            <ul className="mt-4 space-y-2.5">
              {g.links.map((l) => (
                <li key={l}>
                  <a
                    href={hrefs[l]}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {l}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-border px-5 py-6 sm:px-8">
        <p className="mx-auto w-full max-w-6xl text-xs text-muted-foreground">
          © 2026 CVMatch AI. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
