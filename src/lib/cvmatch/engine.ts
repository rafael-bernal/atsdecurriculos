import type {
  AnalysisResult,
  AnalysisType,
  Improvement,
  OptimizedSection,
  Recommendation,
  Strength,
} from "./types";

/**
 * Deterministic local analysis engine.
 *
 * NOTE: this is a heuristic prototype engine, not a real language model. It only
 * derives insights from text the user actually pasted and never invents facts.
 * Swap `analyzeResume` for an LLM-backed server function later — the return
 * shape is the contract the whole UI depends on.
 */

const SKILL_DICTIONARY = [
  "python","javascript","typescript","java","c#","c++","go","golang","rust","ruby","php","kotlin","swift","scala",
  "react","angular","vue","next.js","node.js","express","django","flask","fastapi","spring","rails","laravel",
  ".net","graphql","rest","api","microservices","html","css","tailwind","sass","redux",
  "sql","mysql","postgresql","postgres","mongodb","redis","elasticsearch","oracle","nosql","dynamodb",
  "aws","azure","gcp","google cloud","docker","kubernetes","terraform","ansible","jenkins","ci/cd","github actions",
  "linux","git","bash","devops","serverless","lambda","cloudformation",
  "power bi","tableau","excel","looker","dbt","airflow","spark","hadoop","snowflake","etl","data warehouse",
  "machine learning","deep learning","nlp","tensorflow","pytorch","pandas","numpy","scikit-learn","statistics",
  "agile","scrum","kanban","jira","confluence","stakeholder management","roadmap","okr","kpi","product management",
  "leadership","mentoring","communication","project management","budget","forecasting","negotiation",
  "salesforce","hubspot","sap","crm","erp","seo","sem","google analytics","marketing","copywriting",
  "figma","ux","ui","design system","accessibility","wcag","user research",
  "testing","unit testing","jest","cypress","playwright","qa","selenium","tdd",
  "security","oauth","jwt","encryption","compliance","gdpr","iso",
];

const SECTION_HINTS: Record<string, RegExp> = {
  "Resumo Profissional":
    /^(professional\s+)?(summary|profile|objective|about( me)?|resumo|perfil|objetivo|sobre)\b/i,
  "Experiência Profissional":
    /^(professional\s+|work\s+)?(experience|employment|history|career|experiência|experiencia|atuação|atuacao|carreira|histórico)\b/i,
  "Competências Técnicas":
    /^(technical\s+)?(skills|competenc(ies|es)|technologies|stack|tools|habilidades|competências|competencias|conhecimentos|ferramentas|tecnologias)\b/i,
  "Formação Acadêmica": /^(education|academic|degrees?|formação|formacao|escolaridade|educação|educacao)\b/i,
  "Certificações": /^(certifications?|licenses?|courses?|training|certificações|certificacoes|cursos)\b/i,
  "Informações Adicionais":
    /^(additional|other|languages|interests|volunteer|projects|awards|idiomas|informações|informacoes|projetos|outros|prêmios|premios)\b/i,
};

const ACTION_VERBS = [
  "liderei","construí","desenhei","entreguei","lancei","melhorei","reduzi","aumentei","implementei","migrei",
  "automatizei","gerenciei","escalei","otimizei","criei","desenvolvi","coordenei","negociei","mentorei","estruturei",
];

const WEAK_PHRASES = [
  "responsible for","in charge of","duties included","worked on","helped with","participated in","tasked with",
  "responsável por","responsavel por","encarregado de","atividades incluíam","atividades incluiam","trabalhei em",
  "ajudei com","ajudei na","participei de","participei do","auxiliei em","auxiliei na","fui responsável",
];

const clamp = (n: number, min = 12, max = 99) => Math.max(min, Math.min(max, Math.round(n)));

const norm = (s: string) => s.toLowerCase().replace(/\s+/g, " ");

function hasTerm(haystack: string, term: string) {
  const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`(^|[^a-z0-9+#.])${escaped}([^a-z0-9+#.]|$)`, "i").test(haystack);
}

function titleCase(term: string) {
  const specials: Record<string, string> = {
    "ci/cd": "CI/CD","aws":"AWS","gcp":"GCP","sql":"SQL","nosql":"NoSQL","api":"API","rest":"REST","ux":"UX",
    "ui":"UI","qa":"QA","seo":"SEO","sem":"SEM","crm":"CRM","erp":"ERP","etl":"ETL","nlp":"NLP","okr":"OKR",
    "kpi":"KPI","tdd":"TDD","jwt":"JWT","oauth":"OAuth","gdpr":"GDPR","iso":"ISO","sap":"SAP","html":"HTML",
    "css":"CSS","php":"PHP",
  };
  if (specials[term]) return specials[term];
  return term
    .split(" ")
    .map((w) => (w.length <= 2 ? w.toUpperCase() : w.charAt(0).toUpperCase() + w.slice(1)))
    .join(" ");
}

function extractRequirements(jd: string): string[] {
  return jd
    .split(/\n+/)
    .map((l) => l.replace(/^[\s•\-*·–—>+]+/, "").trim())
    .filter((l) => l.length > 24 && l.length < 240 && /[a-z]/i.test(l))
    .slice(0, 22);
}

interface ParsedResume {
  lines: string[];
  bullets: string[];
  sections: Record<string, string[]>;
  hasNumbers: boolean;
  weakLines: string[];
  wordCount: number;
  emailOrPhone: boolean;
}

function parseResume(resume: string): ParsedResume {
  const lines = resume.split(/\n/).map((l) => l.replace(/\s+$/, ""));
  const sections: Record<string, string[]> = {};
  let current = "Informações Adicionais";
  for (const raw of lines) {
    const line = raw.trim();
    if (!line) continue;
    const heading = Object.entries(SECTION_HINTS).find(
      ([, re]) => line.length < 60 && re.test(line.replace(/[:•\-–—]/g, " ").trim()),
    );
    if (heading) {
      current = heading[0];
      sections[current] = sections[current] ?? [];
      continue;
    }
    const bucket = sections[current] ?? (sections[current] = []);
    bucket.push(line);
  }
  const bullets = lines.filter((l) => /^[\s]*[•\-*·–—]/.test(l));
  const body = resume.toLowerCase();
  return {
    lines: lines.filter((l) => l.trim().length > 0),
    bullets,
    sections,
    hasNumbers:
      /\b\d+([.,]\d+)?\s*(%|k|m|mil|milhões|milhoes|\+|customers|users|clients|hours|projects|people|clientes|usuários|usuarios|horas|projetos|pessoas|r\$|\$|€)/i.test(
        resume,
      ),
    weakLines: lines.filter((l) => WEAK_PHRASES.some((p) => body && l.toLowerCase().includes(p))).slice(0, 4),
    wordCount: resume.trim().split(/\s+/).filter(Boolean).length,
    emailOrPhone: /@/.test(resume) || /\+?\d[\d\s().-]{7,}/.test(resume),
  };
}

function detectSkills(text: string) {
  const t = norm(text);
  return SKILL_DICTIONARY.filter((s) => hasTerm(t, s));
}

export function analyzeResume(input: {
  resume: string;
  jobDescription: string;
  hasJob: boolean;
  analyses: AnalysisType[];
  variant?: number;
}): AnalysisResult {
  const { resume, jobDescription, hasJob, analyses } = input;
  const parsed = parseResume(resume);
  const resumeSkills = detectSkills(resume);
  const jdSkills = hasJob ? detectSkills(jobDescription) : [];

  const found = (hasJob ? jdSkills.filter((s) => resumeSkills.includes(s)) : resumeSkills).slice(0, 18);
  const missing = hasJob ? jdSkills.filter((s) => !resumeSkills.includes(s)).slice(0, 12) : [];

  const requirements = hasJob ? extractRequirements(jobDescription) : [];
  const requirementsTotal = requirements.length || (hasJob ? 1 : 0);
  const requirementsMet = requirements.filter((r) => {
    const terms = detectSkills(r);
    if (terms.length === 0) {
      const words = norm(r)
        .replace(/[^a-z0-9+#/. ]/g, " ")
        .split(" ")
        .filter((w) => w.length > 5);
      const hits = words.filter((w) => norm(resume).includes(w)).length;
      return words.length > 0 && hits / words.length > 0.35;
    }
    return terms.some((t) => resumeSkills.includes(t));
  }).length;

  // ATS sub-scores from real structural signals
  const sectionCount = Object.keys(parsed.sections).filter((k) => (parsed.sections[k]?.length ?? 0) > 0).length;
  const structure = clamp(52 + sectionCount * 9 + (parsed.emailOrPhone ? 8 : 0));
  const bulletRatio = parsed.lines.length ? parsed.bullets.length / parsed.lines.length : 0;
  const readability = clamp(
    58 + bulletRatio * 60 + (parsed.wordCount > 180 && parsed.wordCount < 900 ? 14 : 0),
  );
  const formatting = clamp(
    70 + (parsed.bullets.length > 4 ? 12 : 0) + (/[|\t]{2,}/.test(resume) ? -18 : 8),
  );
  const organization = clamp(50 + sectionCount * 11);
  const keywordScore = hasJob
    ? clamp(jdSkills.length ? (found.length / jdSkills.length) * 100 : 60)
    : clamp(45 + resumeSkills.length * 4);

  const atsBreakdown = [
    { label: "Estrutura", value: structure },
    { label: "Palavras-chave", value: keywordScore },
    { label: "Legibilidade", value: readability },
    { label: "Formatação", value: formatting },
    { label: "Organização das seções", value: organization },
  ];
  const atsScore = clamp(atsBreakdown.reduce((a, b) => a + b.value, 0) / atsBreakdown.length);

  const experienceLines = parsed.sections["Experiência Profissional"]?.length ?? 0;
  const experience = clamp(48 + experienceLines * 5 + (parsed.hasNumbers ? 14 : 0));
  const technical = clamp(40 + resumeSkills.length * 5 + (hasJob ? (found.length / Math.max(jdSkills.length, 1)) * 25 : 15));
  const education = clamp((parsed.sections["Formação Acadêmica"]?.length ?? 0) > 0 ? 88 + sectionCount : 55);

  const breakdown = [
    { label: "Experiência", value: experience },
    { label: "Competências técnicas", value: technical },
    { label: "Palavras-chave", value: keywordScore },
    { label: "Formação", value: education },
    { label: "Estrutura ATS", value: structure },
  ];

  const matchScore = hasJob
    ? clamp(
        keywordScore * 0.34 +
          (requirementsTotal ? (requirementsMet / requirementsTotal) * 100 : 60) * 0.26 +
          experience * 0.2 +
          technical * 0.12 +
          structure * 0.08,
      )
    : atsScore;

  // Pontos fortes — apenas afirmações sustentadas pelo texto colado
  const strengths: Strength[] = [];
  if (experienceLines > 3)
    strengths.push({
      title: "Seção de experiência bem definida",
      detail: `Seu currículo apresenta ${experienceLines} linhas de experiência profissional em uma seção dedicada, o que funciona bem tanto para recrutadores quanto para sistemas de leitura.`,
    });
  if (found.length > 0)
    strengths.push({
      title: hasJob ? "Terminologia relevante já presente" : "Vocabulário de competências reconhecível",
      detail: `Termos como ${found.slice(0, 4).map(titleCase).join(", ")} aparecem no seu currículo e são comumente indexados por sistemas ATS.`,
    });
  if (parsed.hasNumbers)
    strengths.push({
      title: "Algumas conquistas estão quantificadas",
      detail:
        "Números e resultados mensuráveis aparecem no seu texto — é isso que diferencia currículos fortes de listas de tarefas.",
    });
  if ((parsed.sections["Formação Acadêmica"]?.length ?? 0) > 0)
    strengths.push({
      title: "Formação claramente informada",
      detail:
        "Uma seção dedicada à formação facilita que os sistemas de triagem extraiam seu histórico acadêmico.",
    });
  if (parsed.bullets.length > 4)
    strengths.push({
      title: "Estrutura em tópicos fácil de escanear",
      detail: `${parsed.bullets.length} tópicos mantêm o documento legível nos poucos segundos que um recrutador costuma dedicar à primeira leitura.`,
    });
  if (strengths.length === 0)
    strengths.push({
      title: "Bom ponto de partida",
      detail:
        "Seu currículo já contém a matéria-prima necessária para uma boa candidatura — as melhorias abaixo focam em estrutura e relevância.",
    });

  // Melhorias
  const improvements: Improvement[] = [];
  if (missing.length > 0)
    improvements.push({
      priority: "high",
      title: `Trate ${missing.slice(0, 3).map(titleCase).join(", ")}`,
      detail: `A descrição da vaga menciona ${missing.slice(0, 3).map(titleCase).join(", ")}, mas seu currículo não demonstra ${missing.length > 1 ? "esses pontos" : "esse ponto"} com clareza. Se você tem experiência real, descreva-a de forma concreta. Se não tem, destaque experiências transferíveis ou planeje aprender — nunca adicione uma competência que você não possui.`,
    });
  if (!parsed.hasNumbers)
    improvements.push({
      priority: "high",
      title: "Quantifique suas conquistas",
      detail:
        "Nenhum resultado mensurável foi detectado. Substitua responsabilidades genéricas por volumes, percentuais, prazos ou orçamentos que você realmente entregou.",
    });
  if (parsed.weakLines.length > 0)
    improvements.push({
      priority: "medium",
      title: "Substitua frases passivas de responsabilidade",
      detail: `Frases como "${(parsed.weakLines[0] ?? "").trim().slice(0, 70)}" descrevem tarefas em vez de impacto. Comece com um verbo de ação como ${ACTION_VERBS.slice(0, 4).join(", ")}.`,
    });
  if ((parsed.sections["Resumo Profissional"]?.length ?? 0) === 0)
    improvements.push({
      priority: "medium",
      title: "Inclua um resumo profissional direcionado",
      detail:
        "Um resumo de três linhas no topo dá ao ATS e ao recrutador contexto imediato sobre seu nível e seu foco.",
    });
  if ((parsed.sections["Competências Técnicas"]?.length ?? 0) === 0)
    improvements.push({
      priority: "medium",
      title: "Crie uma seção dedicada de competências",
      detail:
        "Agrupar ferramentas e tecnologias em um bloco identificado melhora a precisão da extração de palavras-chave.",
    });
  if (parsed.wordCount > 900)
    improvements.push({
      priority: "low",
      title: "Reduza o tamanho do texto",
      detail: `Seu currículo tem cerca de ${parsed.wordCount} palavras. Cortar detalhes antigos ou menos relevantes mantém a atenção no que importa para esta vaga.`,
    });
  if (parsed.bullets.length < 4)
    improvements.push({
      priority: "low",
      title: "Use tópicos para as responsabilidades",
      detail:
        "Parágrafos densos são mais difíceis de interpretar. Divida a experiência em tópicos curtos, com uma ideia cada.",
    });
  if (improvements.length === 0)
    improvements.push({
      priority: "low",
      title: "Ajuste a linguagem para esta vaga específica",
      detail:
        "Seu currículo está estruturalmente sólido. Foque em espelhar a linguagem de cada descrição de vaga para a qual se candidatar.",
    });

  // Recomendações
  const recommendations: Recommendation[] = [];
  if (parsed.weakLines.length > 0) {
    const line = (parsed.weakLines[0] ?? "").replace(/^[\s•\-*·–—]+/, "").trim();
    recommendations.push({
      id: "rec-impact",
      category: "Experiência",
      priority: "high",
      problem: "Quantifique suas conquistas",
      why: "Recrutadores comparam candidatos por resultados. Frases focadas em tarefas fazem uma boa experiência parecer comum.",
      current: line,
      suggested: `${line
        .replace(
          /^(responsible for|in charge of|worked on|helped with|participated in|tasked with|duties included|responsável por|responsavel por|encarregado de|trabalhei em|ajudei com|participei de|auxiliei em)\s*/i,
          () => "",
        )
        .replace(/^./, (c) => c.toUpperCase())} — informe a escala envolvida (volume, frequência, orçamento ou resultado) para tornar o impacto visível.`,
    });
  }
  if (missing.length > 0) {
    recommendations.push({
      id: "rec-gap",
      category: "Palavras-chave",
      priority: "high",
      problem: `${titleCase(missing[0] ?? "")} é solicitado, mas não aparece`,
      why: "O ranqueamento do ATS é fortemente baseado em palavras-chave, e o recrutador que buscar esse termo não vai encontrá-lo.",
      suggested: `Se você realmente já usou ${titleCase(missing[0] ?? "")}, cite explicitamente no contexto em que utilizou. Se não usou, descreva com honestidade a experiência mais próxima e considere um curso curto antes de se candidatar.`,
    });
  }
  if ((parsed.sections["Resumo Profissional"]?.length ?? 0) === 0) {
    recommendations.push({
      id: "rec-summary",
      category: "Posicionamento",
      priority: "medium",
      problem: "Resumo profissional ausente",
      why: "O primeiro terço do currículo decide se o restante será lido.",
      suggested:
        "Comece com duas ou três linhas informando seu cargo, anos de experiência e principal área de impacto — usando apenas fatos que já estão no seu currículo.",
    });
  }
  recommendations.push({
    id: "rec-structure",
    category: "Estrutura ATS",
    priority: (parsed.sections["Competências Técnicas"]?.length ?? 0) === 0 ? "medium" : "low",
    problem: "Padronize os títulos das seções",
    why: "Os sistemas mapeiam o conteúdo por títulos convencionais. Nomes criativos podem fazer blocos inteiros serem ignorados.",
    suggested:
      'Use títulos simples: "Resumo Profissional", "Experiência Profissional", "Competências Técnicas", "Formação Acadêmica", "Certificações".',
  });
  if (hasJob) {
    recommendations.push({
      id: "rec-tailor",
      category: "Compatibilidade com a vaga",
      priority: "medium",
      problem: "Espelhe a linguagem da vaga",
      why: "Usar o vocabulário exato do anúncio aumenta tanto o ranqueamento no ATS quanto o reconhecimento pelo recrutador.",
      suggested: `Quando for verdadeiro, use as próprias palavras do anúncio para conceitos que você já demonstra${found.length ? ` — por exemplo ${found.slice(0, 3).map(titleCase).join(", ")}` : ""}.`,
    });
  }

  const optimized = buildOptimizedResume(parsed, found, input.variant ?? 0);

  const insights = [
    {
      title: "Competências que vale desenvolver",
      detail: missing.length
        ? `Com base neste anúncio, ${missing.slice(0, 4).map(titleCase).join(", ")} aumentariam de forma mais direta sua compatibilidade.`
        : `Aprofundar as ferramentas que você já lista${resumeSkills.length ? ` (${resumeSkills.slice(0, 3).map(titleCase).join(", ")})` : ""} e incluir resultados mensuráveis é o caminho mais rápido para fortalecer seu perfil.`,
    },
    {
      title: "Certificações sugeridas",
      detail: missing.length
        ? `Certificações introdutórias ou projetos guiados em ${missing.slice(0, 2).map(titleCase).join(" e ")} são uma forma honesta e crível de fechar essa lacuna.`
        : "Uma certificação reconhecida no seu principal conjunto de ferramentas pode te destacar entre candidatos semelhantes.",
    },
    {
      title: "Direção de carreira",
      detail: `Hoje seu currículo comunica um perfil ${parsed.wordCount > 600 ? "sênior" : experienceLines > 6 ? "pleno" : "de início a meio de carreira"}. Posicione as próximas candidaturas um passo à frente disso, liderando com escopo e responsabilidade em vez de tarefas.`,
    },
    {
      title: "Palavras-chave para manter visíveis",
      detail: found.length
        ? `${found.slice(0, 6).map(titleCase).join(", ")} já jogam a seu favor — mantenha esses termos no resumo e no bloco de competências, não apenas dentro dos tópicos de experiência.`
        : "Adicione um bloco compacto de competências para que seus termos mais fortes apareçam no início do documento.",
    },
  ];

  return {
    createdAt: Date.now(),
    hasJob,
    analyses,
    matchScore,
    atsScore,
    keywordsFound: found.map(titleCase),
    keywordsMissing: missing.map(titleCase),
    requirementsMet,
    requirementsTotal,
    breakdown,
    atsBreakdown,
    strengths: strengths.slice(0, 5),
    improvements: improvements.slice(0, 6),
    recommendations,
    optimized,
    insights,
  };
}

function polish(line: string, variant: number): string {
  let out = line.replace(/^[\s•\-*·–—]+/, "").trim();
  const replacements: [RegExp, string][] = [
    [/^responsible for\s+/i, ""],
    [/^in charge of\s+/i, ""],
    [/^duties included\s*:?\s*/i, ""],
    [/^tasked with\s+/i, ""],
    [/^worked on\s+/i, variant % 2 === 0 ? "Entreguei " : "Contribuí para "],
    [/^helped with\s+/i, "Apoiei "],
    [/^participated in\s+/i, "Contribuí para "],
    [/^(fui\s+)?respons[áa]vel\s+(por|pela|pelo)\s+/i, ""],
    [/^encarregad[oa]\s+(de|do|da)\s+/i, ""],
    [/^atividades\s+inclu[íi]am\s*:?\s*/i, ""],
    [/^trabalhei\s+(em|no|na|com)\s+/i, variant % 2 === 0 ? "Entreguei " : "Contribuí para "],
    [/^ajudei\s+(com|na|no|a)\s+/i, "Apoiei "],
    [/^auxiliei\s+(em|na|no|com)\s+/i, "Apoiei "],
    [/^participei\s+(de|do|da|em)\s+/i, "Contribuí para "],
  ];
  for (const [re, rep] of replacements) {
    if (re.test(out)) {
      out = out.replace(re, rep);
      break;
    }
  }
  out = out.replace(/\s{2,}/g, " ").replace(/\s+([,.;])/g, "$1");
  if (out.length > 1) out = out.charAt(0).toUpperCase() + out.slice(1);
  return out;
}

function buildOptimizedResume(
  parsed: ParsedResume,
  found: string[],
  variant: number,
): OptimizedSection[] {
  const order = [
    "Resumo Profissional",
    "Experiência Profissional",
    "Competências Técnicas",
    "Formação Acadêmica",
    "Certificações",
    "Informações Adicionais",
  ];

  const sections: OptimizedSection[] = [];
  for (const title of order) {
    let lines = (parsed.sections[title] ?? []).map((l) => polish(l, variant)).filter(Boolean);

    if (title === "Resumo Profissional" && lines.length === 0) {
      // Derivado estritamente do conteúdo já presente — sem inventar fatos.
      const source = (parsed.sections["Informações Adicionais"] ?? parsed.lines).filter(
        (l) => l.split(/\s+/).length > 8,
      );
      if (source.length > 0) lines = [polish(source[0] ?? "", variant)];
    }

    if (title === "Competências Técnicas" && lines.length === 0 && found.length > 0) {
      lines = [found.map(titleCase).join(" · ")];
    }

    if (lines.length > 0) sections.push({ title, lines });
  }

  if (sections.length === 0) {
    sections.push({ title: "Experiência Profissional", lines: parsed.lines.map((l) => polish(l, variant)) });
  }
  return sections;
}

export function optimizedToText(sections: OptimizedSection[]) {
  return sections
    .map((s) => `${s.title.toUpperCase()}\n${"-".repeat(s.title.length)}\n${s.lines.join("\n")}`)
    .join("\n\n");
}
