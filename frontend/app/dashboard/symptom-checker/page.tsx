'use client';

import { useState } from 'react';
import { api } from '@/lib/api';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { Search, X, ChevronRight, CheckCircle, AlertCircle, Activity, HeartPulse, Sparkles, TrendingUp } from 'lucide-react';
import Link from 'next/link';

const ALL_SYMPTOMS = [
  "itching","skin_rash","nodal_skin_eruptions","continuous_sneezing","shivering","chills",
  "joint_pain","stomach_pain","acidity","ulcers_on_tongue","muscle_wasting","vomiting",
  "burning_micturition","fatigue","weight_gain","anxiety","cold_hands_and_feets",
  "mood_swings","weight_loss","restlessness","lethargy","patches_in_throat",
  "irregular_sugar_level","cough","high_fever","sunken_eyes","breathlessness",
  "sweating","dehydration","indigestion","headache","yellowish_skin","dark_urine",
  "nausea","loss_of_appetite","back_pain","constipation","abdominal_pain","diarrhoea",
  "mild_fever","yellow_urine","yellowing_of_eyes","swelling_of_stomach","swelled_lymph_nodes",
  "malaise","blurred_and_distorted_vision","phlegm","throat_irritation","redness_of_eyes",
  "sinus_pressure","runny_nose","congestion","chest_pain","weakness_in_limbs",
  "fast_heart_rate","neck_pain","dizziness","cramps","bruising","obesity","swollen_legs",
  "enlarged_thyroid","brittle_nails","excessive_hunger","drying_and_tingling_lips",
  "slurred_speech","knee_pain","hip_joint_pain","muscle_weakness","stiff_neck",
  "swelling_joints","movement_stiffness","spinning_movements","loss_of_balance",
  "unsteadiness","loss_of_smell","bladder_discomfort","passage_of_gases","internal_itching",
  "depression","irritability","muscle_pain","red_spots_over_body","belly_pain",
  "abnormal_menstruation","watering_from_eyes","increased_appetite","polyuria",
  "family_history","mucoid_sputum","rusty_sputum","lack_of_concentration",
  "visual_disturbances","palpitations","painful_walking","pus_filled_pimples",
  "blackheads","skin_peeling","small_dents_in_nails","inflammatory_nails","blister",
];

interface PredictionResult {
  disease: string;
  confidence: number;
  precautions: string[];
  exercises: string[];
  tips: string[];
}

function formatSymptom(s: string) {
  return s.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

export default function SymptomCheckerPage() {
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<string[]>([]);
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [emailSent, setEmailSent] = useState(false);

  const filtered = ALL_SYMPTOMS.filter(
    (s) => s.replace(/_/g, ' ').includes(search.toLowerCase()) && !selected.includes(s)
  ).slice(0, 8);

  const addSymptom = (s: string) => {
    setSelected((p) => [...p, s]);
    setSearch('');
  };

  const removeSymptom = (s: string) => setSelected((p) => p.filter((x) => x !== s));

  const handlePredict = async () => {
    if (selected.length === 0) { setError('Please select at least one symptom.'); return; }
    setLoading(true);
    setError('');
    setResult(null);
    setEmailSent(false);
    
    // Simulate thinking delay for premium feel
    await new Promise(r => setTimeout(r, 600));

    try {
      const data = await api.predict(selected);
      setResult(data.result);
      setEmailSent(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Prediction failed. Ensure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const reset = () => { setResult(null); setSelected([]); setEmailSent(false); };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show" className="max-w-3xl mx-auto space-y-6 pb-20">
      {/* Header */}
      <motion.div variants={itemVariants} className="mb-8">
        <h2 className="text-3xl font-extrabold text-slate-900 flex items-center gap-3 tracking-tight">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-md shadow-primary/20">
            <Activity className="w-5 h-5 text-white" />
          </div>
          AI Symptom Analysis
        </h2>
        <p className="text-slate-500 text-sm mt-3 max-w-xl leading-relaxed">
          Select the symptoms you are currently experiencing. Our machine learning model will analyze patterns to calculate the probability of potential conditions and prepare a secure health dossier.
        </p>
      </motion.div>

      <AnimatePresence mode="wait">
        {!result && (
          <motion.div
            key="checker"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
            className="glass-card-premium p-8 lg:p-10 relative overflow-hidden flex flex-col gap-8"
          >

            {/* Search input with premium styling */}
            <div className="relative group z-20">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-primary transition-all" />
                <input
                  type="text"
                  placeholder="Search database (e.g., headache, fever)…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-12 pr-6 py-4 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-[15px] placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-white transition-all font-medium shadow-sm"
                />
              </div>
              
              {/* Dropdown suggestions */}
              <AnimatePresence>
                {search && filtered.length > 0 && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute top-full left-0 right-0 mt-3 rounded-xl border border-slate-200 bg-white shadow-lg overflow-hidden z-50 divide-y divide-slate-100"
                  >
                    {filtered.map((s) => (
                      <button
                        key={s}
                        onClick={() => addSymptom(s)}
                        className="w-full flex items-center justify-between px-5 py-3.5 text-[15px] text-slate-600 hover:bg-slate-50 hover:text-primary transition-all text-left font-medium"
                      >
                        <span>{formatSymptom(s)}</span>
                        <ChevronRight className="w-5 h-5 text-slate-400" />
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Selected tags */}
            <div className="z-10 relative">
              <div className="flex items-center justify-between mb-3 px-1">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Active Symptoms ({selected.length})
                </p>
                {selected.length > 0 && (
                  <button onClick={() => setSelected([])} className="text-xs font-bold text-slate-400 hover:text-red-500 uppercase tracking-widest transition-colors">Clear All</button>
                )}
              </div>
              <div className="flex flex-wrap gap-2.5 min-h-[50px] p-4 rounded-xl bg-slate-50 border border-slate-200">
                <AnimatePresence>
                  {selected.length === 0 && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2 text-slate-400 font-semibold text-sm px-2">
                       <AlertCircle className="w-4 h-4" /> No symptoms selected
                    </motion.div>
                  )}
                  {selected.map((s) => (
                    <motion.span
                      key={s}
                      initial={{ opacity: 0, scale: 0.8, x: -10 }}
                      animate={{ opacity: 1, scale: 1, x: 0 }}
                      exit={{ opacity: 0, scale: 0.8, x: 10 }}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white text-[14px] font-semibold shadow-sm"
                    >
                      {formatSymptom(s)}
                      <button onClick={() => removeSymptom(s)} className="hover:bg-black/20 p-0.5 rounded transition-colors ml-1">
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </motion.span>
                  ))}
                </AnimatePresence>
              </div>
            </div>

            {/* Common quick-add */}
            <div className="pt-6 border-t border-slate-100 z-10 relative">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Common Symptoms</p>
              <div className="flex flex-wrap gap-2">
                {['fever','headache','fatigue','cough','nausea','chest_pain','dizziness','vomiting'].filter(s => !selected.includes(s)).map((s) => (
                  <button
                    key={s}
                    onClick={() => addSymptom(s)}
                    className="px-4 py-2 rounded-lg border border-slate-200 bg-white text-[13px] font-semibold text-slate-600 hover:border-primary/40 hover:text-primary hover:bg-slate-50 transition-all shadow-sm"
                  >
                    + {formatSymptom(s)}
                  </button>
                ))}
              </div>
            </div>

            <AnimatePresence>
              {error && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="flex items-center gap-3 p-4 rounded-xl bg-red-50 border border-red-200 text-red-600 tracking-tight text-[15px] font-semibold shadow-sm"
                >
                  <AlertCircle className="w-5 h-5 shrink-0" /> {error}
                </motion.div>
              )}
            </AnimatePresence>

            <div className="pt-2"> {/* Wrapper to ensure spacing away from absolute elements or floats */}
              <motion.button
                whileHover={{ scale: selected.length > 0 ? 1.02 : 1, translateY: selected.length > 0 ? -2 : 0 }}
                whileTap={{ scale: selected.length > 0 ? 0.98 : 1 }}
                onClick={handlePredict}
                disabled={loading || selected.length === 0}
                className="btn-premium w-full text-[16px] py-4"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Analyzing Symptoms...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" /> Start Diagnosis
                  </>
                )}
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence mode="wait">
          {result && (
            <motion.div
              key="results"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="space-y-8"
            >
              {emailSent && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3 p-5 rounded-2xl bg-emerald-50 border border-emerald-100 text-emerald-700 text-sm font-semibold shadow-sm uppercase tracking-wide">
                  <CheckCircle className="w-5 h-5" /> Secure Identification Dossier Dispatched.
                </motion.div>
              )}

              {/* Disease card */}
              <div className="bg-white rounded-[2rem] overflow-hidden relative border border-slate-200 shadow-xl">
                {/* Top Banner */}
                <div className="relative p-10 lg:p-14 border-b border-slate-100 bg-slate-50 overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[80px] pointer-events-none" />
                  
                  <div className="relative z-10">
                    <p className="text-[11px] font-bold text-primary uppercase tracking-wider mb-3 flex items-center gap-2">
                      <Activity className="w-4 h-4" /> Probabilistic Core Identified
                    </p>
                    <h3 className="text-4xl lg:text-6xl font-extrabold text-slate-900 tracking-tight mb-8 leading-none">{result.disease}</h3>
                    
                    <div className="space-y-3 max-w-md">
                      <div className="flex justify-between text-xs font-bold uppercase tracking-wide">
                        <span className="text-slate-500">Accuracy Index</span>
                        <span className="text-primary">{result.confidence}%</span>
                      </div>
                      <div className="h-3 w-full bg-slate-200 rounded-full overflow-hidden shadow-inner">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${result.confidence}%` }}
                          transition={{ duration: 1.5, ease: "circOut" }}
                          className="h-full bg-primary rounded-full relative"
                        >
                          <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.2)_50%,transparent_100%)] animate-[shimmer_2s_infinite]" />
                        </motion.div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Guidance Sections */}
                <div className="p-8 lg:p-12 grid md:grid-cols-3 gap-8 bg-white">
                  {/* Precautions */}
                  <div className="space-y-5">
                    <p className="text-[11px] font-bold text-red-600 uppercase tracking-wider flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-red-500" /> Containment
                    </p>
                    <ul className="space-y-3">
                      {result.precautions.map((p, i) => (
                        <li key={i} className="flex items-start gap-3 text-[14px] text-slate-700 font-medium leading-relaxed">
                          <div className="mt-2 w-1.5 h-1.5 rounded-full bg-red-200 shrink-0" />
                          {p}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Exercises */}
                  <div className="space-y-5">
                    <p className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" /> Therapy
                    </p>
                    <ul className="space-y-3">
                      {result.exercises.map((e, i) => (
                        <li key={i} className="flex items-start gap-3 text-[14px] text-slate-700 font-medium leading-relaxed">
                          <div className="mt-2 w-1.5 h-1.5 rounded-full bg-emerald-200 shrink-0" />
                          {e}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Tips */}
                  <div className="space-y-5">
                    <p className="text-[11px] font-bold text-blue-600 uppercase tracking-wider flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-blue-500" /> Evolution
                    </p>
                    <ul className="space-y-3">
                      {result.tips.map((t, i) => (
                        <li key={i} className="flex items-start gap-3 text-[14px] text-slate-700 font-medium leading-relaxed">
                          <div className="mt-2 w-1.5 h-1.5 rounded-full bg-blue-200 shrink-0" />
                          {t}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Disclaimer */}
              <div className="p-6 rounded-2xl bg-amber-50 border border-amber-200 text-slate-600 text-[12px] font-medium leading-relaxed flex items-start gap-4 shadow-sm">
                <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-amber-700 block mb-1">Heuristic Engine Warning:</strong> This dataset is provided for preliminary identification purposes only. It does not constitute medical advice or certified diagnosis. Access to professional healthcare practitioners is mandatory for treatment protocols.
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-10">
                <motion.button
                  whileHover={{ scale: 1.02, translateY: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={reset}
                  className="btn-ghost-premium w-full text-[15px] py-3.5"
                >
                  <HeartPulse className="w-4 h-4" /> New Diagnostic Cycle
                </motion.button>
                <Link
                  href="/dashboard/reports"
                  className="btn-premium w-full text-[15px] py-3.5"
                >
                  Access Archives <TrendingUp className="w-4 h-4" />
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
    </motion.div>
  );
}
