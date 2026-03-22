'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Stethoscope,
  ActivitySquare,
  FileText,
  User,
  LogOut,
  ChevronRight,
  Menu,
  HeartPulse,
  MapPin
} from 'lucide-react';
import { Chatbot } from '@/components/Chatbot';

const navItems = [
  { href: '/dashboard', label: 'Overview', icon: LayoutDashboard },
  { href: '/dashboard/symptom-checker', label: 'Symptom AI', icon: Stethoscope },
  { href: '/dashboard/reports', label: 'Health Records', icon: FileText },
  { href: '/dashboard/nearby', label: 'Nearby Doctors', icon: MapPin },
  { href: '/dashboard/health-tips', label: 'Wellness Tips', icon: ActivitySquare },
  { href: '/dashboard/profile', label: 'Profile Settings', icon: User },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const token = localStorage.getItem('medipredict_token');
    if (!token) {
      router.push('/');
      return;
    }
    const userStr = localStorage.getItem('medipredict_user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        setUserName(user.name);
        setUserEmail(user.email);
      } catch (e) {
        console.error('Failed to parse user', e);
      }
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('medipredict_token');
    localStorage.removeItem('medipredict_user');
    router.push('/');
  };

  if (!mounted) return null;

  return (
    <div className="flex bg-slate-50 min-h-screen text-slate-800 overflow-hidden relative selection:bg-primary/20 selection:text-primary">
      {/* Clean Clinical Background */}
      <div className="absolute inset-0 bg-white/50 backdrop-blur-3xl pointer-events-none z-0" />
      <div className="absolute top-[-10%] right-[-5%] w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-5%] w-[600px] h-[600px] bg-secondary/5 rounded-full blur-[100px] pointer-events-none" />
      
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white/80 backdrop-blur-xl border-b border-slate-200 z-50 flex items-center justify-between px-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <HeartPulse className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-slate-900 tracking-tight">MediAssist</span>
        </div>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
        >
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* Sidebar Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-30 lg:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Clean Clinical Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 w-72 bg-white border-r border-slate-200 shadow-sm z-40 flex flex-col transition-transform duration-500 ease-[0.22,1,0.36,1] lg:translate-x-0 ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Sidebar Header */}
        <div className="h-24 flex items-center gap-4 px-8 border-b border-slate-100 bg-white">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-md shadow-primary/20">
            <HeartPulse className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-xl text-slate-900 tracking-tight">MediAssist</h1>
            <p className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold">AI Clinical Core</p>
          </div>
        </div>

        {/* User Profile Snippet */}
        <div className="p-6">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-4 shadow-sm group hover:border-slate-300 transition-colors">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary shrink-0">
              {userName ? userName.charAt(0).toUpperCase() : 'U'}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-bold text-slate-900 truncate">{userName || 'Welcome'}</p>
              <p className="text-[11px] text-slate-500 font-medium truncate">{userEmail || 'Patient Account'}</p>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto pb-4 custom-scrollbar">
          <p className="px-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3 mt-4">Modules</p>
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center justify-between px-4 py-3.5 rounded-xl transition-all relative group ${
                  isActive ? 'text-primary' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="sidebarActiveIndicator"
                    className="absolute inset-0 bg-primary/10 border border-primary/20 rounded-xl"
                    initial={false}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <div className="flex items-center gap-3 relative z-10">
                  <item.icon className={`w-5 h-5 transition-colors duration-200 ${isActive ? 'text-primary' : 'text-slate-400 group-hover:text-slate-600'}`} />
                  <span className="font-semibold text-[14px]">{item.label}</span>
                </div>
                {isActive && <motion.div layoutId="arrow" initial={{ x: -5 }} animate={{ x: 0 }}>
                  <ChevronRight className="w-4 h-4 text-primary relative z-10" />
                </motion.div>}
              </Link>
            );
          })}
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-slate-100 bg-white">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 text-[14px] font-semibold text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all border border-transparent hover:border-red-100"
          >
            <LogOut className="w-5 h-5" />
            Sign Out
          </motion.button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative z-10">
        <div className="flex-1 overflow-y-auto p-4 lg:p-8 pt-20 lg:pt-8 scroll-smooth z-10">
          <div className="max-w-6xl mx-auto space-y-8">
            <Suspense fallback={
              <div className="flex items-center justify-center h-64">
                <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
              </div>
            }>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                {children}
              </motion.div>
            </Suspense>
          </div>
        </div>
      </main>

      {/* Floating Global Chatbot */}
      <Chatbot />
    </div>
  );
}
