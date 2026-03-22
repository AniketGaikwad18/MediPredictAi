'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { Activity, Mail, Lock, User, Eye, EyeOff, Heart, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AuthPage() {
  const router = useRouter();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    // Enhanced vibration/feedback simulation
    if (typeof window !== 'undefined' && 'vibrate' in navigator) navigator.vibrate(5);
    
    try {
      let data;
      if (mode === 'login') {
        data = await api.login(form.email, form.password);
      } else {
        data = await api.register(form.name, form.email, form.password);
      }
      localStorage.setItem('medipredict_token', data.token);
      localStorage.setItem('medipredict_user', JSON.stringify(data.user));
      router.push('/dashboard');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Access Denied. Check credentials.');
      if (typeof window !== 'undefined' && 'vibrate' in navigator) navigator.vibrate([10, 30, 10]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4 relative overflow-hidden selection:bg-primary/20 selection:text-primary">
      {/* Clean Clinical Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ 
            scale: [1, 1.05, 1],
            opacity: [0.05, 0.08, 0.05]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-[-10%] left-[-10%] w-[1000px] h-[1000px] bg-primary rounded-full blur-[140px]"
        />
        <motion.div
          animate={{ 
            scale: [1, 1.1, 1],
            opacity: [0.03, 0.06, 0.03]
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear", delay: 2 }}
          className="absolute bottom-[-10%] right-[-10%] w-[800px] h-[800px] bg-secondary rounded-full blur-[120px]"
        />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-[440px] relative z-10"
      >
        {/* Animated Brand Identity */}
        <div className="text-center mb-10">
          <motion.div 
            whileHover={{ scale: 1.05, rotate: 5 }}
            className="inline-flex items-center justify-center w-20 h-20 rounded-[2rem] bg-white shadow-xl mb-6 border border-slate-100 relative group overflow-hidden"
          >
            <div className="absolute inset-0 border-2 border-primary/20 rounded-[2rem]" />
            <Activity className="w-10 h-10 text-primary relative z-10" />
          </motion.div>
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-2">MediAssist AI</h1>
          <p className="text-slate-500 font-medium text-sm">Next-Generation Healthcare Intelligence</p>
        </div>

        {/* Clean Clinical Auth Card */}
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xl relative group">
          
          {/* Light Tab System */}
          <div className="flex rounded-xl bg-slate-100 p-1 mb-8 border border-slate-200 relative z-10">
            {(['login', 'register'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => { setMode(tab); setError(''); }}
                className={`flex-1 py-3 rounded-lg text-[14px] font-semibold transition-all duration-300 relative ${
                  mode === tab ? 'text-primary' : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                {mode === tab && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-white rounded-lg shadow-sm border border-slate-200"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{tab === 'login' ? 'Sign In' : 'Register'}</span>
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <AnimatePresence mode="popLayout">
              {mode === 'register' && (
                <motion.div
                  initial={{ opacity: 0, height: 0, y: -20 }}
                  animate={{ opacity: 1, height: 'auto', y: 0 }}
                  exit={{ opacity: 0, height: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="relative group"
                >
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-highlight transition-colors" />
                  <input
                    type="text"
                    required
                    placeholder="Full Name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-white/10 bg-black/20 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-highlight/50 focus:border-highlight transition-all"
                  />
                </motion.div>
              )}
            </AnimatePresence>

            <div className="relative group z-10">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-primary transition-all" />
              <input
                type="email"
                required
                placeholder="Email Address"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-white transition-all font-medium text-[15px]"
              />
            </div>

            <div className="relative group z-10">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-primary transition-all" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="Password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full pl-12 pr-12 py-3.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-white transition-all font-medium text-[15px]"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-primary transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            <AnimatePresence>
              {error && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex items-center gap-2 p-3.5 rounded-xl bg-destructive/10 border border-destructive/20 text-red-400 text-sm"
                >
                  <ShieldCheck className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </motion.div>
              )}
            </AnimatePresence>

            <motion.button
              whileHover={{ scale: 1.02, translateY: -2 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="btn-premium w-full mt-6 z-10 group"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-primary/30 border-t-white rounded-full animate-spin" />
                  {mode === 'login' ? 'Authenticating…' : 'Creating Account…'}
                </>
              ) : (
                <>
                  {mode === 'login' ? 'Sign In Securely' : 'Create Account'}
                  <ShieldCheck className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </motion.button>
          </form>

          {mode === 'login' && (
            <p className="text-center mt-6 text-sm text-slate-400">
              <button className="hover:text-highlight transition-colors underline underline-offset-4 decoration-white/20 hover:decoration-highlight/50">
                Forgot your password?
              </button>
            </p>
          )}
        </div>

        {/* Demo Mode Notice */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-6 p-4 rounded-2xl bg-white/5 border border-white/10 text-slate-300 text-xs text-center backdrop-blur-md"
        >
          <strong className="text-highlight">✨ Demo Mode Active</strong> — Works without backend.<br/>
          Register to test the premium AI environment locally.
        </motion.div>

        {/* Footer */}
        <p className="text-center mt-6 text-xs text-slate-500 flex items-center justify-center gap-1.5 font-medium tracking-wide border-t border-white/5 pt-6">
          <Heart className="w-3.5 h-3.5 text-red-400 animate-pulse" />
          Enterprise-grade AI Healthcare Platform
        </p>
      </motion.div>
    </div>
  );
}
