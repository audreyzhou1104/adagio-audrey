import { useState } from "react";
import { Check, Save, Trash2 } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import PageHeader from "@/components/app/PageHeader";
import Disclaimer from "@/components/app/Disclaimer";
import IdentityMapGraphic from "@/components/app/IdentityMapGraphic";
import { cn } from "@/lib/utils";
import { useAdagio, type IdentitySnapshot } from "@/lib/store";
import { useUnsavedGuard } from "@/lib/unsaved";
import { toast } from "sonner";

const values = [
  "Discipline", "Musicality", "Expression", "Belonging", "Craft", "Curiosity",
  "Strength", "Precision", "Storytelling", "Mentoring", "Resilience", "Play",
];

const mapBranches = [
  { id: "roles", label: "Roles I hold", hint: "Friend, sibling, student, teammate, teacher…" },
  { id: "strengths", label: "Strengths that aren't physical", hint: "Patience, humour, organisation, listening…" },
  { id: "curiosities", label: "Things I'm curious about", hint: "Subjects, crafts, places, ideas…" },
  { id: "people", label: "People I matter to", hint: "Who would say your name without mentioning dance?" },
  { id: "future", label: "A future I'd like", hint: "Describe a good day five years from now." },
];

const exercises = [
  { id: "ex-beyond", title: "Beyond the barre", text: "List three things you'd want people to know about you that have nothing to do with dance." },
  { id: "ex-transfer", title: "The transferable list", text: "Name a skill dance gave you and one place outside the studio where it already shows up." },
  { id: "ex-future", title: "Future selves", text: "Describe a version of your life five years from now where you're happy, whether or not you're performing." },
];

const Identity = () => {
  const { state, update } = useAdagio();
  const [selected, setSelected] = useState<string[]>(state.identity.values);
  const [answers, setAnswers] = useState<Record<string, string>>(state.identity.answers);

  const toggle = (v: string) =>
    setSelected((s) => (s.includes(v) ? s.filter((x) => x !== v) : [...s, v]));

  const history = state.identityHistory ?? [];

  const buildSnapshot = (): IdentitySnapshot => ({
    id: crypto.randomUUID(),
    date: new Date().toISOString(),
    center: state.profile?.name || "You",
    values: selected,
    answers,
    branches: [
      ...mapBranches.map((b) => ({ label: b.label, text: (answers[b.id] ?? "").trim() })),
      ...exercises.map((e) => ({ label: e.title, text: (answers[e.id] ?? "").trim() })),
    ].filter((b) => b.text.length > 0),
  });

  const save = () => {
    const snapshot = buildSnapshot();
    if (snapshot.branches.length === 0 && selected.length === 0) {
      toast.error("Write at least one branch or choose a value first.");
      return;
    }
    update({
      identity: { values: selected, answers },
      identityHistory: [snapshot, ...history],
    });
    toast.success("Identity map saved with today's map.");
  };

  const remove = (id: string) => {
    update({ identityHistory: history.filter((h) => h.id !== id) });
    toast.success("Entry deleted.");
  };

  const restore = (snap: IdentitySnapshot) => {
    setSelected(snap.values);
    setAnswers(snap.answers);
    toast.success("Loaded that entry into the editor.");
  };

  const filled = mapBranches.filter((b) => (answers[b.id] ?? "").trim().length > 0).length;

  const dirty =
    JSON.stringify({ v: selected, a: answers }) !==
    JSON.stringify({ v: state.identity.values, a: state.identity.answers });
  useUnsavedGuard(dirty, save, "identity map");


  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Identity map"
        title="Who am I besides a dancer?"
        description="Injury, burnout, or stepping away can shake the sense of who you are. Build a map of the parts of you that exist off the stage — it saves as you go."
      />

      <section className="surface p-6">
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <h2 className="text-xl">Your identity map</h2>
          <p className="text-sm text-muted-foreground">{filled} of {mapBranches.length} branches filled</p>
        </div>
        <p className="mt-2 text-sm text-muted-foreground">
          Centre of the map: <span className="font-medium text-foreground">{state.profile?.name || "You"}</span> — not a role, a person.
        </p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {mapBranches.map((b) => (
            <div key={b.id} className="rounded-xl border border-border p-4">
              <label htmlFor={b.id} className="text-sm font-medium">{b.label}</label>
              <p className="mt-1 text-xs text-muted-foreground">{b.hint}</p>
              <Textarea
                id={b.id}
                rows={3}
                className="mt-3"
                maxLength={600}
                value={answers[b.id] ?? ""}
                onChange={(e) => setAnswers((a) => ({ ...a, [b.id]: e.target.value }))}
                placeholder="Write freely…"
              />
            </div>
          ))}
        </div>
      </section>

      <section className="surface p-6">
        <h2 className="text-xl">What does dance give you?</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Choose the values that feel most like you. We&apos;ll help you find where else they can live.
        </p>
        <div className="mt-5 flex flex-wrap gap-2">
          {values.map((v) => (
            <button
              key={v}
              onClick={() => toggle(v)}
              aria-pressed={selected.includes(v)}
              className={cn(
                "flex items-center gap-1.5 rounded-full border border-border px-4 py-2 text-sm transition-colors",
                selected.includes(v) ? "bg-primary text-primary-foreground" : "bg-card text-muted-foreground hover:bg-muted",
              )}
            >
              {selected.includes(v) && <Check aria-hidden="true" className="h-3.5 w-3.5" />}
              {v}
            </button>
          ))}
        </div>
        {selected.length > 0 && (
          <div className="mt-6 rounded-xl bg-sage-soft p-5 text-sm leading-relaxed">
            <p className="eyebrow mb-2">Reflection</p>
            You chose {selected.slice(0, 3).join(", ").toLowerCase()}
            {selected.length > 3 ? " and more" : ""}. None of these require a stage. Where else in your week do they
            already appear — teaching, choreographing, music, friendship, study?
          </div>
        )}
      </section>

      <section aria-labelledby="exercises">
        <h2 id="exercises" className="mb-4 text-xl">Guided reflections</h2>
        <div className="space-y-4">
          {exercises.map((e) => (
            <article key={e.id} className="surface p-5">
              <h3 className="text-lg">{e.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{e.text}</p>
              <Textarea
                className="mt-4"
                rows={3}
                aria-label={e.title}
                maxLength={800}
                value={answers[e.id] ?? ""}
                onChange={(ev) => setAnswers((a) => ({ ...a, [e.id]: ev.target.value }))}
                placeholder="Write a few lines…"
              />
            </article>
          ))}
        </div>
      </section>

      <Button onClick={save}>
        <Save aria-hidden="true" className="mr-2 h-4 w-4" /> Save my identity map
      </Button>

      <section aria-labelledby="history" className="space-y-4">
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <h2 id="history" className="text-xl">Saved maps</h2>
          <p className="text-sm text-muted-foreground">
            {history.length === 0 ? "Nothing saved yet" : `${history.length} saved ${history.length === 1 ? "entry" : "entries"}`}
          </p>
        </div>
        {history.length === 0 ? (
          <p className="surface p-5 text-sm text-muted-foreground">
            Each time you save, we keep a dated copy and draw an identity map from it, so you can look back and see
            how your sense of self changes.
          </p>
        ) : (
          <div className="space-y-4">
            {history.map((snap) => (
              <article key={snap.id} className="surface p-5">
                <div className="flex flex-wrap items-baseline justify-between gap-3">
                  <div>
                    <p className="eyebrow">
                      {new Date(snap.date).toLocaleDateString(undefined, {
                        weekday: "short",
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                    <h3 className="text-lg">{snap.center}&apos;s identity map</h3>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => restore(snap)}>
                      Load into editor
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => remove(snap.id)} aria-label="Delete entry">
                      <Trash2 aria-hidden="true" className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="mt-4 overflow-hidden rounded-xl border border-border bg-muted/30 p-2">
                  <IdentityMapGraphic
                    center={snap.center}
                    branches={snap.branches}
                    values={snap.values}
                    className="h-auto w-full"
                  />
                </div>
                {snap.values.length > 0 && (
                  <p className="mt-3 text-sm text-muted-foreground">
                    Values that day: {snap.values.join(", ").toLowerCase()}.
                  </p>
                )}
              </article>
            ))}
          </div>
        )}
      </section>

      <Disclaimer />

    </div>
  );
};

export default Identity;
