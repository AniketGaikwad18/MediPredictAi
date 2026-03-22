'use client';

import { motion } from 'framer-motion';
import { Map } from 'lucide-react';
import { GoogleMapsDocLocator } from '@/components/GoogleMapsDocLocator';

export default function NearbyDoctorsPage() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-4xl mx-auto space-y-8"
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center shadow-sm">
              <Map className="w-6 h-6 text-primary" />
            </div>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Nearby Specialists</h2>
          </div>
          <p className="text-slate-500 text-[15px] max-w-xl leading-relaxed mt-4">
            Our intelligent location matrix identifies top-rated medical professionals and emergency facilities in your immediate vicinity.
          </p>
        </div>
      </div>

      <GoogleMapsDocLocator />
    </motion.div>
  );
}
