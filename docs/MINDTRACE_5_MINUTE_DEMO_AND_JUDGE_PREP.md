# MindTrace — 5-Minute Demo Script & Comprehensive Judge Preparation Masterbook

**Problem Statement PS-03**: Burnout Prediction & Wellbeing Nudge System for Engineering Students  
**Product Name**: MindTrace — Student Wellbeing Companion  
**Team Structure**: 6 Members  
**Demo Duration**: EXACTLY 5:00 Minutes  
**Target Environment**: Hackathon Live Evaluation (Supports both Live API & Deterministic Offline Demo Mode)

---

## 1. Project Reality Audit & Implementation Status

Below is the verified audit of what is actually built and functional in the MindTrace codebase:

| Component / Feature | Implementation Location | Actual Behavior & Tech Foundation | Safe to Demo? | Demo Priority |
| :--- | :--- | :--- | :--- | :--- |
| **Routine Quest (Onboarding)** | `src/pages/OnboardingPage.tsx` | Interactive 4-step game-like baseline setup ("Discover your normal"). Captures sleep window, study hours, campus activity, and task timing. | ✅ Yes | **P0** |
| **Student Consent Framework** | `src/pages/ConsentPage.tsx` | Privacy-first explicit consent selection with student-controlled data permissions. | ✅ Yes | **P0** |
| **Student Dashboard** | `src/pages/DashboardPage.tsx` | Real-time wellbeing overview displaying average mood, stress, sleep, academic load, recent check-in logs, and support sessions. | ✅ Yes | **P0** |
| **Indicator Calculation Engine** | `backend/app/services/indicator_service.py` | Mathematical baseline deviation score formula: $\text{Score} = 0.35 \times \text{dev\_late} + 0.30 \times \text{dev\_delay} + 0.20 \times \text{dev\_library} + 0.15 \times \text{dev\_variance}$. | ✅ Yes | **P0** |
| **Pattern Timeline** | `src/components/dashboard/PatternTimeline.tsx` | 21-day chronological behavioral progression breakdown (Week 1 Baseline -> Week 2 Early Shift -> Week 3/4 Current Shift). Derived strictly from signal history. | ✅ Yes | **P0** |
| **Counterfactual Explorer** | `src/components/dashboard/CounterfactualExplorer.tsx` | **WOW MOMENT**: Interactive "What-If Model Scenario" sensitivity simulator with 4 live sliders (Late Nights, Delays, Library, Variance) and live score recalculation. | ✅ Yes | **P0** |
| **Deterministic Demo Mode** | `backend/app/api/v1/demo.py` & `src/data/demoData.ts` | Instant state switcher (`stable` / `changing` / `needs_attention`) for student Riya (3rd Year CSE) with <1s Reset button. | ✅ Yes | **P0** |
| **Calm Companion Chatbot** | `src/components/chat/CalmCompanionChat.tsx` | Privacy-first conversational listener using Google Gemini API (`gemini-2.5-flash`) with warm deterministic offline fallback & crisis keyword safety filter. | ✅ Yes | **P0** |
| **Wellness Resources Hub** | `src/pages/ResourcesPage.tsx` & `src/components/resources/` | Intent quick-pick ("Calm down", "Focus"), 4-7-8 / Box Breathing timer visualizer (`BreathingModal.tsx`), Guide Reader (`ArticleReaderModal.tsx`), Ambient Sound Player (`AudioPlayerModal.tsx`). | ✅ Yes | **P1** |
| **Counsellor Connect & WhatsApp** | `src/components/counselling/CounsellorConnectPage.tsx` & `whatsapp_service.py` | 15-minute slot locking, appointment management, and direct `wa.me` non-diagnostic coordination handoff. | ✅ Yes | **P1** |
| **Institutional Admin Dashboard** | `src/pages/InstitutionDashboardPage.tsx` | College admin dashboard displaying program-level aggregate metrics, adoption funnel, cohort breakdowns, and support utilization. | ✅ Yes | **P0** |
| **Privacy Aggregation Boundary** | `backend/app/services/institution_service.py` | Server-side protection enforcing minimum cohort aggregation threshold (`MIN_AGGREGATION_THRESHOLD = 10`) to prevent individual student identification. | ✅ Yes | **P0** |
| **Dark Mode / Light Mode** | `src/context/ThemeContext.tsx` & `Header.tsx` | Polished HSL theme switcher persisted in `localStorage`. | ✅ Yes | **P1** |

---

## 2. Feature Inventory & Priority Matrix

| Priority Level | Features Included | Reason / Strategy |
| :--- | :--- | :--- |
| **P0: MUST SHOW (00:00 - 04:30)** | Problem Hook -> Routine Quest -> Student Dashboard -> Pattern Timeline -> **Counterfactual Explorer** -> Calm Companion -> Institutional Dashboard | Constructs the single unbreakable narrative: Student Awareness -> Sensitivity Exploration -> Human/AI Support -> Institutional Aggregate Visibility. |
| **P1: SHOW IF TIME (04:30 - 05:00)** | Interactive Breathing Reset Modal (`BreathingModal.tsx`), WhatsApp Coordination Link | Quick 15-second visual demonstration of micro-interventions and campus counselling handoff. |
| **P2: DO NOT SHOW IN 5-MIN DEMO** | Full Settings Page, Historical Reset Page, Raw API JSON endpoints, Admin login form filling | Consumes precious presentation seconds without adding narrative value to judges. |

---

## 3. The Single Coherent Narrative Arc

> **"MindTrace bridges the critical gap between early behavioral routine drift and timely, student-controlled support—before burnout occurs."**

1. **The Core Problem**: Engineering students experience intense academic pressure. Traditional support systems are reactive—acting only after academic failure or severe crisis.
2. **Student Empowerment**: Students don't want to be diagnosed or labeled as "burned out". They need self-awareness of their own routine baseline shifts.
3. **The MindTrace Difference**: MindTrace does not diagnose. It tracks personal routine deviation, explains *why* the routine shifted via the **Pattern Timeline**, and lets students run **What-If Simulations (Counterfactual Explorer)**.
4. **Support & Intervention**: Offers judgment-free **Calm Companion** AI listening and seamless **Counsellor Connect** scheduling.
5. **Institutional Value & Privacy**: Colleges get anonymous, aggregate program analytics to allocate counselling resources—protected by a minimum 10-student privacy threshold.

---

## 4. Exact 5-Minute Demo Timeline (00:00 – 05:00)

| Timestamp | Segment Title | Primary Speaker | Exact Screen / Action Shown | Core Message |
| :--- | :--- | :--- | :--- | :--- |
| **00:00 – 00:30** | Problem Statement & Hook | **Member 1** (Lead Pitch) | Title Slide / MindTrace Welcome Screen (`WelcomePage.tsx`) | "70% of engineering students show signs of extreme stress, but traditional campus support is reactive. MindTrace introduces personal baseline tracking." |
| **00:30 – 01:10** | Student Onboarding & Baseline | **Member 2** (Student UX) | Routine Quest (`OnboardingPage.tsx`) -> Consent (`ConsentPage.tsx`) | "Onboarding isn't a form; it's Routine Quest. Students establish their own baseline without feeling judged or diagnosed." |
| **01:10 – 02:00** | Dashboard & Pattern Timeline | **Member 3** (Core Intelligence) | Student Dashboard (`DashboardPage.tsx`) -> `PatternTimeline.tsx` | "MindTrace compares the last 7 days against Riya's 14-day baseline. The Pattern Timeline shows exact weekly routine shifts." |
| **02:00 – 02:50** | **WOW MOMENT**: Counterfactual Explorer | **Member 3** & **Member 4** | `CounterfactualExplorer.tsx` (Live slider tweaks) | "Students don't just see a score—they explore model sensitivity. Adjusting assignment delay back to baseline lowers the indicator score in real time." |
| **02:50 – 03:40** | Calm Companion & Support | **Member 4** (Intervention Lead) | `CalmCompanionChat.tsx` & `BreathingModal.tsx` | "Calm Companion is an empathetic listener. No unsolicited advice, no clinical labels. Students can also book campus counselling in 2 clicks." |
| **03:40 – 04:30** | Institutional Analytics & Privacy | **Member 5** (Tech Arch) & **Member 6** (Biz Lead) | Institutional Dashboard (`InstitutionDashboardPage.tsx`) | "Colleges see aggregated program trends to optimize counselling staff. Individual student identities remain 100% private behind a 10-student threshold." |
| **04:30 – 05:00** | Business Model, Tech Stack & Summary | **Member 6** & **Member 1** | MindTrace Summary Screen / Q&A Transition | "React + FastAPI + Supabase B2B2C model. MindTrace transforms campus mental health from reactive intervention to proactive support." |

---

## 5. Team Member Roles & Responsibilities (6 Members)

### Member 1 — Lead Presenter & Pitch Owner
- **Role**: Problem Hook, Narrative Continuity, Pitch Closing.
- **Key Knowledge**: PS-03 requirements, student mental health gap, MindTrace mission.
- **What They Say**: Opening hook (00:00-00:30) and final closing statement (04:45-05:00).
- **Expected Questions**: "Why does traditional campus counseling fail?", "What is your main differentiator?"
- **Must NOT Claim**: Never claim MindTrace provides medical diagnosis or clinically predicts depression.

### Member 2 — Student Experience & Onboarding Owner
- **Role**: Routine Quest & Consent Demonstration.
- **Key Knowledge**: Onboarding flow (`OnboardingPage.tsx`), student privacy choices (`ConsentPage.tsx`).
- **What They Say**: Onboarding walk-through (00:30-01:10).
- **Expected Questions**: "What if a student inputs false routine data during onboarding?"
- **Backup Answer**: "The system normalizes baseline over a rolling 14-day window; initial inputs are refined as daily check-ins occur."

### Member 3 — Core Intelligence & Model Explainability Owner
- **Role**: Indicator Engine, Baseline Deviation, Pattern Timeline, Counterfactual Explorer.
- **Key Knowledge**: Baseline formula, weight factors ($0.35$ late night, $0.30$ delay, $0.20$ library, $0.15$ variance), sensitivity modeling.
- **What They Say**: Indicator overview & Counterfactual demonstration (01:10-02:30).
- **Expected Questions**: "Is this a trained machine learning model?", "How do you calculate burnout?"
- **Backup Answer**: "In this prototype, we use a deterministic baseline deviation formula grounded in behavioral indicator research. We avoid black-box ML to maintain 100% explainability for students."

### Member 4 — Student Support & AI Companion Owner
- **Role**: Calm Companion Chatbot, Wellness Resources, Counsellor Handoff.
- **Key Knowledge**: Gemini API integration, prompt engineering (`CALM_COMPANION_SYSTEM_PROMPT`), fallback system, crisis safety filters.
- **What They Say**: Chatbot & Support walk-through (02:30-03:40).
- **Expected Questions**: "What if the AI gives harmful advice?", "What happens if the Gemini API goes down?"
- **Backup Answer**: "System prompts strictly forbid unsolicited advice or medical diagnosis. If the API fails, our system seamlessly switches to local empathetic template fallbacks."

### Member 5 — Technical Architecture & Security Lead
- **Role**: Full-Stack Architecture, Database, Security, Privacy Enforcement.
- **Key Knowledge**: React/Vite, FastAPI backend, Supabase PostgreSQL, RLS policies, minimum aggregation threshold (10 students).
- **What They Say**: Tech stack overview & Privacy boundary (03:40-04:15).
- **Expected Questions**: "How do you prevent student identification on the college dashboard?"
- **Backup Answer**: "All aggregate queries enforce a server-side minimum threshold of 10 students. Any department cohort smaller than 10 returns a privacy-preserving notice."

### Member 6 — Institutional Product & Business Model Owner
- **Role**: Institutional Dashboard, Business Model (B2B2C), Scalability.
- **Key Knowledge**: B2B SaaS pricing for universities, counseling utilization metrics, college buyer persona (Dean of Student Affairs / Wellness Directors).
- **What They Say**: Institutional Dashboard & Business Model (04:15-04:45).
- **Expected Questions**: "Why would a college pay for this?", "Who is the buyer?"
- **Backup Answer**: "Colleges pay an annual subscription based on FTE student enrollment to reduce dropout rates, optimize counselling staff allocation, and satisfy regulatory student welfare mandates."

---

## 6. Speaker Scripts & Exact Dialogue

### Segment 1: Problem & Hook (00:00 – 00:30) | **Member 1**
> *"Good morning judges. Engineering students face immense academic pressure, but traditional university wellness systems are reactive—they only intervene after a crisis occurs or grades collapse. Students don't want to be diagnosed or labeled as 'burned out'. They need early, private awareness of their own routine shifts. Presenting **MindTrace**—an early-warning student wellbeing companion that tracks personal baseline routine changes and empowers students with explainable support."*

### Segment 2: Routine Quest & Onboarding (00:30 – 01:10) | **Member 2**
> *"Instead of asking students to fill out clinical forms, MindTrace introduces **Routine Quest**—an interactive experience where students discover their own routine baseline. Students input their usual study hours, sleep windows, and campus activity. Crucially, privacy is student-controlled: students explicitly select what data is stored and who can access support features."*

### Segment 3: Dashboard & Pattern Timeline (01:10 – 02:00) | **Member 3**
> *"Once onboarded, MindTrace continuously evaluates recent behavior against the student's own 14-day baseline—never comparing them against peers. Here on Riya's dashboard, we observe a routine pattern index shift of +25%. Rather than showing an opaque score, the **Pattern Timeline** breaks down the exact progression over 21 days: stable baseline in Week 1, slight late-night study extension in Week 2, and increased submission delay in Week 3."*

### Segment 4: WOW MOMENT — Counterfactual Explorer (02:00 – 02:50) | **Member 3 & Member 4**
> *"Now for our core differentiator—the **Counterfactual Explorer**. MindTrace doesn't just display historical changes; it allows students to run 'What-If' sensitivity simulations. If Riya adjusts her assignment delay slider back toward her baseline of 1.2 hours, the indicator score recalculates live from 1.62x down to 1.18x. This gives students self-agency to explore how small routine adjustments influence their overall pattern indicator."*

### Segment 5: Calm Companion & Counselling (02:50 – 03:40) | **Member 4**
> *"When students need to talk, they can open the **Calm Companion**. Unlike generic chatbots, Calm Companion follows a strict server-side rule: Listen, Acknowledge, Reflect, and Gently Ask. It never gives unsolicited advice or clinical diagnoses. If a student wants human guidance, **Counsellor Connect** locks a 15-minute slot in two clicks and generates a private WhatsApp coordination link."*

### Segment 6: Institutional Analytics & Privacy (03:40 – 04:30) | **Member 5 & Member 6**
> *"For university administrators, MindTrace provides the **Institutional Dashboard**. Colleges gain high-level aggregate visibility into cohort adoption, stress trends, and counselling demand. **Crucially, student privacy is protected by design**: all aggregate queries enforce a server-side minimum threshold of 10 students. No Dean or administrator can ever view an individual student's name, risk score, or check-in logs."*

### Segment 7: Business Model & Closing (04:30 – 05:00) | **Member 6 & Member 1**
> *"MindTrace operates on a B2B2C model—100% free for students, monetized via annual university SaaS subscriptions. Built on React, FastAPI, and Supabase, MindTrace shifts campus mental health from reactive crisis management to proactive, student-first wellbeing support. Thank you, and we welcome your questions."*

---

## 7. Click-by-Click Demo Runbook

| Step | Action in UI | Expected Visual Result | What Speaker Says | Fallback / Contingency Plan |
| :--- | :--- | :--- | :--- | :--- |
| **1** | Open `http://localhost:5173/` | MindTrace Welcome Screen loads cleanly with brand title. | "Welcome to MindTrace." | Refresh page or run `npm run dev`. |
| **2** | Click **Start Experience** | Navigates to Consent Page (`ConsentPage.tsx`). | "Students begin with explicit privacy consent." | Click direct nav "Home" button. |
| **3** | Click **Continue to Routine Quest** | Opens `OnboardingPage.tsx` Step 1. | "Routine Quest establishes personal baseline." | Skip directly to `/dashboard`. |
| **4** | Click **Go to Dashboard** | Renders `DashboardPage.tsx` for Riya. | "Here is Riya's personalized wellbeing overview." | Use Demo Control Bar to select state. |
| **5** | Scroll to **Pattern Timeline** | `PatternTimeline.tsx` renders 21-day steps. | "The Pattern Timeline explains routine drift over 3 weeks." | Point out baseline metrics cards. |
| **6** | Scroll to **Counterfactual Explorer** | `CounterfactualExplorer.tsx` renders 4 sliders + live output card. | "Our WOW moment: What-If Model Sensitivity Simulation." | Ensure `demoData.ts` client logic is active. |
| **7** | Drag **Assignment Delay** slider from 3.5h to 1.2h | Live indicator score updates from `1.62x` (+62%) to `1.18x` (+18%). | "Adjusting task delay recalculates the trend score in real time." | Click **Reset Variables** button. |
| **8** | Click **Talk to Calm Companion** | `CalmCompanionChat.tsx` modal opens. | "Calm Companion provides a judgment-free space." | Show offline fallback message. |
| **9** | Type "I feel overwhelmed with project deadlines" | Chatbot responds with empathetic reflection and gentle question. | "It listens and reflects without giving unsolicited medical advice." | Pre-loaded message response appears. |
| **10** | Click **Institutional Portal** in Header | Opens `InstitutionLoginPage.tsx`. Click Quick Login. | "Now let's view the university administrator portal." | Navigate directly to `/institution_dashboard`. |
| **11** | Show **Cohort Breakdown & Adoption Funnel** | Displays aggregate graphs with `MIN_AGGREGATION_THRESHOLD = 10` label. | "Colleges view anonymous aggregate trends; student identity is 100% protected." | Point out privacy disclaimer banner. |

---

## 8. The "WOW Moment": Counterfactual Explorer

### Why it's the WOW Moment
Most mental health dashboards are static displays of past scores. MindTrace's **Counterfactual Explorer** introduces interactive sensitivity simulation. It turns an abstract indicator score into an interactive learning tool where students can explore:

> *"If my assignment submission delays return to my baseline level of 1.2 hours, how does the mathematical trend model respond?"*

### Live Model Formula Demonstrated
$$\text{Score} = 0.35 \times \left(\frac{\text{Late Night}}{\text{Base Late}}\right) + 0.30 \times \left(\frac{\text{Delay}}{\text{Base Delay}}\right) + 0.20 \times \left(\frac{\text{Base Library}}{\text{Library}}\right) + 0.15 \times \left(\frac{\text{Variance}}{\text{Base Variance}}\right)$$

### Scientific Framing Rules (What NOT to say)
- ❌ **DO NOT SAY**: "This proves that turning in assignments on time stops burnout."
- ✅ **DO SAY**: "This is a model sensitivity simulation that shows students how individual behavioral factors weigh into our mathematical indicator formula."

---

## 9. Comprehensive Judge Q&A (60+ Questions & Defenses)

### Category A: Problem & Purpose
1. **Q: Isn't burnout a medical condition? How can an app predict it?**
   - **Short Answer**: MindTrace does *not* diagnose medical burnout. It tracks non-clinical daily routine variances against a personal baseline.
   - **Detailed Answer**: We strictly position MindTrace as an early-warning routine indicator system. It monitors observable lifestyle metrics (sleep windows, assignment submission timing, campus activity) to highlight routine drift before it impacts student well-being.
2. **Q: Why are existing college counseling centers insufficient?**
   - **Short Answer**: They are reactive and depend on self-referral after severe distress occurs.
   - **Detailed Answer**: University counseling centers operate on a walk-in or crisis basis. By the time a student reaches out, they may already be failing courses or in severe crisis. MindTrace acts as an earlier, student-controlled bridge.

### Category B: AI & Machine Learning
3. **Q: Where exactly is AI used in MindTrace?**
   - **Short Answer**: Gemini AI powers the **Calm Companion** chatbot and non-diagnostic summary generation.
   - **Detailed Answer**: We use Google Gemini (`gemini-2.5-flash`) for natural language understanding in the Calm Companion chat and personalized nudge text generation. All routine score calculations remain 100% deterministic for explainability.
4. **Q: Is your trend score generated by a trained ML model?**
   - **Short Answer**: No, it uses a transparent deterministic baseline deviation formula.
   - **Detailed Answer**: In a hackathon prototype without clinically validated longitudinal datasets, training a black-box ML model creates false accuracy claims. We built an explainable weight-based baseline deviation formula.
5. **Q: What happens if the Gemini AI API goes down during live usage?**
   - **Short Answer**: MindTrace executes automatic, deterministic local fallback templates.
   - **Detailed Answer**: Every AI service function in `ai_service.py` and `chat_service.py` is wrapped in try/except blocks that trigger pre-tested, empathetic local template responses if the API times out or fails.

### Category C: Privacy & Security
6. **Q: Can a college Dean view an individual student's stress score?**
   - **Short Answer**: Absolutely not. Institutional access is strictly aggregate.
   - **Detailed Answer**: MindTrace's database architecture separates student tables from institutional endpoints. Backend services enforce `MIN_AGGREGATION_THRESHOLD = 10`, returning an error if a cohort query contains fewer than 10 students.
7. **Q: How do you prevent student identification via department filters?**
   - **Short Answer**: Minimum cohort aggregation thresholds enforced server-side.
   - **Detailed Answer**: If an admin filters by "3rd Year Aerospace Engineering" and only 4 students exist, the FastAPI backend refuses to render counts or averages, returning "Cohort size too small to guarantee privacy."

### Category D: Business Model & Monetization
8. **Q: Who pays for MindTrace?**
   - **Short Answer**: Universities pay an annual SaaS subscription; students use it 100% free.
   - **Detailed Answer**: Colleges purchase MindTrace as part of their student welfare and counseling operations infrastructure. Pricing is structured per FTE (Full-Time Equivalent) student per year.
9. **Q: Why would a university buy MindTrace if they already have counselors?**
   - **Short Answer**: MindTrace optimizes counselor time and increases early student engagement.
   - **Detailed Answer**: Counselors spend hours manually scheduling and managing administrative handoffs. MindTrace automates 15-minute slot allocation, provides aggregate program analytics, and connects students earlier.

*(Refer to Section 10-16 for extended category Q&As).*

---

## 10. High-Probability "Trap Questions" & Defenses

1. **Trap Question: "Isn't this just another mental health chatbot?"**
   - **Defense**: "No. Chatbots are purely reactive text interfaces. MindTrace combines 21-day personal baseline deviation tracking, interactive What-If sensitivity modeling, static wellness tools, and direct campus counselling slot locking. The chatbot is just one optional support layer."
2. **Trap Question: "How do you know your 21-day mock data is accurate?"**
   - **Defense**: "We explicitly state that our hackathon data is simulated to demonstrate system behavior. We do not claim fake 99% accuracy statistics. Production deployment would establish true baselines over rolling 14-day student check-in windows."
3. **Trap Question: "What if a student lies during daily check-ins?"**
   - **Defense**: "Check-ins are voluntary and non-evaluative. Because MindTrace does not grade students or report scores to faculty, students have zero incentive to game the system. Furthermore, passive behavioral signals (submission timestamps) corroborate routine patterns."

---

## 11. AI Defense Cheat Sheet

- **Model Used**: Google Gemini 2.5 Flash (`gemini-2.5-flash`).
- **Prompt Guardrails**: Server-side system prompt (`CALM_COMPANION_SYSTEM_PROMPT`) explicitly enforces:
  1. NO unsolicited advice.
  2. NO clinical diagnosis or burnout labels.
  3. NO assumptions of student stress data.
  4. Max 2 short paragraphs ending with ONE open question.
- **Safety Keywords**: Regex crisis filter detects self-harm keywords (`suicide`, `kill myself`, `overdose`) and immediately renders Tele-MANAS (14416) and AASRA helpline cards.

---

## 12. Privacy & Security Defense Cheat Sheet

- **Data Separation**: Student identity (`Student`) is decoupled from aggregate institutional reporting models (`InstitutionalOverview`).
- **Anon / Service Keys**: No Supabase service-role keys are exposed in frontend code.
- **Minimum Cohort Size**: $N \ge 10$ enforced server-side.

---

## 13. Existing Solutions & Differentiation ("Why MindTrace?")

| Feature | Generic Survey Apps | Traditional College Counseling | MindTrace |
| :--- | :--- | :--- | :--- |
| **Approach** | Reactive periodic forms | Walk-in / Crisis referral | **Continuous personal baseline monitoring** |
| **Explainability** | Opaque total score | Human consultation only | **Pattern Timeline + Counterfactual Explorer** |
| **Student Control** | Data shared with admins | Manual scheduling | **100% private; student-driven counselling handoff** |
| **Institutional Value** | Low response rates | Overwhelmed staff | **Privacy-preserving aggregate operational analytics** |

---

## 14. Business Model & B2B2C Strategy

- **Target Buyer**: Vice Chancellor of Student Affairs, Head of Student Welfare, Director of Campus Counseling.
- **Pricing Hypothesis**: ₹150 – ₹300 ($2–$4) per student per year.
- **Value Delivered**: Higher retention, lower drop-out rates, automated scheduling, compliance with AICTE/UGC student mental health guidelines.

---

## 15. Technical Architecture (20s & 60s Explanations)

### 20-Second Summary
> *"MindTrace uses a React + TypeScript frontend connected to a FastAPI Python backend. Data is stored in Supabase PostgreSQL. Deterministic algorithms calculate baseline deviations, while server-side Gemini AI powers privacy-guarded conversational support."*

### 60-Second Technical Deep-Dive
> *"Architecturally, MindTrace separates presentation from calculation. The Vite React client handles responsive UI rendering and local sensitivity simulations. The FastAPI backend executes core indicator logic via `indicator_service.py`, computing rolling 14-day student baselines and evaluating 7-day trend shifts. Persistent storage uses Supabase PostgreSQL with strict Row Level Security. For AI, requests pass through FastAPI where server-side prompts sanitize input and inject crisis safety checks before calling Gemini 2.5 Flash. All admin aggregate queries execute server-side threshold checks to prevent student re-identification."*

---

## 16. Live Demo Failure Plan & Recovery Strategies

| Failure Scenario | Detection Signal | Immediate Recovery Action | What to Say to Judges |
| :--- | :--- | :--- | :--- |
| **Live Gemini API Times Out** | Chat response takes >3s | FastAPI automatically catches timeout and returns empathetic local template response. | "Our system detected an API delay and seamlessly fell back to our deterministic conversation template." |
| **Backend Service Offline** | Network error banner appears | Click **Demo Scenario Switcher** on Dashboard to activate pure client-side simulation. | "MindTrace includes a standalone client mode for offline evaluation." |
| **Browser Freeze / Glitch** | UI unresponsive | Press `Cmd+R` (Mac) / `Ctrl+R` to refresh. App loads instantly from `localStorage`. | "Refreshing the Vite production bundle..." |

---

## 17. Elevator Pitches

### 10-Second Pitch
> *"MindTrace is an early-warning wellbeing companion for engineering students that tracks personal routine shifts, empowers students with what-if simulations, and provides privacy-first campus support."*

### 30-Second Pitch
> *"Traditional campus counseling is reactive. MindTrace establishes a personal behavioral baseline for engineering students by tracking subtle routine shifts in sleep, study hours, and task timing. Students can explore what causes routine shifts using our Counterfactual Explorer and access private AI listening or book campus counseling—while colleges receive privacy-protected aggregate insights."*

---

## 18. Hackathon Judge Scorecard Mapping

| Judge Criterion | What MindTrace Demonstrates | Exact Demo Moment | Codebase Evidence |
| :--- | :--- | :--- | :--- |
| **Problem Relevance** | Targets engineering academic stress & reactive counseling gaps | 00:00 Pitch Hook & Routine Quest | `OnboardingPage.tsx` |
| **Technical Execution** | Full-stack FastAPI + React + Supabase pipeline with explainable indicators | 01:10 Dashboard & Indicator Engine | `indicator_service.py` |
| **Innovation & Differentiation**| Interactive sensitivity simulation ("What-If Explorer") | 02:00 Counterfactual Explorer | `CounterfactualExplorer.tsx` |
| **AI Integration** | Server-side Gemini API with safety guardrails and graceful fallbacks | 02:50 Calm Companion Chatbot | `chat_service.py` & `ai_service.py` |
| **Privacy & Ethics** | Non-diagnostic framing, explicit consent, minimum cohort threshold = 10 | 03:40 Institutional Privacy Boundary | `institution_service.py` |
| **Business Viability** | B2B2C college SaaS model solving counseling operational bottlenecks | 04:30 Institutional Dashboard | `InstitutionDashboardPage.tsx` |

---

## 19. One-Page Team Memorization Sheet

```
================================================================================
                    MINDTRACE TEAM QUICK REFERENCE SHEET
================================================================================
PRODUCT NAME: MindTrace (Exact casing: "MindTrace")
TAGLINE: "Student Wellbeing Companion"
PROBLEM STATEMENT: PS-03 — Burnout Prediction & Wellbeing Nudge System

MEMBER ROLES:
- Member 1: Pitch Lead (Problem, Hook, Narrative, Closing)
- Member 2: Student UX (Routine Quest, Consent)
- Member 3: Intelligence Lead (Baseline Formula, Timeline, Counterfactual WOW Moment)
- Member 4: Support Lead (Calm Companion Chatbot, Resources, Counsellor Booking)
- Member 5: Tech Lead (FastAPI, React, Supabase, Security, Privacy Threshold N>=10)
- Member 6: Business Lead (Institutional Dashboard, B2B SaaS Model)

CORE FORMULA TO REMEMBER:
Score = 0.35*(LateNight) + 0.30*(Delay) + 0.20*(Library) + 0.15*(Variance)

3 SACRED RULES OF MINDTRACE:
1. MindTrace DOES NOT diagnose burnout or mental illness.
2. MindTrace NEVER compares students against other students.
3. MindTrace NEVER exposes individual student data to college administrators.

5-MINUTE TIMELINE CHEAT SHEET:
00:00-00:30 -> Problem Hook (Member 1)
00:30-01:10 -> Onboarding / Routine Quest (Member 2)
01:10-02:00 -> Dashboard & Pattern Timeline (Member 3)
02:00-02:50 -> WOW Moment: Counterfactual Explorer (Member 3 & 4)
02:50-03:40 -> Calm Companion & Counselling (Member 4)
03:40-04:30 -> Institutional Dashboard & Privacy (Member 5 & 6)
04:30-05:00 -> Business Model & Closing (Member 6 & 1)
================================================================================
```

---

## 20. Team Rehearsal Plan (6 Practice Rounds)

1. **Round 1 (Story Understanding - No Timer)**: Walk through screens slowly to align on narrative transition phrases between members.
2. **Round 2 (7-Minute Trim)**: Deliver presentation with timer running; identify and cut redundant explanations.
3. **Round 3 (Strict 5-Minute Execution)**: Execute exact timeline with click-by-click runbook.
4. **Round 4 (Interruption Practice)**: Rehearse pausing cleanly when a judge interrupts with a question, having the assigned role owner answer directly in <15 seconds.
5. **Round 5 (Technical Judge Deep-Dive)**: Practice answering database, RLS, API security, and mathematical formula questions.
6. **Round 6 (Hostile / Trap Question Defense)**: Practice defending against "Isn't this just a chatbot?" and "Is this scientifically proven?" traps.
