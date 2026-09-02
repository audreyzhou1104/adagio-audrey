// Local, on-device text analysis used by the prototype's journal "AI".
// No network calls — themes are matched from language patterns in the entry.

type ThemeRule = {
  theme: string;
  keywords: string[];
  reading: string;
  suggestion: string;
};

const rules: ThemeRule[] = [
  {
    theme: "Fear of re-injury",
    keywords: ["scared", "afraid", "fear", "terrified", "landing", "reinjur", "re-injur", "trust my", "nervous", "panic"],
    reading: "you describe your body as something to watch rather than use",
    suggestion: "Pick the lowest rung of your fear ladder and do it once tomorrow, then write down what actually happened.",
  },
  {
    theme: "Impatience with progress",
    keywords: ["slow", "still", "weeks", "not yet", "behind", "forever", "plateau", "stuck", "should be"],
    reading: "time appears more often than effort does",
    suggestion: "Compare today's entry with one from two weeks ago rather than with your pre-injury self.",
  },
  {
    theme: "Identity & belonging",
    keywords: ["who am i", "identity", "erased", "invisible", "myself", "belong", "outsider", "watching", "side of the room"],
    reading: "your sense of place in the studio is doing as much work as your body",
    suggestion: "Add one line to your Identity Map — a value dance gave you that already lives somewhere else.",
  },
  {
    theme: "Comparison & pressure",
    keywords: ["everyone else", "compare", "better than", "casting", "audition", "perfect", "not good enough", "disappoint"],
    reading: "other people's timelines are shaping how you rate your own",
    suggestion: "Name one measure of progress that only involves you, and track that this week.",
  },
  {
    theme: "Body image",
    keywords: ["mirror", "weight", "fat", "thin", "look", "body looks", "shape", "eating", "food"],
    reading: "appearance language appears alongside training language",
    suggestion: "Try one training block facing away from the mirror and note how the movement felt instead.",
  },
  {
    theme: "Exhaustion",
    keywords: ["tired", "exhaust", "drained", "no energy", "sleep", "burnt", "burned out", "overwhelmed"],
    reading: "recovery capacity, not effort, looks like the limiting factor",
    suggestion: "Protect one 60-minute unscheduled rest block before adding any new training load.",
  },
  {
    theme: "Progress & relief",
    keywords: ["managed", "finally", "better", "stronger", "proud", "no pain", "full class", "first time", "good"],
    reading: "there is real evidence of progress in your own words",
    suggestion: "Save this entry. On a harder day, read it back as evidence rather than as luck.",
  },
  {
    theme: "Isolation",
    keywords: ["alone", "lonely", "no one", "nobody", "distant", "left out", "forgotten"],
    reading: "connection is thinner than it was before the injury",
    suggestion: "Send one message to someone from the studio today — presence rebuilds faster than explanation.",
  },
  {
    theme: "Self-criticism",
    keywords: ["stupid", "weak", "lazy", "failure", "hate myself", "pathetic", "my fault", "useless"],
    reading: "the tone you use with yourself is harsher than the facts you report",
    suggestion: "Rewrite one sentence of this entry as if a friend had written it to you.",
  },
];

export type Analysis = {
  summary: string;
  themes: string[];
  suggestions: string[];
  tone: "heavy" | "mixed" | "steady";
};

export function analyseEntry(text: string, context?: { name?: string; focus?: string }): Analysis {
  const lower = text.toLowerCase();
  const words = lower.split(/\s+/).filter(Boolean);
  const hits = rules
    .map((r) => ({ rule: r, score: r.keywords.filter((k) => lower.includes(k)).length }))
    .filter((h) => h.score > 0)
    .sort((a, b) => b.score - a.score);

  const top = hits.slice(0, 3);
  const positive = hits.find((h) => h.rule.theme === "Progress & relief");
  const heavyCount = hits.filter((h) => h.rule.theme !== "Progress & relief").length;
  const tone: Analysis["tone"] = heavyCount >= 3 && !positive ? "heavy" : positive && heavyCount ? "mixed" : "steady";

  const themes = top.length ? top.map((h) => h.rule.theme) : ["Observation without judgement"];

  const readings = top.map((h) => h.rule.reading);
  const opener =
    tone === "heavy"
      ? "This entry carries a lot."
      : tone === "mixed"
        ? "Two things sit side by side here: difficulty and evidence of movement forward."
        : "This reads as a steady, observational entry.";

  const body = readings.length
    ? `Across ${words.length} words, ${readings.join("; and ")}.`
    : `Across ${words.length} words you mostly describe events rather than judge them, which is a useful baseline to keep.`;

  const closer = context?.focus
    ? `For where you are with ${context.focus.toLowerCase()}, this is a normal shape for a week — not a setback.`
    : "None of this is a diagnosis — it's a reflection of the language you used today.";

  const suggestions = (top.length ? top.map((h) => h.rule.suggestion) : [
    "Write again tomorrow with one sentence about what your body managed today.",
  ]).slice(0, 3);

  if (tone === "heavy") {
    suggestions.push("If this weight stays for more than two weeks, bring it to a psychologist, GP, or someone you trust — the Resources page has options.");
  }

  return {
    summary: `${opener} ${body} ${closer}`,
    themes,
    suggestions,
    tone,
  };
}
