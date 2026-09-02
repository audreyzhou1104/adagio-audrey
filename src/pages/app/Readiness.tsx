import { useRef, useState } from "react";
import { Loader2, Sparkles } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import PageHeader from "@/components/app/PageHeader";
import Disclaimer from "@/components/app/Disclaimer";
import { useAdagio, todayKey } from "@/lib/store";
import { useUnsavedGuard } from "@/lib/unsaved";
import { aiReadinessInsights, type AiInsights } from "@/lib/ai";
import { toast } from "sonner";


const physical = [
  "I can do 25 single-leg heel raises without pain",
  "I can hold single-leg balance for 30 seconds, eyes closed",
  "I can do 10 small jumps with no pain during or after",
  "I complete a full barre without modifying",
  "Pain stays at or below 2/10 for 24 hours after class",
];

const psychological = [
  "I trust my injured side to hold me",
  "I can dance without constantly monitoring the injury",
  "I feel ready to be seen dancing again",
  "I can accept that my body may perform differently now",
  "Returning excites me more than it frightens me",
];

const Group = ({
  title,
  items,
  values,
  setValues,
}: {
  title: string;
  items: string[];
  values: number[];
  setValues: (v: number[]) => void;
}) => (
  <section className="surface p-6">
    <h2 className="text-xl">{title}</h2>
    <div className="mt-6 space-y-7">
      {items.map((label, i) => (
        <div key={label}>
          <div className="mb-3 flex items-baseline justify-between gap-4">
            <span className="text-sm">{label}</span>
            <span className="font-serif text-lg">{values[i]}</span>
          </div>
          <Slider
            value={[values[i]]}
            min={0}
            max={10}
            step={1}
            aria-label={label}
            onValueChange={([v]) => setValues(values.map((old, idx) => (idx === i ? v : old)))}
          />
          <div className="mt-2 flex justify-between text-xs text-muted-foreground">
            <span>Not yet</span>
            <span>Completely</span>
          </div>
        </div>
      ))}
    </div>
  </section>
);

const Readiness = () => {
  const { state, update } = useAdagio();
  const [phys, setPhys] = useState<number[]>(Array(physical.length).fill(5));
  const [psych, setPsych] = useState<number[]>(Array(psychological.length).fill(4));
  const [submitted, setSubmitted] = useState(false);

  const avg = (a: number[]) => Math.round((a.reduce((x, y) => x + y, 0) / (a.length * 10)) * 100);
  const physScore = avg(phys);
  const psychScore = avg(psych);
  const overall = Math.round((physScore + psychScore) / 2);
  const gap = physScore - psychScore;

  const interpretation = () => {
    if (overall < 40) return "You're early in this. Treat today's numbers as a baseline to measure against, not a verdict.";
    if (gap >= 20) return "Your body is ahead of your confidence — the most common pattern in dancers, and the biggest re-injury risk. Prioritise graded exposure over extra strength work.";
    if (gap <= -20) return "You feel readier than your current physical tests show. Keep the enthusiasm, but let the capacity markers catch up before full impact.";
    if (overall >= 80) return "Both sides are tracking high. Bring these numbers to your physio or teacher as part of a return conversation.";
    return "Physical and psychological readiness are moving together. Keep progressing one variable at a time.";
  };

  const lowest = [
    ...physical.map((label, i) => ({ label, v: phys[i] })),
    ...psychological.map((label, i) => ({ label, v: psych[i] })),
  ].sort((a, b) => a.v - b.v).slice(0, 2);

  const [insights, setInsights] = useState<AiInsights | null>(null);
  const [insightsBusy, setInsightsBusy] = useState(false);

  const runInsights = async () => {
    setInsightsBusy(true);
    try {
      const result = await aiReadinessInsights({
        profile: state.profile,
        physical: physical.map((label, i) => ({ label, score: phys[i] })),
        psychological: psychological.map((label, i) => ({ label, score: psych[i] })),
        scores: { physical: physScore, psychological: psychScore, overall, gap },
        previousSnapshots: state.readiness.slice(0, 3),
      });
      setInsights(result);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not generate a reading right now.");
    } finally {
      setInsightsBusy(false);
    }
  };

  const savedRef = useRef(JSON.stringify([phys, psych]));
  const dirty = JSON.stringify([phys, psych]) !== savedRef.current;

  const save = () => {
    setSubmitted(true);
    savedRef.current = JSON.stringify([phys, psych]);
    update({
      readiness: [
        { id: crypto.randomUUID(), date: todayKey(), physical: physScore, psychological: psychScore, overall },
        ...state.readiness,
      ].slice(0, 20),
    });
    toast.success("Readiness snapshot saved.");
  };

  useUnsavedGuard(dirty, save, "readiness answers");


  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Return-to-dance readiness"
        title="Two kinds of ready"
        description="Physical capacity and psychological readiness are scored separately, because dancers are often cleared long before they feel safe."
      />

      <Group title="Physical readiness" items={physical} values={phys} setValues={setPhys} />
      <Group title="Psychological readiness" items={psychological} values={psych} setValues={setPsych} />

      <Button className="w-full sm:w-auto" onClick={save}>
        See and save my readiness snapshot
      </Button>

      {submitted && (
        <section className="surface overflow-hidden" aria-live="polite">
          <div className="bg-gradient-calm px-6 py-8 text-primary-foreground">
            <p className="text-xs uppercase tracking-[0.18em] opacity-80">Snapshot</p>
            <p className="mt-2 font-serif text-4xl">{overall}%</p>
            <p className="mt-2 max-w-md text-sm opacity-90">
              A reflection of your own answers today — not a clearance to return.
            </p>
          </div>
          <div className="space-y-5 p-6">
            <div>
              <div className="mb-2 flex justify-between text-sm">
                <span>Physical</span>
                <span className="font-medium">{physScore}%</span>
              </div>
              <Progress value={physScore} aria-label={`Physical readiness ${physScore} percent`} />
            </div>
            <div>
              <div className="mb-2 flex justify-between text-sm">
                <span>Psychological</span>
                <span className="font-medium">{psychScore}%</span>
              </div>
              <Progress value={psychScore} aria-label={`Psychological readiness ${psychScore} percent`} />
            </div>
            <div className="rounded-xl bg-sage-soft p-5 text-sm leading-relaxed">
              <p className="eyebrow mb-2">What this suggests</p>
              {interpretation()}
            </div>
            <div>
              <p className="eyebrow mb-2">Two things to work on next</p>
              <ul className="list-disc space-y-1 pl-5 text-sm text-muted-foreground">
                {lowest.map((l) => <li key={l.label}>{l.label} — currently {l.v}/10</li>)}
              </ul>
            </div>
            <div className="rounded-xl border border-border p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="eyebrow">AI reading of this snapshot</p>
                <Button variant="outline" size="sm" onClick={() => void runInsights()} disabled={insightsBusy}>
                  {insightsBusy ? (
                    <Loader2 aria-hidden="true" className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Sparkles aria-hidden="true" className="mr-2 h-4 w-4" />
                  )}
                  {insightsBusy ? "Reading…" : insights ? "Refresh" : "Generate"}
                </Button>
              </div>
              {insights ? (
                <div className="mt-4 space-y-3 text-sm leading-relaxed">
                  <p className="font-serif text-lg">{insights.headline}</p>
                  <ul className="list-disc space-y-2 pl-5 text-muted-foreground">
                    {insights.insights.map((i) => <li key={i}>{i}</li>)}
                  </ul>
                  <p className="rounded-lg bg-sage-soft p-4">
                    <span className="font-medium">This week: </span>
                    {insights.focusThisWeek}
                  </p>
                </div>
              ) : (
                <p className="mt-3 text-sm text-muted-foreground">
                  Get a personalized reading of the gap between your physical and psychological answers. Educational
                  reflection only — returning to dance is a decision for you and your clinician.
                </p>
              )}
            </div>
          </div>

        </section>
      )}

      {state.readiness.length > 0 && (
        <section className="surface p-6">
          <h2 className="text-xl">Your readiness history</h2>
          <ul className="mt-4 divide-y divide-border text-sm">
            {state.readiness.map((r) => (
              <li key={r.id} className="flex flex-wrap justify-between gap-3 py-3">
                <span className="text-muted-foreground">{r.date}</span>
                <span>Overall {r.overall}% · Physical {r.physical}% · Psychological {r.psychological}%</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      <Disclaimer />
    </div>
  );
};

export default Readiness;
