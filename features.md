# 🧠 MindTrace — Complete Feature Documentation

> **MindTrace** is a passive early-warning wellbeing companion for engineering students.  
> It tracks routine signals, detects drift before it becomes a crisis, and gives students private, judgment-free support.

---

## Table of Contents

1. [Onboarding & Consent](#1-onboarding--consent)
2. [Daily Check-In](#2-daily-check-in)
3. [Wellbeing Assessment & Risk Scoring](#3-wellbeing-assessment--risk-scoring)
4. [Student Dashboard](#4-student-dashboard)
5. [Pattern Timeline & Trend Analysis](#5-pattern-timeline--trend-analysis)
6. [Counterfactual Explorer (What-If Simulator)](#6-counterfactual-explorer-what-if-simulator)
7. [Calm Companion](#7-calm-companion)
8. [Wellness Resources Library](#8-wellness-resources-library)
9. [Wellbeing Nudges & Recommendations](#9-wellbeing-nudges--recommendations)
10. [Settings & Privacy Controls](#10-settings--privacy-controls)
11. [Institution Admin Dashboard](#11-institution-admin-dashboard)

---

## 1. Onboarding & Consent

**Files:** `WelcomePage.tsx` → `ConsentPage.tsx` → `OnboardingPage.tsx`

### Landing Page
- Animated headline with MindTrace branding
- Two primary CTAs: **"Get Started"** and **"See Privacy Design"**
- No login required — private-by-default from the first screen

### Privacy Consent Screen
- Full plain-language privacy statement before any data is collected
- Key guarantees shown prominently:
  - No third-party data sharing
  - No university account linkage
  - All data stored locally on-device
  - Student can delete everything at any time
- Explicit consent checkbox required to proceed

### Student Onboarding Form
- Collects: student name, branch (e.g., Computer Science), year of study
- Sets communication tone preference: **Balanced**, **Direct**, or **Gentle**
- Generates a unique local `student_identifier` — no email, no password, no university ID
- Saves student profile to backend (FastAPI → SQLite) on submission

---

## 2. Daily Check-In

**File:** `CheckinPage.tsx`

### Signal Sliders (5 Dimensions)

| Signal | Scale | What it Captures |
|--------|-------|-----------------|
| Mood | 1–5 | Overall emotional state |
| Energy Level | 1–5 | Physical and mental alertness |
| Stress Level | 1–5 | Perceived pressure level |
| Sleep Hours | 3–10 hrs | Duration of last night's sleep |
| Academic Pressure | 1–5 | Workload intensity |

### Optional Free-Text Note
- Students can add a short personal note (optional, never surfaced to institutions)

### Submission Flow
1. Check-in saved to **SQLite via FastAPI**
2. Risk analysis triggered automatically (`WellbeingService.analyzeWellbeing`)
3. Student is routed to the **Assessment Result Page**
4. If backend is offline → local resilient scoring activates (no data loss)

---

## 3. Wellbeing Assessment & Risk Scoring

**File:** `AssessmentResultPage.tsx`

### Risk Score
- Computed from the 5 check-in dimensions using a weighted algorithm
- Score range: **0–100** (higher = more concern)
- Risk level assigned: **Low / Moderate / High**

### Assessment Output
- **Contributing Factors** — top 3 signals driving the score (e.g., `"Sleep duration (4.5h)"`)
- **Explanation** — plain-language sentence summarizing the pattern
- **3 Actionable Recommendations** — specific, non-clinical steps
- All phrasing is strictly supportive and non-diagnostic

### Resilient Offline Fallback
- If the backend is unreachable, the frontend calculates the score locally
- Student always receives a result — zero broken states

---

## 4. Student Dashboard

**File:** `DashboardPage.tsx`

### Greeting & Student Profile Card
- Personalized greeting with student name and branch
- Live date and session context

### Routine Pattern Index
- 14-day rolling score visualizing routine stability
- Built from check-in history: sleep, stress, energy trends
- Implemented as a trend chart (`TrendChart.tsx`)

### Active Nudge Card
- Latest wellbeing recommendation displayed prominently
- Priority badge: **Low / Medium / High**
- Category tag (e.g., sleep, academic, social)
- Tap to view full Nudges page

### Counselling Appointment Card
- Shows upcoming booked counsellor appointment (if any)
- Integrates with `AppointmentCard.tsx` + `CounsellingService`

### Demo State Switcher *(for presentations)*
- Toggle between three pre-seeded scenarios:
  - 🟢 **Stable** — healthy baseline, consistent routine
  - 🟡 **Changing** — early drift signal, sleep shifting later
  - 🔴 **Needs Attention** — consecutive high-stress, low-sleep pattern
- Instantly re-renders all dashboard components with deterministic data

### Navigation Bar
- Links to: Dashboard, Check-In, Nudges, Resources, Settings
- Calm Companion button accessible from the dashboard

---

## 5. Pattern Timeline & Trend Analysis

**Files:** `PatternTimeline.tsx`, `TrendDetailPage.tsx`, `HistoryPage.tsx`

### Pattern Timeline (Dashboard Widget)
- Weekly bar chart visualization of routine signals
- Per-week breakdown: sleep trend, stress trend, academic pressure
- Color-coded: green (stable), amber (changing), red (needs attention)
- Clickable bars for detailed view

### Check-In History Page
- Full chronological log of all past check-ins
- Each entry shows: date, mood, sleep, stress, energy, academic pressure
- Optional note shown inline (if provided)

### Trend Detail Page
- Deep-dive into a single metric over time (e.g., sleep trend for past 14 days)
- Line chart with daily data points
- Shows 7-day rolling average alongside raw values

---

## 6. Counterfactual Explorer (What-If Simulator)

**File:** `CounterfactualExplorer.tsx`

### Purpose
Lets students (or demo viewers) interactively simulate how changing a behavior would affect their routine pattern score.

### Interactive Sliders

| Variable | What it Simulates |
|----------|------------------|
| Late-night minutes | Time spent on screen/studying after midnight |
| Assignment delay (hours) | How far behind on deadlines |
| Library check-ins per day | Active engagement / structured study |
| Routine variance | Day-to-day consistency of schedule |

### Live Score Recalculation
- As sliders move, the system recalculates a **simulated pattern score** vs the **baseline score**
- Shows the delta: *"If you reduce late-night usage by 30 min, your score improves by 12 points"*
- Reset button restores sliders to current real-signal defaults
- Syncs automatically when Demo State changes

---

## 7. Calm Companion

**Files:** `CalmCompanionChat.tsx`, `AudioPlayerModal.tsx`, `BreathingModal.tsx`

### Calm Companion Chat
- Floating chat panel accessible from the dashboard
- AI-powered, non-directive conversation companion
- Opening message: *"Hey. I'm here with you. You don't have to figure anything out right now."*
- **Safety state detection** — if crisis signals are detected in messages, a counsellor prompt appears
- No clinical language, no diagnoses, no advice-pushing
- Powered by backend `ChatService` (FastAPI route + `chat_service.py`)

### Ambient Audio Player
- Synthesized ambient soundscapes using **Web Audio API** (no external assets, no CORS issues)
- Available sounds: Nature tones, Rain, Focus hum, White noise
- Play / Pause / Volume controls
- Accessible from the Resources page (Audio category)

### Guided Breathing Exercise
- 4-7-8 breathing pattern (or box breathing)
- Animated breathing circle with inhale / hold / exhale timing
- Session duration: 2–5 minutes
- Accessible from the Resources page (Breathing category)

---

## 8. Wellness Resources Library

**Files:** `ResourcesPage.tsx`, `ArticleReaderModal.tsx`

### Intent-Based Navigation
Four quick-select intents to filter relevant resources:

| Intent | Use Case |
|--------|----------|
| 😮‍💨 Calm down | High stress / anxiety relief |
| 🧠 Clear my mind | Mental fog, overwhelm, decision fatigue |
| 😴 Wind down | Pre-sleep relaxation, screen-off routine |
| 🎯 Focus | Study sessions, flow state, attention |

### Resource Categories
- **Breathing** — Guided breathing exercises (opens `BreathingModal`)
- **Audio** — Ambient soundscapes (opens `AudioPlayerModal`)
- **Articles** — Curated wellbeing articles (opens `ArticleReaderModal`)

### Search & Filter
- Full-text search across resource titles and descriptions
- Category filter tabs: All / Breathing / Audio / Articles

### College Counsellor CTA
- Dedicated section linking to the institution's counselling service
- WhatsApp-based booking link for counsellor appointment
- Non-intrusive — always positioned below self-help resources

---

## 9. Wellbeing Nudges & Recommendations

**Files:** `NudgesPage.tsx`, `NudgeCard.tsx`

### What are Nudges?
Auto-generated contextual recommendations based on recent check-in patterns.

Examples:
- *"Your sleep window has shifted ~1.5 hours later. Try a 15-minute screen-free wind-down."*
- *"Multiple consecutive late-night study blocks detected. Breaking tasks into 20-minute intervals can help."*

### Nudge Properties
- **Category**: sleep / academic / social / physical
- **Priority**: Low / Medium / High
- **Date generated**
- **Action CTA**: "Take action →" links to Reset / Resources flow

### Generate on Demand
- "Refresh Recommendation" button triggers backend to produce a fresh nudge
- Falls back to existing nudge list if generation fails

---

## 10. Settings & Privacy Controls

**File:** `SettingsPage.tsx`

### Communication Tone
Choose how the system addresses you:
- **Balanced** — neutral, factual
- **Direct** — concise, action-first
- **Gentle** — warm, supportive

### Nudge Frequency
- **On routine shift** — only when patterns change
- **Daily** — every day after check-in
- **Weekly summary** — once a week

### Check-In Reminder Time
- Morning / Afternoon / Evening

### Privacy Guarantees Panel
- Clearly lists what data is and isn't stored, shared, or visible to faculty
- Explains local-first storage architecture

### Data Deletion
- **"Reset local session"** — clears all on-device data, returns to Welcome screen
- Requires confirmation dialog — no accidental deletion

---

## 11. Institution Admin Dashboard

**Files:** `InstitutionDashboardPage.tsx`, `InstitutionLoginPage.tsx`, `AnalyticsPage.tsx`

> Access: College admin login (separate from student flow)

### Overview Tab
- Total enrolled students
- Total check-ins logged (system-wide)
- High-risk student count
- Active counselling sessions

### Adoption Funnel Tab
Shows the student journey funnel:
`Aware → Consented → First Check-in → 7-day Active → 30-day Retained`

### Cohort Breakdown Tab
- Filter by year (1st / 2nd / 3rd / 4th year)
- Per-cohort risk distribution
- Branch-wise engagement rates

### Support Analytics Tab
- Counselling appointment volume over time
- Nudge engagement rates
- Resource access frequency

### Engagement Metrics Tab
- Daily Active Users (DAU)
- Check-in streak data
- Calm Companion session counts

### Reports Tab
- Downloadable institutional wellbeing summary report
- All data is **aggregated and anonymised** — no individual student is identifiable
- Designed for welfare committee reviews

### Role-Based Access
- `COLLEGE_ADMIN` — full dashboard access
- `COUNSELLOR` — support analytics + appointment view only

---

## Architecture at a Glance

| Layer | Technology |
|-------|-----------|
| Frontend | React + TypeScript + Vite |
| Styling | Vanilla CSS + Tailwind utility tokens |
| State | React `useState` + `localStorage` SWR caching |
| Backend API | FastAPI (Python) |
| Database | SQLite via SQLAlchemy ORM |
| Audio | Web Audio API (synthesized, no external files) |
| Routing | Hash-based (`window.location.hash`) for persistence |
| Deployment | Vercel (frontend) + Railway (backend) |

---

*Last updated: September 2026 · MindTrace v1 Prototype*
