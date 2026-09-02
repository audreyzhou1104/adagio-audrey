import { useState } from "react";
import { Loader2, MessageSquare, PenLine, ShieldCheck } from "lucide-react";
import { communityThreads, stories } from "@/data/content";
import PageHeader from "@/components/app/PageHeader";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useUnsavedGuard } from "@/lib/unsaved";
import { aiModerate, type AiModeration } from "@/lib/ai";

type Thread = (typeof communityThreads)[number];
type Story = { name: string; tag: string; quote: string };

const Community = () => {
  const [open, setOpen] = useState<Thread | null>(null);
  const [reply, setReply] = useState("");
  const [sent, setSent] = useState<Record<string, string[]>>({});
  const [checking, setChecking] = useState(false);
  const [verdict, setVerdict] = useState<AiModeration | null>(null);
  const [storyOpen, setStoryOpen] = useState(false);
  const [storyName, setStoryName] = useState("");
  const [storyTag, setStoryTag] = useState("");
  const [storyText, setStoryText] = useState("");
  const [myStories, setMyStories] = useState<Story[]>([]);


  const submitReply = async () => {
    if (!open || !reply.trim() || checking) return;
    setChecking(true);
    setVerdict(null);
    const text = reply.trim();
    try {
      const result = await aiModerate(text);
      setVerdict(result);
      if (result.decision === "approved") {
        setSent((s) => ({ ...s, [open.title]: [...(s[open.title] ?? []), text] }));
        setReply("");
        toast.success("Approved by the moderator — your reply is live.");
      } else if (result.decision === "blocked") {
        toast.error("The moderator couldn't publish that reply.");
      } else if (result.decision === "escalate") {
        toast("A human moderator has been alerted, and support resources are on the Resources page.");
      } else {
        toast("Small change needed before this can go live.");
      }
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Moderation is unavailable right now.");
    } finally {
      setChecking(false);
    }
  };
  useUnsavedGuard(reply.trim().length > 0, undefined, "reply");


  return (
    <div className="space-y-10">
      <PageHeader
        eyebrow="Moderated community"
        title="Recovery is lonely. It doesn't have to be."
        description="Peer spaces grouped by what you're going through, with trained moderators and no comparison of timelines, bodies, or ability."
      />

      <div className="surface flex items-start gap-3 bg-muted/50 p-5 text-sm text-muted-foreground">
        <ShieldCheck aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
        <p>
          <span className="font-medium text-foreground">Community guidelines.</span> No medical advice, no numbers about
          weight or body size, no timeline comparisons, no harassment or body shaming, no advice to train through pain
          or hide injuries. An AI moderator checks every reply against these guidelines the moment you post it, and
          anything suggesting crisis is escalated to a human. Under-18 spaces are separated and supervised.
        </p>
      </div>

      <section aria-labelledby="threads">
        <h2 id="threads" className="mb-4 text-xl">
          Active conversations
        </h2>
        <ul className="space-y-3">
          {communityThreads.map((t) => (
            <li key={t.title} className="surface flex items-start justify-between gap-4 p-5">
              <div>
                <p className="eyebrow">{t.space}</p>
                <p className="mt-1 font-medium leading-snug">{t.title}</p>
                <p className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
                  <MessageSquare aria-hidden="true" className="h-3.5 w-3.5" />
                  {t.replies + (sent[t.title]?.length ?? 0)} replies · {t.tone}
                </p>
              </div>
              <Button variant="outline" size="sm" onClick={() => setOpen(t)}>
                Open
              </Button>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="stories">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h2 id="stories" className="text-xl">
            Recovery stories
          </h2>
          <Button variant="outline" size="sm" onClick={() => setStoryOpen(true)}>
            <PenLine aria-hidden="true" className="mr-2 h-4 w-4" />
            Submit your story
          </Button>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {[...myStories, ...stories].map((s) => (
            <blockquote key={s.name + s.quote.slice(0, 12)} className="surface bg-gradient-dawn p-6">
              <p className="font-serif text-lg leading-snug">&ldquo;{s.quote}&rdquo;</p>
              <footer className="mt-4 text-sm text-muted-foreground">
                <span className="font-medium text-foreground">{s.name}</span> · {s.tag}
              </footer>
            </blockquote>
          ))}
        </div>
      </section>

      <Dialog open={storyOpen} onOpenChange={setStoryOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-left text-xl">Share your recovery story</DialogTitle>
            <DialogDescription className="text-left">
              A few sentences about what helped. Keep it free of medical advice, numbers or timelines.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <Input
              value={storyName}
              onChange={(e) => setStoryName(e.target.value)}
              placeholder="Name and age, e.g. Maya, 19"
              aria-label="Name"
            />
            <Input
              value={storyTag}
              onChange={(e) => setStoryTag(e.target.value)}
              placeholder="Context, e.g. Stress fracture · Pre-professional"
              aria-label="Context"
            />
            <Textarea
              rows={5}
              value={storyText}
              onChange={(e) => setStoryText(e.target.value)}
              placeholder="What helped you most?"
              aria-label="Your story"
            />
            <Button
              className="w-full"
              disabled={!storyName.trim() || !storyText.trim()}
              onClick={() => {
                setMyStories((m) => [
                  { name: storyName.trim(), tag: storyTag.trim() || "Recovery story", quote: storyText.trim() },
                  ...m,
                ]);
                setStoryName("");
                setStoryTag("");
                setStoryText("");
                setStoryOpen(false);
                toast.success("Thank you — your story is now on the board.");
              }}
            >
              Post my story
            </Button>
          </div>
        </DialogContent>
      </Dialog>


      <Dialog open={!!open} onOpenChange={(o) => {
          if (!o) {
            setOpen(null);
            setVerdict(null);
          }
        }}>
        <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg">
          {open && (
            <>
              <DialogHeader>
                <p className="eyebrow">{open.space}</p>
                <DialogTitle className="text-left text-xl leading-snug">{open.title}</DialogTitle>
                <DialogDescription className="text-left leading-relaxed">{open.opener}</DialogDescription>
              </DialogHeader>

              <div className="space-y-3">
                {open.posts.map((p) => (
                  <div key={p.author} className="rounded-xl border border-border bg-muted/40 p-4">
                    <p className="text-xs font-medium text-foreground">{p.author}</p>
                    <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{p.text}</p>
                  </div>
                ))}
                {(sent[open.title] ?? []).map((r, i) => (
                  <div key={i} className="rounded-xl border border-primary/30 bg-primary/5 p-4">
                    <p className="text-xs font-medium text-foreground">You · approved by moderator</p>
                    <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{r}</p>
                  </div>
                ))}
              </div>

              <div className="space-y-2">
                <label htmlFor="reply" className="text-sm font-medium">
                  Add a reply
                </label>
                <Textarea
                  id="reply"
                  value={reply}
                  onChange={(e) => setReply(e.target.value)}
                  placeholder="Share your experience — no medical advice, no timeline comparisons."
                  rows={3}
                />
                {verdict && verdict.decision !== "approved" && (
                  <div className="rounded-xl border border-border bg-muted/40 p-4 text-sm" aria-live="polite">
                    <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      {verdict.decision === "blocked"
                        ? "Moderator · not published"
                        : verdict.decision === "escalate"
                          ? "Moderator · sent to a human moderator"
                          : "Moderator · small change needed"}
                    </p>
                    <p className="mt-1.5 leading-relaxed">{verdict.reason}</p>
                    {verdict.guideline && (
                      <p className="mt-1.5 text-xs text-muted-foreground">Guideline: {verdict.guideline}</p>
                    )}
                    {verdict.suggestion && (
                      <div className="mt-3">
                        <p className="text-xs text-muted-foreground">Suggested rewrite</p>
                        <p className="mt-1 leading-relaxed">{verdict.suggestion}</p>
                        <Button
                          size="sm"
                          variant="outline"
                          className="mt-2"
                          onClick={() => {
                            setReply(verdict.suggestion ?? "");
                            setVerdict(null);
                          }}
                        >
                          Use this wording
                        </Button>
                      </div>
                    )}
                  </div>
                )}
                <div className="flex items-center justify-end gap-3">
                  <p className="text-xs text-muted-foreground">Checked by the AI moderator before it posts.</p>
                  <Button size="sm" disabled={!reply.trim() || checking} onClick={() => void submitReply()}>
                    {checking && <Loader2 aria-hidden="true" className="mr-2 h-4 w-4 animate-spin" />}
                    {checking ? "Checking…" : "Post reply"}
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Community;
