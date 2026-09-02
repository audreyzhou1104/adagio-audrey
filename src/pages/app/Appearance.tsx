import { Moon, Sun, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import PageHeader from "@/components/app/PageHeader";
import { accents, useAdagio, type AccentKey } from "@/lib/store";
import { cn } from "@/lib/utils";

const AppearancePage = () => {
  const { state, setAppearance } = useAdagio();
  const a = state.appearance;

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Appearance"
        title="Make it feel like yours"
        description="Recovery spaces should feel calm to you specifically. Adjust theme, accent, spacing, type size and motion — changes apply instantly and are remembered."
      />

      <section className="surface p-6">
        <h2 className="text-xl">Theme</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {(["light", "dark"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setAppearance({ theme: t })}
              aria-pressed={a.theme === t}
              className={cn(
                "flex items-center gap-3 rounded-xl border p-4 text-left text-sm capitalize transition-colors",
                a.theme === t ? "border-primary bg-secondary" : "border-border hover:bg-muted",
              )}
            >
              {t === "light" ? <Sun aria-hidden="true" className="h-4 w-4" /> : <Moon aria-hidden="true" className="h-4 w-4" />}
              {t} mode
            </button>
          ))}
        </div>
      </section>

      <section className="surface p-6">
        <h2 className="text-xl">Accent colour</h2>
        <p className="mt-1 text-sm text-muted-foreground">Sets buttons, highlights and focus rings across the app.</p>
        <div className="mt-4 flex flex-wrap gap-3">
          {(Object.keys(accents) as AccentKey[]).map((key) => (
            <button
              key={key}
              onClick={() => setAppearance({ accent: key })}
              aria-pressed={a.accent === key}
              className={cn(
                "flex items-center gap-2 rounded-full border px-4 py-2 text-sm transition-colors",
                a.accent === key ? "border-primary bg-secondary" : "border-border hover:bg-muted",
              )}
            >
              <span className="h-4 w-4 rounded-full" style={{ background: accents[key].swatch }} aria-hidden="true" />
              {accents[key].label}
            </button>
          ))}
        </div>
      </section>

      <section className="surface space-y-8 p-6">
        <h2 className="text-xl">Layout & type</h2>

        <div>
          <div className="mb-2 flex justify-between text-sm">
            <span>Corner softness</span>
            <span className="font-serif">{a.radius.toFixed(2)}rem</span>
          </div>
          <Slider value={[a.radius]} min={0} max={1.5} step={0.25} aria-label="Corner softness" onValueChange={([v]) => setAppearance({ radius: v })} />
        </div>

        <div>
          <div className="mb-2 flex justify-between text-sm">
            <span>Text size</span>
            <span className="font-serif">{Math.round(a.fontScale * 100)}%</span>
          </div>
          <Slider value={[a.fontScale]} min={0.9} max={1.25} step={0.05} aria-label="Text size" onValueChange={([v]) => setAppearance({ fontScale: v })} />
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {(["comfortable", "compact"] as const).map((d) => (
            <button
              key={d}
              onClick={() => setAppearance({ density: d })}
              aria-pressed={a.density === d}
              className={cn(
                "rounded-xl border p-4 text-left text-sm capitalize transition-colors",
                a.density === d ? "border-primary bg-secondary" : "border-border hover:bg-muted",
              )}
            >
              {d} spacing
            </button>
          ))}
        </div>

        <div className="flex items-center justify-between gap-4">
          <Label htmlFor="motion" className="text-sm font-normal">
            Animations and transitions
            <span className="block text-xs text-muted-foreground">Turn off for a stiller, lower-stimulation interface.</span>
          </Label>
          <Switch id="motion" checked={a.motion} onCheckedChange={(v) => setAppearance({ motion: v })} />
        </div>
      </section>

      <section className="surface p-6">
        <h2 className="text-xl">Preview</h2>
        <div className="mt-4 space-y-3">
          <div className="bg-gradient-calm rounded-xl px-5 py-6 text-primary-foreground">
            <p className="eyebrow opacity-80">Sample card</p>
            <p className="mt-1 font-serif text-2xl">Rebuild phase</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button>Primary action</Button>
            <Button variant="outline">Secondary</Button>
            
          </div>
        </div>
        <Button
          variant="ghost"
          className="mt-6"
          onClick={() => setAppearance({ theme: "light", accent: "slate", density: "comfortable", radius: 0.75, fontScale: 1, motion: true })}
        >
          <RotateCcw aria-hidden="true" className="mr-2 h-4 w-4" /> Reset to defaults
        </Button>
      </section>
    </div>
  );
};

export default AppearancePage;
