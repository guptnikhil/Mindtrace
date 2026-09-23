import type { ResourceItem } from '../types/wellbeing';

export const WELLNESS_RESOURCES: ResourceItem[] = [
  // --- Quick Actions ---
  {
    id: 'qa_quick_breathing',
    title: 'Quick Breathing',
    category: 'quick_action',
    description: '3-minute reset when you feel overwhelmed.',
    duration: '3 min',
    badge: 'Quick Reset',
    type: 'breathing',
    intentTags: ['calm', 'clear_mind'],
    isFeatured: true,
    breathingPattern: {
      phases: [
        { name: 'INHALE', durationSeconds: 4 },
        { name: 'HOLD', durationSeconds: 4 },
        { name: 'EXHALE', durationSeconds: 4 },
      ],
      cycles: 5,
    },
  },
  {
    id: 'qa_daily_meditation',
    title: 'Daily Meditation',
    category: 'quick_action',
    description: 'A short mindful pause between study sessions.',
    duration: '5 min',
    badge: 'Daily',
    type: 'audio',
    intentTags: ['clear_mind', 'calm'],
  },
  {
    id: 'qa_calming_sounds',
    title: 'Calming Sounds',
    category: 'quick_action',
    description: 'Gentle ambient sounds for a mental break.',
    duration: '30 min',
    badge: 'Ambient',
    type: 'audio',
    intentTags: ['calm', 'sleep'],
  },
  {
    id: 'qa_wellness_guide',
    title: 'Wellness Guide',
    category: 'quick_action',
    description: 'Practical guides for student wellbeing.',
    duration: '4 min read',
    badge: 'Guide',
    type: 'article',
    intentTags: ['support', 'focus'],
    content: {
      readingTime: '4 min read',
      sections: [
        {
          heading: '1. Notice the Pressure Early',
          body: 'Pay attention when deadlines start piling up. Recognizing strain early gives you space to respond intentionally rather than react under stress.',
        },
        {
          heading: '2. Break Tasks Into Small Steps',
          body: 'Large assignments feel intimidating. Breaking projects into 20-minute action blocks reduces mental friction and builds steady momentum.',
        },
        {
          heading: '3. Protect Recovery Time',
          body: 'Continuous studying without rest leads to diminishing returns. Scheduling short, non-academic breaks helps recharge focus.',
        },
      ],
      keyTakeaways: [
        'Recognize routine changes early.',
        'Break heavy tasks into smaller 20-minute chunks.',
        'Rest is a necessary part of academic performance.',
      ],
    },
  },

  // --- Breathing Exercises ---
  {
    id: 'br_478',
    title: '4-7-8 Breathing',
    category: 'breathing',
    description: 'Slow, structured breathing for a short pause.',
    duration: '5 min',
    badge: 'Recommended',
    type: 'breathing',
    intentTags: ['calm', 'clear_mind', 'sleep'],
    isFeatured: true,
    breathingPattern: {
      phases: [
        { name: 'INHALE', durationSeconds: 4 },
        { name: 'HOLD', durationSeconds: 7 },
        { name: 'EXHALE', durationSeconds: 8 },
      ],
      cycles: 6,
    },
  },
  {
    id: 'br_box',
    title: 'Box Breathing',
    category: 'breathing',
    description: 'A structured breathing exercise for stressful moments.',
    duration: '10 min',
    badge: 'New',
    type: 'breathing',
    intentTags: ['calm', 'focus'],
    breathingPattern: {
      phases: [
        { name: 'INHALE', durationSeconds: 4 },
        { name: 'HOLD', durationSeconds: 4 },
        { name: 'EXHALE', durationSeconds: 4 },
        { name: 'HOLD', durationSeconds: 4 },
      ],
      cycles: 8,
    },
  },
  {
    id: 'br_sleep',
    title: 'Deep Breathing for Sleep',
    category: 'breathing',
    description: 'A slower breathing exercise for winding down.',
    duration: '15 min',
    badge: 'Popular',
    type: 'breathing',
    intentTags: ['sleep', 'calm'],
    breathingPattern: {
      phases: [
        { name: 'INHALE', durationSeconds: 4 },
        { name: 'HOLD', durationSeconds: 2 },
        { name: 'EXHALE', durationSeconds: 6 },
      ],
      cycles: 10,
    },
  },

  // --- Meditation & Mindfulness ---
  {
    id: 'med_mindful_reset',
    title: 'Mindful Reset',
    category: 'meditation',
    description: 'A guided pause between study sessions.',
    duration: '5 min',
    badge: 'Featured',
    type: 'audio',
    intentTags: ['clear_mind', 'calm', 'focus'],
  },
  {
    id: 'med_body_scan',
    title: 'Body Scan',
    category: 'meditation',
    description: 'Bring attention gradually to different parts of the body.',
    duration: '12 min',
    badge: 'Recommended',
    type: 'audio',
    intentTags: ['calm', 'sleep'],
  },
  {
    id: 'med_presleep',
    title: 'Pre-Sleep Mindfulness',
    category: 'meditation',
    description: 'A quiet exercise for winding down before sleep.',
    duration: '10 min',
    badge: 'Daily',
    type: 'audio',
    intentTags: ['sleep', 'calm'],
  },

  // --- Educational Resources ---
  {
    id: 'edu_academic_pressure',
    title: 'Managing Academic Pressure',
    category: 'education',
    description: 'Practical strategies for navigating demanding academic periods.',
    duration: '4 min read',
    badge: 'Essential',
    type: 'article',
    intentTags: ['support', 'focus', 'clear_mind'],
    content: {
      readingTime: '4 min read',
      sections: [
        {
          heading: '1. Notice the Pressure',
          body: 'Academic pressure often builds up silently during exam or project periods. Acknowledge when you feel overloaded.',
        },
        {
          heading: '2. Break Large Tasks Into Smaller Actions',
          body: 'Avoid trying to tackle an entire syllabus in one sitting. Divide your work into manageable tasks.',
        },
        {
          heading: '3. Protect Recovery Time',
          body: 'Stepping away from screens and textbooks for 15 minutes restores mental energy and clarity.',
        },
        {
          heading: '4. Avoid All-or-Nothing Study Schedules',
          body: 'Consistency matters more than marathon study sessions. Regular, short study blocks yield better retention.',
        },
        {
          heading: '5. Know When to Ask for Support',
          body: 'Reaching out to peers, mentors, or campus counsellors is a healthy way to manage heavy academic periods.',
        },
      ],
      keyTakeaways: [
        'Academic pressure is manageable with structured pacing.',
        'Short study blocks prevent exhaustion.',
        'Reaching out for guidance is a strength.',
      ],
    },
  },
  {
    id: 'edu_healthy_routine',
    title: 'Building a Healthy Study Routine',
    category: 'education',
    description: 'Simple principles for balancing study and recovery.',
    duration: '5 min read',
    badge: 'New',
    type: 'article',
    intentTags: ['focus', 'clear_mind'],
    content: {
      readingTime: '5 min read',
      sections: [
        {
          heading: '1. Align With Your Peak Energy',
          body: 'Identify when your focus is naturally highest during the day and schedule complex problem solving then.',
        },
        {
          heading: '2. Build Transition Rituals',
          body: 'Use a 5-minute wind-down or desk clean-up to mark the boundary between studying and relaxing.',
        },
        {
          heading: '3. Prioritize Consistent Sleep',
          body: 'Sleep consolidates memory and learning. Sacrificing sleep often hurts exam performance more than it helps.',
        },
      ],
      keyTakeaways: [
        'Study during your natural energy peak.',
        'Create clear boundaries between work and rest.',
        'Prioritize sleep memory consolidation.',
      ],
    },
  },
  {
    id: 'edu_understanding_stress',
    title: 'Understanding Stress & Strain',
    category: 'education',
    description: 'Learn about stress, recovery, and longer-term strain.',
    duration: '6 min read',
    badge: 'Popular',
    type: 'article',
    intentTags: ['calm', 'support'],
    content: {
      readingTime: '6 min read',
      sections: [
        {
          heading: '1. Stress vs. Recovery',
          body: 'Stress is a natural physiological reaction to challenges. Strain occurs when stress accumulates without adequate recovery.',
        },
        {
          heading: '2. The Role of Routine Variance',
          body: 'Fluctuations in sleep, meals, and social contact are normal indicators of temporary workload changes.',
        },
        {
          heading: '3. Restoring Balance',
          body: 'Small daily adjustments—like a 3-minute breathing pause or talking with a friend—help prevent persistent strain.',
        },
      ],
      keyTakeaways: [
        'Stress requires intentional recovery.',
        'Routine changes indicate temporary workload demands.',
        'Small daily resets keep your routine balanced.',
      ],
    },
  },
  {
    id: 'edu_when_to_reach_out',
    title: 'When to Reach Out for Support',
    category: 'education',
    description: 'Information about recognizing when additional support may be useful.',
    duration: '3 min read',
    badge: 'Important',
    type: 'article',
    intentTags: ['support', 'calm'],
    content: {
      readingTime: '3 min read',
      sections: [
        {
          heading: '1. Listening to Your Needs',
          body: 'If stress feels persistent or if you simply want a confidential space to talk, college counsellors are available to help.',
        },
        {
          heading: '2. Support is Optional & Private',
          body: 'Connecting with a counsellor is completely voluntary. No private MindTrace behavioural data is shared automatically.',
        },
        {
          heading: '3. How to Connect',
          body: 'You can view available counselling slots directly in MindTrace at any time.',
        },
      ],
      keyTakeaways: [
        'Counselling is a confidential, optional resource.',
        'MindTrace never shares your private data automatically.',
        'You are always in control of your support choices.',
      ],
    },
  },

  // --- Music & Sounds ---
  {
    id: 'snd_calm_ambient',
    title: 'Calm Ambient Sounds',
    category: 'sounds',
    description: 'Background sound for relaxation and mental breaks.',
    duration: '30 min',
    badge: 'Ambient',
    type: 'audio',
    intentTags: ['calm', 'sleep'],
  },
  {
    id: 'snd_rain_nature',
    title: 'Rain & Nature Sounds',
    category: 'sounds',
    description: 'Gentle natural sounds for a mental break.',
    duration: '45 min',
    badge: 'Relaxation',
    type: 'audio',
    intentTags: ['calm', 'sleep', 'clear_mind'],
  },
  {
    id: 'snd_focus_sounds',
    title: 'Focus Sounds',
    category: 'sounds',
    description: 'Background audio for focused study sessions.',
    duration: '60 min',
    badge: 'Productivity',
    type: 'audio',
    intentTags: ['focus', 'clear_mind'],
  },
];
