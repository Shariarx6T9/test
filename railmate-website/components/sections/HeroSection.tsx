"use client";

import DownloadButton from "../ui/DownloadButton";

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Background with radial gradient */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at 60% 50%, rgba(0,168,89,0.08) 0%, transparent 70%)"
        }}
      />
      
      <div className="max-w-7xl mx-auto px-6 lg:px-12 w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left Side Content */}
        <div className="space-y-8 z-10">
          <div className="space-y-4">
            <h1 className="text-5xl lg:text-7xl font-jakarta font-extrabold text-text-primary leading-[1.1]">
              Your Railway, <br />
              <span className="text-primary">Simplified.</span>
            </h1>
            <p className="text-2xl font-bengali text-text-secondary leading-relaxed">
              আপনার রেলযাত্রা, সহজ করা হলো।
            </p>
            <p className="text-text-tertiary text-lg lg:text-xl max-w-xl leading-relaxed font-inter">
              RailMate gives Bangladeshi train travelers real-time schedules, fare info, community delay reports, and smart journey tools — all in one app.
            </p>
          </div>

          <div className="flex flex-wrap gap-4 pt-4">
            <DownloadButton platform="google-play" />
            <DownloadButton platform="apk" />
            <DownloadButton platform="app-store" status="coming-soon" />
          </div>
        </div>

        {/* Right Side Mockup */}
        <div className="relative hidden lg:flex justify-end items-center z-10">
          <div className="w-[320px] h-[640px] bg-bg-elevated rounded-[40px] border-[8px] border-bg-card shadow-2xl overflow-hidden relative">
            {/* Screen Content Mockup */}
            <div className="p-6 space-y-6">
               <div className="h-4 w-24 bg-border rounded-full" />
               <div className="space-y-3">
                  <div className="h-12 w-full bg-bg-card rounded-xl border border-border" />
                  <div className="h-12 w-full bg-bg-card rounded-xl border border-border" />
               </div>
               
               {/* Search Result Mockup */}
               <div className="p-4 bg-primary/10 border border-primary/20 rounded-2xl space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-primary font-bold text-xs uppercase">Subarna Express</span>
                    <span className="text-success text-[10px] font-bold px-2 py-0.5 bg-success/10 rounded-full">On Time</span>
                  </div>
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-2xl font-jakarta font-extrabold text-text-primary">04:30</p>
                      <p className="text-[10px] text-text-secondary">Chittagong</p>
                    </div>
                    <div className="flex-1 border-b border-dashed border-border-strong mb-2 mx-4 relative">
                       <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-bg-elevated border border-border-strong rounded-full flex items-center justify-center">
                          <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                       </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-jakarta font-extrabold text-text-primary">09:10</p>
                      <p className="text-[10px] text-text-secondary">Dhaka</p>
                    </div>
                  </div>
               </div>

               <div className="space-y-4">
                  <div className="h-24 w-full bg-bg-card rounded-2xl border border-border opacity-50" />
                  <div className="h-24 w-full bg-bg-card rounded-2xl border border-border opacity-30" />
               </div>
            </div>
            {/* Glow effect inside phone */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-primary/5 blur-3xl pointer-events-none" />
          </div>
          
          {/* Decorative Glow */}
          <div className="absolute -z-10 w-[500px] h-[500px] bg-primary/10 blur-[120px] rounded-full" />
        </div>
      </div>
    </section>
  );
}
