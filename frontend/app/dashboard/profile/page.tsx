'use client';

import { useEffect, useState } from 'react';
import { User, Mail, Calendar, Activity, Shield, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<{ name: string; email: string; id: string }>({ name: '', email: '', id: '' });

  useEffect(() => {
    try {
      const u = JSON.parse(localStorage.getItem('medipredict_user') || '{}');
      setUser(u);
    } catch {}
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('medipredict_token');
    localStorage.removeItem('medipredict_user');
    router.push('/');
  };

  const initials = user.name?.split(' ').map((n) => n[0]).join('').toUpperCase() || 'U';

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <User className="w-6 h-6 text-primary" /> Profile
        </h2>
        <p className="text-muted-foreground text-sm mt-1">Your account information</p>
      </div>

      {/* Avatar card */}
      <div className="glass-card-premium p-10 flex flex-col items-center text-center relative overflow-hidden group">
        <motion.div 
          whileHover={{ scale: 1.05, rotate: 5 }}
          className="w-24 h-24 rounded-full bg-primary flex items-center justify-center text-white text-3xl font-bold shadow-md mb-6"
        >
          {initials}
        </motion.div>
        <h3 className="text-2xl font-bold text-slate-900">{user.name || '—'}</h3>
        <p className="text-slate-500 text-sm mt-1">{user.email || '—'}</p>
        <motion.span 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 mt-4 px-4 py-1.5 rounded-full bg-emerald-50 text-emerald-600 text-xs font-semibold border border-emerald-100"
        >
          <Shield className="w-4 h-4" /> Verified Health Profile
        </motion.span>
      </div>

      {/* Info list */}
      <div className="glass-card-premium divide-y divide-slate-100 overflow-hidden">
        {[
          { icon: User, label: 'Full Identity', value: user.name || '—' },
          { icon: Mail, label: 'Digital Address', value: user.email || '—' },
          { icon: Calendar, label: 'Member Since', value: 'March 2026' },
          { icon: Activity, label: 'Registry Status', value: 'Active & Protected', valueColor: 'text-emerald-600' },
        ].map(({ icon: Icon, label, value, valueColor }) => (
          <div key={label} className="flex items-center gap-6 px-8 py-5 hover:bg-slate-50 transition-colors group">
            <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0 group-hover:border-primary/50 transition-colors">
              <Icon className="w-5 h-5 text-slate-500 group-hover:text-primary transition-colors" />
            </div>
            <div className="flex-1">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{label}</p>
              <p className={`text-base font-bold mt-0.5 ${valueColor || 'text-slate-900'}`}>{value}</p>
            </div>
          </div>
        ))}
      </div>

      <motion.button
        whileHover={{ scale: 1.02, translateY: -2 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleLogout}
        className="btn-destructive-premium w-full"
      >
        <LogOut className="w-4 h-4" /> Sign Out
      </motion.button>
    </div>
  );
}
