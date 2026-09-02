import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { focusAreas } from "@/data/plans";
import { useAdagio, type Profile, todayKey } from "@/lib/store";
import { useUnsavedGuard } from "@/lib/unsaved";
import { toast } from "sonner";

const levels = ["Recreational", "Competitive", "Pre-professional", "Conservatory", "Professional", "Former dancer"];

const ProfileForm = ({ onDone }: { onDone?: () => void }) => {
  const { state, update } = useAdagio();
  const p = state.profile;
  const [form, setForm] = useState<Profile>({
    name: p?.name ?? "",
    age: p?.age ?? "",
    level: p?.level ?? levels[1],
    styles: p?.styles ?? "",
    focusId: p?.focusId ?? focusAreas[0].id,
    focusLabel: p?.focusLabel ?? focusAreas[0].label,
    startedOn: p?.startedOn ?? todayKey(),
    goal: p?.goal ?? "",
    createdAt: p?.createdAt ?? new Date().toISOString(),
  });

  const set = (patch: Partial<Profile>) => setForm((f) => ({ ...f, ...patch }));

  const savedRef = useRef(JSON.stringify(form));

  const persist = () => {
    if (!form.name.trim()) return;
    const focus = focusAreas.find((f) => f.id === form.focusId);
    savedRef.current = JSON.stringify(form);
    update({ profile: { ...form, name: form.name.trim().slice(0, 60), focusLabel: focus?.label ?? "" } });
    toast.success("Saved — Adagio will remember you on this device.");
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    persist();
    onDone?.();
  };

  useUnsavedGuard(JSON.stringify(form) !== savedRef.current, persist, "profile details");


  return (
    <form onSubmit={submit} className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="pf-name">Your name</Label>
          <Input id="pf-name" value={form.name} maxLength={60} required onChange={(e) => set({ name: e.target.value })} placeholder="Maya" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="pf-age">Age</Label>
          <Input id="pf-age" type="number" min={12} max={99} value={form.age} onChange={(e) => set({ age: e.target.value })} placeholder="17" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="pf-level">Where you dance</Label>
          <Select value={form.level} onValueChange={(v) => set({ level: v })}>
            <SelectTrigger id="pf-level"><SelectValue /></SelectTrigger>
            <SelectContent>
              {levels.map((l) => <SelectItem key={l} value={l}>{l}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="pf-styles">Styles you train</Label>
          <Input id="pf-styles" maxLength={80} value={form.styles} onChange={(e) => set({ styles: e.target.value })} placeholder="Ballet, contemporary" />
        </div>
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="pf-focus">What are you recovering from right now?</Label>
          <Select
            value={form.focusId}
            onValueChange={(v) => set({ focusId: v, focusLabel: focusAreas.find((f) => f.id === v)?.label ?? "" })}
          >
            <SelectTrigger id="pf-focus"><SelectValue /></SelectTrigger>
            <SelectContent>
              {focusAreas.map((f) => (
                <SelectItem key={f.id} value={f.id}>{f.label} · {f.category}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="pf-start">Recovery started</Label>
          <Input id="pf-start" type="date" value={form.startedOn} onChange={(e) => set({ startedOn: e.target.value })} />
        </div>
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="pf-goal">What would a good outcome look like?</Label>
          <Textarea id="pf-goal" rows={3} maxLength={400} value={form.goal} onChange={(e) => set({ goal: e.target.value })} placeholder="Back in full class by winter, without bracing every landing." />
        </div>
      </div>
      <div className="flex flex-wrap gap-3">
        <Button type="submit">{p ? "Save changes" : "Create my profile"}</Button>
        {onDone && <Button type="button" variant="outline" onClick={onDone}>Cancel</Button>}
      </div>
      <p className="text-xs text-muted-foreground">
        Prototype only — everything stays in this browser. Nothing is uploaded or shared.
      </p>
    </form>
  );
};

export default ProfileForm;
