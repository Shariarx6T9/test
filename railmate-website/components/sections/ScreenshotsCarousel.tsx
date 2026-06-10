"use client";

import { motion } from "framer-motion";
import SectionHeader from "../ui/SectionHeader";

export default function ScreenshotsCarousel() {
  const screenshots = [
    { id: 1, title: "Home Screen", desc: "Live station board" },
    { id: 2, title: "Schedules", desc: "Browse timetables" },
    { id: 3, title: "Fare Lookup", desc: "8 class pricing" },
    { id: 4, title: "Community", desc: "Real-time reports" },
    { id: 5, title: "Saved Routes", desc: "One-tap access" },
  ];

  // For the auto-scroll effect, we'll duplicate the list
  const duplicatedScreenshots = [...screenshots, ...screenshots];

  return (
    <section className="py-24 bg-bg-base overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 mb-16">
        <SectionHeader 
          title="Everything You Need, In One App"
          align="center"
        />
      </div>

      <div className="relative group">
        <motion.div 
          className="flex gap-8 px-4"
          animate={{
            x: [0, -1800], // Adjust based on width
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "linear",
          }}
          whileHover={{ animationPlayState: "paused" }}
        >
          {duplicatedScreenshots.map((screen, idx) => (
            <div 
              key={`${screen.id}-${idx}`}
              className="flex-shrink-0 w-[280px] h-[560px] bg-bg-elevated rounded-[40px] border-[6px] border-bg-card shadow-xl relative overflow-hidden flex flex-col items-center justify-center p-8 text-center"
            >
               <div className="absolute top-4 left-1/2 -translate-x-1/2 w-20 h-5 bg-bg-card rounded-full" />
               
               <div className="space-y-4">
                  <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <div className="w-8 h-8 bg-primary rounded-xl" />
                  </div>
                  <h4 className="text-text-primary font-jakarta font-bold text-xl">{screen.title}</h4>
                  <p className="text-text-tertiary text-sm">{screen.desc}</p>
               </div>
               
               <div className="absolute bottom-12 left-6 right-6 space-y-3">
                  <div className="h-2 w-full bg-border rounded-full" />
                  <div className="h-2 w-2/3 bg-border rounded-full" />
                  <div className="h-10 w-full bg-bg-card border border-border rounded-xl mt-6" />
               </div>

               {/* Inner Glow */}
               <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            </div>
          ))}
        </motion.div>

        {/* Masking Gradients */}
        <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-base to-transparent z-10" />
        <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-base to-transparent z-10" />
      </div>

      <div className="flex justify-center gap-2 mt-12">
        {screenshots.map((_, i) => (
          <div 
            key={i} 
            className={`h-1.5 rounded-full transition-all ${i === 0 ? "w-8 bg-primary" : "w-2 bg-border"}`} 
          />
        ))}
      </div>
    </section>
  );
}
