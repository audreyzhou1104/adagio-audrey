import { useState } from "react";
import { Check, Loader2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import PageHeader from "@/components/app/PageHeader";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { useAdagio } from "@/lib/store";
import { useUnsavedGuard } from "@/lib/unsaved";
import { toast } from "sonner";

const Feedback = () => {
  const { user } = useAuth();
  const { state } = useAdagio();
  const [name, setName] = useState(
    state.profile?.name ?? (user?.user_metadata?.display_name as string | undefined) ?? "",
  );
  const [comment, setComment] = useState("");
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);

  const send = async () => {
    if (busy || !user) return;
    if (!name.trim() || !comment.trim()) {
      toast.error("Please add your name and a comment.");
      return;
    }
    setBusy(true);
    try {
      const { error } = await supabase
        .from("feedback")
        .insert({ user_id: user.id, name: name.trim(), comment: comment.trim() });
      if (error) throw error;
      setSent(true);
      setComment("");
      toast.success("Thank you — your feedback was sent.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not send your feedback.");
    } finally {
      setBusy(false);
    }
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    void send();
  };

  useUnsavedGuard(comment.trim().length > 0, send, "feedback");


  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Feedback"
        title="Tell us how Adagio is working for you"
        description="What helped, what felt off, what's missing. Every comment is read by the team building this."
      />

      <form onSubmit={submit} className="surface space-y-5 p-6">
        <div className="space-y-2">
          <Label htmlFor="fb-name">Your name</Label>
          <Input id="fb-name" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="fb-comment">Your comment</Label>
          <Textarea
            id="fb-comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={6}
            placeholder="What would make this more useful for your recovery?"
            required
          />
        </div>
        <Button type="submit" disabled={busy}>
          {busy ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
          Send feedback
        </Button>

        {sent && (
          <p className="flex items-center gap-2 text-sm text-muted-foreground">
            <Check aria-hidden="true" className="h-4 w-4 text-primary" /> Received — thank you for taking the time.
          </p>
        )}
      </form>

      <ImpactCheckIn />
    </div>
  );
};

const IMPACT_QUESTIONS = [
  { key: "mental_wellbeing_improved", label: "My mental well-being has improved since using Adagio." },
  { key: "body_confidence_improved", label: "I feel more confidence and trust in my body." },
  { key: "physical_goals_improved", label: "I've made progress toward my physical recovery goals." },
] as const;

const ImpactCheckIn = () => {
  const { user } = useAuth();
  const [answers, setAnswers] = useState<Record<string, boolean | null>>({
    mental_wellbeing_improved: null,
    body_confidence_improved: null,
    physical_goals_improved: null,
  });
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  const complete = IMPACT_QUESTIONS.every((q) => typeof answers[q.key] === "boolean");

  const submit = async () => {
    if (!user || !complete || busy) return;
    setBusy(true);
    try {
      const { error } = await supabase.from("impact_responses").insert({
        user_id: user.id,
        mental_wellbeing_improved: answers.mental_wellbeing_improved as boolean,
        body_confidence_improved: answers.body_confidence_improved as boolean,
        physical_goals_improved: answers.physical_goals_improved as boolean,
      });
      if (error) throw error;
      setDone(true);
      toast.success("Thank you — your check-in was recorded.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not save your check-in.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="surface space-y-5 p-6">
      <div>
        <p className="eyebrow">Impact check-in</p>
        <h2 className="text-xl">Three quick questions</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Private — only you and the Adagio team see this. It helps us measure whether the app actually helps.
        </p>
      </div>

      <div className="space-y-4">
        {IMPACT_QUESTIONS.map((q) => (
          <div key={q.key} className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm">{q.label}</p>
            <div className="flex gap-2">
              <Button
                type="button"
                size="sm"
                variant={answers[q.key] === true ? "default" : "outline"}
                onClick={() => setAnswers((a) => ({ ...a, [q.key]: true }))}
              >
                Yes
              </Button>
              <Button
                type="button"
                size="sm"
                variant={answers[q.key] === false ? "default" : "outline"}
                onClick={() => setAnswers((a) => ({ ...a, [q.key]: false }))}
              >
                Not yet
              </Button>
            </div>
          </div>
        ))}
      </div>

      <Button type="button" onClick={() => void submit()} disabled={!complete || busy}>
        {busy ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Check className="mr-2 h-4 w-4" />}
        Submit check-in
      </Button>

      {done && <p className="text-sm text-muted-foreground">Recorded — thank you.</p>}
    </section>
  );
};


export default Feedback;
