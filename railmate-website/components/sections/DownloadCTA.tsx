"use client";

import DownloadButton from "../ui/DownloadButton";

export default function DownloadCTA() {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-bg-base to-bg-elevated" />
      
      {/* Center Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-primary/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10 text-center space-y-12">
        <div className="space-y-4">
          <h2 className="text-4xl lg:text-6xl font-jakarta font-extrabold text-text-primary">
            Ready to Simplify Your <br />
            <span className="text-primary">Train Journey?</span>
          </h2>
          <p className="text-text-secondary text-lg max-w-2xl mx-auto">
            Join thousands of Bangladeshi travelers who trust RailMate for their daily commute. Download now for free.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-4">
          <DownloadButton platform="google-play" />
          <DownloadButton platform="apk" />
          <DownloadButton platform="app-store" status="coming-soon" />
        </div>
        
        <div className="pt-8">
           <p className="text-text-tertiary text-sm">
             Available for Android 7.0 and above. iOS version coming in Late 2025.
           </p>
        </div>
      </div>
    </section>
  );
}
