'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { motion, Variants } from 'framer-motion';
import { Stethoscope, FileText, TrendingUp, Calendar, ArrowRight, Activity, Shield, Zap, Sparkles } from 'lucide-react';

interface Report {
  _id: string;
  disease: string;
  confidence: number;
  created_at: string;
  symptoms: string[];
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

export default function DashboardPage() {
  const [mounted, setMounted] = useState(false);
  const [userName, setUserName] = useState('there');
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (mounted) {
      const user = JSON.parse(localStorage.getItem('medipredict_user') || '{}');
      setUserName(user.name || 'there');
      api.getReports().then((d) => setReports(d.reports || [])).catch(() => {}).finally(() => setLoading(false));
    }
  }, [mounted]);

  const stats = [
    { label: 'Total Predictions', value: reports.length, icon: Activity, color: 'text-highlight', bg: 'bg-highlight/10 border-highlight/20' },
    { label: 'Last Checked', value: reports[0] ? new Date(reports[0].created_at).toLocaleDateString() : '—', icon: Calendar, color: 'text-secondary', bg: 'bg-secondary/10 border-secondary/20' },
    { label: 'Avg Confidence', value: reports.length ? `${Math.round(reports.reduce((a, r) => a + r.confidence, 0) / reports.length)}%` : '—', icon: TrendingUp, color: 'text-accent', bg: 'bg-accent/10 border-accent/20' },
  ];

  const quickActions = [
    { href: '/dashboard/symptom-checker', label: 'Check Symptoms', desc: 'AI Diagnosis & Analysis', icon: Stethoscope, color: 'from-primary to-highlight', shadow: 'shadow-highlight/20' },
    { href: '/dashboard/reports', label: 'View Reports', desc: 'Secure medical history', icon: FileText, color: 'from-secondary to-teal-400', shadow: 'shadow-secondary/20' },
    { href: '/dashboard/health-tips', label: 'Wellness Tips', desc: 'Proactive health advice', icon: Shield, color: 'from-accent to-emerald-400', shadow: 'shadow-accent/20' },
  ];

  if (!mounted) return null;

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show" className="max-w-5xl mx-auto space-y-6 pb-12">
      
      {/* Premium Welcome Banner */}
      <motion.div variants={itemVariants} className="relative overflow-hidden rounded-[2rem] bg-white border border-slate-200 p-8 lg:p-10 shadow-xl">
        <motion.div 
           animate={{ rotate: 360 }}
           transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
           className="absolute top-[-50%] right-[-10%] w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] pointer-events-none" 
        />
        
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div className="max-w-xl">
            <div className="flex items-center gap-2 mb-3">
              <div className="flex -space-x-1">
                {[1,2,3].map(i => <div key={i} className="w-5 h-5 rounded-full border border-white bg-primary/10 flex items-center justify-center text-[8px] font-bold text-primary">AI</div>)}
              </div>
              <span className="text-[11px] font-bold text-primary uppercase tracking-wider">MediAssist Intelligence active</span>
            </div>
            <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight">Welcome back, {userName}</h2>
            <p className="text-slate-600 mt-4 text-base leading-relaxed">
              Experience the future of healthcare. Analyze symptoms with precision AI, monitor your logs, and receive personalized medical insights in seconds.
            </p>
          </div>
          
          <Link
            href="/dashboard/symptom-checker"
            className="shrink-0 flex items-center justify-center gap-2 px-8 py-4 bg-primary hover:bg-blue-600 text-white rounded-2xl text-base font-bold transition-all shadow-md group active:scale-95"
          >
            Start Diagnosis <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </motion.div>

      {/* Stats Row */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {stats.map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="bg-white border border-slate-200 shadow-sm rounded-3xl p-6 flex flex-col gap-6 group hover:border-primary/20 transition-all">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border ${bg} transition-transform group-hover:rotate-12`}>
              <Icon className={`w-7 h-7 ${color}`} />
            </div>
            <div>
              <p className="text-3xl font-extrabold text-slate-900 tracking-tight">{loading ? '…' : value}</p>
              <p className="text-[13px] text-slate-500 font-bold uppercase tracking-wider mt-1">{label}</p>
            </div>
          </div>
        ))}
      </motion.div>

      {/* Quick Actions */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {quickActions.map(({ href, label, desc, icon: Icon, color, shadow }) => (
          <Link
            key={href}
            href={href}
            className="group bg-white border border-slate-200 shadow-sm rounded-3xl p-8 hover:-translate-y-2 transition-all duration-500 relative overflow-hidden flex flex-col h-full hover:shadow-lg"
          >
            <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center shadow-lg ${shadow} mb-6 relative z-10 transition-all group-hover:scale-110 group-hover:rotate-6`}>
              <Icon className="w-7 h-7 text-white" />
            </div>
            <p className="font-extrabold text-slate-900 text-xl relative z-10">{label}</p>
            <p className="text-sm text-slate-500 mt-2 mb-6 relative z-10 leading-relaxed font-medium">{desc}</p>
            <div className="mt-auto flex items-center text-xs font-bold text-primary uppercase tracking-wider group-hover:gap-2 transition-all relative z-10">
              Launch Agent <ArrowRight className="w-4 h-4 ml-1" />
            </div>
          </Link>
        ))}
      </motion.div>

      {/* Recent Predictions */}
      <motion.div variants={itemVariants} className="bg-white rounded-[2rem] shadow-sm flex flex-col border border-slate-200 overflow-hidden">
        <div className="flex items-center justify-between p-8 border-b border-slate-100 bg-slate-50">
          <h3 className="font-extrabold text-slate-900 text-xl flex items-center gap-3">
             <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
             AI Diagnosis Logs
          </h3>
          <Link href="/dashboard/reports" className="text-xs font-bold uppercase tracking-wider text-primary hover:text-blue-700 transition-all bg-primary/10 px-4 py-2 rounded-full border border-primary/20">View Data Room</Link>
        </div>
        
        <div className="flex-1 bg-white p-4">
          {loading ? (
            <div className="p-12 text-center text-slate-500 text-sm font-bold tracking-widest uppercase flex flex-col items-center">
              <div className="w-10 h-10 border-4 border-slate-200 border-t-primary rounded-full animate-spin mb-6" />
              Synchronizing encrypted records…
            </div>
          ) : reports.length === 0 ? (
            <div className="p-16 text-center flex flex-col items-center">
              <div className="w-20 h-20 rounded-3xl bg-slate-50 flex items-center justify-center mb-6 border border-slate-200 shadow-sm">
                <Activity className="w-10 h-10 text-slate-400" />
              </div>
              <p className="text-slate-900 text-lg font-extrabold tracking-tight">Digital Health Vault Empty</p>
              <p className="text-slate-500 text-sm mt-2 max-w-xs font-medium">Your future diagnosis results will be securely stored here using military-grade encryption.</p>
            </div>
          ) : (
            <div className="space-y-3 p-2">
              {reports.slice(0, 4).map((r) => (
                <div key={r._id} className="group flex flex-col sm:flex-row sm:items-center justify-between p-5 rounded-2xl hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-all gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                       <Zap className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-[17px] font-bold text-slate-900 tracking-tight">{r.disease}</p>
                      <p className="text-sm text-slate-500 font-medium mt-0.5">{r.symptoms?.slice(0, 3).join(' • ')}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between sm:flex-col sm:items-end gap-3 shrink-0">
                    <span className="px-4 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wide bg-primary/10 text-primary border border-primary/20">
                      {Math.floor(r.confidence)}% Match
                    </span>
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">{new Date(r.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
