export type InjuryPhase = {
  name: string;
  focus: string;
  /** Rough guide only — every timeline is individual and clinician-led. */
  typical: string;
  goals: string[];
  work: string[];
  avoid: string[];
};

export type Injury = {
  slug: string;
  name: string;
  area: string;
  summary: string;
  commonIn: string;
  /** Plain-language explanation of what is actually happening in the body. */
  whatItIs: string;
  symptoms: string[];
  /** Why this injury behaves differently in dancers. */
  danceContext: string[];
  phases: InjuryPhase[];
  emotional: string;
  emotionalPractices: string[];
  redFlags: string[];
  clinicianQuestions: string[];
  /** Ids from src/data/resources.ts — all verified, real links. */
  resourceIds: string[];
  /** Matching plan track id from src/data/plans.ts, if there is one. */
  focusId?: string;
};

export const injuries: Injury[] = [
  {
    slug: "achilles-tendinopathy",
    name: "Achilles Tendinopathy",
    area: "Ankle & Foot",
    summary:
      "Irritation of the Achilles tendon, often felt as morning stiffness and pain during relevé or jumping.",
    commonIn: "Frequent allegro, rapid increases in pointe work",
    whatItIs:
      "The Achilles is the thick tendon joining your calf muscles to your heel. Tendinopathy is not a tear — it is a change in how the tendon tolerates load, usually after the amount of jumping or relevé work rises faster than the tendon can adapt. Tendons respond well to gradual, progressive loading and poorly to complete rest, which is why the plan is built around strength rather than stopping.",
    symptoms: [
      "Stiffness in the first steps of the morning that eases as you move",
      "Pain at the back of the heel during relevé, jumps or push-off",
      "Tenderness when you pinch the tendon between finger and thumb",
      "Pain that warms up during class and returns worse the next day",
    ],
    danceContext: [
      "Allegro and pointe work load the tendon at high speed and at end-range plantarflexion.",
      "Fast increases in rehearsal hours before a show are a classic trigger.",
      "Rolling out towards the little toe in relevé shifts load onto the tendon unevenly.",
    ],
    phases: [
      {
        name: "Calm",
        focus: "Load reduction, isometric holds, gentle ankle mobility",
        typical: "Often the first 1–3 weeks, guided by symptoms",
        goals: ["Settle day-to-day pain", "Keep the calf working without irritating the tendon"],
        work: [
          "Isometric calf holds (e.g. 5 × 30–45s) — these often reduce tendon pain directly",
          "Pain-free ankle mobility and gentle foot intrinsic work",
          "Low-impact cardio: cycling, pool, upper-body conditioning",
        ],
        avoid: ["Jumping, running and repeated relevé volume", "Deep loaded stretching of the tendon", "Complete rest — tendons de-load fast"],
      },
      {
        name: "Rebuild",
        focus: "Progressive heel raises, calf endurance, single-leg control",
        typical: "Usually several weeks, progressing by tolerance not by date",
        goals: ["Restore single-leg calf endurance", "Tolerate load without next-day flare"],
        work: [
          "Slow heel raises, straight and bent knee, building to single leg",
          "Balance and foot control work",
          "Gradual re-introduction of relevé volume, counted rather than guessed",
        ],
        avoid: ["Adding jumps and volume in the same week", "Judging progress by pain during only — next-day response matters more"],
      },
      {
        name: "Return",
        focus: "Graded jumping, relevé volume tracking, technique review",
        typical: "Overlaps class re-entry; often the longest phase",
        goals: ["Return to allegro without a 24-hour flare", "Restore confidence in push-off"],
        work: ["Low then higher-energy jumping, landing quality first", "Full class in stages", "A technique look at alignment in relevé"],
        avoid: ["Full rehearsal weeks straight after your first full class"],
      },
    ],
    emotional: "Fear of pushing off the floor again is extremely common. Rebuilding trust in the tendon takes patience.",
    emotionalPractices: [
      "Track relevé and jump counts so progress is visible even when it feels slow.",
      "Name the specific movement you're avoiding in your journal, then rehearse its smallest version.",
      "Expect confidence to lag behind capacity — that gap is normal, not a warning sign.",
    ],
    redFlags: [
      "A sudden pop with immediate weakness pushing off — seek urgent assessment",
      "Pain that keeps rising session after session despite reducing load",
      "Swelling or heat around the tendon that does not settle",
    ],
    clinicianQuestions: [
      "How much relevé and jump volume can I do this week?",
      "What next-day response tells me I did too much?",
      "Which loading exercise should I prioritise if I only have ten minutes?",
    ],
    resourceIds: ["v-calf-raise", "v-ankle-rehab", "v-foot-strength", "a-nhs-sprain", "a-iadms-conditioning"],
    focusId: "ankle-sprain",
  },
  {
    slug: "hip-impingement",
    name: "Hip Impingement (FAI)",
    area: "Hip",
    summary: "Pinching at the front of the hip in développé, grand plié, or high extensions.",
    commonIn: "Extreme turnout demands, repetitive end-range work",
    whatItIs:
      "Femoroacetabular impingement describes the ball and socket of the hip contacting earlier than usual at end range, which can irritate the joint rim (labrum) and surrounding tissue. Many people have the bone shape without symptoms — it becomes a problem when the demand on end-range hip motion outpaces what the joint and surrounding muscles can control.",
    symptoms: [
      "A pinch at the front or deep in the groin in développé devant or grand plié",
      "A 'C' shape formed with the hand around the hip when describing pain",
      "Aching after long rehearsals, sometimes into the side of the hip",
      "Clicking or catching in some ranges",
    ],
    danceContext: [
      "Forcing turnout from the feet rather than the hips increases the pinch.",
      "Extension height is often achieved by tipping the pelvis, which loads the joint edge.",
      "Adage and repeated end-range work concentrate load in one small area.",
    ],
    phases: [
      {
        name: "Calm",
        focus: "Range within comfort, deep hip rotator release, breathing mechanics",
        typical: "Symptom-led, often a few weeks",
        goals: ["Reduce daily irritation", "Learn where your pain-free range actually is"],
        work: ["Pain-free hip mobility", "Glute and deep rotator activation", "Pelvic control and breathing work"],
        avoid: ["Pushing extension past the pinch", "Aggressive stretching into the painful range"],
      },
      {
        name: "Rebuild",
        focus: "Turnout strength from the hip, core-pelvis control",
        typical: "Weeks to months, strength-led",
        goals: ["Control your available range under load", "Build glute and trunk capacity"],
        work: ["Bridges, clamshells, side-lying and standing turnout strength", "Dead bugs and anti-rotation trunk work", "Barre work with honest, controlled range"],
        avoid: ["Chasing height before control", "Comparing your extension to pre-injury photos"],
      },
      {
        name: "Return",
        focus: "Controlled extension height, adage progression",
        typical: "Gradual, alongside technique work",
        goals: ["Full class without next-day groin pain"],
        work: ["Graded adage and centre work", "Jump and partnering re-entry in stages"],
        avoid: ["Full rehearsal load immediately after clearance"],
      },
    ],
    emotional: "Losing extension can feel like losing artistry. Naming that grief helps recovery move forward.",
    emotionalPractices: [
      "Write what your extension means to you — then separate the feeling from the fact of this week's range.",
      "Set one process goal (control) instead of one outcome goal (height).",
      "Notice comparison triggers in class and plan a response in advance.",
    ],
    redFlags: [
      "Locking or giving way in the hip",
      "Groin pain with night pain or fever",
      "Pain that worsens steadily over weeks despite modifying load",
    ],
    clinicianQuestions: [
      "What range is safe for me to work in right now?",
      "Is my extension limited by strength, by range, or by pain?",
      "What would make surgery a conversation rather than a last resort?",
    ],
    resourceIds: ["a-hip-labral", "v-clamshell", "v-glute-bridge", "v-deadbug", "a-iadms-conditioning"],
    focusId: "hip-surgery",
  },
  {
    slug: "lateral-ankle-sprain",
    name: "Lateral Ankle Sprain",
    area: "Ankle & Foot",
    summary: "Ligament injury on the outside of the ankle, often from landing off-balance.",
    commonIn: "Jump landings, rolling over on pointe or demi-pointe",
    whatItIs:
      "The ligaments on the outside of the ankle get overstretched when the foot rolls inwards, usually on a landing. Beyond the ligament itself, the sensors inside it that tell your brain where your foot is in space are disrupted — which is why the ankle can feel untrustworthy long after the swelling has gone. Balance retraining is the best-evidenced way to prevent a repeat sprain.",
    symptoms: [
      "Swelling and bruising on the outside of the ankle",
      "Pain on weight-bearing, especially on uneven ground",
      "A feeling of the ankle wanting to give way",
      "Hesitation and bracing on landings even once pain settles",
    ],
    danceContext: [
      "Landings from allegro and jumps off pointe are the classic mechanism.",
      "Repeat sprains are common when balance work is skipped in favour of strength alone.",
      "Pointe re-entry needs both ankle control and calf endurance, not just pain-free walking.",
    ],
    phases: [
      {
        name: "Calm",
        focus: "Swelling management, pain-free range, gentle weight bearing",
        typical: "Roughly the first 1–2 weeks",
        goals: ["Settle swelling", "Walk normally without a limp"],
        work: ["Elevation and gentle movement", "Pain-free ankle alphabet and range work", "Seated calf and foot activation"],
        avoid: ["Jumping and running", "Prolonged complete immobilisation unless prescribed"],
      },
      {
        name: "Rebuild",
        focus: "Balance and proprioception, peroneal strength",
        typical: "Several weeks",
        goals: ["Single-leg balance 30s eyes closed", "Symmetrical calf endurance"],
        work: ["Single-leg balance progressions", "Resisted eversion with a band", "Slow heel raises to single leg"],
        avoid: ["Skipping balance work because strength feels fine"],
      },
      {
        name: "Return",
        focus: "Hop and landing control, direction changes, pointe re-entry",
        typical: "Once strength and balance are symmetrical",
        goals: ["Quiet, controlled single-leg landings", "Confidence in unplanned movement"],
        work: ["Graded hopping and landing drills", "Direction-change work", "Staged return to pointe with your teacher"],
        avoid: ["Returning to full allegro before landings feel quiet and controlled"],
      },
    ],
    emotional: "Hesitation on landings is normal. Confidence usually returns slower than the tissue heals.",
    emotionalPractices: [
      "Build a fear ladder of movements from easiest to scariest and work up one rung at a time.",
      "Log disconfirming evidence: what you feared vs what actually happened.",
      "Repeat boring, small landings — volume of safe reps rebuilds trust faster than one big jump.",
    ],
    redFlags: [
      "Unable to weight-bear four steps immediately after injury or in clinic — needs assessment for fracture",
      "Bony tenderness over the ankle knobbles",
      "Repeated giving way months later",
    ],
    clinicianQuestions: [
      "Do I need imaging to rule out a fracture?",
      "What tests will tell us I'm ready for jumps and pointe?",
      "How do I know whether it's pain or fear stopping me?",
    ],
    resourceIds: ["v-ankle-rehab", "v-balance", "v-band-eversion", "v-landing", "a-nhs-sprain", "a-aaos-sprain", "a-fear-reinjury"],
    focusId: "ankle-sprain",
  },
  {
    slug: "stress-fracture-metatarsal",
    name: "Metatarsal Stress Fracture",
    area: "Foot",
    summary: "A bone overload injury with focal pain that worsens with dance volume.",
    commonIn: "Sudden rehearsal load spikes, low energy availability",
    whatItIs:
      "A stress fracture is a small crack that develops when repeated loading outpaces the bone's ability to repair itself. Two things drive it: how much load went through the foot, and how well the body was fuelled and recovered while that happened. Both sides need addressing, which is why fuelling and sleep sit inside the physical plan rather than beside it.",
    symptoms: [
      "Pinpoint pain you can cover with one fingertip",
      "Pain that starts late in class and gradually starts earlier",
      "Pain that persists at rest or at night as it progresses",
      "Local swelling on the top of the foot",
    ],
    danceContext: [
      "Rehearsal peaks, intensives and competition season concentrate load quickly.",
      "Under-fuelling relative to training is a major, often unrecognised risk factor.",
      "Timelines are set by bone healing, not by motivation — this is the hardest part for most dancers.",
    ],
    phases: [
      {
        name: "Protect",
        focus: "Protected loading as guided by your clinician, nutrition support",
        typical: "Often 4–8 weeks, entirely clinician-led",
        goals: ["Let bone heal", "Maintain fitness without loading the foot"],
        work: ["Boot or modified weight-bearing exactly as prescribed", "Seated and upper-body conditioning", "Consistent, adequate fuelling across the day"],
        avoid: ["Testing the foot to see if it still hurts", "Skipping meals while less active"],
      },
      {
        name: "Rebuild",
        focus: "Foot intrinsic strength, gradual weight-bearing progression",
        typical: "Weeks, progressing in planned steps",
        goals: ["Pain-free walking then pain-free rises", "Restore foot and calf strength"],
        work: ["Foot intrinsic and toe strength", "Progressive calf and hip work", "Low-impact cardio building back up"],
        avoid: ["Jumping straight back into full class after clearance"],
      },
      {
        name: "Return",
        focus: "Volume-tracked class re-entry, jump load monitoring",
        typical: "Several weeks of staged loading",
        goals: ["Full class with no focal pain during or after"],
        work: ["Barre, then centre, then allegro in separate steps", "Written jump counts week to week"],
        avoid: ["Returning to pointe and allegro in the same week"],
      },
    ],
    emotional: "Long timelines can trigger identity questions. Small weekly wins matter more than the end date.",
    emotionalPractices: [
      "Set weekly, controllable goals instead of counting down to a return date.",
      "Stay in the room: watch class with a purpose so you keep your place in your community.",
      "If food or fuelling feels loaded, treat that as its own recovery goal with professional support.",
    ],
    redFlags: [
      "Pain at rest or at night that is getting worse",
      "Any recurrence of focal pain after clearance",
      "Missed periods, persistent fatigue or repeated bone injuries — signs of low energy availability worth medical review",
    ],
    clinicianQuestions: [
      "What weight-bearing am I allowed this week, exactly?",
      "Should my fuelling be reviewed by a sports dietitian?",
      "What are the criteria for my next progression?",
    ],
    resourceIds: ["a-stress-fracture", "a-red-s", "v-glute-bridge", "v-deadbug", "v-foot-strength", "a-iadms-nutrition"],
    focusId: "stress-fracture",
  },
  {
    slug: "patellofemoral-pain",
    name: "Patellofemoral Pain",
    area: "Knee",
    summary: "Aching around the kneecap in pliés, jumps, and stairs.",
    commonIn: "Rapid technique changes, quad and glute strength gaps",
    whatItIs:
      "Pain around or behind the kneecap, usually related to how load is shared between the kneecap and the thigh bone during bending. It is typically an irritation from load and control, not damage — which is good news, because strength and load management change it.",
    symptoms: [
      "Aching around the front of the knee in grand plié and jumps",
      "Pain on stairs, especially going down",
      "Discomfort after sitting for a long time",
      "Occasional grinding sensation without swelling",
    ],
    danceContext: [
      "Landing with knees rolling inwards concentrates load at the kneecap.",
      "Fast increases in jump volume or a sudden technique change are common triggers.",
      "Glute strength affects knee alignment more than most dancers expect.",
    ],
    phases: [
      {
        name: "Calm",
        focus: "Pain-guided plié range, quad activation",
        typical: "1–3 weeks",
        goals: ["Reduce daily aching", "Find a pain-free plié depth"],
        work: ["Isometric quad holds", "Reduced jump volume", "Hip and glute activation"],
        avoid: ["Deep loaded plié if it flares symptoms", "Ignoring pain and pushing through class"],
      },
      {
        name: "Rebuild",
        focus: "Glute and quad strength, alignment control",
        typical: "Weeks",
        goals: ["Symmetrical single-leg control", "Tolerate depth without flare"],
        work: ["Bridges, clamshells, step-downs", "Single-leg control drills", "Trunk stability work"],
        avoid: ["Adding jump volume in the same week as new strength work"],
      },
      {
        name: "Return",
        focus: "Jump volume progression, fatigue-aware scheduling",
        typical: "Ongoing",
        goals: ["Full allegro without next-day ache"],
        work: ["Landing quality drills", "Planned jump counts", "Rest days that are genuinely rest"],
        avoid: ["Training hard when fatigued — alignment fails before strength does"],
      },
    ],
    emotional: "Pain that has no visible sign often makes dancers doubt themselves. Your experience is valid.",
    emotionalPractices: [
      "Invisible injuries invite self-doubt — write down what you're actually feeling so you can report it accurately.",
      "Track function (what you managed) alongside pain, so progress is visible.",
      "Rehearse how you'll explain a modification to a teacher without apologising.",
    ],
    redFlags: [
      "The knee locking, giving way or swelling",
      "A clear injury moment with immediate swelling",
      "Pain that keeps climbing across months",
    ],
    clinicianQuestions: [
      "Is my plié depth safe right now, or should it be limited?",
      "Which strength gaps are driving this for me specifically?",
      "How much jumping per week should I build to?",
    ],
    resourceIds: ["v-glute-bridge", "v-clamshell", "v-landing", "v-deadbug", "a-iadms-conditioning"],
  },
  {
    slug: "low-back-strain",
    name: "Low Back Strain",
    area: "Spine",
    summary: "Muscular back pain aggravated by cambré, partnering, and repetitive extension.",
    commonIn: "Partnering load, hyperextension-based aesthetics",
    whatItIs:
      "Pain in the muscles and joints of the lower back, usually from a mismatch between the extension and rotation demanded of the spine and the trunk control available to manage it. Back pain is also strongly influenced by stress, sleep and fatigue — tracking those alongside pain often reveals the pattern faster than tracking pain alone.",
    symptoms: [
      "Aching or tightness across the lower back after class",
      "Pain in cambré, arabesque and repeated extension",
      "Discomfort with partnering lifts",
      "Symptoms that flare in stressful or under-slept weeks",
    ],
    danceContext: [
      "Aesthetic demands push the spine towards end-range extension repeatedly.",
      "Hip mobility limits often get compensated for by the lower back.",
      "Partnering adds external load to an already extended position.",
    ],
    phases: [
      {
        name: "Calm",
        focus: "Breathing, gentle mobility, load management",
        typical: "Days to a couple of weeks",
        goals: ["Reduce guarding and daily pain", "Keep moving gently"],
        work: ["Breathing and rib–pelvis alignment", "Gentle mobility in all directions", "Walking"],
        avoid: ["Bed rest", "Repeated end-range extension while symptoms are high"],
      },
      {
        name: "Rebuild",
        focus: "Trunk endurance, hip mobility, control in extension",
        typical: "Weeks",
        goals: ["Trunk endurance", "Extension shared between hips and spine"],
        work: ["Dead bugs, side planks, bird dogs", "Hip flexor and glute work", "Controlled, graded extension"],
        avoid: ["Chasing a bigger backbend before control improves"],
      },
      {
        name: "Return",
        focus: "Partnering re-entry, graded backbend work",
        typical: "Staged",
        goals: ["Full class and partnering without flare"],
        work: ["Lifts reintroduced in stages", "Full extension work with fatigue monitoring"],
        avoid: ["Heavy partnering days back-to-back at first"],
      },
    ],
    emotional: "Back pain often flares with stress. Tracking both together reveals the pattern.",
    emotionalPractices: [
      "Log stress and sleep next to pain for two weeks and look for the overlap.",
      "Use slow exhale breathing before class to reduce guarding.",
      "Notice catastrophic thoughts about your back and write the more accurate version.",
    ],
    redFlags: [
      "Numbness, pins and needles or weakness in the legs",
      "Any change in bladder or bowel control — seek urgent medical care",
      "Pain following a fall, or night pain with feeling unwell",
    ],
    clinicianQuestions: [
      "Is extension safe for me right now and to what range?",
      "What trunk work should I prioritise?",
      "How should I stage a return to partnering?",
    ],
    resourceIds: ["v-deadbug", "v-glute-bridge", "a-nhs-sleep", "a-nhs-breathing", "v-floor-barre"],
  },
  {
    slug: "burnout",
    name: "Burnout & Overtraining",
    area: "Whole-person",
    summary: "Persistent fatigue, dropping motivation, and a body that stops adapting to training.",
    commonIn: "Competition season, conservatory schedules, perfectionism",
    whatItIs:
      "Burnout is what happens when demand consistently exceeds recovery — physically, emotionally, or both. It shows up as exhaustion that sleep doesn't fix, growing cynicism or detachment from something you used to love, and a sense that your effort no longer produces results. It is a load-and-recovery mismatch, not a character flaw.",
    symptoms: [
      "Fatigue that persists after rest days",
      "Loss of enjoyment in class you used to look forward to",
      "Performance plateau or decline despite training hard",
      "Irritability, low mood, poor sleep, more frequent illness or niggles",
    ],
    danceContext: [
      "Dance culture often frames rest as weakness, which delays recognition.",
      "Perfectionism keeps effort high while satisfaction drops.",
      "Overlapping school, exams and rehearsal seasons stack demands invisibly.",
    ],
    phases: [
      {
        name: "Calm",
        focus: "Sleep, fuelling, real rest days, reduced intensity",
        typical: "Weeks — often longer than dancers expect",
        goals: ["Restore sleep and fuelling", "Take genuine, scheduled rest"],
        work: ["A fixed wake time", "Full meals, no skipped breakfast", "Gentle movement with no performance element"],
        avoid: ["Filling rest days with 'productive' training", "Deciding you'll rest after one more show"],
      },
      {
        name: "Rebuild",
        focus: "Rebuilding enjoyment, sustainable schedule design",
        typical: "Weeks to months",
        goals: ["Reconnect with why you dance", "Design a schedule you could hold for a year"],
        work: ["Movement nobody grades", "An honest energy audit of what drains and restores", "One boundary practised per week"],
        avoid: ["Returning to the exact schedule that caused this"],
      },
      {
        name: "Return",
        focus: "Values-led goals, workload boundaries",
        typical: "Ongoing",
        goals: ["Sustainable training with intentional recovery built in"],
        work: ["Goals based on values rather than approval", "Planned deload weeks", "Regular check-ins on early warning signs"],
        avoid: ["Ignoring the first signs when they come back"],
      },
    ],
    emotional: "Burnout is not weakness or a lack of discipline. It is a load-and-recovery mismatch.",
    emotionalPractices: [
      "Say no once this week to something optional and notice what actually happens.",
      "Do fifteen minutes of movement nobody is grading.",
      "List what drained and what restored you each day for a week — then change one thing.",
    ],
    redFlags: [
      "Low mood or hopelessness lasting more than two weeks",
      "Losing weight, missing periods, or repeated injuries",
      "Any thoughts of harming yourself — contact urgent support immediately",
    ],
    clinicianQuestions: [
      "Could anything medical be contributing to this fatigue?",
      "What would a sustainable weekly load look like for me?",
      "Would talking therapy help alongside schedule changes?",
    ],
    resourceIds: ["a-burnout", "a-nhs-sleep", "a-sleep-foundation", "a-mental-health-dance", "v-floor-barre", "v-breathing"],
    focusId: "burnout",
  },
  {
    slug: "post-surgery",
    name: "Post-Surgical Recovery",
    area: "Whole-person",
    summary: "Structured return after an operative procedure, guided entirely by your surgical team.",
    commonIn: "Ankle, hip, and knee procedures",
    whatItIs:
      "After surgery your tissue heals on a biological timeline that your protocol is built around. Your surgeon's and physio's instructions always override anything you read here — including this page. What Adagio can help with is the part protocols rarely cover: the emotional weight of the months around an operation, and keeping the rest of you strong while one part heals.",
    symptoms: [
      "Swelling, stiffness and weakness in the operated area",
      "Fatigue that is disproportionate to activity in the early weeks",
      "Mood dips around milestones and clinic appointments",
      "Fear of the first time you load the joint properly",
    ],
    danceContext: [
      "Return to dance usually comes in stages: walking, barre, centre, jumps, pointe, performance.",
      "Clearance to dance and feeling ready to dance rarely arrive at the same time.",
      "Losing the studio for months affects friendships and identity, not just fitness.",
    ],
    phases: [
      {
        name: "Protect",
        focus: "Follow your surgeon's protocol exactly",
        typical: "Set by your surgical team",
        goals: ["Protect the repair", "Manage swelling and range as prescribed"],
        work: ["Prescribed range-of-motion work", "Activation exercises within cleared limits", "Conditioning for uninvolved body parts"],
        avoid: ["Anything not in your protocol, however harmless it looks online"],
      },
      {
        name: "Rebuild",
        focus: "Strength and range within cleared limits",
        typical: "Months, milestone-based",
        goals: ["Restore strength symmetry", "Normal walking pattern"],
        work: ["Progressive strength work", "Gait quality", "Trunk and hip stability"],
        avoid: ["Comparing your timeline with another dancer's"],
      },
      {
        name: "Return",
        focus: "Barre, centre, and jumps in stages with clearance",
        typical: "Staged over months",
        goals: ["Full class", "Psychological readiness alongside physical clearance"],
        work: ["Staged class re-entry", "Landing and jump progression", "Imagery and confidence work"],
        avoid: ["Jumping stages because you feel good on one day"],
      },
    ],
    emotional: "Surgery days can be emotionally heavy. Support before and after matters as much as the rehab plan.",
    emotionalPractices: [
      "Read back your week-one entry when progress feels invisible.",
      "Use imagery: three minutes rehearsing a clean, pain-free movement.",
      "Ask for one specific thing from someone in your studio each week so you stay connected.",
    ],
    redFlags: [
      "Fever, spreading redness, or wound discharge — contact your surgical team",
      "Sudden calf pain and swelling, or breathlessness — seek urgent medical care",
      "Pain that suddenly changes character after a stable period",
    ],
    clinicianQuestions: [
      "What are the criteria — not dates — for my next stage?",
      "What is normal soreness after rehab versus a warning sign for me?",
      "When can I start jumping, and what has to be true first?",
    ],
    resourceIds: ["v-hip-labral", "a-hip-labral", "v-imagery", "a-return-to-sport", "v-deadbug", "v-glute-bridge"],
    focusId: "hip-surgery",
  },
];


export const stories = [
  {
    name: "Maya, 19",
    tag: "Stress fracture · Pre-professional",
    quote:
      "Eight months out felt like losing myself. What helped was giving my recovery its own goals instead of measuring everything against the dancer I used to be.",
  },
  {
    name: "Jonah, 22",
    tag: "Hip surgery · Company trainee",
    quote:
      "I was cleared physically a month before I felt safe. Naming that gap out loud, with people who understood, was the turning point.",
  },
  {
    name: "Elise, 16",
    tag: "Burnout · Competitive",
    quote:
      "I thought resting meant falling behind. My first real week off in three years is the reason I still dance today.",
  },
  {
    name: "Priya, 24",
    tag: "Ankle sprain · Former dancer",
    quote:
      "I stopped performing, but movement is still mine. Rebuilding identity outside the studio was harder than rehab and worth every step.",
  },
];

export const communityThreads = [
  {
    title: "First class back after 6 months — how did you handle nerves?",
    replies: 24,
    space: "Return to dance",
    tone: "Supportive",
    opener:
      "I'm cleared for barre next Monday after six months out with a metatarsal stress fracture. I've been imagining this day for so long and now I mostly feel sick about it. How did you get through your first class back?",
    posts: [
      {
        author: "Nadia, 20",
        text: "I told one person in the room beforehand — just my teacher — that it was my first class back. Not having to pretend took about half the pressure off.",
      },
      {
        author: "Theo, 17",
        text: "I gave myself permission to leave after barre. I stayed for the whole class, but knowing I could go made it feel like a choice instead of a test.",
      },
      {
        author: "Moderator · Ren",
        text: "Nerves before a first class back are extremely common and not a sign you aren't ready. Physical clearance and feeling ready usually arrive at different times. Keep clearance questions with your clinician.",
      },
    ],
  },
  {
    title: "Physio says cleared, brain says no",
    replies: 41,
    space: "Fear of reinjury",
    tone: "Peer support",
    opener:
      "Everything on paper says my ankle is fine. Strength is symmetrical, hop tests are good. But every time I land I brace like it's going to give out again. Does that ever go away?",
    posts: [
      {
        author: "Imogen, 23",
        text: "For me it faded with reps, not with time off. A hundred small boring landings did more for my confidence than any single big jump.",
      },
      {
        author: "Sam, 19",
        text: "I started naming it out loud in my head — 'this is fear, not pain'. Sounds silly but it stopped me treating every twinge as evidence.",
      },
      {
        author: "Moderator · Ren",
        text: "A gap between physical clearance and psychological readiness is well documented in return-to-sport research. If the fear is not shifting, a sport psychologist or your physio can work on it directly.",
      },
    ],
  },
  {
    title: "How do you answer 'when are you dancing again?'",
    replies: 17,
    space: "Identity",
    tone: "Reflective",
    opener:
      "Every family dinner. Every message from studio friends. I don't have an answer and having to say that out loud over and over is wearing me down.",
    posts: [
      {
        author: "Priya, 24",
        text: "I made one sentence and reused it: 'I'm working on it, and I'll share when there's news.' Having it ready meant I stopped improvising while upset.",
      },
      {
        author: "Lucas, 16",
        text: "I started answering with what I am doing instead — rehab, cross-training, teaching a little. It changes the conversation away from a date.",
      },
    ],
  },
  {
    title: "Rest day ideas that don't feel like giving up",
    replies: 33,
    space: "Burnout",
    tone: "Practical",
    opener:
      "My schedule finally has a real rest day in it and I spend the whole day anxious. What do you actually do with one?",
    posts: [
      {
        author: "Elise, 16",
        text: "Something that uses my body gently but has nothing to do with technique — a long walk, swimming, cooking something slow.",
      },
      {
        author: "Mira, 21",
        text: "I schedule it like a class. It's in the calendar with a start and end. If it's on the schedule my brain treats it as training, not slacking.",
      },
      {
        author: "Moderator · Ren",
        text: "Rest is part of adaptation, not a pause from it. If rest days consistently trigger high anxiety, that's worth raising with a mental-health professional.",
      },
    ],
  },
];

export const journalPrompts = [
  "What did your body do well today that you didn't have to think about?",
  "Where did fear show up today, and what was it protecting you from?",
  "Who are you when you're not dancing? Write three answers.",
  "What's one thing you'd tell a friend in your exact situation?",
  "Name one part of recovery that felt lonely this week.",
];
