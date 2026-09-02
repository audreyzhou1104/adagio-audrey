import { focusAreas, findFocus } from "@/data/plans";
import { useAdagio, todayKey } from "@/lib/store";

/** True when the user has a plan but has not ticked off every step for today. */
export const usePlanIncomplete = () => {
  const { state } = useAdagio();
  const { profile, tasks } = state;
  if (!profile) return false;
  const focus = findFocus(profile.focusId ?? focusAreas[0].id) ?? focusAreas[0];
  const all = [...focus.physicalPlan, ...focus.psychologicalPlan];
  if (!all.length) return false;
  const day = todayKey();
  return all.some((t) => !(tasks[t.id] ?? []).includes(day));
};
