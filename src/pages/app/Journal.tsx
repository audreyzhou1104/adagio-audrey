import { useState } from "react";
import { Loader2, RefreshCw, Sparkles, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { journalPrompts } from "@/data/content";
import PageHeader from "@/components/app/PageHeader";
import Disclaimer from "@/components/app/Disclaimer";
import { analyseEntry, type Analysis } from "@/lib/analysis";
import { aiAnalyseEntry } from "@/lib/ai";
import { useAdagio, todayKey } from "@/lib/store";
import { useUnsavedGuard } from "@/lib/unsaved";
import { toast } from "sonner";

const Journal = () => {
  const { state, update } = useAdagio();
  const { journal, profile } = state;
  const [promptIndex, setPromptIndex] = useState(0);
  const [text, setText] = useState("");
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [busy, setBusy] = useState(false);

  const prompt = journalPrompts[promptIndex];

  const run = async () => {
    setBusy(true);
    try {
      const a = await aiAnalyseEntry(text, { profile, prompt });
      setAnalysis(a);
    } catch (e) {
      toast.error(
        `${e instanceof Error ? e.message : "AI analysis failed"} — showing an on-device reading instead.`,
      );
      setAnalysis(analyseEntry(text, { name: profile?.name, focus: profile?.focusLabel }));
    } finally {
      setBusy(false);
    }
  };

  const save = (withAnalysis: boolean) => {
    if (text.trim().length === 0) return;
    const entry = {
      id: crypto.randomUUID(),
      date: todayKey(),
      prompt,
      text: text.trim(),
      summary: withAnalysis && analysis ? analysis.summary : "",
      themes: withAnalysis && analysis ? analysis.themes : [],
      suggestions: withAnalysis && analysis ? analysis.suggestions : [],
    };
    update({ journal: [entry, ...journal] });
    setText("");
    setAnalysis(null);
    toast.success(withAnalysis ? "Entry saved with its analysis." : "Entry saved to your journal.");
  };

  useUnsavedGuard(text.trim().length > 0, () => save(!!analysis), "journal entry");



  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="AI-assisted journaling"
        title="Write it down, then look at it gently"
        description="Write freely. Adagio reads the language you used and returns a reflection summary, the emotional themes it noticed, and suggestions you can actually act on."
      />

      <section className="surface p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="eyebrow">Today&apos;s prompt</p>
            <p className="mt-2 font-serif text-xl leading-snug">{prompt}</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            aria-label="Show another prompt"
            onClick={() => setPromptIndex((i) => (i + 1) % journalPrompts.length)}
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>

        <Textarea
          className="mt-5"
          rows={8}
          value={text}
          maxLength={4000}
          onChange={(e) => setText(e.target.value)}
          placeholder="Write freely. No one reads this but you."
          aria-label="Journal entry"
        />
        <p className="mt-1 text-xs text-muted-foreground">{text.trim().split(/\s+/).filter(Boolean).length} words</p>

        <div className="mt-4 flex flex-wrap gap-3">
          <Button onClick={() => save(false)} disabled={text.trim().length === 0 || busy}>
            Save to my journal
          </Button>
          <Button variant="outline" onClick={() => void run()} disabled={text.trim().length < 20 || busy}>
            {busy ? (
              <Loader2 aria-hidden="true" className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Sparkles aria-hidden="true" className="mr-2 h-4 w-4" />
            )}
            {busy ? "Reading your entry…" : "Analyse with AI (optional)"}
          </Button>
          <Button variant="ghost" onClick={() => { setText(""); setAnalysis(null); }}>Clear</Button>
        </div>
        <p className="mt-2 text-xs text-muted-foreground">
          Saving is always private to your account. AI analysis only happens if you ask for it.
        </p>



        {analysis && (
          <div className="mt-6 space-y-4" aria-live="polite">
            <div className="rounded-xl bg-sage-soft p-5 text-sm leading-relaxed">
              <p className="eyebrow mb-2">Reflection summary</p>
              {analysis.summary}
            </div>

            <div className="rounded-xl border border-border p-5">
              <p className="eyebrow mb-3">Emotional themes</p>
              <div className="flex flex-wrap gap-2">
                {analysis.themes.map((t) => (
                  <span key={t} className="rounded-full bg-muted px-3 py-1 text-xs text-foreground">{t}</span>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-border p-5">
              <p className="eyebrow mb-3">Personalized suggestions</p>
              <ul className="list-disc space-y-2 pl-5 text-sm leading-relaxed text-muted-foreground">
                {analysis.suggestions.map((s) => <li key={s}>{s}</li>)}
              </ul>
            </div>

            <Button onClick={() => save(true)}>Save entry with analysis</Button>
          </div>
        )}
      </section>

      <section aria-labelledby="past">
        <h2 id="past" className="mb-4 text-xl">Your entries</h2>
        {journal.length === 0 ? (
          <p className="surface p-5 text-sm text-muted-foreground">
            Nothing saved yet. Your entries and their analyses stay on this device.
          </p>
        ) : (
          <ul className="space-y-3">
            {journal.map((e) => (
              <li key={e.id} className="surface p-5">
                <div className="flex items-start justify-between gap-4">
                  <p className="eyebrow">{e.date}</p>
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label={`Delete entry from ${e.date}`}
                    onClick={() => update({ journal: journal.filter((x) => x.id !== e.id) })}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <p className="mt-2 text-sm leading-relaxed">{e.text}</p>
                {e.summary && <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{e.summary}</p>}
                <div className="mt-3 flex flex-wrap gap-2">
                  {e.themes.map((t) => (
                    <span key={t} className="rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground">{t}</span>
                  ))}
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <Disclaimer />
    </div>
  );
};

export default Journal;
