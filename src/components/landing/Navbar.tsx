import { Link } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/brand/Logo";

const links = [
  { label: "Como Funciona", href: "/#how-it-works" },
  { label: "Recursos", href: "/#features" },
  { label: "ATS", href: "/#ats" },
  { label: "Preços", href: "/#pricing" },
  { label: "Perguntas Frequentes", href: "/#faq" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/80 backdrop-blur-xl">
      <nav className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-5 sm:px-8">
        <Link to="/" className="flex items-center gap-2.5" onClick={() => setOpen(false)}>
          <Logo />
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <a
              key={l.label}
              href={l.href}
              className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              {l.label}
            </a>
          ))}
        </div>

        <div className="hidden md:block">
          <Button asChild size="sm" className="rounded-full px-5">
            <Link to="/analyze">Analisar Meu Currículo</Link>
          </Button>
        </div>

        <button
          className="inline-flex size-10 items-center justify-center rounded-lg text-foreground md:hidden"
          onClick={() => setOpen((o) => !o)}
          aria-label={open ? "Fechar menu" : "Abrir menu"}
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </nav>

      {open && (
        <div className="border-t border-border bg-background px-5 pb-5 pt-2 md:hidden">
          <div className="flex flex-col">
            {links.map((l) => (
              <a
                key={l.label}
                href={l.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-2 py-3 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                {l.label}
              </a>
            ))}
            <Button asChild className="mt-3 w-full rounded-full">
              <Link to="/analyze" onClick={() => setOpen(false)}>
                Analisar Meu Currículo
              </Link>
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
