export type ResourceKind = "video" | "article" | "audio" | "tool";

export type Resource = {
  id: string;
  kind: ResourceKind;
  title: string;
  source: string;
  url: string;
  minutes?: number;
  note: string;
  /** Keywords used to match a resource to a described situation. */
  tags: string[];
};

/**
 * Curated external resources. Every URL below was checked as live and on-topic.
 * Educational material only — none of it replaces a clinician.
 */
export const resourceList: Resource[] = [
  /* ---- Video: physical ---- */
  {
    id: "v-ankle-rehab",
    kind: "video",
    title: "Sprained ankle rehab programme exercises",
    source: "Doctor O'Donovan (YouTube)",
    url: "https://www.youtube.com/watch?v=t0L7Aw1zLB0",
    minutes: 12,
    note: "Doctor- and physiotherapist-led walkthrough of ankle sprain rehab, split into phases from early days to return to sport.",
    tags: ["ankle", "sprain", "rehab", "balance", "injury"],
  },
  {
    id: "v-balance",
    kind: "video",
    title: "Single-leg balance exercise",
    source: "Coury & Buehler Physical Therapy (YouTube)",
    url: "https://www.youtube.com/watch?v=7SF7AYh2_Yw",
    minutes: 1,
    note: "Short demonstration of correct single-leg balance setup and progressions.",
    tags: ["balance", "proprioception", "ankle", "knee"],
  },
  {
    id: "v-band-eversion",
    kind: "video",
    title: "Ankle eversion with a resistance band",
    source: "AskDoctorJo (YouTube)",
    url: "https://www.youtube.com/watch?v=xfrncpP5ONQ",
    minutes: 1,
    note: "How to set up and perform resisted eversion for the peroneal muscles.",
    tags: ["ankle", "band", "peroneal", "sprain"],
  },
  {
    id: "v-calf-raise",
    kind: "video",
    title: "Calf raise technique (bent knee variation)",
    source: "The Irish Physio TV (YouTube)",
    url: "https://www.youtube.com/watch?v=_DirjelaQ-Q",
    minutes: 1,
    note: "Quick technique check for heel raises, including why the bent-knee version targets the soleus.",
    tags: ["calf", "achilles", "ankle", "strength"],
  },
  {
    id: "v-glute-bridge",
    kind: "video",
    title: "Glute bridge demonstration",
    source: "Elite Sports Medicine (YouTube)",
    url: "https://www.youtube.com/watch?v=ugbRWDwEnYU",
    minutes: 2,
    note: "Clinic demonstration of glute bridge setup and common compensations.",
    tags: ["hip", "glute", "strength", "back"],
  },
  {
    id: "v-clamshell",
    kind: "video",
    title: "Clamshell exercise: four common mistakes",
    source: "Chaplin Performance (YouTube)",
    url: "https://www.youtube.com/watch?v=09YaaN9hG2I",
    minutes: 5,
    note: "What usually goes wrong in clamshells and how to actually target the glutes.",
    tags: ["hip", "glute", "strength"],
  },
  {
    id: "v-deadbug",
    kind: "video",
    title: "How to do a dead bug",
    source: "Hinge Health (YouTube)",
    url: "https://www.youtube.com/watch?v=GbSC02oU3To",
    minutes: 3,
    note: "Physical-therapist guide to dead bugs for trunk control, with regressions.",
    tags: ["core", "back", "stability", "hip"],
  },
  {
    id: "v-hip-labral",
    kind: "video",
    title: "Rehab after hip labral repair: what you need to know",
    source: "Fitness Pain Free (YouTube)",
    url: "https://www.youtube.com/watch?v=Wi-cBJ7mfm8",
    minutes: 24,
    note: "Detailed overview of post-operative hip labral rehab phases and typical timelines.",
    tags: ["hip", "surgery", "labral", "post-op"],
  },
  {
    id: "v-landing",
    kind: "video",
    title: "Jump training and landing stabilisation drill",
    source: "St. Elizabeth Healthcare (YouTube)",
    url: "https://www.youtube.com/watch?v=g2gixJmjXUI",
    minutes: 2,
    note: "Hospital-produced demonstration of controlled landing mechanics from an injury-prevention programme.",
    tags: ["jumping", "landing", "knee", "ankle", "return"],
  },
  {
    id: "v-plyometrics",
    kind: "video",
    title: "Foot and ankle strengthening for dancers",
    source: "Ballet For All (YouTube)",
    url: "https://www.youtube.com/watch?v=EY5cPWg_vbs",
    minutes: 4,
    note: "Dancer-specific foot and ankle strengthening you can do at home before returning to jumps.",
    tags: ["foot", "ankle", "pointe", "dancer", "strength"],
  },
  {
    id: "v-foot-strength",
    kind: "video",
    title: "Feet & pointe strengthening workout",
    source: "Kathryn Morgan (YouTube)",
    url: "https://www.youtube.com/watch?v=Yw897BansQs",
    minutes: 30,
    note: "Longer follow-along session for relevés, arch strength and balance, led by a former professional dancer.",
    tags: ["foot", "pointe", "relevé", "dancer"],
  },
  {
    id: "v-floor-barre",
    kind: "video",
    title: "Floor barre class (intermediate)",
    source: "Train Like a Ballerina (YouTube)",
    url: "https://www.youtube.com/watch?v=zFyw9UCr8m4",
    minutes: 20,
    note: "Low-impact floor barre — useful when standing work is limited or energy is low.",
    tags: ["floor barre", "gentle", "burnout", "dancer", "mobility"],
  },

  /* ---- Video / audio: emotional ---- */
  {
    id: "v-breathing",
    kind: "audio",
    title: "Free short meditation: release stress and anxious thoughts",
    source: "Headspace (YouTube)",
    url: "https://www.youtube.com/watch?v=nFkHV7LfVUc",
    minutes: 8,
    note: "Free guided meditation you can use before class or before sleep.",
    tags: ["anxiety", "stress", "breathing", "meditation", "sleep"],
  },
  {
    id: "v-bodyscan",
    kind: "audio",
    title: "Free short meditation (body and breath)",
    source: "Headspace (YouTube)",
    url: "https://www.youtube.com/watch?v=nFkHV7LfVUc",
    minutes: 8,
    note: "Use this as the guided version of a body scan when you'd rather be led than self-guide.",
    tags: ["body scan", "mindfulness", "anxiety"],
  },
  {
    id: "v-imagery",
    kind: "video",
    title: "Returning to sport and managing fear of re-injury",
    source: "UCSF Orthopaedic Surgery (YouTube)",
    url: "https://www.youtube.com/watch?v=tsvQ4_n7-c8",
    minutes: 20,
    note: "Talk by a sports-focused clinical social worker on fear, imagery and psychological readiness to return.",
    tags: ["fear", "reinjury", "return", "psychology", "imagery"],
  },

  /* ---- Articles ---- */
  {
    id: "a-nhs-sprain",
    kind: "article",
    title: "Sprains and strains",
    source: "NHS",
    url: "https://www.nhs.uk/conditions/sprains-and-strains/",
    minutes: 5,
    note: "What a sprain is, expected timelines, self-care and the red flags that need urgent assessment.",
    tags: ["ankle", "sprain", "injury", "pain"],
  },
  {
    id: "a-aaos-sprain",
    kind: "article",
    title: "Sprained ankle",
    source: "OrthoInfo — American Academy of Orthopaedic Surgeons",
    url: "https://orthoinfo.aaos.org/en/diseases--conditions/sprained-ankle/",
    minutes: 8,
    note: "Surgeon-reviewed explanation of ligament grades, treatment and rehabilitation.",
    tags: ["ankle", "sprain", "ligament"],
  },
  {
    id: "a-stress-fracture",
    kind: "article",
    title: "Stress fractures of the foot and ankle",
    source: "OrthoInfo — American Academy of Orthopaedic Surgeons",
    url: "https://orthoinfo.aaos.org/en/diseases--conditions/stress-fractures-of-the-foot-and-ankle/",
    minutes: 8,
    note: "How stress fractures develop, why load management matters, and typical healing timeframes.",
    tags: ["stress fracture", "bone", "foot", "metatarsal"],
  },
  {
    id: "a-red-s",
    kind: "article",
    title: "The Eatwell Guide",
    source: "NHS",
    url: "https://www.nhs.uk/live-well/eat-well/food-guidelines-and-food-labels/the-eatwell-guide/",
    minutes: 6,
    note: "General fuelling foundations. If you train heavily, a sports dietitian should individualise this — under-fuelling is a major risk factor for bone injury.",
    tags: ["fuel", "nutrition", "energy", "bone", "red-s"],
  },
  {
    id: "a-iadms-nutrition",
    kind: "article",
    title: "IADMS Bulletin for Dancers and Teachers — archive",
    source: "International Association for Dance Medicine & Science",
    url: "https://bulletin.iadms.org/index.php/iadms/issue/archive",
    minutes: 10,
    note: "Free, peer-reviewed short papers written for dancers and teachers, covering nutrition, conditioning, injury and wellbeing.",
    tags: ["dance medicine", "nutrition", "conditioning", "education"],
  },
  {
    id: "a-iadms-conditioning",
    kind: "article",
    title: "IADMS Bulletin for Dancers and Teachers — archive",
    source: "International Association for Dance Medicine & Science",
    url: "https://bulletin.iadms.org/index.php/iadms/issue/archive",
    minutes: 10,
    note: "Dance-specific conditioning and cross-training guidance from dance medicine researchers.",
    tags: ["conditioning", "cross-training", "dance medicine"],
  },
  {
    id: "a-hip-labral",
    kind: "article",
    title: "Femoroacetabular impingement and labral injury",
    source: "OrthoInfo — American Academy of Orthopaedic Surgeons",
    url: "https://orthoinfo.aaos.org/en/diseases--conditions/femoroacetabular-impingement/",
    minutes: 8,
    note: "Background on hip impingement and labral injury, including what surgery does and does not fix.",
    tags: ["hip", "labral", "surgery", "impingement"],
  },
  {
    id: "a-nhs-breathing",
    kind: "article",
    title: "Breathing exercises for stress",
    source: "NHS",
    url: "https://www.nhs.uk/mental-health/self-help/guides-tools-and-activities/breathing-exercises-for-stress/",
    minutes: 3,
    note: "The NHS calming breathing technique, written out step by step.",
    tags: ["anxiety", "breathing", "stress", "panic"],
  },
  {
    id: "a-nhs-anxiety",
    kind: "article",
    title: "Anxiety, fear and panic",
    source: "NHS",
    url: "https://www.nhs.uk/mental-health/feelings-symptoms-behaviours/feelings-and-symptoms/anxiety-fear-panic/",
    minutes: 6,
    note: "What anxiety does in the body, self-help steps, and when to seek help.",
    tags: ["anxiety", "panic", "fear", "mental health"],
  },
  {
    id: "a-bodyscan",
    kind: "article",
    title: "Mindfulness",
    source: "NHS",
    url: "https://www.nhs.uk/mental-health/self-help/tips-and-support/mindfulness/",
    minutes: 6,
    note: "NHS introduction to mindfulness practices, including body awareness exercises.",
    tags: ["mindfulness", "body scan", "stress"],
  },
  {
    id: "a-nhs-sleep",
    kind: "article",
    title: "How to fall asleep faster and sleep better",
    source: "NHS — Every Mind Matters",
    url: "https://www.nhs.uk/every-mind-matters/mental-wellbeing-tips/how-to-fall-asleep-faster-and-sleep-better/",
    minutes: 5,
    note: "Practical, evidence-based sleep routine advice.",
    tags: ["sleep", "burnout", "fatigue", "recovery"],
  },
  {
    id: "a-sleep-foundation",
    kind: "article",
    title: "Mastering sleep hygiene",
    source: "Sleep Foundation",
    url: "https://www.sleepfoundation.org/sleep-hygiene",
    minutes: 10,
    note: "Deeper explainer on sleep environment, body clock and consistent wake times.",
    tags: ["sleep", "recovery", "fatigue"],
  },
  {
    id: "a-burnout",
    kind: "article",
    title: "Burnout prevention and recovery",
    source: "HelpGuide",
    url: "https://www.helpguide.org/mental-health/stress/burnout-prevention-and-recovery",
    minutes: 12,
    note: "How burnout differs from ordinary tiredness, its stages, and what actually helps recovery.",
    tags: ["burnout", "exhaustion", "stress", "rest"],
  },
  {
    id: "a-mental-health-dance",
    kind: "article",
    title: "Teaching for wellbeing: managing dancers' stress",
    source: "IADMS Bulletin for Dancers and Teachers",
    url: "https://bulletin.iadms.org/index.php/iadms/article/view/1283",
    minutes: 10,
    note: "Dance-specific paper on stress, burnout and mental health in training environments.",
    tags: ["mental health", "burnout", "dance", "teachers", "pressure"],
  },
  {
    id: "a-perfectionism",
    kind: "article",
    title: "Perfectionism is an epidemic in the dance world",
    source: "Pointe Magazine",
    url: "https://pointemagazine.com/perfectionism-is-an-epidemic-in-the-dance-world-heres-how-to-keep-it-from-derailing-your-career/",
    minutes: 8,
    note: "Why perfectionism is so common in dance and how dancers keep it from taking over.",
    tags: ["perfectionism", "pressure", "anxiety", "dance"],
  },
  {
    id: "a-performance-anxiety",
    kind: "article",
    title: "How perfectionism and performance anxiety show up in the studio",
    source: "Dance Spirit",
    url: "https://dancespirit.com/perfectionism-performance-anxiety-in-studio/",
    minutes: 7,
    note: "Written for younger dancers: recognising self-sabotage patterns in class and auditions.",
    tags: ["perfectionism", "performance anxiety", "audition", "studio"],
  },
  {
    id: "a-fear-reinjury",
    kind: "article",
    title: "Psychological readiness to return to dance after injury",
    source: "Trinity Laban Conservatoire of Music and Dance",
    url: "https://researchonline.trinitylaban.ac.uk/oa/thesis/176/",
    minutes: 15,
    note: "Conservatoire research on what dancers say helps them feel psychologically ready to return.",
    tags: ["fear", "reinjury", "return", "confidence", "psychology"],
  },
  {
    id: "a-return-to-sport",
    kind: "article",
    title: "Helping injured athletes cope",
    source: "American Psychological Association",
    url: "https://www.apa.org/topics/exercise-fitness/injured-athletes",
    minutes: 8,
    note: "Psychology-led overview of the emotional side of injury and evidence-based coping strategies.",
    tags: ["injury", "psychology", "coping", "return", "identity"],
  },
  {
    id: "a-injury-psychology",
    kind: "article",
    title: "Helping injured athletes cope",
    source: "American Psychological Association",
    url: "https://www.apa.org/topics/exercise-fitness/injured-athletes",
    minutes: 8,
    note: "Why injury affects mood, identity and motivation — and what helps.",
    tags: ["injury", "psychology", "identity", "mood"],
  },
  {
    id: "a-body-image",
    kind: "article",
    title: "Dancer with an eating disorder, I see you",
    source: "National Eating Disorders Association",
    url: "https://www.nationaleatingdisorders.org/dancer-eating-disorder-i-see-you/",
    minutes: 6,
    note: "First-person piece on body image and eating disorders inside dance culture.",
    tags: ["body image", "eating", "mirror", "dance"],
  },
  {
    id: "a-eating-support",
    kind: "article",
    title: "Get help — eating disorder support",
    source: "Beat (UK) & NEDA (US)",
    url: "https://www.beateatingdisorders.org.uk/get-information-and-support/get-help-for-myself/i-need-support-now/helplines/",
    minutes: 3,
    note: "Helplines and immediate support if food, eating or exercise feels out of control. US readers: nationaleatingdisorders.org/get-help.",
    tags: ["eating", "support", "helpline", "body image", "crisis"],
  },
  {
    id: "a-eating-support-us",
    kind: "article",
    title: "Get help (US)",
    source: "National Eating Disorders Association",
    url: "https://www.nationaleatingdisorders.org/get-help/",
    minutes: 3,
    note: "US-based screening tool, helpline and treatment finder.",
    tags: ["eating", "support", "helpline", "us"],
  },
  {
    id: "a-recovery-story",
    kind: "article",
    title: "Fearing recovery as a male dancer: Jonny's story",
    source: "Beat",
    url: "https://www.beateatingdisorders.org.uk/your-stories/recovery/recovery-as-a-male-dancer/",
    minutes: 6,
    note: "A dancer's own account of recovery — useful if you feel like the only one.",
    tags: ["recovery story", "body image", "eating", "male dancer"],
  },
  {
    id: "a-identity-transition",
    kind: "article",
    title: "Career Transition For Dancers",
    source: "Entertainment Community Fund",
    url: "https://entertainmentcommunity.org/services-and-programs/career-transition-dancers",
    minutes: 6,
    note: "Free career counselling and grants for dancers moving on from performing — including after injury.",
    tags: ["identity", "transition", "retirement", "career", "leaving dance"],
  },
  {
    id: "a-athletes-soul",
    kind: "article",
    title: "Transition resources for athletes",
    source: "Athletes Soul",
    url: "https://www.athletessoul.org/transition-resources",
    minutes: 10,
    note: "Webinars and reading on grief, identity and life after competitive performance.",
    tags: ["identity", "grief", "transition", "retirement"],
  },
];

export const resources: Record<string, Resource> = Object.fromEntries(
  resourceList.map((r) => [r.id, r]),
);

export const getResources = (ids: string[]) =>
  ids.map((id) => resources[id]).filter(Boolean);

/** Simple keyword match used by the reading finder — no AI, no invented links. */
export const searchResources = (query: string, limit = 6) => {
  const words = query
    .toLowerCase()
    .split(/[^a-zà-ÿ]+/)
    .filter((w) => w.length > 2);
  if (!words.length) return [];
  const scored = resourceList.map((r) => {
    const haystack = `${r.title} ${r.note} ${r.tags.join(" ")} ${r.source}`.toLowerCase();
    const score = words.reduce((n, w) => n + (haystack.includes(w) ? 1 : 0), 0);
    return { r, score };
  });
  return scored
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((s) => s.r);
};
