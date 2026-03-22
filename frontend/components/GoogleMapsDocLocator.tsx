'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Navigation, Star, Phone, Clock, AlertCircle } from 'lucide-react';

interface Clinic {
  id: string;
  name: string;
  vicinity: string;
  rating: number;
  user_ratings_total: number;
  open_now?: boolean;
}

export function GoogleMapsDocLocator() {
  const [clinics, setClinics] = useState<Clinic[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // In a real application, we would:
    // 1. Get user's coordinates via navigator.geolocation
    // 2. Pass them to our backend /api/doctors route
    // 3. The backend calls Google Places API for nearby hospitals/doctors
    
    // Simulating API call for the premium UI demonstration
    const mockFetch = async () => {
      setLoading(true);
      try {
        await new Promise(r => setTimeout(r, 1500)); // Simulate network
        setClinics([
          { id: '1', name: 'City Central Hospital', vicinity: '123 Health Ave, Downtown', rating: 4.8, user_ratings_total: 1240, open_now: true },
          { id: '2', name: 'Prime Care Clinic', vicinity: '45 Wellness Blvd, Westside', rating: 4.5, user_ratings_total: 856, open_now: true },
          { id: '3', name: 'MediAssist Advanced Care', vicinity: '88 Innovation Dr, North Park', rating: 4.9, user_ratings_total: 2104, open_now: true },
          { id: '4', name: 'Family Health Center', vicinity: '210 Community Way, Eastside', rating: 4.2, user_ratings_total: 420, open_now: false },
        ]);
      } catch {
        setError('Failed to load nearby medical facilities.');
      } finally {
        setLoading(false);
      }
    };

    mockFetch();
  }, []);

  return (
    <div className="space-y-6">
      <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-6 relative overflow-hidden">
        {/* Decorative Map Background Simulation */}
        <div className="absolute inset-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/cartographer.png')] pointer-events-none mix-blend-overlay" />
        
        <div className="relative z-10 flex flex-col md:flex-row gap-6 md:items-center justify-between">
          <div>
            <h3 className="text-xl font-extrabold text-slate-900 flex items-center gap-2 tracking-tight">
              <MapPin className="w-5 h-5 text-primary" /> Active Radius Scanner
            </h3>
            <p className="text-slate-500 text-sm mt-1 font-medium">
              Locating top-rated medical facilities and specialists in your immediate vicinity.
            </p>
          </div>
          
          <div className="shrink-0 flex items-center gap-3">
             <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-50 border border-emerald-100 shadow-sm">
               <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
               </span>
               <span className="text-sm font-bold text-emerald-700 uppercase tracking-widest">GPS Active</span>
             </div>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="bg-white border border-slate-200 shadow-sm rounded-2xl p-6 h-32 flex items-center justify-center animate-pulse">
               <div className="w-8 h-8 border-2 border-slate-200 border-t-primary rounded-full animate-spin" />
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="flex items-center gap-2 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm font-bold">
          <AlertCircle className="w-4 h-4 shrink-0" /> {error}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {clinics.map((clinic, i) => (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              key={clinic.id}
              className="group bg-white rounded-3xl p-8 flex flex-col justify-between border border-slate-200 hover:border-primary/30 transition-all relative overflow-hidden shadow-sm hover:shadow-md"
            >
              <div className="absolute top-0 right-0 w-40 h-40 bg-primary/5 rounded-full blur-3xl pointer-events-none group-hover:bg-primary/10 transition-colors" />
              
              <div className="relative z-10">
                <div className="flex items-start justify-between mb-4">
                  <h4 className="text-xl font-extrabold text-slate-900 group-hover:text-primary transition-colors tracking-tight">{clinic.name}</h4>
                  {clinic.open_now ? (
                    <span className="px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-bold uppercase tracking-widest shadow-sm">Open</span>
                  ) : (
                    <span className="px-3 py-1.5 rounded-full bg-slate-100 text-slate-500 text-[10px] font-bold uppercase tracking-widest border border-slate-200">Closed</span>
                  )}
                </div>
                
                <p className="text-[14px] text-slate-500 font-medium flex items-center gap-2 mb-6">
                  <MapPin className="w-4 h-4 text-primary" /> {clinic.vicinity}
                </p>
                
                <div className="flex items-center gap-6 text-sm">
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-100 shadow-sm">
                    <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                    <span className="font-extrabold text-amber-700">{clinic.rating.toFixed(1)}</span>
                    <span className="text-amber-600/70 font-bold">({clinic.user_ratings_total})</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-500 hover:text-primary transition-all cursor-pointer font-bold uppercase tracking-wider text-[11px] group/item">
                    <Phone className="w-4 h-4 text-secondary group-hover/item:scale-110 transition-transform" /> Contact
                  </div>
                </div>
              </div>
              
              <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between relative z-10">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5" /> Updated 2m ago
                </span>
                <button className="flex items-center gap-2 text-[11px] font-extrabold text-primary hover:text-blue-700 transition-all group-hover:translate-x-1 uppercase tracking-widest">
                  Route Matrix <Navigation className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
