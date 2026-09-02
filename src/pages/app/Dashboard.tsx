import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Activity, HeartPulse, MoonStar, Sparkles, Pencil, Target } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import PageHeader from "@/components/app/PageHeader";
import Disclaimer from "@/components/app/Disclaimer";
import ProfileForm from "@/components/app/ProfileForm";
import { findFocus } from "@/data/plans";
import { useAdagio, todayKey } from "@/lib/store";

const Dashboard = () => {
  const { state, toggleTask } = useAdagio();
  const { profile, checkins, tasks, readiness, journal } = state;
  const [editing, setEditing] = useState(false);

  if (!profile) {
    return (
      <div className="space-y-8">
        <PageHeader
          eyebrow="Welcome to Adagio"
          title="Let's start with you"
          description="Tell Adagio who you are and what you're recovering from. Everything after this — your plan, prompts, readiness check and feedback — is built from these answers and remembered on this device."
        />
        <section className="surface p-6">
          <ProfileForm />
        </section>
        <Disclaimer />
      </div>
    );
  }

  const focus = findFocus(profile.focusId);
  const day = todayKey();
  const c = checkins[day];
  const dates = Object.keys(checkins).sort();
  const prev = dates.filter((d) => d < day).slice(-1)[0];
  const p = prev ? checkins[prev] : undefined;
  const weeks = Math.max(
    1,
    Math.ceil((Date.now() - new Date(profile.startedOn).getTime()) / (7 * 864e5)) || 1,
  );
  const allTasks = focus ? [...focus.physicalPlan, ...focus.psychologicalPlan] : [];
  const doneToday = allTasks.filter((t) => (tasks[t.id] ?? []).includes(day)).length;
  const latest = readiness[0];

  const delta = (now?: number, before?: number) => {
    if (now === undefined || before === undefined) return "First entries are the baseline";
    const d = now - before;
    return d === 0 ? "No change since last check-in" : `${d > 0 ? "Up" : "Down"} ${Math.abs(d)} since last check-in`;
  };

  const metrics = [
    { icon: HeartPulse, label: "Pain today", value: c ? `${c.pain} / 10` : "—", note: delta(c?.pain, p?.pain) },
    { icon: Activity, label: "Plan today", value: `${doneToday}/${allTasks.length || 0}`, note: "Consistency beats intensity" },
    { icon: MoonStar, label: "Sleep", value: c ? `${c.sleep}h` : "—", note: delta(c?.sleep, p?.sleep) },
    { icon: Sparkles, label: "Confidence", value: c ? `${c.confidence} / 10` : "—", note: delta(c?.confidence, p?.confidence) },
  ];

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  return (
    <div className="space-y-10">
      <PageHeader
        eyebrow={`Week ${weeks} of recovery · ${profile.level}`}
        title={`${greeting}, ${profile.name}.`}
        description={
          profile.goal
            ? `You're working toward: ${profile.goal}`
            : "Add a goal to your profile and Adagio will keep it in view."
        }
      />

      <section aria-labelledby="you" className="surface p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 id="you" className="text-xl">Your details</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {profile.focusLabel} · started {profile.startedOn}
              {profile.age ? ` · age ${profile.age}` : ""}
              {profile.styles ? ` · ${profile.styles}` : ""}
            </p>
          </div>
          <Button variant="ghost" size="sm" onClick={() => setEditing((e) => !e)}>
            <Pencil aria-hidden="true" className="mr-2 h-4 w-4" />
            {editing ? "Close" : "Edit"}
          </Button>
        </div>
        {editing && (
          <div className="mt-6 border-t border-border pt-6">
            <ProfileForm onDone={() => setEditing(false)} />
          </div>
        )}
      </section>

      {focus && (
        <section aria-labelledby="phase" className="surface overflow-hidden">
          <div className="bg-gradient-calm px-6 py-8 text-primary-foreground">
            <p className="text-xs uppercase tracking-[0.18em] opacity-80">{focus.label}</p>
            <h2 id="phase" className="mt-2 font-serif text-3xl">{focus.phases[focus.currentPhase]} phase</h2>
            <p className="mt-2 max-w-md text-sm opacity-90">{focus.summary}</p>
          </div>
          <div className="space-y-3 p-6">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Return-to-dance readiness</span>
              <span className="font-medium">{latest ? `${latest.overall}%` : "Not assessed yet"}</span>
            </div>
            <Progress value={latest?.overall ?? 0} aria-label="Return to dance readiness" />
            {latest && (
              <div className="grid gap-2 pt-2 text-sm sm:grid-cols-2">
                <p className="text-muted-foreground">Physical · {latest.physical}%</p>
                <p className="text-muted-foreground">Psychological · {latest.psychological}%</p>
              </div>
            )}
            <div className="flex flex-wrap gap-3 pt-2">
              <Button asChild variant="outline" size="sm">
                <Link to="/readiness">
                  {latest ? "Update readiness check" : "Take readiness assessment"} <ArrowRight aria-hidden="true" className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="sm">
                <Link to="/plan"><Target aria-hidden="true" className="mr-2 h-4 w-4" />Open my plan</Link>
              </Button>
            </div>
          </div>
        </section>
      )}

      <section aria-labelledby="signals">
        <h2 id="signals" className="mb-4 text-xl">Today&apos;s signals</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {metrics.map(({ icon: Icon, label, value, note }) => (
            <article key={label} className="surface p-5">
              <Icon aria-hidden="true" className="h-4 w-4 text-primary" />
              <p className="mt-3 text-sm text-muted-foreground">{label}</p>
              <p className="font-serif text-2xl">{value}</p>
              <p className="mt-1 text-xs text-muted-foreground">{note}</p>
            </article>
          ))}
        </div>
        {!c && (
          <p className="mt-3 text-sm text-muted-foreground">
            No check-in yet today — <Link className="story-link" to="/plan">log pain, mood, sleep and confidence</Link> to see personalised feedback.
          </p>
        )}
      </section>

      {focus && (
        <section aria-labelledby="plan">
          <h2 id="plan" className="mb-4 text-xl">Your plan for today</h2>
          <ul className="space-y-3">
            {[focus.physicalPlan[0], focus.psychologicalPlan[0], focus.physicalPlan[1]].filter(Boolean).map((item) => {
              const done = (tasks[item.id] ?? []).includes(day);
              return (
                <li key={item.id} className="surface flex items-start justify-between gap-4 p-5">
                  <div>
                    <p className="font-medium">{item.title}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{item.detail}</p>
                  </div>
                  <Button size="sm" variant={done ? "secondary" : "outline"} onClick={() => toggleTask(item.id)}>
                    {done ? "Done" : "Mark done"}
                  </Button>
                </li>
              );
            })}
          </ul>
        </section>
      )}

      <section aria-labelledby="insight" className="surface bg-gradient-dawn p-6">
        <h2 id="insight" className="text-xl">A pattern worth noticing</h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          {journal.length > 1
            ? `Across your last ${journal.length} entries, the themes appearing most often are ${Array.from(
                new Set(journal.flatMap((e) => e.themes)),
              )
                .slice(0, 3)
                .join(", ")
                .toLowerCase()}. Physical and emotional load often move together — this is an observation from your own entries, not a diagnosis.`
            : "Once you've written a few journal entries and logged some check-ins, Adagio will surface patterns between your physical and emotional data here."}
        </p>
        <Button asChild size="sm" className="mt-4">
          <Link to="/journal">Open the journal</Link>
        </Button>
      </section>

      <Disclaimer />
    </div>
  );
};

export default Dashboard;
