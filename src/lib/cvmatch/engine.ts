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
  "Professional Summary": /^(professional\s+)?(summary|profile|objective|about( me)?|resumo|perfil)\b/i,
  "Professional Experience":
    /^(professional\s+|work\s+)?(experience|employment|history|career|experiência|experiencia)\b/i,
  "Technical Skills": /^(technical\s+)?(skills|competenc(ies|es)|technologies|stack|tools|habilidades)\b/i,
  Education: /^(education|academic|degrees?|formação|formacao)\b/i,
  Certifications: /^(certifications?|licenses?|courses?|training|certificações)\b/i,
  "Additional Information": /^(additional|other|languages|interests|volunteer|projects|awards)\b/i,
};

const ACTION_VERBS = [
  "led","built","designed","delivered","launched","improved","reduced","increased","implemented","migrated",
  "automated","owned","scaled","optimized","managed","created","developed","coordinated","negotiated","mentored",
];

const WEAK_PHRASES = [
  "responsible for","in charge of","duties included","worked on","helped with","participated in","tasked with",
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
    .map((w) => (w.length <= 2 ? w.toUpperCase() : w[0].toUpperCase() + w.slice(1)))
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
  let current = "Additional Information";
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
    sections[current] = sections[current] ?? [];
    sections[current].push(line);
  }
  const bullets = lines.filter((l) => /^[\s]*[•\-*·–—]/.test(l));
  const body = resume.toLowerCase();
  return {
    lines: lines.filter((l) => l.trim().length > 0),
    bullets,
    sections,
    hasNumbers: /\b\d+([.,]\d+)?\s*(%|k|m|\+|customers|users|clients|hours|projects|people|r\$|\$|€)/i.test(resume),
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
    { label: "Structure", value: structure },
    { label: "Keywords", value: keywordScore },
    { label: "Readability", value: readability },
    { label: "Formatting", value: formatting },
    { label: "Section Organization", value: organization },
  ];
  const atsScore = clamp(atsBreakdown.reduce((a, b) => a + b.value, 0) / atsBreakdown.length);

  const experienceLines = parsed.sections["Professional Experience"]?.length ?? 0;
  const experience = clamp(48 + experienceLines * 5 + (parsed.hasNumbers ? 14 : 0));
  const technical = clamp(40 + resumeSkills.length * 5 + (hasJob ? (found.length / Math.max(jdSkills.length, 1)) * 25 : 15));
  const education = clamp((parsed.sections["Education"]?.length ?? 0) > 0 ? 88 + sectionCount : 55);

  const breakdown = [
    { label: "Experience", value: experience },
    { label: "Technical Skills", value: technical },
    { label: "Keywords", value: keywordScore },
    { label: "Education", value: education },
    { label: "ATS Structure", value: structure },
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

  // Strengths — only claims backed by the pasted text
  const strengths: Strength[] = [];
  if (experienceLines > 3)
    strengths.push({
      title: "Clear experience section",
      detail: `Your resume presents ${experienceLines} lines of professional experience in a dedicated section, which reads well for both recruiters and parsers.`,
    });
  if (found.length > 0)
    strengths.push({
      title: hasJob ? "Relevant terminology already present" : "Recognisable skill vocabulary",
      detail: `Terms such as ${found.slice(0, 4).map(titleCase).join(", ")} appear in your resume and are commonly indexed by ATS engines.`,
    });
  if (parsed.hasNumbers)
    strengths.push({
      title: "Some achievements are quantified",
      detail: "Numbers and measurable outcomes appear in your text — this is what differentiates strong resumes from task lists.",
    });
  if ((parsed.sections["Education"]?.length ?? 0) > 0)
    strengths.push({
      title: "Education is clearly stated",
      detail: "A dedicated education section makes it easy for screening systems to extract your academic background.",
    });
  if (parsed.bullets.length > 4)
    strengths.push({
      title: "Scannable bullet structure",
      detail: `${parsed.bullets.length} bullet points keep the document readable in the six seconds a recruiter usually spends on a first pass.`,
    });
  if (strengths.length === 0)
    strengths.push({
      title: "Solid starting point",
      detail: "Your resume contains the raw material needed for a strong application — the improvements below focus on structure and relevance.",
    });

  // Improvements
  const improvements: Improvement[] = [];
  if (missing.length > 0)
    improvements.push({
      priority: "high",
      title: `Address ${missing.slice(0, 3).map(titleCase).join(", ")}`,
      detail: `The job description references ${missing.slice(0, 3).map(titleCase).join(", ")}, but your resume does not clearly demonstrate ${missing.length > 1 ? "these" : "this"}. If you have real exposure, describe it concretely. If you do not, highlight transferable experience or plan to learn it — never add a skill you do not have.`,
    });
  if (!parsed.hasNumbers)
    improvements.push({
      priority: "high",
      title: "Quantify your achievements",
      detail: "No measurable results were detected. Replace generic responsibilities with volumes, percentages, timelines or budgets you genuinely delivered.",
    });
  if (parsed.weakLines.length > 0)
    improvements.push({
      priority: "medium",
      title: "Replace passive responsibility phrasing",
      detail: `Phrases like "${parsed.weakLines[0].trim().slice(0, 70)}" describe duties rather than impact. Start with an action verb such as ${ACTION_VERBS.slice(0, 4).join(", ")}.`,
    });
  if ((parsed.sections["Professional Summary"]?.length ?? 0) === 0)
    improvements.push({
      priority: "medium",
      title: "Add a targeted professional summary",
      detail: "A three-line summary at the top gives both ATS and recruiters immediate context about your level and focus.",
    });
  if ((parsed.sections["Technical Skills"]?.length ?? 0) === 0)
    improvements.push({
      priority: "medium",
      title: "Create a dedicated skills section",
      detail: "Grouping tools and technologies in one labelled block improves keyword extraction accuracy.",
    });
  if (parsed.wordCount > 900)
    improvements.push({
      priority: "low",
      title: "Tighten the length",
      detail: `Your resume is around ${parsed.wordCount} words. Trimming older or less relevant detail keeps attention on what matters for this role.`,
    });
  if (parsed.bullets.length < 4)
    improvements.push({
      priority: "low",
      title: "Use bullet points for responsibilities",
      detail: "Dense paragraphs are harder to parse. Break experience into short, single-idea bullets.",
    });
  if (improvements.length === 0)
    improvements.push({
      priority: "low",
      title: "Refine wording for this specific role",
      detail: "Your resume is structurally sound. Focus on mirroring the language of each job description you apply to.",
    });

  // Recommendations
  const recommendations: Recommendation[] = [];
  if (parsed.weakLines.length > 0) {
    const line = parsed.weakLines[0].replace(/^[\s•\-*·–—]+/, "").trim();
    recommendations.push({
      id: "rec-impact",
      category: "Experience",
      priority: "high",
      problem: "Quantify your achievements",
      why: "Recruiters compare candidates on outcomes. Duty-based phrasing makes strong experience look ordinary.",
      current: line,
      suggested: `${line.replace(/^(responsible for|in charge of|worked on|helped with|participated in|tasked with|duties included)\s*/i, (m) => "").replace(/^./, (c) => c.toUpperCase())} — add the scale you handled (volume, frequency, budget or result) so the impact is visible.`,
    });
  }
  if (missing.length > 0) {
    recommendations.push({
      id: "rec-gap",
      category: "Keywords",
      priority: "high",
      problem: `${titleCase(missing[0])} is requested but not represented`,
      why: "ATS ranking is heavily keyword-driven, and a recruiter scanning for this term will not find it.",
      suggested: `If you have genuinely used ${titleCase(missing[0])}, name it explicitly in the context where you used it. If you have not, describe the closest adjacent experience honestly and consider a short course before applying.`,
    });
  }
  if ((parsed.sections["Professional Summary"]?.length ?? 0) === 0) {
    recommendations.push({
      id: "rec-summary",
      category: "Positioning",
      priority: "medium",
      problem: "Missing professional summary",
      why: "The top third of a resume decides whether the rest gets read.",
      suggested: "Open with two or three lines stating your role, years of experience and main area of impact — using only facts already present in your resume.",
    });
  }
  recommendations.push({
    id: "rec-structure",
    category: "ATS Structure",
    priority: (parsed.sections["Technical Skills"]?.length ?? 0) === 0 ? "medium" : "low",
    problem: "Standardise section headings",
    why: "Parsers map content using conventional headings. Creative labels can cause whole blocks to be dropped.",
    suggested: 'Use plain headings: "Professional Summary", "Professional Experience", "Technical Skills", "Education", "Certifications".',
  });
  if (hasJob) {
    recommendations.push({
      id: "rec-tailor",
      category: "Job Match",
      priority: "medium",
      problem: "Mirror the job's language",
      why: "Matching the exact vocabulary of the posting raises both ATS ranking and recruiter recognition.",
      suggested: `Where accurate, use the posting's own wording for concepts you already demonstrate${found.length ? ` — for example ${found.slice(0, 3).map(titleCase).join(", ")}` : ""}.`,
    });
  }

  const optimized = buildOptimizedResume(parsed, found, input.variant ?? 0);

  const insights = [
    {
      title: "Skills worth developing",
      detail: missing.length
        ? `Based on this posting, ${missing.slice(0, 4).map(titleCase).join(", ")} would most directly increase your match rate.`
        : `Deepening the tools you already list${resumeSkills.length ? ` (${resumeSkills.slice(0, 3).map(titleCase).join(", ")})` : ""} and adding measurable outcomes is the fastest way to strengthen your profile.`,
    },
    {
      title: "Suggested certifications",
      detail: missing.length
        ? `Entry-level certifications or guided projects in ${missing.slice(0, 2).map(titleCase).join(" and ")} are a credible way to close this gap honestly.`
        : "A recognised certification in your primary tool set can help you stand out among similar candidates.",
    },
    {
      title: "Career direction",
      detail: `Your resume currently reads as a ${parsed.wordCount > 600 ? "senior" : experienceLines > 6 ? "mid-level" : "early-to-mid career"} profile. Position your next applications one step ahead of that by leading with scope and ownership rather than tasks.`,
    },
    {
      title: "Keywords to keep visible",
      detail: found.length
        ? `${found.slice(0, 6).map(titleCase).join(", ")} are already working for you — keep them in the summary and skills block, not only deep inside experience bullets.`
        : "Add a compact skills block so your strongest terms appear early in the document.",
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
    [/^worked on\s+/i, variant % 2 === 0 ? "Delivered " : "Contributed to "],
    [/^helped with\s+/i, "Supported "],
    [/^participated in\s+/i, "Contributed to "],
  ];
  for (const [re, rep] of replacements) {
    if (re.test(out)) {
      out = out.replace(re, rep);
      break;
    }
  }
  out = out.replace(/\s{2,}/g, " ").replace(/\s+([,.;])/g, "$1");
  if (out.length > 1) out = out[0].toUpperCase() + out.slice(1);
  return out;
}

function buildOptimizedResume(
  parsed: ParsedResume,
  found: string[],
  variant: number,
): OptimizedSection[] {
  const order = [
    "Professional Summary",
    "Professional Experience",
    "Technical Skills",
    "Education",
    "Certifications",
    "Additional Information",
  ];

  const sections: OptimizedSection[] = [];
  for (const title of order) {
    let lines = (parsed.sections[title] ?? []).map((l) => polish(l, variant)).filter(Boolean);

    if (title === "Professional Summary" && lines.length === 0) {
      // Derive strictly from content already present — no invented facts.
      const source = (parsed.sections["Additional Information"] ?? parsed.lines).filter(
        (l) => l.split(/\s+/).length > 8,
      );
      if (source.length > 0) lines = [polish(source[0], variant)];
    }

    if (title === "Technical Skills" && lines.length === 0 && found.length > 0) {
      lines = [found.map(titleCase).join(" · ")];
    }

    if (lines.length > 0) sections.push({ title, lines });
  }

  if (sections.length === 0) {
    sections.push({ title: "Professional Experience", lines: parsed.lines.map((l) => polish(l, variant)) });
  }
  return sections;
}

export function optimizedToText(sections: OptimizedSection[]) {
  return sections
    .map((s) => `${s.title.toUpperCase()}\n${"-".repeat(s.title.length)}\n${s.lines.join("\n")}`)
    .join("\n\n");
}
