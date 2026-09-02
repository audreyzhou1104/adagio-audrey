import { ExternalLink, PlayCircle, FileText, Headphones, Wrench, CheckCircle2, Circle, AlertTriangle } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { getResources, type ResourceKind } from "@/data/resources";
import { taskGuides } from "@/data/taskGuides";
import type { PlanTask } from "@/data/plans";
import { cn } from "@/lib/utils";

const kindIcon: Record<ResourceKind, typeof PlayCircle> = {
  video: PlayCircle,
  article: FileText,
  audio: Headphones,
  tool: Wrench,
};

type Props = {
  task: PlanTask | null;
  done: boolean;
  history: number;
  /** -1 gentler, 0 standard, 1 progressed. */
  level?: -1 | 0 | 1;
  onLevelChange?: (level: -1 | 0 | 1) => void;
  onToggle: () => void;
  onOpenChange: (open: boolean) => void;
};

const TaskDetailDialog = ({ task, done, history, level = 0, onLevelChange, onToggle, onOpenChange }: Props) => {
  const guide = task ? taskGuides[task.id] : undefined;
  const detail =
    level === -1 && guide?.easier ? guide.easier : level === 1 && guide?.harder ? guide.harder : task?.detail;

  return (
    <Dialog open={!!task} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[88vh] max-w-2xl overflow-y-auto">
        {task && (
          <>
            <DialogHeader className="text-left">
              <p className="eyebrow">
                {task.track} · {guide?.minutes ? `${guide.minutes} min` : "Short practice"}
                {history > 0 && ` · done ${history} day${history === 1 ? "" : "s"}`}
                {level !== 0 && ` · adjusted ${level === -1 ? "gentler" : "harder"}`}
              </p>
              <DialogTitle className="font-serif text-2xl">{task.title}</DialogTitle>
              <DialogDescription className="text-base text-muted-foreground">{detail}</DialogDescription>
            </DialogHeader>


            {guide ? (
              <div className="space-y-6">
                <section className="rounded-xl bg-sage-soft p-4">
                  <p className="eyebrow mb-1">Why this is in your plan</p>
                  <p className="text-sm leading-relaxed">{guide.why}</p>
                </section>

                {guide.equipment && guide.equipment.length > 0 && (
                  <p className="text-sm text-muted-foreground">
                    <span className="font-medium text-foreground">You&apos;ll need: </span>
                    {guide.equipment.join(", ")}
                  </p>
                )}

                <section>
                  <h3 className="mb-3 text-lg">How to do it</h3>
                  <ol className="space-y-3">
                    {guide.steps.map((s, i) => (
                      <li key={s.title} className="flex gap-3">
                        <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-secondary text-xs font-medium">
                          {i + 1}
                        </span>
                        <span>
                          <span className="block font-medium">{s.title}</span>
                          <span className="block text-sm leading-relaxed text-muted-foreground">{s.text}</span>
                        </span>
                      </li>
                    ))}
                  </ol>
                </section>

                {guide.cues.length > 0 && (
                  <section>
                    <h3 className="mb-2 text-lg">Cues that matter</h3>
                    <ul className="list-disc space-y-1 pl-5 text-sm text-muted-foreground">
                      {guide.cues.map((c) => <li key={c}>{c}</li>)}
                    </ul>
                  </section>
                )}

                <section className="grid gap-3 sm:grid-cols-2">
                  <button
                    type="button"
                    onClick={() => onLevelChange?.(level === -1 ? 0 : -1)}
                    className={cn(
                      "rounded-xl border p-4 text-left transition-colors",
                      level === -1 ? "border-primary bg-sage-soft" : "border-border hover:bg-muted/60",
                    )}
                  >
                    <p className="eyebrow mb-1">If today feels like too much</p>
                    <p className="text-sm leading-relaxed text-muted-foreground">{guide.easier}</p>
                    <p className="mt-2 text-xs font-medium text-primary">
                      {level === -1 ? "Currently using this version — tap to return to standard" : "Use this version"}
                    </p>
                  </button>
                  <button
                    type="button"
                    onClick={() => onLevelChange?.(level === 1 ? 0 : 1)}
                    className={cn(
                      "rounded-xl border p-4 text-left transition-colors",
                      level === 1 ? "border-primary bg-sage-soft" : "border-border hover:bg-muted/60",
                    )}
                  >
                    <p className="eyebrow mb-1">When this feels easy</p>
                    <p className="text-sm leading-relaxed text-muted-foreground">{guide.harder}</p>
                    <p className="mt-2 text-xs font-medium text-primary">
                      {level === 1 ? "Currently using this version — tap to return to standard" : "Use this version"}
                    </p>
                  </button>
                </section>


                {guide.safety.length > 0 && (
                  <section className="rounded-xl border border-border bg-muted/50 p-4">
                    <p className="flex items-center gap-2 font-medium">
                      <AlertTriangle aria-hidden="true" className="h-4 w-4 text-primary" />
                      Stop and check in with a professional if
                    </p>
                    <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
                      {guide.safety.map((s) => <li key={s}>{s}</li>)}
                    </ul>
                  </section>
                )}

                {(() => {
                  const items = getResources(guide.resourceIds);
                  if (!items.length) return null;
                  return (
                    <section>
                      <h3 className="mb-1 text-lg">Go deeper</h3>
                      <p className="mb-3 text-sm text-muted-foreground">
                        External educational material from clinicians and dance-health organisations. Adagio does not
                        control these pages.
                      </p>
                      <ul className="space-y-2">
                        {items.map((r) => {
                          const Icon = kindIcon[r.kind];
                          return (
                            <li key={r.id}>
                              <a
                                href={r.url}
                                target="_blank"
                                rel="noreferrer noopener"
                                className="flex items-start gap-3 rounded-xl border border-border p-4 transition-colors hover:bg-muted/60"
                              >
                                <Icon aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                                <span className="flex-1">
                                  <span className="block font-medium">{r.title}</span>
                                  <span className="block text-xs uppercase tracking-[0.14em] text-muted-foreground">
                                    {r.source}
                                    {r.minutes ? ` · ${r.minutes} min` : ""}
                                  </span>
                                  <span className="mt-1 block text-sm text-muted-foreground">{r.note}</span>
                                </span>
                                <ExternalLink aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                              </a>
                            </li>
                          );
                        })}
                      </ul>
                    </section>
                  );
                })()}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                A detailed guide for this step is on its way. For now, keep it short, pain-free and consistent.
              </p>
            )}

            <div className="sticky bottom-0 -mx-6 mt-2 border-t border-border bg-background px-6 pt-4">
              <Button className={cn("w-full", done && "bg-sage text-foreground hover:bg-sage/90")} onClick={onToggle}>
                {done ? (
                  <><CheckCircle2 aria-hidden="true" className="mr-2 h-4 w-4" />Done today — tap to undo</>
                ) : (
                  <><Circle aria-hidden="true" className="mr-2 h-4 w-4" />Mark done for today</>
                )}
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default TaskDetailDialog;
