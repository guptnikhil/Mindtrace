# MindTrace — Comprehensive Feature Specification

**Project**: MindTrace — Student Wellbeing Companion  
**Problem Statement PS-03**: Burnout Prediction & Wellbeing Nudge System for Engineering Students  
**Architecture**: React (Vite + TypeScript + Tailwind CSS) + FastAPI (Python 3.14 + SQLAlchemy) + SQLite Database  
**Live Deployments**:
- Frontend: [mindtrace-app-rho.vercel.app](https://mindtrace-app-rho.vercel.app/)
- Backend: [mindtrace-jxh0.onrender.com](https://mindtrace-jxh0.onrender.com)
- WhatsApp Support Number: `+91 99199 63335`

---

## 📋 Table of Contents
1. [Core Design Philosophy & Privacy Principles](#1-core-design-philosophy--privacy-principles)
2. [End-to-End Technology Stack](#2-end-to-end-technology-stack)
3. [Student-Facing Features](#3-student-facing-features)
   - [3.1 Front Landing Page & Dark Mode](#31-front-landing-page--dark-mode)
   - [3.2 Routine Quest (Gamified Baseline Onboarding)](#32-routine-quest-gamified-baseline-onboarding)
   - [3.3 Student Consent & Data Permissions](#33-student-consent--data-permissions)
   - [3.4 Student Wellbeing Dashboard](#34-student-wellbeing-dashboard)
   - [3.5 Daily Micro-Check-in](#35-daily-micro-check-in)
   - [3.6 Check-in & Behavioral History](#36-check-in--behavioral-history)
   - [3.7 Routine Pattern Timeline](#37-routine-pattern-timeline)
   - [3.8 Counterfactual Explorer ("What-If" Sensitivity Simulator)](#38-counterfactual-explorer-what-if-sensitivity-simulator)
   - [3.9 Routine Deviation Indicator Engine](#39-routine-deviation-indicator-engine)
   - [3.10 Contextual Wellbeing Micro-Nudges](#310-contextual-wellbeing-micro-nudges)
   - [3.11 Interactive Wellness Resources Hub](#311-interactive-wellness-resources-hub)
   - [3.12 Human Support Directory & Crisis Safe-Net](#312-human-support-directory--crisis-safe-net)
   - [3.13 Counsellor Connect & WhatsApp Deep-Link Handoff](#313-counsellor-connect--whatsapp-deep-link-handoff)
   - [3.14 Calm Companion (Gemini AI Conversational Listener)](#314-calm-companion-gemini-ai-conversational-listener)
   - [3.15 Settings & Student Data Governance](#315-settings--student-data-governance)
4. [Institutional & Campus Administration Features](#4-institutional--campus-administration-features)
   - [4.1 Institutional Analytics Overview](#41-institutional-analytics-overview)
   - [4.2 Cohort & Departmental Trend Analysis](#42-cohort--departmental-trend-analysis)
   - [4.3 Differential Privacy & Aggregation Boundary](#43-differential-privacy--aggregation-boundary)
   - [4.4 Admin Access & Counselor Authentication](#44-admin-access--counselor-authentication)
5. [Deterministic Demo & Hackathon Evaluator Tools](#5-deterministic-demo--hackathon-evaluator-tools)
   - [5.1 Centralized Deterministic Dataset (Student Riya)](#51-centralized-deterministic-dataset-student-riya)
   - [5.2 Live Scenario Switcher](#52-live-scenario-switcher)
   - [5.3 One-Click Instant Reset (<1s)](#53-one-click-instant-reset-1s)

---

## 1. Core Design Philosophy & Privacy Principles

MindTrace was engineered around a core tenet: **Engineering students resist clinical labeling and surveillance.** Traditional campus mental health systems fail because they are reactive—intervening only after severe distress or academic failure.

* **Non-Clinical & Non-Diagnostic**: MindTrace never diagnoses clinical depression, anxiety, or mental illness. Instead, it tracks personal **routine drift**—observable shifts in sleep hours, assignment submission timing, campus activity, and schedule consistency.
* **Explainable vs. Black-Box**: Avoids opaque neural network scores. Uses a deterministic, weighted baseline deviation formula that students can inspect, understand, and simulate.
* **Student-Controlled Privacy**: No personal behavioural signals or check-in notes are ever shared automatically with faculty, counselors, or parents without explicit student initiation.
* **Supportive & Judgment-Free AI**: Conversational AI is strictly framed as an empathetic, reflective listener—prohibited from giving unsolicited life advice or diagnoses.

---

## 2. End-to-End Technology Stack

| Layer | Technologies & Libraries | Key Responsibilities |
| :--- | :--- | :--- |
| **Frontend Framework** | React 18, Vite, TypeScript | High-performance Single Page Application (SPA) with hot-module reloading and type safety. |
| **Styling & Design System** | Tailwind CSS, Lucide React, Glassmorphism UI | Responsive UI supporting dynamic Dark and Light theme switching with curated color palettes. |
| **Backend API** | FastAPI (Python 3.14), Uvicorn, Pydantic v2 | High-concurrency RESTful API endpoints for check-ins, signals, indicators, nudges, and counselling. |
| **Database & ORM** | SQLite, SQLAlchemy 2.0 | Zero-dependency local persistence storing students, signals, baselines, check-ins, counsellors, and appointments. |
| **AI / LLM Integration** | Google GenAI SDK (`google-genai`), `gemini-2.5-flash` | Server-side Gemini API integration for Calm Companion conversational chat with crisis safety guardrails. |
| **Edge Routing & Proxy** | Vercel Serverless Edge Rewrites (`vercel.json`) | Same-origin edge proxy (`/api/*` → Render backend) eliminating CORS preflight overhead and cross-site cookie issues. |
| **External Communications** | WhatsApp Deep Link Protocol (`wa.me/919919963335`), Jitsi Meet | Privacy-preserving appointment coordination without exposing student risk indicators to third parties. |

---

## 3. Student-Facing Features

### 3.1 Front Landing Page & Dark Mode
* **Location**: [`frontend/src/pages/WelcomePage.tsx`](file:///Users/nikhilgupt/Downloads/wellbeing-companion-prototype/frontend/src/pages/WelcomePage.tsx)
* **Features**:
  * **Brand Introduction**: Highlights the mission of proactive, non-diagnostic student wellbeing.
  * **Dark / Light Mode Switching**: Header-mounted Sun/Moon toggle button with theme persistence via `ThemeContext` and `localStorage`.
  * **Interactive Routine Preview Chart**: SVG-rendered dynamic curve illustrating baseline routine stability vs. stress drift.
  * **Privacy Guarantee Highlights**: Clear, upfront commitment to zero surveillance, no clinical labeling, and private data ownership.
  * **Smart Navigation**:
    * New Visitors: Direct 1-click CTA to **"Get Started"** (Routine Quest Onboarding).
    * Returning Students: Automatically detects existing sessions and provides a prominent **"Go to Dashboard"** shortcut.
    * Evaluators: Direct link to view the **Institutional Portal**.

---

### 3.2 Routine Quest (Gamified Baseline Onboarding)
* **Location**: [`frontend/src/pages/OnboardingPage.tsx`](file:///Users/nikhilgupt/Downloads/wellbeing-companion-prototype/frontend/src/pages/OnboardingPage.tsx)
* **Features**:
  * **4-Step Interactive Discovery Flow**: Gamified setup ("Discover your normal") that avoids the feel of an intake form:
    1. *Sleep Rhythms*: Bedtime and wake-up target windows.
    2. *Study Patterns*: Typical daily focused study blocks and assignment habits.
    3. *Campus Activity*: Library visits, lab schedules, and peer interactions.
    4. *Personal Rhythms*: Weekend schedule variance and academic workload preferences.
  * **Persona Pre-fills**: Evaluator quick-fill button for demo student **Riya Sharma** (3rd Year CSE).
  * **Tone Customization**: Student selects preferred companion tone (`gentle`, `balanced`, `direct`).

---

### 3.3 Student Consent & Data Permissions
* **Location**: [`frontend/src/pages/ConsentPage.tsx`](file:///Users/nikhilgupt/Downloads/wellbeing-companion-prototype/frontend/src/pages/ConsentPage.tsx)
* **Features**:
  * **Granular Opt-in Toggles**:
    * Passive behavioural signal monitoring (late-night activity, submission timestamps).
    * Contextual wellbeing micro-nudges.
    * Voluntary counsellor coordination.
  * **Complete Transparency**: Clear explanations of what data is collected, how baseline calculations work, and what is *never* collected (no screen recording, no keystrokes, no camera tracking).
  * **Revocable Permissions**: Permissions can be altered or completely revoked at any time from Settings.

---

### 3.4 Student Wellbeing Dashboard
* **Location**: [`frontend/src/pages/DashboardPage.tsx`](file:///Users/nikhilgupt/Downloads/wellbeing-companion-prototype/frontend/src/pages/DashboardPage.tsx)
* **Features**:
  * **Deterministic Scenario Controller**: Embedded header toolbar allowing judges to switch between `Baseline`, `Early Drift`, and `Current Shift` scenarios.
  * **Summary Wellbeing Cards**: Instant glance at rolling average metrics:
    * Mood Score (1.0 – 5.0)
    * Stress Level (1.0 – 5.0)
    * Sleep Hours per night
    * Academic Load Index
  * **My Support Sessions**: Displays scheduled counselling appointments with direct actions:
    * **Join Session**: Opens automated Jitsi Meet video room.
    * **Continue on WhatsApp**: Opens non-diagnostic coordination chat with `+91 99199 63335`.
    * **Reschedule / Cancel**: Modifies appointment with live slot availability checking.
  * **Quick Launchers**: Fast access to Daily Check-in, Calm Companion AI Chat, and Wellness Resources.

---

### 3.5 Daily Micro-Check-in
* **Location**: [`frontend/src/pages/CheckinPage.tsx`](file:///Users/nikhilgupt/Downloads/wellbeing-companion-prototype/frontend/src/pages/CheckinPage.tsx)
* **Features**:
  * **30-Second Lightweight Check-in**: Eliminates user fatigue with simple interactive sliders:
    * Current Mood (1: Very Low to 5: Energized)
    * Stress Level (1: Relaxed to 5: Overwhelmed)
    * Sleep Duration (hours)
    * Academic Pressure (1: Manageable to 5: High)
  * **Private Journal / Reflection Box**: Optional freeform text area for personal notes (kept strictly private on device).
  * **Instant Validation & Feedback**: Provides immediate gentle confirmation and updates student rolling trend models.

---

### 3.6 Check-in & Behavioral History
* **Location**: [`frontend/src/pages/HistoryPage.tsx`](file:///Users/nikhilgupt/Downloads/wellbeing-companion-prototype/frontend/src/pages/HistoryPage.tsx)
* **Features**:
  * **Longitudinal Trajectory Visualization**: Visual charts tracking mood, stress, and sleep trends across 7-day, 14-day, and 30-day windows.
  * **Chronological Check-in Log**: Searchable and filterable history of past self-reports.
  * **Pattern Recognition**: Highlights days with correlated stress peaks and sleep deficits to encourage self-reflection.

---

### 3.7 Routine Pattern Timeline
* **Location**: [`frontend/src/components/dashboard/PatternTimeline.tsx`](file:///Users/nikhilgupt/Downloads/wellbeing-companion-prototype/frontend/src/components/dashboard/PatternTimeline.tsx)
* **Features**:
  * **21-Day Behavioral Progression**: Derived strictly from signal history across 3 distinct phases:
    * *Week 1 (Baseline Normal)*: Consistent sleep (7.5h), steady library visits, on-time submissions.
    * *Week 2 (Early Behavioral Drift)*: Late-night activity increases by 35%, library visits drop from 4 to 2.
    * *Week 3/4 (Current Shift)*: Assignment delays average 3.5h, sleep variance increases, indicator elevated.
  * **Visual Milestones**: Interactive chronological cards showing exact dates and signal values, proving the model detects drift before acute burnout.

---

### 3.8 Counterfactual Explorer ("What-If" Sensitivity Simulator)
* **Location**: [`frontend/src/components/dashboard/CounterfactualExplorer.tsx`](file:///Users/nikhilgupt/Downloads/wellbeing-companion-prototype/frontend/src/components/dashboard/CounterfactualExplorer.tsx)
* **Features**:
  * **Interactive Model Sensitivity Sandbox**:
    * 4 Live Interactive Sliders:
      1. Late-Night Activity (minutes past midnight)
      2. Assignment Submission Delay (hours past deadline)
      3. Campus Library Visits (visits per week)
      4. Schedule Variance (hours deviation between weekdays and weekends)
  * **Real-Time Recalculation**: Adjusting any slider immediately updates the simulated indicator score and status badge (`Stable`, `Moderate Drift`, `High Drift`).
  * **Actionable Empowerment**: Proves to the student that small behavioral tweaks (e.g. going to bed 45 minutes earlier) directly stabilize their routine score.
  * **Non-Diagnostic Disclaimer**: Explicit UI clarification that this is a mathematical sensitivity exploration tool, not a clinical risk assessment.

---

### 3.9 Routine Deviation Indicator Engine
* **Location**: [`backend/app/services/indicator_service.py`](file:///Users/nikhilgupt/Downloads/wellbeing-companion-prototype/backend/app/services/indicator_service.py)
* **Mathematical Specification**:
  $$\text{Indicator Score} = 0.35 \times \Delta_{\text{late}} + 0.30 \times \Delta_{\text{delay}} + 0.20 \times \Delta_{\text{library}} + 0.15 \times \Delta_{\text{variance}}$$
* **Signal Weight Rationale**:
  * $0.35$ — Late-night screen activity (highest correlation with circadian rhythm disruption in students).
  * $0.30$ — Academic delay patterns (early operational indicator of cognitive fatigue and task paralysis).
  * $0.20$ — Campus presence / library check-ins (measure of academic engagement and social withdrawal).
  * $0.15$ — Daily routine variance (irregular sleep/wake schedules amplifies exhaustion).
* **State Classification**:
  * $\text{Score} < 0.35$ → `stable` (Green / Baseline)
  * $0.35 \le \text{Score} < 0.65$ → `changing` (Amber / Early Drift)
  * $\text{Score} \ge 0.65$ → `needs_attention` (Red / Significant Shift)

---

### 3.10 Contextual Wellbeing Micro-Nudges
* **Location**: [`frontend/src/pages/NudgesPage.tsx`](file:///Users/nikhilgupt/Downloads/wellbeing-companion-prototype/frontend/src/pages/NudgesPage.tsx) & [`backend/app/services/nudge_service.py`](file:///Users/nikhilgupt/Downloads/wellbeing-companion-prototype/backend/app/services/nudge_service.py)
* **Features**:
  * **Proactive Micro-Interventions**: Non-alarmist, practical behavioral suggestions based on specific detected shifts:
    * *Sleep Drift Detected*: "Your schedule has shifted later this week. Try a 15-minute wind-down without screens tonight."
    * *High Academic Pressure*: "You have 3 deadlines approaching. Breaking task #1 into a 25-minute Pomodoro block could help regain momentum."
    * *Low Campus Engagement*: "A 20-minute walk through the campus quad or library could offer a fresh mental reset."
  * **Interactive Feedback Loop**: Students can mark nudges as "Helpful", "Not for me", or "Dismiss", helping calibrate future suggestions.

---

### 3.11 Interactive Wellness Resources Hub
* **Location**: [`frontend/src/pages/ResourcesPage.tsx`](file:///Users/nikhilgupt/Downloads/wellbeing-companion-prototype/frontend/src/pages/ResourcesPage.tsx)
* **Features**:
  * **Intent-Driven Category Navigation**:
    * "Calm Down Now" (Quick acute stress de-escalation)
    * "Focus & Study" (Pomodoro and deep-work methods)
    * "Improve Sleep" (Sleep hygiene protocols for engineering students)
    * "Social Connection" (Overcoming imposter syndrome and academic isolation)
  * **Embedded Interactive Modals**:
    * **Breathing Visualizer (`BreathingModal.tsx`)**: Fullscreen animated visual guide supporting 4-7-8 Relaxation Breathing and Box Breathing (4-4-4-4) with second counters and tactile cues.
    * **Ambient Audio Generator (`AudioPlayerModal.tsx`)**: Embedded soothing soundscapes (Binaural Beats, Rain on Tent, White Noise, Gentle Stream) with playback controls.
    * **Article Reader (`ArticleReaderModal.tsx`)**: In-app reader presenting evidence-based guides written specifically for STEM students.

---

### 3.12 Human Support Directory & Crisis Safe-Net
* **Location**: [`frontend/src/pages/SupportPage.tsx`](file:///Users/nikhilgupt/Downloads/wellbeing-companion-prototype/frontend/src/pages/SupportPage.tsx)
* **Features**:
  * **Tiered Human Support Options**:
    * Talk to a Campus Counselor (Routes directly to Counsellor Connect).
    * Peer Support Communities (Information on student-led circles).
    * Campus Wellbeing Department (Directory of college mental health infrastructure).
  * **Crisis Intervention Safe-Net**: Visible on support flows and Calm Companion chat:
    * **Tele-MANAS** (National Mental Health Helpline of India): `14416` or `1800-891-4416` (24/7 toll-free).
    * **AASRA Suicide Prevention Helpline**: `+91-9820466726` (24/7 volunteer crisis support).
    * **Emergency Call Services**: `112`.

---

### 3.13 Counsellor Connect & WhatsApp Deep-Link Handoff
* **Location**: [`frontend/src/components/counselling/CounsellorConnectPage.tsx`](file:///Users/nikhilgupt/Downloads/wellbeing-companion-prototype/frontend/src/components/counselling/CounsellorConnectPage.tsx) & [`backend/app/services/whatsapp_service.py`](file:///Users/nikhilgupt/Downloads/wellbeing-companion-prototype/backend/app/services/whatsapp_service.py)
* **Features**:
  * **Verified College Counsellor Directory**: Profiles for certified staff (e.g. Dr. Mehta — Wellbeing Lead, Dr. Sharma — Senior Student Counsellor).
  * **15-Minute Slot Reservation**: Conflict-checked time slot booking with double-booking prevention.
  * **Automated Video Meeting**: Generates secure Jitsi Meet link (`https://meet.jit.si/mindtrace-wellbeing-support-session`) for remote sessions.
  * **Direct WhatsApp Coordination (`wa.me`)**:
    * Automatically formats a clean, non-diagnostic pre-filled appointment confirmation to `+91 99199 63335`:
      ```
      Hi, I requested a counselling session through MindTrace.

      Counsellor: Dr. Sharma
      Date: 2026-09-23
      Time: 16:00

      I'd like to confirm my session.
      ```
    * **Strict Privacy Rule**: Never includes risk scores, check-in reflections, or behavioral signals in the WhatsApp payload.

---

### 3.14 Calm Companion (Gemini AI Conversational Listener)
* **Location**: [`frontend/src/components/chat/CalmCompanionChat.tsx`](file:///Users/nikhilgupt/Downloads/wellbeing-companion-prototype/frontend/src/components/chat/CalmCompanionChat.tsx) & [`backend/app/services/chat_service.py`](file:///Users/nikhilgupt/Downloads/wellbeing-companion-prototype/backend/app/services/chat_service.py)
* **Features**:
  * **Powered by Google GenAI**: Uses `gemini-2.5-flash` model with backend-only key isolation.
  * **Empathetic System Prompting (`CALM_COMPANION_SYSTEM_PROMPT`)**:
    * Listens actively and reflects feelings without judgment.
    * Strictly prohibited from providing medical, psychological, or clinical diagnoses.
    * Avoids toxic positivity or unsolicited productivity hacks.
  * **Crisis Safety Filter**: Immediate regex keyword interceptor for self-harm or acute emergency queries, instantly providing Tele-MANAS (`14416`) and AASRA (`+91-9820466726`) contact details.
  * **Graceful Local Fallback**: If internet connectivity is interrupted or API quotas are exhausted, seamlessly provides warm offline conversational responses.

---

### 3.15 Settings & Student Data Governance
* **Location**: [`frontend/src/pages/SettingsPage.tsx`](file:///Users/nikhilgupt/Downloads/wellbeing-companion-prototype/frontend/src/pages/SettingsPage.tsx)
* **Features**:
  * **Notification & Nudge Cadence**: Customize daily nudge delivery preferences (morning, evening, or silent).
  * **Data Export**: Allows students to view or export their logged check-in history.
  * **Clear Local Data & Session Reset**: Single-click button to flush cached student tokens and reset local storage.

---

## 4. Institutional & Campus Administration Features

### 4.1 Institutional Analytics Overview
* **Location**: [`frontend/src/pages/InstitutionDashboardPage.tsx`](file:///Users/nikhilgupt/Downloads/wellbeing-companion-prototype/frontend/src/pages/InstitutionDashboardPage.tsx)
* **Features**:
  * **High-Level Campus Adoption Funnel**:
    * Total enrolled students vs. active MindTrace users.
    * Weekly check-in completion rate.
    * Aggregate support session and WhatsApp handoff requests.
  * **Program-Level Status Distribution**:
    * Percentage of campus cohort in `Stable`, `Early Drift`, and `Needs Attention` routine states.
  * **Intervention Utilization Rate**: Statistics on how many students utilized breathing exercises, resources, and counselling bookings.

---

### 4.2 Cohort & Departmental Trend Analysis
* **Location**: [`backend/app/services/institution_service.py`](file:///Users/nikhilgupt/Downloads/wellbeing-companion-prototype/backend/app/services/institution_service.py)
* **Features**:
  * **Departmental Filtering**: Filter aggregate routine drift metrics by branch:
    * Computer Science & Engineering (CSE)
    * Electronics & Communication (ECE)
    * Mechanical Engineering (ME)
    * Civil Engineering (CE)
  * **Year of Study Breakdown**: Compare 1st year (freshman transition stress) vs. 3rd year (internship/lab pressure) vs. 4th year (placement/thesis load).
  * **Strategic Resource Allocation**: Helps university administrators deploy wellness counselors to specific departments during peak project weeks.

---

### 4.3 Differential Privacy & Aggregation Boundary
* **Server-Side Enforcement**: `MIN_AGGREGATION_THRESHOLD = 10`
* **Features**:
  * **Anti-Identification Safeguard**: If any filtered department/year cohort contains fewer than 10 students, the backend refuses to return granular metrics.
  * **No Individual Inspection**: The institutional portal has zero access to individual student names, IDs, check-in journals, or individual indicator scores.

---

### 4.4 Admin Access & Counselor Authentication
* **Location**: [`frontend/src/pages/InstitutionLoginPage.tsx`](file:///Users/nikhilgupt/Downloads/wellbeing-companion-prototype/frontend/src/pages/InstitutionLoginPage.tsx)
* **Features**:
  * **Secure Administrative Gateway**: Authenticated entry for campus counselors and department deans.
  * **Demo Access Credentials**: Preset evaluator credentials for seamless hackathon testing.

---

## 5. Deterministic Demo & Hackathon Evaluator Tools

### 5.1 Centralized Deterministic Dataset (Student Riya)
* **Location**: [`backend/app/api/v1/demo.py`](file:///Users/nikhilgupt/Downloads/wellbeing-companion-prototype/backend/app/api/v1/demo.py) & [`frontend/src/data/demoData.ts`](file:///Users/nikhilgupt/Downloads/wellbeing-companion-prototype/frontend/src/data/demoData.ts)
* **Persona**: **Riya Sharma** (3rd Year Computer Science & Engineering, IIT Delhi scenario).
* **Dataset Characteristics**:
  * 21 consecutive days of fixed, realistic behavioral signals (no `random.uniform()` or volatile RNG).
  * Day -20 to Day -10: Baseline stability (late-night: 32–40 min, delays: 1.0–1.4h, library: 3.2–3.8 visits/wk).
  * Day -9 to Day 0: Demonstrates progressive drift depending on selected scenario.

---

### 5.2 Live Scenario Switcher
* **Toolbar Location**: Top of Student Dashboard & Demo Controls Modal (`DemoControlsModal.tsx`).
* **Scenarios**:
  1. **Baseline (`stable`)**: Perfect routine stability, normal sleep, zero backlog, indicator score $< 0.35$.
  2. **Early Drift (`changing`)**: Moderate shift, late-night activity rising to 60+ min, library visits dipping, indicator score $\approx 0.52$.
  3. **Current Shift (`needs_attention`)**: Acute academic crunch, late nights $\ge 100$ min, assignment delays $\ge 6.5$h, indicator score $\ge 0.78$.

---

### 5.3 One-Click Instant Reset (<1s)
* **Endpoints**: `POST /api/demo/reset` & `POST /api/demo/seed?state=changing`
* **Features**:
  * Instantly restores the standard prototype state within 800 milliseconds.
  * Clears counterfactual slider overrides and re-seeds the deterministic dataset without requiring server restarts or database re-creations.
