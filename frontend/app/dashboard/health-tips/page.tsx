'use client';

import { Shield, Heart, Dumbbell, Apple, Moon, Droplets, Wind, Sun } from 'lucide-react';

const tips = [
  {
    icon: Droplets,
    color: 'from-blue-400 to-primary',
    title: 'Stay Hydrated',
    desc: 'Drink 8–10 glasses of water daily. Proper hydration keeps your organs functioning optimally and helps flush out toxins.',
    tag: 'Daily Habit',
  },
  {
    icon: Moon,
    color: 'from-indigo-400 to-purple-500',
    title: 'Quality Sleep',
    desc: 'Aim for 7–9 hours of sleep per night. Sleep strengthens your immune system and supports mental health.',
    tag: 'Essential',
  },
  {
    icon: Dumbbell,
    color: 'from-secondary to-teal-400',
    title: 'Regular Exercise',
    desc: 'At least 30 minutes of moderate physical activity daily reduces risk of chronic diseases and boosts energy.',
    tag: 'Physical',
  },
  {
    icon: Apple,
    color: 'from-accent to-green-400',
    title: 'Balanced Nutrition',
    desc: 'Fill half your plate with vegetables and fruits. Whole grains and lean proteins support long-term health.',
    tag: 'Nutrition',
  },
  {
    icon: Wind,
    color: 'from-sky-400 to-cyan-400',
    title: 'Breathing Exercises',
    desc: '5 minutes of deep breathing daily reduces cortisol levels, lowers blood pressure, and improves focus.',
    tag: 'Mental',
  },
  {
    icon: Heart,
    color: 'from-rose-400 to-red-400',
    title: 'Heart Health',
    desc: 'Avoid smoking, limit alcohol, manage stress and have regular cardiovascular check-ups every year.',
    tag: 'Preventive',
  },
  {
    icon: Sun,
    color: 'from-amber-400 to-yellow-400',
    title: 'Vitamin D',
    desc: '15–20 minutes of morning sunlight boosts vitamin D synthesis, which is vital for bone and immune health.',
    tag: 'Daily Habit',
  },
  {
    icon: Shield,
    color: 'from-violet-400 to-purple-400',
    title: 'Preventive Screenings',
    desc: 'Annual health screenings catch potential issues early. Schedule regular check-ups with your GP.',
    tag: 'Preventive',
  },
];

export default function HealthTipsPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <Shield className="w-6 h-6 text-primary" /> Health Tips
        </h2>
        <p className="text-muted-foreground text-sm mt-1">Evidence-based wellness recommendations for a healthier life.</p>
      </div>

      {/* Hero banner */}
      <div className="rounded-2xl bg-gradient-to-r from-secondary to-accent p-6 text-white">
        <p className="text-xs uppercase tracking-wider font-semibold text-white/70 mb-1">Daily Wellness</p>
        <h3 className="text-xl font-bold">Small habits, big impact 💪</h3>
        <p className="text-white/80 text-sm mt-1 max-w-lg">
          Consistent healthy habits are more powerful than occasional large efforts. Start with one tip today.
        </p>
      </div>

      {/* Tips grid */}
      <div className="grid sm:grid-cols-2 gap-4">
        {tips.map(({ icon: Icon, color, title, desc, tag }) => (
          <div key={title} className="bg-white rounded-2xl border border-border p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group">
            <div className="flex items-start gap-3">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center shadow shrink-0`}>
                <Icon className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <p className="font-semibold text-foreground text-sm">{title}</p>
                  <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-muted text-muted-foreground shrink-0">{tag}</span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">{desc}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <p className="text-center text-xs text-muted-foreground pb-4">
        Always consult your healthcare provider before making significant changes to your health routine.
      </p>
    </div>
  );
}
