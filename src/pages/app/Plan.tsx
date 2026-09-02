import { useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { AlertTriangle, BookOpen, CheckCircle2, Circle, Flame, Loader2, Sliders, Sparkles, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import PageHeader from "@/components/app/PageHeader";
import Disclaimer from "@/components/app/Disclaimer";
import TaskDetailDialog from "@/components/app/TaskDetailDialog";
import { focusAreas, findFocus, type PlanTask } from "@/data/plans";
import { taskGuides } from "@/data/taskGuides";
import { useAdagio, todayKey, type TaskLevel } from "@/lib/store";
import { useUnsavedGuard } from "@/lib/unsaved";
import { aiInsights, type AiInsights } from "@/lib/ai";
import { cn } from "@/lib/utils";
import { toast } from "sonner";



const streakFor = (dates: string[]) => {
  const set = new Set(dates);
  let n = 0;
  const d = new Date();
  for (;;) {
    const key = d.toISOString().slice(0, 10);
    if (!set.has(key)) break;
    n += 1;
    d.setDate(d.getDate() - 1);
  }
  return n;
};

const Plan = () => {
  const { state, update, toggleTask, setTaskLevel, resetTaskLevels } = useAdagio();
  const { profile, tasks, checkins } = state;
  // Saved states from before adaptive levels existed have no taskLevels key.
  const taskLevels = state.taskLevels ?? {};


  const focusId = profile?.focusId ?? focusAreas[0].id;
  const focus = findFocus(focusId) ?? focusAreas[0];
  const day = todayKey();
  const existing = checkins[day];
  const [pain, setPain] = useState(existing?.pain ?? 3);
  const [mood, setMood] = useState(existing?.mood ?? 6);
  const [confidence, setConfidence] = useState(existing?.confidence ?? 5);
  const [sleep, setSleep] = useState(existing?.sleep ?? 7);

  const all = [...focus.physicalPlan, ...focus.psychologicalPlan];
  const doneToday = all.filter((t) => (tasks[t.id] ?? []).includes(day)).length;
  const pct = Math.round((doneToday / all.length) * 100);
  const streak = useMemo(
    () => streakFor(Array.from(new Set(all.flatMap((t) => tasks[t.id] ?? [])))),
    [all, tasks],
  );

  const history = Object.entries(checkins).sort(([a], [b]) => (a < b ? 1 : -1)).slice(0, 7);

  const feedback = useMemo(() => {
    const lines: string[] = [];
    if (pain >= 6) lines.push("Pain at 6+ is a signal to hold today's load steady rather than progress it — and to check in with your clinician if it lasts past 24 hours.");
    else if (pain <= 2) lines.push("Low pain today means this is a good day to attempt the next rung of your plan, not to double the volume.");
    if (confidence <= 4) lines.push("Confidence is lagging behind your body. That's the usual pattern — the psychological set matters more than extra reps this week.");
    else if (confidence >= 7) lines.push("Confidence is high; use it on the movement you've been avoiding, at the smallest safe size.");
    if (sleep < 7) lines.push("Under seven hours reduces tissue recovery and raises perceived pain. Sleep is part of the plan, not around it.");
    if (mood <= 4) lines.push("Low mood alongside recovery is common and workable — the journal and Support pages are built for exactly this.");
    return lines.length ? lines : ["Everything is tracking within a normal range for this phase. Keep the rhythm rather than raising intensity."];
  }, [pain, mood, confidence, sleep]);

  const [insights, setInsights] = useState<AiInsights | null>(null);
  const [insightsBusy, setInsightsBusy] = useState(false);

  const runInsights = async () => {
    setInsightsBusy(true);
    try {
      const result = await aiInsights({
        profile,
        focus: { label: focus.label, phase: focus.phases[focus.currentPhase], summary: focus.summary },
        today: { pain, mood, confidence, sleep },
        recentCheckins: Object.entries(checkins)
          .sort(([a], [b]) => (a < b ? 1 : -1))
          .slice(0, 7)
          .map(([date, c]) => ({ date, ...c })),
        planProgress: { doneToday, totalTasks: all.length, streakDays: streak },
      });
      setInsights(result);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not generate insights right now.");
    } finally {
      setInsightsBusy(false);
    }
  };

  const savedCheckIn = useRef(JSON.stringify([pain, mood, confidence, sleep]));

  const saveCheckIn = () => {
    savedCheckIn.current = JSON.stringify([pain, mood, confidence, sleep]);
    update({ checkins: { ...checkins, [day]: { pain, mood, confidence, sleep } } });
    toast.success("Check-in saved for today.");
  };

  useUnsavedGuard(
    JSON.stringify([pain, mood, confidence, sleep]) !== savedCheckIn.current,
    saveCheckIn,
    "check-in",
  );




  const [openTask, setOpenTask] = useState<PlanTask | null>(null);
  /** Steps the dancer has flagged as too hard while already on the gentler version. */
  const [flagged, setFlagged] = useState<string[]>([]);

  const levelOf = (id: string): TaskLevel => (taskLevels[id] ?? 0) as TaskLevel;

  /** The prescription actually shown, adapted to the level the dancer chose. */
  const detailFor = (t: PlanTask) => {
    const level = levelOf(t.id);
    const guide = taskGuides[t.id];
    if (level === -1 && guide?.easier) return guide.easier;
    if (level === 1 && guide?.harder) return guide.harder;
    return t.detail;
  };

  const adjusted = all.filter((t) => levelOf(t.id) !== 0);
  const easedCount = all.filter((t) => levelOf(t.id) === -1).length;
  const pushedCount = all.filter((t) => levelOf(t.id) === 1).length;
  /** Early phases stay conservative — progressing is offered with a caution, never silently. */
  const earlyPhase = focus.currentPhase <= 1;

  const applyLevel = (t: PlanTask, next: TaskLevel) => {
    const current = levelOf(t.id);
    if (next === -1 && current === -1) {
      setFlagged((f) => (f.includes(t.id) ? f : [...f, t.id]));
      toast("Still too hard? That's useful information for your clinician or teacher.");
      return;
    }
    if (next === 1 && !taskGuides[t.id]?.harder) {
      toast("There isn't a harder version of this step — keep it steady.");
      return;
    }
    if (next === -1 && !taskGuides[t.id]?.easier) {
      toast("There isn't a gentler version of this step — skip it today if it hurts.");
      return;
    }
    setFlagged((f) => f.filter((id) => id !== t.id));
    setTaskLevel(t.id, next);
    toast.success(
      next === 0
        ? "Back to the standard version."
        : next === -1
          ? "Adjusted to the gentler version."
          : "Adjusted to the progressed version.",
    );
  };

  const Task = ({ t }: { t: PlanTask }) => {
    const done = (tasks[t.id] ?? []).includes(day);
    const total = (tasks[t.id] ?? []).length;
    const guide = taskGuides[t.id];
    const level = levelOf(t.id);
    return (
      <li
        className={cn(
          "surface p-2 transition-colors",
          done
            ? "border-primary/40 bg-sage-soft ring-1 ring-primary/30"
            : "hover:bg-muted/60",
        )}
      >
        <div className="flex items-start gap-2">
          <button
            onClick={() => toggleTask(t.id)}
            aria-pressed={done}
            aria-label={done ? `Mark ${t.title} not done` : `Mark ${t.title} done today`}
            className="rounded-lg p-2 transition-colors hover:bg-background/60"
          >
            {done ? (
              <CheckCircle2 aria-hidden="true" className="h-5 w-5 fill-primary text-primary-foreground" />
            ) : (
              <Circle aria-hidden="true" className="h-5 w-5 text-muted-foreground" />
            )}
          </button>
          <button
            onClick={() => setOpenTask(t)}
            className="flex-1 rounded-lg p-2 text-left transition-colors hover:bg-background/60"
          >
            <span className="flex flex-wrap items-center gap-2">
              <span className={cn("font-medium", done && "line-through decoration-primary/50")}>{t.title}</span>
              {done && (
                <span className="inline-flex items-center gap-1 rounded-full bg-primary px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-primary-foreground">
                  <CheckCircle2 aria-hidden="true" className="h-3 w-3" />
                  Done today
                </span>
              )}
              {level !== 0 && (
                <span className="inline-flex items-center gap-1 rounded-full border border-primary/40 px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.12em] text-primary">
                  <Sliders aria-hidden="true" className="h-3 w-3" />
                  {level === -1 ? "Adjusted gentler" : "Adjusted harder"}
                </span>
              )}
            </span>
            <span className="block text-sm text-muted-foreground">{detailFor(t)}</span>

            <span className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1 text-primary">
                <BookOpen aria-hidden="true" className="h-3.5 w-3.5" />
                How to do this
              </span>
              {guide?.minutes ? <span>{guide.minutes} min</span> : null}
              {guide?.resourceIds?.length ? (
                <span>{guide.resourceIds.length} video{guide.resourceIds.length === 1 ? "" : "s"} & reads</span>
              ) : null}
              <span>{total} day{total === 1 ? "" : "s"} logged</span>
            </span>
          </button>
        </div>

        <div className="mt-1 flex flex-wrap items-center gap-2 border-t border-border/70 px-2 pt-2">
          <span className="text-xs text-muted-foreground">How did this feel?</span>
          {([
            ["Too hard", -1],
            ["Just right", 0],
            ["Too easy", 1],
          ] as const).map(([label, value]) => (
            <button
              key={label}
              onClick={() => applyLevel(t, value)}
              aria-pressed={level === value}
              className={cn(
                "min-h-9 rounded-full border px-3 py-1 text-xs transition-colors",
                level === value
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border text-muted-foreground hover:bg-muted",
              )}
            >
              {label}
            </button>
          ))}
          {level !== 0 && (
            <button
              onClick={() => applyLevel(t, 0)}
              className="min-h-9 px-1 text-xs text-primary underline underline-offset-2"
            >
              Undo
            </button>
          )}
        </div>

        {level === 1 && earlyPhase && (
          <p className="px-2 pb-1 pt-2 text-xs text-muted-foreground">
            You&apos;re early in this phase — progress this one only if your clinician has cleared it.
          </p>
        )}
        {flagged.includes(t.id) && (
          <p className="px-2 pb-1 pt-2 text-xs text-muted-foreground">
            Already on the gentlest version and still too hard. Worth raising with a physio, teacher or doctor —
            Adagio can&apos;t assess this for you.
          </p>
        )}
      </li>
    );
  };



  if (!profile) {
    return (
      <div className="space-y-6">
        <PageHeader
          eyebrow="My plan"
          title="Set up your profile first"
          description="Your plan is generated from what you're recovering from, so Adagio needs a few details before it can personalise anything."
        />
        <Button asChild><Link to="/dashboard">Go to my dashboard</Link></Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow={`Personalised for ${profile.name}`}
        title={focus.label}
        description={focus.summary}
      />

      <section className="surface overflow-hidden">
        <div className="bg-gradient-calm px-6 py-7 text-primary-foreground">
          <p className="text-xs uppercase tracking-[0.18em] opacity-80">Phase {focus.currentPhase + 1} of {focus.phases.length}</p>
          <h2 className="mt-2 font-serif text-3xl">{focus.phases[focus.currentPhase]}</h2>
          <div className="mt-5 flex flex-wrap gap-2">
            {focus.phases.map((p, i) => (
              <span
                key={p}
                className={cn(
                  "rounded-full px-3 py-1 text-xs",
                  i <= focus.currentPhase ? "bg-primary-foreground/25" : "bg-primary-foreground/10 opacity-70",
                )}
              >
                {p}
              </span>
            ))}
          </div>
        </div>
        <div className="grid gap-4 p-6 sm:grid-cols-3">
          <div>
            <p className="text-sm text-muted-foreground">Today complete</p>
            <p className="font-serif text-2xl">{doneToday}/{all.length}</p>
            <Progress className="mt-2" value={pct} aria-label={`Plan ${pct} percent complete today`} />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Current streak</p>
            <p className="font-serif text-2xl flex items-center gap-2"><Flame aria-hidden="true" className="h-5 w-5 text-primary" />{streak} days</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Goal</p>
            <p className="text-sm">{profile.goal || "No goal set yet — add one from your dashboard."}</p>
          </div>
        </div>
      </section>

      <section aria-labelledby="checkin" className="surface p-6">
        <h2 id="checkin" className="text-xl">Today&apos;s check-in</h2>
        <p className="mt-1 text-sm text-muted-foreground">Move the sliders — feedback below updates from your own numbers.</p>
        <div className="mt-6 space-y-6">
          {([
            ["Pain", pain, setPain, 10, "None", "Severe"],
            ["Mood", mood, setMood, 10, "Low", "Good"],
            ["Confidence in your body", confidence, setConfidence, 10, "None", "Full"],
            ["Sleep (hours)", sleep, setSleep, 12, "0", "12"],
          ] as const).map(([label, value, setter, max, lo, hi]) => (
            <div key={label}>
              <div className="mb-2 flex items-baseline justify-between">
                <span className="text-sm">{label}</span>
                <span className="font-serif text-lg">{value}</span>
              </div>
              <Slider value={[value]} min={0} max={max} step={1} aria-label={label} onValueChange={([v]) => setter(v)} />
              <div className="mt-1 flex justify-between text-xs text-muted-foreground"><span>{lo}</span><span>{hi}</span></div>
            </div>
          ))}
        </div>
        <Button className="mt-6" onClick={saveCheckIn}>Save today&apos;s check-in</Button>

        <div className="mt-6 rounded-xl bg-sage-soft p-5" aria-live="polite">
          <p className="eyebrow mb-2">Personalised feedback</p>
          <ul className="space-y-2 text-sm leading-relaxed">
            {feedback.map((f) => <li key={f}>{f}</li>)}
          </ul>
        </div>

        <div className="mt-6 rounded-xl border border-border p-5" aria-live="polite">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="eyebrow">AI recovery insights</p>
            <Button variant="outline" size="sm" onClick={() => void runInsights()} disabled={insightsBusy}>
              {insightsBusy ? (
                <Loader2 aria-hidden="true" className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Sparkles aria-hidden="true" className="mr-2 h-4 w-4" />
              )}
              {insightsBusy ? "Reading your data…" : insights ? "Refresh insights" : "Generate insights"}
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
              Adagio reads your profile, check-in trends and plan progress to find links between how your body and
              your mind are tracking. Educational reflection only — not medical advice.
            </p>
          )}
        </div>
      </section>


      <section aria-labelledby="tuning" className="surface p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="eyebrow mb-1">Your adjustments</p>
            <h2 id="tuning" className="text-xl">
              {adjusted.length === 0 ? "Every step is at its standard level" : `${adjusted.length} step${adjusted.length === 1 ? "" : "s"} tuned to you`}
            </h2>
            <p className="mt-1 max-w-prose text-sm text-muted-foreground">
              {adjusted.length === 0
                ? "Tell each step below whether it felt too hard, just right or too easy, and Adagio swaps in the gentler or progressed version of that exercise or practice."
                : `${easedCount} made gentler, ${pushedCount} progressed. Your plan keeps these next time you open it.`}
            </p>
          </div>
          {adjusted.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                resetTaskLevels();
                setFlagged([]);
                toast.success("Plan reset to its standard levels.");
              }}
            >
              Reset to baseline
            </Button>
          )}
        </div>
      </section>


      <div className="grid gap-6 lg:grid-cols-2">
        <section aria-labelledby="phys">
          <h2 id="phys" className="mb-1 text-xl">Physical recovery plan</h2>
          <p className="mb-3 text-sm text-muted-foreground">
            Tap any step to open a full walkthrough — why it&apos;s in your plan, how to do it, easier and harder
            versions, what to watch for, and linked videos and reading.
          </p>
          <ul className="space-y-3">{focus.physicalPlan.map((t) => <Task key={t.id} t={t} />)}</ul>
        </section>
        <section aria-labelledby="psych">
          <h2 id="psych" className="mb-1 text-xl">Psychological recovery plan</h2>
          <p className="mb-3 text-sm text-muted-foreground">
            Same again for the emotional side: each step opens a guided practice with the reasoning behind it.
          </p>
          <ul className="space-y-3">{focus.psychologicalPlan.map((t) => <Task key={t.id} t={t} />)}</ul>
        </section>
      </div>

      <TaskDetailDialog
        task={openTask}
        done={openTask ? (tasks[openTask.id] ?? []).includes(day) : false}
        history={openTask ? (tasks[openTask.id] ?? []).length : 0}
        level={openTask ? levelOf(openTask.id) : 0}
        onLevelChange={(next) => openTask && applyLevel(openTask, next)}
        onToggle={() => openTask && toggleTask(openTask.id)}

        onOpenChange={(open) => !open && setOpenTask(null)}
      />


      {history.length > 0 && (
        <section aria-labelledby="hist" className="surface p-6">
          <h2 id="hist" className="text-xl">Recent check-ins</h2>
          <ul className="mt-4 divide-y divide-border text-sm">
            {history.map(([date, c]) => (
              <li key={date} className="flex flex-wrap justify-between gap-3 py-3">
                <span className="text-muted-foreground">{date}</span>
                <span>Pain {c.pain} · Mood {c.mood} · Confidence {c.confidence} · Sleep {c.sleep}h</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section aria-labelledby="watch" className="surface p-6">
        <h2 id="watch" className="flex items-center gap-2 text-xl">
          <AlertTriangle aria-hidden="true" className="h-5 w-5 text-primary" /> When to get professional input
        </h2>
        <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
          {focus.watchFor.map((w) => <li key={w}>{w}</li>)}
        </ul>
        <Button asChild variant="outline" size="sm" className="mt-4">
          <Link to="/resources"><Target aria-hidden="true" className="mr-2 h-4 w-4" />Find support</Link>
        </Button>
      </section>

      <Disclaimer />
    </div>
  );
};

export default Plan;
