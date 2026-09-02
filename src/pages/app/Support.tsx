import { useState } from "react";
import { Loader2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import PageHeader from "@/components/app/PageHeader";
import Disclaimer from "@/components/app/Disclaimer";
import { cn } from "@/lib/utils";
import { aiChat } from "@/lib/ai";
import { useAdagio } from "@/lib/store";
import { toast } from "sonner";

type Message = { role: "user" | "assistant"; text: string };

const starters = [
  "I'm cleared to dance but I'm scared to jump.",
  "I feel like I'm falling behind everyone in my class.",
  "How do I talk to my teacher about pain?",
  "I don't know who I am without dance.",
];

const Support = () => {
  const { state } = useAdagio();
  const { profile, checkins, readiness } = state;
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      text: profile?.name
        ? `Hi ${profile.name}. I can see your profile and recent check-ins. What's on your mind today?`
        : "Hi. I'm here for reflection and practical support — not medical advice. What's on your mind today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);

  const recentCheckins = Object.entries(checkins)
    .sort(([a], [b]) => (a < b ? 1 : -1))
    .slice(0, 7)
    .map(([date, c]) => ({ date, ...c }));

  const send = async (text: string) => {
    if (!text.trim() || busy) return;
    const next: Message[] = [...messages, { role: "user", text: text.trim() }];
    setMessages(next);
    setInput("");
    setBusy(true);
    try {
      const { text: reply } = await aiChat(next, {
        profile,
        recentCheckins,
        recentReadiness: readiness.slice(0, 3),
      });
      setMessages((m) => [...m, { role: "assistant", text: reply }]);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "The companion could not respond.");
      setMessages((m) => m.slice(0, -1));
      setInput(text);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="AI recovery companion"
        title="A place to think out loud"
        description="Personalized to your check-ins, injury phase, and goals. It listens for the link between how your body feels and how you feel."
      />

      <Disclaimer>
        <span className="font-medium text-foreground">Not a clinician.</span> This companion offers educational and
        reflective support only. It cannot diagnose, prescribe, or handle emergencies. For urgent help, see{" "}
        <a href="/resources" className="underline underline-offset-4">
          crisis resources
        </a>
        .
      </Disclaimer>

      <section className="surface flex flex-col overflow-hidden">
        <div className="flex-1 space-y-4 p-5" aria-live="polite">
          {messages.map((m, i) => (
            <div
              key={i}
              className={cn(
                "max-w-[85%] whitespace-pre-wrap rounded-2xl px-4 py-3 text-sm leading-relaxed",
                m.role === "user"
                  ? "ml-auto bg-primary text-primary-foreground"
                  : "bg-muted text-foreground",
              )}
            >
              {m.text}
            </div>
          ))}
          {busy && (
            <div className="flex items-center gap-2 rounded-2xl bg-muted px-4 py-3 text-sm text-muted-foreground">
              <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" />
              Thinking about what you said…
            </div>
          )}
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            void send(input);
          }}
          className="flex gap-2 border-t border-border p-4"
        >
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type what's going on…"
            aria-label="Message the recovery companion"
            disabled={busy}
          />
          <Button type="submit" size="icon" aria-label="Send message" disabled={busy || !input.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </section>

      <section aria-labelledby="starters">
        <h2 id="starters" className="mb-3 text-sm text-muted-foreground">
          Not sure where to start?
        </h2>
        <div className="flex flex-wrap gap-2">
          {starters.map((s) => (
            <button
              key={s}
              onClick={() => void send(s)}
              disabled={busy}
              className="rounded-full border border-border bg-card px-4 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:opacity-50"
            >
              {s}
            </button>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Support;
