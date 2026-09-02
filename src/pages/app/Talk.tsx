import { useEffect, useRef, useState } from "react";
import { Loader2, Mic, Pause, Play, Square, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import PageHeader from "@/components/app/PageHeader";
import Disclaimer from "@/components/app/Disclaimer";
import { cn } from "@/lib/utils";
import { aiChat, aiConversationSummary, type AiInsights } from "@/lib/ai";
import { useAdagio } from "@/lib/store";
import { toast } from "sonner";

const VOICE_KEY = "adagio.voice.uri";

// Voices that tend to sound most natural across platforms, best first.
const naturalHints = [
  "natural",
  "neural",
  "premium",
  "enhanced",
  "google",
  "samantha",
  "ava",
  "allison",
  "serena",
  "daniel",
  "karen",
  "moira",
];

const voiceScore = (v: SpeechSynthesisVoice) => {
  const n = `${v.name} ${v.voiceURI}`.toLowerCase();
  const i = naturalHints.findIndex((h) => n.includes(h));
  return i === -1 ? naturalHints.length : i;
};

// Friendly names so the menu never shows raw system voice IDs.
const friendlyNames = ["Nora", "Ava", "Iris", "Theo", "Rowan"];

const isMasculine = (v: SpeechSynthesisVoice) =>
  /male|daniel|alex|fred|thomas|george|oliver|james|aaron|arthur/i.test(v.name) && !/female/i.test(v.name);

// Pick at most five distinct, natural-sounding voices and label them warmly.
const curate = (all: SpeechSynthesisVoice[]) => {
  const seen = new Set<string>();
  const picked = all
    .filter((v) => {
      const key = v.name.toLowerCase().replace(/\s+/g, "");
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .slice(0, 5);
  return picked.map((v, i) => ({
    voice: v,
    label: `${friendlyNames[i] ?? `Voice ${i + 1}`} — ${isMasculine(v) ? "calm, low" : "warm, gentle"}`,
  }));
};



type Turn = { role: "user" | "assistant"; text: string };

type SpeechRecognitionLike = {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onresult: ((e: { results: ArrayLike<ArrayLike<{ transcript: string }> & { isFinal: boolean }> }) => void) | null;
  onend: (() => void) | null;
  onerror: ((e: { error: string }) => void) | null;
};

const getRecognition = (): SpeechRecognitionLike | null => {
  const w = window as unknown as { SpeechRecognition?: new () => SpeechRecognitionLike; webkitSpeechRecognition?: new () => SpeechRecognitionLike };
  const Ctor = w.SpeechRecognition ?? w.webkitSpeechRecognition;
  if (!Ctor) return null;
  const r = new Ctor();
  r.lang = "en-US";
  r.continuous = false;
  r.interimResults = true;
  return r;
};

const topics = [
  "Fear of reinjury",
  "Burnout",
  "Anxiety before class",
  "Perfectionism",
  "Identity loss",
  "Rebuilding confidence",
  "Returning to dance",
];

const Talk = () => {
  const { state } = useAdagio();
  const { profile, checkins, readiness } = state;

  const [turns, setTurns] = useState<Turn[]>([]);
  const [status, setStatus] = useState<"idle" | "listening" | "thinking" | "speaking" | "paused">("idle");
  const [interim, setInterim] = useState("");
  const [summary, setSummary] = useState<AiInsights | null>(null);
  const [summarising, setSummarising] = useState(false);
  const [supported, setSupported] = useState(true);
  const [voices, setVoices] = useState<{ voice: SpeechSynthesisVoice; label: string }[]>([]);
  const [voiceURI, setVoiceURI] = useState<string>(() =>
    typeof window === "undefined" ? "" : localStorage.getItem(VOICE_KEY) ?? "",
  );

  const recRef = useRef<SpeechRecognitionLike | null>(null);
  const activeRef = useRef(false);
  const pausedRef = useRef(false);
  const turnsRef = useRef<Turn[]>([]);
  const voiceRef = useRef<string>(voiceURI);
  voiceRef.current = voiceURI;

  useEffect(() => {
    setSupported(!!getRecognition());
    return () => {
      activeRef.current = false;
      recRef.current?.abort();
      window.speechSynthesis?.cancel();
    };
  }, []);

  // Voices load asynchronously in most browsers.
  useEffect(() => {
    const synth = window.speechSynthesis;
    if (!synth) return;
    const read = () => {
      const list = curate(
        synth
          .getVoices()
          .filter((v) => v.lang?.toLowerCase().startsWith("en"))
          .sort((a, b) => voiceScore(a) - voiceScore(b) || a.name.localeCompare(b.name)),
      );
      setVoices(list);
      setVoiceURI((current) =>
        current && list.some((v) => v.voice.voiceURI === current) ? current : list[0]?.voice.voiceURI ?? "",
      );
    };
    read();
    synth.addEventListener?.("voiceschanged", read);
    return () => synth.removeEventListener?.("voiceschanged", read);
  }, []);

  const chooseVoice = (uri: string) => {
    setVoiceURI(uri);
    voiceRef.current = uri;
    localStorage.setItem(VOICE_KEY, uri);
    const synth = window.speechSynthesis;
    const v = synth?.getVoices().find((x) => x.voiceURI === uri);
    if (!synth || !v || activeRef.current) return;
    const preview = new SpeechSynthesisUtterance("Hi, I'm here with you. We can take this at your pace.");
    preview.voice = v;
    preview.rate = 0.98;
    synth.cancel();
    synth.speak(preview);
  };

  const recentCheckins = Object.entries(checkins)
    .sort(([a], [b]) => (a < b ? 1 : -1))
    .slice(0, 7)
    .map(([date, c]) => ({ date, ...c }));

  const speak = (text: string) =>
    new Promise<void>((resolve) => {
      const synth = window.speechSynthesis;
      if (!synth) return resolve();
      const u = new SpeechSynthesisUtterance(text);
      const chosen = synth.getVoices().find((v) => v.voiceURI === voiceRef.current);
      if (chosen) {
        u.voice = chosen;
        u.lang = chosen.lang;
      }
      u.rate = 0.98;
      u.pitch = 1;
      u.onend = () => resolve();
      u.onerror = () => resolve();
      synth.cancel();
      synth.speak(u);
    });


  const listen = () =>
    new Promise<string>((resolve) => {
      const rec = getRecognition();
      if (!rec) return resolve("");
      recRef.current = rec;
      let finalText = "";
      rec.onresult = (e) => {
        let live = "";
        for (let i = 0; i < e.results.length; i++) {
          const res = e.results[i];
          const t = res[0]?.transcript ?? "";
          if (res.isFinal) finalText += t;
          else live += t;
        }
        setInterim(live);
      };
      rec.onerror = () => resolve(finalText);
      rec.onend = () => {
        setInterim("");
        resolve(finalText.trim());
      };
      try {
        rec.start();
      } catch {
        resolve("");
      }
    });

  const loop = async () => {
    while (activeRef.current) {
      if (pausedRef.current) {
        await new Promise((r) => setTimeout(r, 300));
        continue;
      }
      setStatus("listening");
      const said = await listen();
      if (!activeRef.current || pausedRef.current) continue;
      if (!said) continue;

      const next: Turn[] = [...turnsRef.current, { role: "user", text: said }];
      turnsRef.current = next;
      setTurns(next);
      setStatus("thinking");
      try {
        const { text: reply } = await aiChat(next, {
          mode: "voice",
          profile,
          recentCheckins,
          recentReadiness: readiness.slice(0, 3),
        });
        if (!activeRef.current) return;
        turnsRef.current = [...turnsRef.current, { role: "assistant", text: reply }];
        setTurns(turnsRef.current);
        setStatus("speaking");
        await speak(reply);
      } catch (e) {
        toast.error(e instanceof Error ? e.message : "The companion could not respond.");
        setStatus("paused");
        pausedRef.current = true;
      }
    }
    setStatus("idle");
  };

  const start = async () => {
    if (!supported) return;
    activeRef.current = true;
    pausedRef.current = false;
    setSummary(null);
    if (turnsRef.current.length === 0) {
      const greeting = profile?.name
        ? `Hi ${profile.name}. I'm here. Take your time — what's going on for you today?`
        : "Hi. I'm here. Take your time — what's going on for you today?";
      turnsRef.current = [{ role: "assistant", text: greeting }];
      setTurns(turnsRef.current);
      setStatus("speaking");
      await speak(greeting);
    }
    void loop();
  };

  const pause = () => {
    pausedRef.current = true;
    recRef.current?.stop();
    window.speechSynthesis?.cancel();
    setStatus("paused");
  };

  const resume = () => {
    pausedRef.current = false;
    setStatus("listening");
  };

  const end = async () => {
    activeRef.current = false;
    pausedRef.current = false;
    recRef.current?.abort();
    window.speechSynthesis?.cancel();
    setStatus("idle");
    const spoken = turnsRef.current;
    if (spoken.filter((t) => t.role === "user").length === 0) return;
    setSummarising(true);
    try {
      setSummary(await aiConversationSummary(spoken, { profile, recentCheckins }));
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not build a summary.");
    } finally {
      setSummarising(false);
    }
  };

  const live = status !== "idle";
  const statusLabel: Record<typeof status, string> = {
    idle: "Not in a conversation",
    listening: "Listening…",
    thinking: "Thinking about what you said…",
    speaking: "Speaking…",
    paused: "Paused",
  };

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Talk it through"
        title="Say it out loud"
        description="A real-time spoken conversation with your recovery companion — for the days when typing feels like too much."
      />

      <Disclaimer>
        <span className="font-medium text-foreground">Not a clinician.</span> Spoken support is educational and
        reflective only. Nothing here diagnoses, prescribes, or handles emergencies — see{" "}
        <a href="/resources" className="underline underline-offset-4">
          crisis resources
        </a>
        .
      </Disclaimer>

      <section className="surface p-6 text-center">
        <div className="flex flex-col items-center gap-5">
          <button
            type="button"
            onClick={() => (live ? (status === "paused" ? resume() : pause()) : void start())}
            disabled={!supported}
            aria-label={live ? (status === "paused" ? "Resume conversation" : "Pause conversation") : "Start voice conversation"}
            className={cn(
              "relative flex h-24 w-24 items-center justify-center rounded-full border border-border bg-primary text-primary-foreground transition-transform hover:scale-105 disabled:opacity-50",
              status === "listening" && "animate-pulse ring-4 ring-primary/25",
            )}
          >
            {status === "thinking" ? (
              <Loader2 className="h-8 w-8 animate-spin" />
            ) : status === "paused" ? (
              <Play className="h-8 w-8" />
            ) : live ? (
              <Pause className="h-8 w-8" />
            ) : (
              <Mic className="h-9 w-9" />
            )}
          </button>

          <p aria-live="polite" className="text-sm text-muted-foreground">
            {supported ? statusLabel[status] : "Voice conversations need a browser with speech recognition (Chrome or Edge)."}
          </p>

          {interim && <p className="max-w-md text-sm italic text-muted-foreground">“{interim}”</p>}

          {voices.length > 0 && (
            <div className="w-full max-w-xs space-y-2 text-left">
              <Label htmlFor="voice" className="text-xs uppercase tracking-wide text-muted-foreground">
                Companion voice
              </Label>
              <Select value={voiceURI} onValueChange={chooseVoice}>
                <SelectTrigger id="voice" aria-label="Choose companion voice">
                  <SelectValue placeholder="Choose a voice" />
                </SelectTrigger>
                <SelectContent>
                  {voices.map((v) => (
                    <SelectItem key={v.voice.voiceURI} value={v.voice.voiceURI}>
                      {v.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">Picking a voice plays a short sample.</p>
            </div>
          )}

          {live && (
            <Button variant="outline" onClick={() => void end()}>
              <Square className="mr-2 h-4 w-4" /> End conversation
            </Button>
          )}
        </div>
      </section>

      {turns.length > 0 && (
        <section aria-labelledby="transcript" className="space-y-3">
          <h2 id="transcript" className="text-sm text-muted-foreground">
            Live transcript
          </h2>
          {turns.map((t, i) => (
            <div
              key={i}
              className={cn(
                "max-w-[85%] whitespace-pre-wrap rounded-2xl px-4 py-3 text-sm leading-relaxed",
                t.role === "user" ? "ml-auto bg-primary text-primary-foreground" : "bg-muted text-foreground",
              )}
            >
              {t.text}
            </div>
          ))}
        </section>
      )}

      {summarising && (
        <p className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" /> Writing your conversation summary…
        </p>
      )}

      {summary && (
        <section aria-labelledby="summary" className="surface p-6">
          <p className="eyebrow flex items-center gap-2">
            <Sparkles aria-hidden="true" className="h-4 w-4 text-primary" /> Conversation summary
          </p>
          <h2 id="summary" className="mt-2 text-xl">
            {summary.headline}
          </h2>
          <ul className="mt-4 space-y-2 text-sm leading-relaxed text-muted-foreground">
            {summary.insights.map((s) => (
              <li key={s}>• {s}</li>
            ))}
          </ul>
          <p className="mt-4 rounded-xl bg-muted/60 p-4 text-sm">
            <span className="font-medium">This week: </span>
            {summary.focusThisWeek}
          </p>
        </section>
      )}

      <section aria-labelledby="topics">
        <h2 id="topics" className="mb-3 text-sm text-muted-foreground">
          Things dancers talk through here
        </h2>
        <div className="flex flex-wrap gap-2">
          {topics.map((t) => (
            <span key={t} className="rounded-full border border-border bg-card px-4 py-2 text-sm text-muted-foreground">
              {t}
            </span>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Talk;
