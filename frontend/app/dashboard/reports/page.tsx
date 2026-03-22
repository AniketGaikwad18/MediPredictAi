'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { FileText, Activity, Calendar, Stethoscope, TrendingUp } from 'lucide-react';
import Link from 'next/link';

interface Report {
  _id: string;
  disease: string;
  confidence: number;
  created_at: string;
  symptoms: string[];
}

function formatSymptom(s: string) {
  return s.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

function ConfidenceBadge({ value }: { value: number }) {
  const color = value >= 75 ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 
                value >= 50 ? 'bg-amber-50 text-amber-700 border-amber-200' : 
                'bg-red-50 text-red-700 border-red-200';
  return <span className={`inline-block px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider border ${color}`}>{value}%</span>;
}

export default function ReportsPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getReports().then((d) => setReports(d.reports || [])).catch(() => {}).finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">

      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900 flex items-center gap-3 tracking-tight">
            <FileText className="w-8 h-8 text-primary" /> Health Records
          </h2>
          <p className="text-slate-500 text-sm mt-1 font-medium italic">Secure biometric identification ledger</p>
        </div>
        <Link
          href="/dashboard/symptom-checker"
          className="px-6 py-3 rounded-2xl bg-primary text-white text-sm font-bold hover:shadow-md transition-all flex items-center gap-2 uppercase tracking-wide border border-primary/10 hover:bg-blue-600"
        >
          <Stethoscope className="w-5 h-5" /> New Analysis
        </Link>
      </div>

      {/* Stats */}
      {!loading && reports.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {[
            { label: 'Total Analyses', value: reports.length, icon: Activity, color: 'text-primary' },
            { label: 'Latest Check', value: new Date(reports[0].created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }), icon: Calendar, color: 'text-secondary' },
            { label: 'Mean Accuracy', value: `${Math.round(reports.reduce((a, r) => a + r.confidence, 0) / reports.length)}%`, icon: TrendingUp, color: 'text-primary' },
          ].map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex items-center gap-4 group hover:border-primary/30 transition-all">
              <div className={`p-4 rounded-2xl bg-slate-50 border border-slate-100 ${color} group-hover:scale-110 transition-transform`}>
                <Icon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-3xl font-extrabold text-slate-900 tracking-tight">{value}</p>
                <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">{label}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Report cards container */}
      <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-20 text-center">
            <div className="w-12 h-12 border-4 border-slate-200 border-t-primary rounded-full animate-spin mx-auto mb-6" />
            <p className="text-slate-500 font-bold uppercase tracking-wider text-xs">Accessing Encrypted Records…</p>
          </div>
        ) : reports.length === 0 ? (
          <div className="p-20 text-center">
            <div className="w-20 h-20 bg-slate-50 border border-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Stethoscope className="w-10 h-10 text-slate-400" />
            </div>
            <p className="text-slate-900 font-extrabold text-xl mb-2">Diagnostic History Empty</p>
            <p className="text-slate-500 text-sm mb-8 max-w-xs mx-auto font-medium">No medical data has been logged to the decentralized engine yet.</p>
            <Link href="/dashboard/symptom-checker" className="px-8 py-4 rounded-xl bg-primary shadow-sm text-white font-bold text-sm hover:bg-blue-600 transition-all uppercase tracking-wider">
              Initialize First Check
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {reports.map((r, i) => (
              <div key={r._id} className="p-8 hover:bg-slate-50 transition-colors group">
                <div className="flex items-center justify-between gap-6">
                  <div className="flex items-center gap-6">
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary text-sm font-extrabold group-hover:scale-110 transition-all">
                      {String(i + 1).padStart(2, '0')}
                    </div>
                    <div>
                      <h4 className="font-extrabold text-slate-900 text-[17px] group-hover:text-primary transition-colors">{r.disease}</h4>
                      <p className="text-xs text-slate-500 mt-1 font-bold flex items-center gap-2">
                        {r.symptoms?.slice(0, 3).map(s => (
                          <span key={s} className="px-2.5 py-1 rounded-md bg-slate-100 border border-slate-200 text-slate-600">{formatSymptom(s)}</span>
                        ))}
                        {r.symptoms?.length > 3 && <span className="text-slate-400">+{r.symptoms.length - 3}</span>}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center justify-end gap-3 mb-2">
                      <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Accuracy</p>
                      <ConfidenceBadge value={r.confidence} />
                    </div>
                    <p className="text-[12px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-end gap-2">
                      <Calendar className="w-3.5 h-3.5" />
                      {new Date(r.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
