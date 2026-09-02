import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";

const MODEL = "gemini-3.6-flash";
const ENDPOINT = (model: string) =>
  `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;

const SAFETY_PREAMBLE = `You are Adagio, an AI recovery and well-being companion for dancers aged 12+ recovering from injury, surgery, chronic pain, burnout, anxiety, perfectionism, body-image concerns, fear of re-injury, isolation, performance pressure, or identity loss.

Hard rules:
- You are NOT a clinician. Never diagnose, never prescribe treatment, never interpret scans or medication.
- Clearly separate general educational information from professional medical or mental-health advice.
- If a message suggests crisis, self-harm, or red-flag physical symptoms, respond with warmth and point to professional and crisis support (the app's Resources page) without alarm.
- Tone: calm, plain, respectful, never bubbly, never clinical-cold, never patronising. Short paragraphs.
- Recognise and name links between physical state and emotional state when the user's data shows one.`;

type Body = {
  task: "chat" | "journal" | "insights" | "readiness" | "articles" | "summary" | "moderate";
  messages?: { role: "user" | "assistant"; text: string }[];
  text?: string;
  context?: Record<string, unknown>;
};

type GenOpts = {
  system: string;
  contents: { role: "user" | "model"; parts: { text: string }[] }[];
  json?: Record<string, unknown>;
  jsonMode?: boolean;

  search?: boolean;
};

type GenResult = { text: string; sources: { url: string; title: string }[] };

// Primary path: Lovable AI gateway (fast, no personal quota).
async function callGateway(opts: GenOpts): Promise<GenResult> {
  const key = Deno.env.get("LOVABLE_API_KEY");
  if (!key) throw Object.assign(new Error("LOVABLE_API_KEY is not configured"), { status: 500 });

  const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: { "Content-Type": "application/json", "Lovable-API-Key": key, "X-Lovable-AIG-SDK": "fetch" },
    body: JSON.stringify({
      model: "google/gemini-3.7-flash",
      service_tier: "priority",
      temperature: 0.7,
      ...(opts.json || opts.jsonMode ? { response_format: { type: "json_object" } } : {}),
      messages: [
        { role: "system", content: opts.system },
        ...opts.contents.map((c) => ({
          role: c.role === "model" ? "assistant" : "user",
          content: c.parts.map((p) => p.text).join(""),
        })),
      ],
    }),
  });

  if (!res.ok) {
    const details = await res.text();
    console.error(`Gateway request failed [${res.status}]: ${details}`);
    throw Object.assign(new Error("AI request failed"), { status: res.status, details });
  }

  const data = await res.json();
  const text = String(data?.choices?.[0]?.message?.content ?? "").trim();
  if (!text) throw Object.assign(new Error("AI returned an empty response"), { status: 502 });
  return { text, sources: [] };

}

async function callGemini(
  apiKey: string,
  opts: GenOpts,
): Promise<GenResult> {

  const res = await fetch(ENDPOINT(MODEL), {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-goog-api-key": apiKey },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: opts.system }] },
      contents: opts.contents,
      ...(opts.search ? { tools: [{ google_search: {} }] } : {}),
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 1600,
        ...(opts.json
          ? { responseMimeType: "application/json", responseSchema: opts.json }
          : {}),
      },
    }),
  });


  if (!res.ok) {
    const details = await res.text();
    console.error(`Gemini request failed [${res.status}]: ${details}`);
    throw Object.assign(new Error("Gemini request failed"), { status: res.status, details });
  }

  const data = await res.json();
  const cand = data?.candidates?.[0];
  const text: string =
    cand?.content?.parts?.map((p: { text?: string }) => p.text ?? "").join("") ?? "";
  const sources = (cand?.groundingMetadata?.groundingChunks ?? [])
    .map((c: { web?: { uri?: string; title?: string } }) => c.web)
    .filter((w: unknown) => !!w)
    .map((w: { uri?: string; title?: string }) => ({ url: w.uri ?? "", title: w.title ?? w.uri ?? "" }));
  return { text: text.trim(), sources } as { text: string; sources: { url: string; title: string }[] };
}

// Search-grounded tasks prefer the Google key; everything else prefers the gateway.
// Either path falls back to the other so one exhausted quota never breaks a feature.
async function generate(apiKey: string | undefined, opts: GenOpts): Promise<GenResult> {
  const order = opts.search && apiKey ? ["google", "gateway"] : ["gateway", "google"];
  let lastError: unknown;
  for (const path of order) {
    try {
      if (path === "google") {
        if (!apiKey) continue;
        return await callGemini(apiKey, opts);
      }
      return await callGateway({ ...opts, search: false });
    } catch (e) {
      lastError = e;
    }
  }
  throw lastError ?? new Error("No AI provider is configured");
}



function parseJsonish(raw: string) {
  const cleaned = raw.replace(/^```(?:json)?/i, "").replace(/```$/, "").trim();
  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");
  return JSON.parse(start >= 0 ? cleaned.slice(start, end + 1) : cleaned);
}


const analysisSchema = {
  type: "object",
  properties: {
    summary: { type: "string" },
    themes: { type: "array", items: { type: "string" } },
    suggestions: { type: "array", items: { type: "string" } },
    tone: { type: "string", enum: ["heavy", "mixed", "steady"] },
  },
  required: ["summary", "themes", "suggestions", "tone"],
};

const insightsSchema = {
  type: "object",
  properties: {
    headline: { type: "string" },
    insights: { type: "array", items: { type: "string" } },
    focusThisWeek: { type: "string" },
  },
  required: ["headline", "insights", "focusThisWeek"],
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const json = (payload: unknown, status = 200) =>
    new Response(JSON.stringify(payload), {
      status,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  try {
    const apiKey = Deno.env.get("GEMINI_API_KEY") ?? undefined;

    const body = (await req.json()) as Body;
    if (!body || typeof body.task !== "string") return json({ error: "task is required" }, 400);

    const ctx = body.context ? JSON.stringify(body.context).slice(0, 4000) : "{}";

    if (body.task === "chat") {
      const messages = Array.isArray(body.messages) ? body.messages.slice(-16) : [];
      if (messages.length === 0) return json({ error: "messages are required" }, 400);
      const { text } = await generate(apiKey, {
        system: `${SAFETY_PREAMBLE}

You are the recovery coach in a live conversation. Reply in 2-4 short paragraphs, end with one open question or one concrete, small next step.
If the context says mode is "voice", you are being spoken aloud: reply in 2-4 conversational sentences, plain spoken language, no lists, no markdown, no emoji, and end with one short question. Use the dancer's own data below when relevant.
Dancer context (JSON): ${ctx}`,
        contents: messages.map((m) => ({
          role: m.role === "assistant" ? "model" : "user",
          parts: [{ text: String(m.text ?? "").slice(0, 4000) }],
        })),
      });
      return json({ text });
    }

    if (body.task === "journal") {
      const entry = String(body.text ?? "").trim();
      if (entry.length < 10) return json({ error: "Entry is too short to analyse" }, 400);
      const { text: raw } = await generate(apiKey, {
        system: `${SAFETY_PREAMBLE}

Analyse one journal entry from a dancer. Return JSON only.
- summary: 3-5 sentences reflecting the entry back, naming any link between physical and emotional language. Never diagnose.
- themes: 2-4 short emotional theme labels (e.g. "Fear of re-injury", "Impatience with progress").
- suggestions: 2-4 specific, small, doable actions grounded in what the entry actually says.
- tone: "heavy", "mixed", or "steady".
If the entry suggests crisis or worsening physical red flags, include one suggestion about reaching a professional or crisis line.
Dancer context (JSON): ${ctx}`,
        contents: [{ role: "user", parts: [{ text: entry.slice(0, 6000) }] }],
        json: analysisSchema,
      });
      return json(parseJsonish(raw));
    }

    if (body.task === "insights" || body.task === "readiness") {
      const { text: raw } = await generate(apiKey, {
        system: `${SAFETY_PREAMBLE}

${
          body.task === "insights"
            ? "Read the dancer's profile, recovery focus, recent check-ins (pain, mood, confidence, sleep) and plan completion, and produce personalized recovery insights."
            : "Read the dancer's return-to-dance readiness answers (physical and psychological, each 0-10) and produce a personalized reading of their readiness. Never clear anyone to return — that is a clinician's call."
        }
Return JSON only.
- headline: one short sentence (max 12 words).
- insights: 3-4 observations, each one or two sentences, referencing the actual numbers and naming physical/emotional links.
- focusThisWeek: one concrete focus for the coming week.
Data (JSON): ${ctx}`,
        contents: [{ role: "user", parts: [{ text: "Generate the insights." }] }],
        json: insightsSchema,
      });
      return json(parseJsonish(raw));
    }

    if (body.task === "summary") {
      const messages = Array.isArray(body.messages) ? body.messages.slice(-40) : [];
      if (messages.length === 0) return json({ error: "messages are required" }, 400);
      const transcript = messages
        .map((m) => `${m.role === "assistant" ? "Coach" : "Dancer"}: ${String(m.text ?? "").slice(0, 2000)}`)
        .join("\n");
      const { text: raw } = await generate(apiKey, {
        system: `${SAFETY_PREAMBLE}

Summarise a spoken conversation between the dancer and the coach. Return JSON only.
- headline: one short sentence (max 12 words) naming what the conversation was really about.
- insights: 3-4 short observations about what the dancer expressed, in their own language where possible.
- focusThisWeek: one small concrete next step they agreed to or that follows naturally.
Dancer context (JSON): ${ctx}`,
        contents: [{ role: "user", parts: [{ text: transcript }] }],
        json: insightsSchema,
      });
      return json(parseJsonish(raw));
    }

    if (body.task === "articles") {
      const query = String(body.text ?? "").trim();
      if (query.length < 3) return json({ error: "Tell me a bit more about the situation" }, 400);
      // Search grounding is the ONLY acceptable path here. No fallback model:
      // an ungrounded model invents plausible-looking titles and URLs.
      if (!apiKey) {
        return json({
          unavailable:
            "Live web search isn't available (no Google Search API key is configured), so no articles can be shown. Nothing here is invented.",
          intro: "",
          articles: [],
          sources: [],
        });
      }
      let raw = "";
      let sources: { url: string; title: string }[] = [];
      try {
        const r = await callGemini(apiKey, {
          search: true,
          system: `${SAFETY_PREAMBLE}

You find real, currently-published articles for a dancer's situation using Google Search. Prefer reputable sources: peer-reviewed or clinical (PubMed, JOSPT, BJSM), dance-medicine organisations (IADMS, Harkness Center, Dance/USA), respected dance publications, and recognised mental-health organisations.
ABSOLUTE RULE: only list articles that appear in your actual search results. Never guess, reconstruct, or invent a title or URL. If your search returns fewer than 3 usable results, return only the ones you actually found — an empty list is correct and expected when you found nothing.
Return JSON only, no prose, no markdown fences, in this shape:
{"intro": string, "articles": [{"title": string, "source": string, "url": string, "summary": string, "whyRelevant": string}]}
- intro: one or two sentences framing what you looked for.
- up to 5 articles. summary: 2-3 sentences on what the article actually says. whyRelevant: one sentence tying it to this dancer.
Dancer context (JSON): ${ctx}`,
          contents: [{ role: "user", parts: [{ text: query.slice(0, 2000) }] }],
        });
        raw = r.text;
        sources = r.sources;
      } catch (e) {
        const status = (e as { status?: number }).status;
        return json({
          unavailable:
            status === 429
              ? "Live web search is out of quota right now, so no articles can be shown. I won't show made-up articles instead — try again after the quota resets."
              : "Live web search failed, so no articles can be shown right now. Nothing here is invented.",
          intro: "",
          articles: [],
          sources: [],
        });
      }
      let parsed: { intro?: string; articles?: { url?: string }[] };
      try {
        parsed = parseJsonish(raw) as { intro?: string; articles?: { url?: string }[] };
      } catch {
        console.error(`Articles parse failed. Raw: ${raw.slice(0, 500)}`);
        return json({ error: "The search results couldn't be read. Try again in a moment." }, 502);
      }
      const articles = (parsed.articles ?? []).filter((a) => typeof a?.url === "string" && /^https?:\/\//i.test(a.url));
      if (articles.length === 0) {
        return json({
          intro: "The search didn't return articles I can verify, so I'm not listing any rather than inventing them.",
          articles: [],
          sources,
        });
      }
      return json({ intro: parsed.intro ?? "", articles, sources });
    }

    if (body.task === "moderate") {
      const post = String(body.text ?? "").trim();
      if (post.length < 2) return json({ error: "Write a reply first" }, 400);
      const { text: raw } = await callGateway({
        system: `You are the community moderator for Élan, a recovery community for dancers aged 12+. Decide fast and return JSON only.

Community guidelines you enforce:
1. No medical advice — no diagnosing, no treatment/rehab prescriptions, no medication or supplement suggestions. Sharing personal experience is fine ("this is what my PT had me do") as long as it isn't told to others as instruction.
2. No numbers about weight, body size, calories, or food restriction.
3. No timeline comparisons that pressure others ("you should be back by week 6", "I was dancing in 3 weeks so you will be").
4. No harassment, insults, body shaming, or comparison of bodies or ability.
5. No promotion of unsafe training through pain, or of hiding injuries from teachers or clinicians.
6. Crisis or self-harm content is not blocked as a violation — it is flagged so a human moderator and crisis resources reach the person quickly.

Return: {"decision": "approved" | "needs_edit" | "blocked" | "escalate", "reason": string, "guideline": string, "suggestion": string}
- decision "approved": reason is one short warm sentence; guideline ""; suggestion "".
- "needs_edit": a fixable violation. reason names what to change in one sentence, guideline names the rule, suggestion is a rewritten version of their reply that keeps their voice and meaning.
- "blocked": harmful and not fixable. reason one sentence; suggestion "".
- "escalate": possible crisis or self-harm. reason is warm, points to the Resources page and crisis support; suggestion "".
Be decisive and brief. Never lecture.`,
        contents: [{ role: "user", parts: [{ text: post.slice(0, 3000) }] }],
        jsonMode: true,
      });
      try {
        return json(parseJsonish(raw));
      } catch {
        return json({ error: "Moderation couldn't be completed. Try posting again." }, 502);
      }
    }



    return json({ error: `Unknown task: ${body.task}` }, 400);
  } catch (error) {
    const status = (error as { status?: number }).status ?? 500;
    const details = (error as { details?: string }).details ?? (error as Error).message;
    return json({ error: "AI request failed", status, details }, status >= 400 && status < 600 ? status : 500);
  }
});
