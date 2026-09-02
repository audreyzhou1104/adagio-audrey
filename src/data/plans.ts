export type PlanTask = {
  id: string;
  title: string;
  detail: string;
  track: "Physical" | "Emotional" | "Reflection";
};

export type FocusArea = {
  id: string;
  label: string;
  category: "Injury" | "Surgery" | "Burnout" | "Mental health" | "Transition";
  summary: string;
  phases: string[];
  currentPhase: number;
  physicalPlan: PlanTask[];
  psychologicalPlan: PlanTask[];
  watchFor: string[];
};

export const focusAreas: FocusArea[] = [
  {
    id: "ankle-sprain",
    label: "Lateral ankle sprain",
    category: "Injury",
    summary:
      "Ligament sprains respond well to graded loading. The usual sticking point for dancers isn't strength — it's trusting the ankle in landings and turns.",
    phases: ["Calm & protect", "Restore range", "Rebuild strength", "Reload dance", "Return"],
    currentPhase: 2,
    physicalPlan: [
      { id: "ank-p1", title: "Calf endurance set", detail: "3 × 15 slow heel raises, 3-second lowering", track: "Physical" },
      { id: "ank-p2", title: "Single-leg balance", detail: "3 × 30s, eyes open then closed", track: "Physical" },
      { id: "ank-p3", title: "Peroneal band work", detail: "2 × 20 resisted eversion each side", track: "Physical" },
      { id: "ank-p4", title: "Low-impact cardio", detail: "15 min cycling or pool work", track: "Physical" },
    ],
    psychologicalPlan: [
      { id: "ank-e1", title: "Pre-class grounding", detail: "2 minutes of box breathing before you step in", track: "Emotional" },
      { id: "ank-e2", title: "Name one fear", detail: "Write the specific movement you're avoiding today", track: "Reflection" },
      { id: "ank-e3", title: "Evidence log", detail: "Note one thing your ankle did well today", track: "Reflection" },
    ],
    watchFor: ["Pain above 4/10 lasting past 24 hours", "New swelling after class", "Avoiding a movement for more than a week"],
  },
  {
    id: "stress-fracture",
    label: "Metatarsal stress fracture",
    category: "Injury",
    summary:
      "Bone healing runs on time and load management. Progress feels invisible for weeks, which makes the emotional side heavier than the physical one.",
    phases: ["Offload", "Bone healing", "Graded loading", "Impact reintroduction", "Return"],
    currentPhase: 1,
    physicalPlan: [
      { id: "sf-p1", title: "Protected weight-bearing", detail: "Follow your clinician's boot and step guidance", track: "Physical" },
      { id: "sf-p2", title: "Upper body & core", detail: "20 min seated conditioning, no foot load", track: "Physical" },
      { id: "sf-p3", title: "Fuel check", detail: "Three meals plus snacks — bone healing is expensive", track: "Physical" },
      { id: "sf-p4", title: "Hip & glute strength", detail: "2 × 12 bridges and clamshells", track: "Physical" },
    ],
    psychologicalPlan: [
      { id: "sf-e1", title: "Patience practice", detail: "5-minute body scan focused on what's healing quietly", track: "Emotional" },
      { id: "sf-e2", title: "Stay in the room", detail: "Watch one class as an observer with a purpose", track: "Emotional" },
      { id: "sf-e3", title: "Weekly reframe", detail: "Journal: what has this time given me space for?", track: "Reflection" },
    ],
    watchFor: ["Pain at rest or at night", "Missed periods or low energy", "Skipping meals to control weight"],
  },
  {
    id: "hip-surgery",
    label: "Hip labral repair (post-surgery)",
    category: "Surgery",
    summary:
      "Post-operative recovery is long and protocol-driven. Expect confidence to lag several months behind the surgical timeline.",
    phases: ["Protect", "Mobilise", "Strengthen", "Dance-specific", "Return"],
    currentPhase: 2,
    physicalPlan: [
      { id: "hs-p1", title: "Prescribed mobility", detail: "Your surgeon's range-of-motion set, twice daily", track: "Physical" },
      { id: "hs-p2", title: "Glute activation", detail: "3 × 10 isometric holds, pain-free range only", track: "Physical" },
      { id: "hs-p3", title: "Core stability", detail: "2 × 30s dead bug holds", track: "Physical" },
      { id: "hs-p4", title: "Gait quality walk", detail: "10 minutes, even rhythm, no limp", track: "Physical" },
    ],
    psychologicalPlan: [
      { id: "hs-e1", title: "Timeline compassion", detail: "Read back your week-one entry", track: "Reflection" },
      { id: "hs-e2", title: "Imagery rehearsal", detail: "3 minutes visualising a clean développé, pain-free", track: "Emotional" },
      { id: "hs-e3", title: "Ask for one thing", detail: "Message someone in your company or studio", track: "Emotional" },
    ],
    watchFor: ["Sharp catching in the joint", "Sleep disrupted by pain", "Feeling forgotten by your studio"],
  },
  {
    id: "burnout",
    label: "Burnout & chronic exhaustion",
    category: "Burnout",
    summary:
      "Burnout isn't laziness. It's what happens after long periods of high demand and low recovery. Rebuilding starts with rhythm, not intensity.",
    phases: ["Stop the bleed", "Restore sleep & fuel", "Reintroduce joy", "Rebuild capacity", "Sustain"],
    currentPhase: 1,
    physicalPlan: [
      { id: "bo-p1", title: "Sleep anchor", detail: "Same wake time daily, screens off 45 min before bed", track: "Physical" },
      { id: "bo-p2", title: "Gentle movement", detail: "20 min walk or easy floor barre — no performance", track: "Physical" },
      { id: "bo-p3", title: "Full fuel day", detail: "Three meals, no skipped breakfast", track: "Physical" },
      { id: "bo-p4", title: "One true rest block", detail: "60 minutes with nothing scheduled", track: "Physical" },
    ],
    psychologicalPlan: [
      { id: "bo-e1", title: "Say no once", detail: "Decline one optional demand this week", track: "Emotional" },
      { id: "bo-e2", title: "Joy without judgement", detail: "15 minutes of movement nobody grades", track: "Emotional" },
      { id: "bo-e3", title: "Energy audit", detail: "List what drained and what restored you today", track: "Reflection" },
    ],
    watchFor: ["Dreading class every day for weeks", "Numbness or crying without cause", "Using injury as the only acceptable rest"],
  },
  {
    id: "fear-reinjury",
    label: "Fear of re-injury",
    category: "Mental health",
    summary:
      "Fear after injury is protective, not weak. It fades through graded exposure and evidence, not willpower.",
    phases: ["Name it", "Map the triggers", "Graded exposure", "Rebuild trust", "Perform freely"],
    currentPhase: 2,
    physicalPlan: [
      { id: "fr-p1", title: "Confidence rep", detail: "One movement from your fear ladder, lowest rung", track: "Physical" },
      { id: "fr-p2", title: "Controlled landings", detail: "3 × 8 small jumps with soft, quiet landings", track: "Physical" },
      { id: "fr-p3", title: "Strength proof", detail: "Repeat a test you passed last week", track: "Physical" },
    ],
    psychologicalPlan: [
      { id: "fr-e1", title: "Fear ladder update", detail: "Rate each feared movement 0–10 today", track: "Reflection" },
      { id: "fr-e2", title: "Breath before the step", detail: "Exhale longer than you inhale, four rounds", track: "Emotional" },
      { id: "fr-e3", title: "Disconfirming evidence", detail: "Write what you feared vs what actually happened", track: "Reflection" },
    ],
    watchFor: ["Avoiding a movement entirely", "Panic symptoms before class", "Hiding the fear from your teacher"],
  },
  {
    id: "body-image",
    label: "Body image & mirror stress",
    category: "Mental health",
    summary:
      "Mirrors, uniforms and corrections make bodies feel public. This track focuses on function over appearance, with clear escalation points.",
    phases: ["Awareness", "Language shift", "Function focus", "Support", "Steadiness"],
    currentPhase: 1,
    physicalPlan: [
      { id: "bi-p1", title: "Function set", detail: "Train one thing measured by what it does, not how it looks", track: "Physical" },
      { id: "bi-p2", title: "Fuel consistently", detail: "Eat before and after training, every session", track: "Physical" },
      { id: "bi-p3", title: "Mirror-free practice", detail: "10 minutes facing away", track: "Physical" },
    ],
    psychologicalPlan: [
      { id: "bi-e1", title: "Language swap", detail: "Replace one appearance word with a capability word", track: "Reflection" },
      { id: "bi-e2", title: "Gratitude to the body", detail: "Name one thing your body did for you today", track: "Emotional" },
      { id: "bi-e3", title: "Boundary rehearsal", detail: "Plan a reply to an appearance comment", track: "Emotional" },
    ],
    watchFor: ["Restricting food or over-exercising", "Avoiding eating around others", "Checking or comparing constantly"],
  },
  {
    id: "career-transition",
    label: "Stepping away from dance",
    category: "Transition",
    summary:
      "Leaving — by choice or not — is a genuine loss. Grief plus identity rebuilding is the work, and it does resolve.",
    phases: ["Acknowledge", "Grieve", "Explore", "Translate skills", "Build next"],
    currentPhase: 1,
    physicalPlan: [
      { id: "ct-p1", title: "Movement for you", detail: "30 minutes of anything that isn't training", track: "Physical" },
      { id: "ct-p2", title: "Sleep & routine", detail: "Keep one anchor from your dance schedule", track: "Physical" },
      { id: "ct-p3", title: "Try something new", detail: "One unfamiliar physical activity this week", track: "Physical" },
    ],
    psychologicalPlan: [
      { id: "ct-e1", title: "Identity map entry", detail: "Answer: who am I besides a dancer?", track: "Reflection" },
      { id: "ct-e2", title: "Transferable skill", detail: "Name one dance skill and where else it fits", track: "Reflection" },
      { id: "ct-e3", title: "Stay connected", detail: "Reach out to one person from the dance world", track: "Emotional" },
    ],
    watchFor: ["Cutting off everyone from dance", "Feeling like a failure daily", "Losing interest in everything"],
  },
];

export const findFocus = (id: string) => focusAreas.find((f) => f.id === id);
