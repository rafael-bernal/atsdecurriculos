import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    q: "O que é um ATS?",
    a: "Um Sistema de Rastreamento de Candidatos é o software que a maioria das empresas usa para receber, analisar e classificar candidaturas. Ele lê seu currículo como texto estruturado, por isso cabeçalhos, redação e palavras-chave importam tanto quanto o conteúdo.",
  },
  {
    q: "Preciso enviar meu currículo?",
    a: "Não. Você simplesmente cola o texto do seu currículo. Não há upload de arquivo nem um processo de espera.",
  },
  {
    q: "Posso analisar meu currículo para uma vaga específica?",
    a: "Sim. Cole a descrição da vaga e o CVMatch AI compara requisitos, palavras-chave e sinais de senioridade com seu currículo para gerar uma pontuação de compatibilidade.",
  },
  {
    q: "O CVMatch AI pode reescrever meu currículo?",
    a: "Ele gera uma versão otimizada e compatível com ATS baseada estritamente no que você escreveu. Melhora a redação, a estrutura e a clareza — nunca inventa empresas, habilidades, formações ou conquistas.",
  },
  {
    q: "O CVMatch AI garante entrevistas?",
    a: "O CVMatch AI oferece análises e recomendações, mas nenhuma ferramenta pode garantir uma entrevista ou proposta de emprego.",
  },
  {
    q: "Preciso criar uma conta?",
    a: "Não. O produto principal é totalmente utilizável sem cadastro ou login.",
  },
  {
    q: "Posso analisar várias vagas?",
    a: "Sim. Você pode substituir a descrição da vaga e refazer a comparação quantas vezes quiser durante sua sessão.",
  },
  {
    q: "As informações do meu currículo são privadas?",
    a: "Seu currículo permanece na sessão do seu navegador e é usado apenas para gerar sua análise. Não pedimos seu e-mail, telefone ou qualquer credencial de conta.",
  },
];

export function Faq() {
  return (
    <section id="faq" className="scroll-mt-20 border-t border-border bg-surface py-20 sm:py-28">
      <div className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-10 px-5 sm:px-8 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Perguntas Frequentes</p>
          <h2 className="mt-3 text-balance-tight text-3xl font-bold sm:text-4xl">
            Perguntas, respondidas com honestidade.
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
